import { Gift, Grip, PackageOpen } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'
import SvgSuccessAnimation from 'src/components/svg-success-animation'
import { Button, Close, Dialog, Spinner } from 'src/components/ui'
import { cn } from 'src/lib/utils'
import { useInfinitePokemonList } from 'src/services/queries'
import { useTeamStore } from 'src/store'
import type { Pokemon } from 'src/types/Pokemon'
import type { Team } from 'src/types/Team'
import { createSwapy } from 'swapy'

interface Props {
  open: boolean
  setOpen: (_open: boolean) => void
  team: Team
}

export default function DialogAddPokemon ({ open, setOpen, team }: Props) {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfinitePokemonList({ limit: 20 })

  const pokemons: Pokemon[] = data?.pages.flat() ?? []

  const listRef = React.useRef<HTMLDivElement>(null)

  const handleScroll = () => {
    const el = listRef.current
    if (!el) return
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10) {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    }
  }

  const { updateTeam } = useTeamStore()

  //
  // Estado para manejar el error si ya existe o supera el límite

  const [ error, setError ] = React.useState<string | null>(null)

  //
  // Estado local con los pokemones seleccionados

  const [ selectedPokemons, setSelectedPokemons ] = React.useState<Pokemon[]>([])

  //
  // sincronizar con team.pokemons cuando abre el dialogo

  React.useEffect(() => {
    if (open) {
      setSelectedPokemons(team.pokemons ?? [])
    }
  }, [ open, team.pokemons ])

  //
  // Agregar pokémon

  const handleAddPokemon = (p: Pokemon) => {
    if (selectedPokemons.length >= 6) {
      toast.error('Un equipo no puede tener más de 6 Pokémon.')
      setError('Un equipo no puede tener más de 6 Pokémon.')
      return
    }
    if (selectedPokemons.some(sp => sp.id === p.id)) {
      toast.error(`${p.name} ya está en el equipo.`)
      setError(`${p.name} ya está en el equipo.`)
      return
    }

    const newSelection = [ ...selectedPokemons, { ...p, order: selectedPokemons.length } ]
    setSelectedPokemons(newSelection)
    updateTeam(team.id, { pokemons: newSelection })
    toast.success(`${p.name} agregado a ${team.name}.`)
    setError(null)
  }

  //
  // Eliminar pokemon de la lista

  const handleRemovePokemon = (id: number) => {
    const newSelection = selectedPokemons
      .filter(sp => sp.id !== id)
      .map((sp, i) => ({ ...sp, order: i })) // reasignar orden
    setSelectedPokemons(newSelection)
    updateTeam(team.id, { pokemons: newSelection })
    toast.success(`Pokémon eliminado del equipo ${team.name}.`)
    setError(null)
  }

  //
  // drag and drop con Swapy

  const containerRef = React.useRef<HTMLDivElement>(null)

  const getOrderIds = React.useCallback((): string[] => {
    if (!containerRef.current) return []
    const nodes = containerRef.current.querySelectorAll<HTMLElement>('[data-swapy-item]')
    return Array.from(nodes).map(el => el.dataset.swapyItem!).filter(Boolean)
  }, [])

  // función estable para reordenar
  const handleSwap = React.useCallback(() => {
    const ids = getOrderIds()
    if (!ids.length) return

    setSelectedPokemons(prev => {
      const byId = new Map(prev.map(sp => [ String(sp.id), sp ]))
      const next: Pokemon[] = ids
        .map(id => byId.get(id))
        .filter(Boolean)
        .map((sp, i) => ({ ...sp!, order: i }))

      updateTeam(team.id, { pokemons: next })
      return next
    })
  }, [ getOrderIds, team.id, updateTeam ])

  // inicializar/destruir Swapy según el estado del dialogo
  React.useEffect(() => {
    if (!open || !containerRef.current) return

    const swapy = createSwapy(containerRef.current, {
      animation: 'spring',
      swapMode: 'hover',
    })

    swapy.onSwap(handleSwap)

    return () => {
      swapy.destroy()
    }
  }, [ open, handleSwap, selectedPokemons.length ])

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={setOpen} dragable={false}>
        <Dialog.Content className="max-w-sm">
          <div className='mx-auto p-10 flex items-center justify-center'>
            <Spinner size="xl" />
          </div>
        </Dialog.Content>
      </Dialog>
    )
  }

  if (isError) {
    return (
      <Dialog open={open} onOpenChange={setOpen} dragable={false}>
        <Dialog.Content className="max-w-sm">
          <div className='mx-auto p-10 flex flex-col items-center justify-center gap-4 text-center'>
            <p className="text-sm text-rose-600">Error al cargar los pokémones. Inténtalo de nuevo más tarde.</p>
            <Button variant="outline" onClick={() => setOpen(false)}>Cerrar</Button>
          </div>
        </Dialog.Content>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen} dragable={false}>
      <Dialog.Content className="max-w-5xl">
        <Dialog.Header className="flex items-center justify-between w-full p-6">
          <div className="flex items-center justify-start gap-4">
            <span className="w-14 h-14 flex-none inline-flex items-center justify-center rounded-full bg-foreground/5">
              <Gift strokeWidth={1.5} size={26} />
            </span>
            <div className="grid gap-1">
              <h2 className="text-base font-semibold">Agregar pokemon</h2>
              <p className="text-sm">Selecciona un pokemon para agregar a tu equipo.</p>
            </div>
          </div>
          <Dialog.Close asChild>
            <Close />
          </Dialog.Close>
        </Dialog.Header>

        <Dialog.Body className="w-full px-6">
          <div className="w-full grid border border-border rounded-xl overflow-hidden">
            <header className="w-full grid grid-cols-2 divide-x divide-border border-b border-border bg-foreground/2">
              <div className="w-full h-full flex items-center justify-between py-4 px-6">
                <h3 className="text-sm font-semibold">Pokemon</h3>
                <div className='h-7 px-3 bg-background rounded border border-border inline-flex items-center justify-center'>
                  {
                    isLoading ? (
                      <Spinner size="sm" />
                    ) : (
                      isError ? (
                        <span className="text-xs text-rose-600">Error</span>
                      ) : (
                        pokemons.length > 0 ? (
                          <span className="text-xs">{pokemons.length}</span>
                        ) : (
                          <span className="text-xs">0</span>
                        )
                      )
                    )
                  }
                </div>
              </div>
              <div className="w-full h-full flex items-center justify-between py-4 px-6">
                <h3 className="text-sm font-semibold">Equipo {team?.name}</h3>
                <span className='text-sm font-medium'>{selectedPokemons.length}/6</span>
              </div>
            </header>

            <section className="grid grid-cols-2 divide-x divide-border min-h-64 max-h-96 overflow-hidden">
              {/* lista izquierda */}
              <div
                ref={listRef}
                onScroll={handleScroll}
                className="overflow-auto p-6"
              >
                <div className="w-full grid gap-2">
                  {
                    pokemons.map((p: Pokemon) => {
                      const isSelected = selectedPokemons.some(sp => sp.id === p.id)
                      return (
                        <div
                          key={p.id}
                          className={cn(
                            'group w-full rounded-xl border flex items-center justify-between p-3 cursor-pointer transition',
                            isSelected ? 'bg-emerald-500/10 ring-2 ring-emerald-600/30 border-transparent' : 'hover:shadow border-border'
                          )}
                          onClick={() => handleAddPokemon(p)}
                        >
                          <div className="flex items-center justify-start gap-2">
                            <img
                              src={p.sprite}
                              alt={p.name}
                              className={cn(
                                'w-12 h-12 rounded-full aspect-square p-2 bg-background ring-2 border-2 ring-background',
                                isSelected ? 'border-emerald-500/30' : 'border-foreground/10'
                              )}
                            />
                            <span className="text-sm font-semibold capitalize">{p.name}</span>
                          </div>
                          <div className={cn(
                            'relative w-9 h-9 rounded-full overflow-hidden',
                            isSelected ? 'bg-transparent' : 'bg-foreground/5 transition group-hover:bg-foreground/10'
                          )}>
                            {isSelected && <SvgSuccessAnimation className="w-full h-full [&_.fill-circle]:!fill-foreground [&_.circle-outline]:!stroke-foreground" />}
                          </div>
                        </div>
                      )
                    })
                  }
                  {isFetchingNextPage && (
                    <div className="p-8 w-full flex items-center justify-center">
                      <Spinner size="xl" />
                    </div>
                  )}
                </div>
              </div>

              {/* lista derecha */}
              <div className="w-full p-6 overflow-auto">
                {
                  selectedPokemons.length === 0 ? (
                    <div className="p-6 text-center flex items-center justify-center min-h-full">
                      <div className='flex flex-col items-center justify-center gap-2 mx-auto max-w-52'>
                        <PackageOpen size={28} strokeWidth={1.5} />
                        <p className="text-sm text-muted-foreground">No hay pokémones actualmente en este equipo.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex flex-col gap-2" ref={containerRef}>
                      {
                        selectedPokemons
                          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                          .map(sp => {
                            const p = pokemons.find(pk => pk.id === sp.id)
                            if (!p) return null
                            return (
                              <React.Fragment key={sp.id}>
                                <div
                                  data-swapy-slot={String(sp.id)}
                                  className="w-full rounded-xl data-[swapy-highlighted]:bg-emerald-500/10 data-[swapy-highlighted]:border-2 data-[swapy-highlighted]:border-dashed data-[swapy-highlighted]:border-emerald-500/20"
                                >
                                  <article
                                    data-swapy-item={String(sp.id)}
                                    className="w-full h-full flex rounded-xl items-center justify-between border border-border p-3 data-[swapy-dragging]:ring-2 data-[swapy-dragging]:ring-foreground/5"
                                  >
                                    <div className="flex items-center justify-start gap-2">
                                      <img
                                        src={p.sprite}
                                        alt={p.name}
                                        className="w-12 h-12 rounded-full border border-border aspect-square p-2"
                                      />
                                      <span className="text-sm font-semibold capitalize">{p.name}</span>
                                    </div>
                                    <div className="inline-flex items-center justify-end gap-2">
                                      <Button size="sm" variant="outline" onClick={() => handleRemovePokemon(sp.id)}>Quitar</Button>
                                      <div
                                        className="w-7 h-8 rounded border border-border inline-flex items-center justify-center cursor-grabbing"
                                        data-swapy-handle
                                      >
                                        <Grip size={16}/>
                                      </div>
                                    </div>
                                  </article>
                                </div>
                              </React.Fragment>
                            )
                          })
                      }
                    </div>
                  )}
              </div>
            </section>
          </div>
        </Dialog.Body>

        <Dialog.Footer className="flex justify-between p-6 gap-2">
          {error && (
            <div className='px-4 py-2 text-sm inline-flex items-center justify-center rounded bg-foreground/5'>
              <p className="text-sm text-amber-600">{error}</p> </div>
          )
          }
          <div className='ml-auto'>
            <Dialog.Close asChild>
              <Button variant="outline">Cancelar</Button>
            </Dialog.Close>
          </div>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  )
}
