import { Gift } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'
import { Button, Close, Dialog, Spinner } from 'src/components/ui'
import { cn } from 'src/lib/utils'
import { useInfinitePokemonList } from 'src/services/queries'
import type { Pokemon } from 'src/types/Pokemon'
import type { Team } from 'src/types/Team'
import { useAddPokemonToTeam } from 'src/hooks/useAddPokemonToTeam' // 👈 nuevo hook

interface Props {
  open: boolean
  setOpen: (_open: boolean) => void
  team: Team
  onSelected: (_pokemon: Pokemon) => void
  selectedSlot: number | null
}

export default function DialogAddPokemonToSlot ({ open, setOpen, team, onSelected, selectedSlot }: Props) {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfinitePokemonList({ limit: 20, enabled: open })

  const pokemons: Pokemon[] = data?.pages.flat() ?? []
  const listRef = React.useRef<HTMLDivElement>(null)

  // Hook global
  const { addPokemon, success, error } = useAddPokemonToTeam()

  // Estado para manejar el pokemon seleccionado
  const [ selectedPokemon, setSelectedPokemon ] = React.useState<Pokemon | null>(null)

  // seleccionar pokemon de la lista
  function handleSelectPokemon (p: Pokemon) {
    setSelectedPokemon(p)
  }

  // agregar al slot seleccionado
  function handleAddPokemon () {
    if (selectedSlot === null) return
    if (!selectedPokemon) return

    addPokemon(team.id, {
      ...selectedPokemon,
      order: selectedSlot
    })

    if (error) {
      toast.error(error)
      return
    }

    if (success) {
      toast.success(`${selectedPokemon.name} agregado al slot ${selectedSlot + 1}`)
      setOpen(false)
    }
  }

  // scroll infinito
  const handleScroll = () => {
    const el = listRef.current
    if (!el) return
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 50) {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    }
  }

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
      <Dialog.Content className="max-w-3xl">
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

        <Dialog.Body className="w-full px-6 overflow-hidden">
          <section className="grid w-full min-h-96 max-h-[30rem] overflow-auto">
            <div
              ref={listRef}
              onScroll={handleScroll}
              className="overflow-auto p-6"
            >
              <div className="w-full grid grid-cols-3 gap-2">
                {pokemons.map((p: Pokemon) => (
                  <div
                    key={p.id}
                    className={cn(
                      'group w-full rounded-xl border flex flex-col items-center justify-between p-6 cursor-pointer transition border-border',
                      selectedPokemon?.id === p.id
                        ? 'ring-2 ring-emerald-500 bg-emerald-500/10 border-emerald-500/20 hover:border-emerald-500/30'
                        : 'hover:bg-foreground/2 hover:border-foreground/8'
                    )}
                    onClick={() => handleSelectPokemon(p)}
                  >
                    <div className="flex flex-col items-center justify-start gap-2">
                      <img
                        src={p.sprite}
                        alt={p.name}
                        className={cn(
                          'w-16 h-16 rounded-full aspect-square p-2 ring-2 bg-foreground/5 ring-foreground/10 border-4 border-background',
                        )}
                      />
                      <div className='flex flex-col items-center justify-center text-center gap-1'>
                        <span className="text-sm font-semibold capitalize">{p.name}</span>
                        <div className='flex items-center justify-center'>
                          {p?.types.length > 0 &&
                            p.types.map((t) => (
                              <span key={t} className="text-xs text-muted-foreground">
                                {t}
                              </span>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {isFetchingNextPage && (
                  <div className="p-8 w-full flex items-center justify-center">
                    <Spinner size="xl" />
                  </div>
                )}
              </div>
            </div>
          </section>
        </Dialog.Body>

        <Dialog.Footer className="flex justify-between p-6 gap-2">
          {error && (
            <div className='px-4 py-2 text-sm inline-flex items-center justify-center rounded bg-foreground/5'>
              <p className="text-sm text-amber-600">{error}</p>
            </div>
          )}
          <div className='ml-auto inline-flex items-center justify-end gap-2'>
            <Dialog.Close asChild>
              <Button variant="outline">Cancelar</Button>
            </Dialog.Close>
            <Button onClick={handleAddPokemon} disabled={!selectedPokemon}> Agregar </Button>
          </div>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  )
}
