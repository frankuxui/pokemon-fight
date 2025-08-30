import React from 'react'
import { toast } from 'sonner'
import { Button, Close, Dialog } from 'src/components/ui'
import { cn } from 'src/lib/utils'
import { useTeamStore } from 'src/store'
import type { Pokemon } from 'src/types/Pokemon'
import type { Team } from 'src/types/Team'
import { useDebounce } from 'src/hooks/useDebounce'
import { PackageOpen } from 'lucide-react'

// Lazy components
const DialogCreateTeams = React.lazy(() => import('src/views/teams/components/dialog-create-team'))

interface Props {
  open: boolean
  setOpen: (_open: boolean) => void
  item: Pokemon
}

export default function DialogSendPokemonToTeam ({ open, setOpen, item }: Props) {
  const { teams, updateTeam } = useTeamStore()
  const [ error, setError ] = React.useState<string | null>(null)
  const [ query, setQuery ] = React.useState('')

  // aplicar debounce al query
  const debouncedQuery = useDebounce(query, 300)

  //
  // Toggle Pokémon en equipo
  const handleTogglePokemon = (p: Pokemon, team: Team) => {
    const current = team.pokemons ?? []
    const exists = current.some(sp => sp.id === p.id)

    if (exists) {
      // remover
      const newSelection = current
        .filter(sp => sp.id !== p.id)
        .map((sp, i) => ({ ...sp, order: i })) // reasignar orden
      updateTeam(team.id, { pokemons: newSelection })
      toast.success(`${p.name} eliminado de ${team.name}.`)
      setError(null)
      return
    }

    // agregar
    if (current.length >= 6) {
      toast.error(`El equipo ${team.name} ya tiene 6 Pokémon.`)
      setError(`El equipo ${team.name} ya tiene 6 Pokémon.`)
      return
    }

    const newPokemon = {
      id: p.id,
      name: p.name,
      order: current.length,
    }

    const newSelection = [ ...current, newPokemon ]
    updateTeam(team.id, { pokemons: newSelection })
    toast.success(`${p.name} agregado a ${team.name}.`)
    setError(null)
  }

  // Filtrar equipos por query con debounce
  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
    team.slogan?.toLowerCase().includes(debouncedQuery.toLowerCase())
  )

  // Dialogo para crear equipos en caso de que no existan
  const [ openCreateTeamDialog, setOpenCreateTeamDialog ] = React.useState(false)

  return (
    <React.Fragment>
      <Dialog open={open} onOpenChange={setOpen}>
        <Dialog.Content className="max-w-xl">
          <Dialog.Header className="w-full p-6 flex items-center justify-between">
            <div className='flex flex-row items-center justify-start gap-4'>
              <figure>
                <img src={item?.sprite} alt={item?.name} className="w-14 h-14 rounded-full" />
              </figure>
              <div className='flex flex-col items-start'>
                <h2 className="text-lg font-semibold capitalize">{item?.name}</h2>
                <p className="text-sm text-muted-foreground">Selecciona un equipo para agregar este Pokémon</p>
              </div>
            </div>
            <Dialog.Close asChild>
              <Close />
            </Dialog.Close>
          </Dialog.Header>

          <Dialog.Body className='px-6 w-full'>

            {
              teams.length > 0 && (
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Buscar equipo por nombre o slogan..."
                    className="w-full border border-border rounded h-10 bg-background px-3 text-sm"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                  />
                </div>
              )
            }

            {
              teams.length === 0 ? (
                <div className='flex items-center justify-center min-h-64'>
                  <div className="p-6 text-center flex items-center justify-center min-h-full">
                    <div className='flex flex-col items-center justify-center gap-2 mx-auto max-w-52'>
                      <PackageOpen size={28} strokeWidth={1.5} />
                      <p className="text-sm text-muted-foreground">Aún no tienes equipos creados en la base de datos.</p>
                      <Button size="sm" onClick={() => setOpenCreateTeamDialog(true)}>Crear equipo</Button>
                    </div>
                  </div>
                </div>
              ) : filteredTeams.length === 0 ? (
                <p className="text-sm text-muted-foreground">No se encontraron equipos con “{debouncedQuery}”.</p>
              ) : (
                <div className='grid grid-cols-3 gap-4'>
                  {
                    filteredTeams.map(team => {
                      const isInTeam = team.pokemons?.some(sp => sp.id === item.id)
                      return (
                        <button
                          key={team.id}
                          type="button"
                          onClick={() => handleTogglePokemon(item, team)}
                          className={cn(
                            'border border-border rounded-xl p-4 text-left transition hover:shadow focus:ring-2 focus:ring-primary',
                            isInTeam && 'bg-emerald-500/5 focus:ring-emerald-500 ring-2 ring-emerald-500'
                          )}
                        >
                          <header className='w-full flex flex-col items-start gap-2'>
                            <img
                              src={team.avatar}
                              alt={team.name}
                              className="w-12 h-12 rounded-full"
                            />
                            <div className='flex flex-col items-start w-full'>
                              <h3 className="font-semibold">{team.name}</h3>
                              <p className='text-xs text-muted-foreground'>{team?.slogan}</p>
                            </div>
                          </header>
                        </button>
                      )
                    })
                  }
                </div>
              )}

          </Dialog.Body>

          <Dialog.Footer className="flex justify-end p-6 gap-2">
            <div className='flex-1 flex items-center justify-end'>
              <Dialog.Close asChild>
                <Button variant="outline">Cancelar</Button>
              </Dialog.Close>
            </div>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog>
      <DialogCreateTeams open={openCreateTeamDialog} setOpen={setOpenCreateTeamDialog} />
    </React.Fragment>
  )
}
