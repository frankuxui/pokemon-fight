import React from 'react'
import { Button } from 'src/components/ui'
import { usePokemonsByIds } from 'src/services/queries'
import { useTeamStore } from 'src/store'
import type { Team } from 'src/types/Team'
import { useForm } from 'react-hook-form'
import { PackageCheck, PackageOpen } from 'lucide-react'
import PokemonSlots from './slot'
import StatusRender from 'src/components/status-render'

// Lazy components
/* const DialogAddPokemon = React.lazy(
  () => import('src/views/teams/components/dialog-add-pokemon')
) */
/* const DialogAddPokemonToSlot = React.lazy(
  () => import('src/components/dialogs/dialog-add-pokemon-to-slot')
) */

const DialogAddPokemonToSlot = React.lazy(() => import('src/components/dialogs/dialog-add-pokemon-to-slot'))
const DialogCreateTeam = React.lazy(() => import('src/views/teams/components/dialog-create-team'))

export default function Render () {
  const { teams, updateTeam } = useTeamStore()

  // React hook form
  const { register, watch } = useForm()

  const [ battleEnabled ] = React.useState(false)

  const teamOneId = watch('teamOneId')
  const teamTwoId = watch('teamTwoId')

  const selectedTeamOne = teams.find((t: Team) => t.id === teamOneId) || null
  const selectedTeamTwo = teams.find((t: Team) => t.id === teamTwoId) || null

  const { data: pokemons, isLoading, isError } = usePokemonsByIds({
    ids: [
      ...(selectedTeamOne?.pokemons.map((p) => p.id) || []),
      ...(selectedTeamTwo?.pokemons.map((p) => p.id) || []),
    ],
    enabled: !!selectedTeamOne || !!selectedTeamTwo,
  })

  const [ isDialogOpen, setIsDialogOpen ] = React.useState(false)
  const [ selectedTeam, setSelectedTeam ] = React.useState<Team | null>(null)
  const [ selectedSlot, setSelectedSlot ] = React.useState<number | null>(null)

  // Estados para abrir el dialogo de agregar pokemon
  const [ openDialogAddPokemonToSlot, setOpenDialogAddPokemonToSlot ] = React.useState(false)

  // Seleccionar pokemon para agregar al slot
  const handleAddPokemonToSlot = (pokemonId: number) => {
    if (selectedTeam && selectedSlot !== null) {
      const updatedPokemons = selectedTeam.pokemons.map((p) => {
        if (p.id === pokemonId) {
          return { ...p, order: selectedSlot }
        }
        return p
      })
      updateTeam(selectedTeam.id, { pokemons: updatedPokemons })
    }
  }

  return (
    <React.Fragment>
      <section className="w-full">
        <header className="py-6 border-b border-border sticky top-0 z-10 bg-background">
          <div className="w-full mx-auto max-w-7xl px-10">
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-start gap-2">
                <h1 className="text-xl font-bold">Batallas</h1>
                <p className="text-base">Campo de batalla entre equipos</p>
              </div>
              <div className="flex flex-none items-center justify-end gap-2">
                <Button size="sm" variant="default">
                  Crear Batalla
                </Button>
                <Button size="sm" variant="outline">
                  Reiniciar Batalla
                </Button>
              </div>
            </div>
          </div>
        </header>
      </section>

      <section className="w-full h-full">
        <div className="w-full mx-auto max-w-7xl px-10 h-full">
          <div
            id="battle-field"
            className="w-full grid grid-cols-12 divide-x divide-border border-x border-border min-h-screen"
          >
            {/* TEAM ONE */}
            <div className="w-full col-span-3 p-6" data-team="team-one">
              <div className="w-full flex flex-col gap-4 items-start">
                <header className="flex flex-col items-start gap-1">
                  <h2 className="text-base font-semibold">Seleccionar equipo</h2>
                  <p className="text-sm text-muted-foreground">
                    Selecciona un equipo para iniciar la batalla
                  </p>
                </header>
                <select
                  id="teamOneId"
                  defaultValue=""
                  className="w-full border border-border rounded p-2"
                  {...register('teamOneId')}
                >
                  <option value="" disabled> Selecciona un equipo </option>
                  {teams
                  // si hay seleccionado en teamTwo, lo excluimos
                    .filter((t) => String(t.id) !== String(teamTwoId))
                    .map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="mt-6">
                <header className="flex items-center justify-between">
                  <h2 className="text-base font-semibold">Guerreros</h2>
                  <span className="text-sm text-muted-foreground">
                    {pokemons?.length || 0} / 6
                  </span>
                </header>
                <section className='mt-4'>
                  {
                    teams.length === 0 ? (
                      <div className='w-full flex items-center justify-center flex-col'>
                        <div className='grid gap-1 mt-2 text-center w-full mx-auto max-w-xs place-items-center'>
                          <StatusRender
                            title='Sin equipos'
                            message='Crea un equipo para comenzar una batalla épica'
                            icon={<PackageOpen strokeWidth='1.5' size={26}/>}
                            action={{
                              label: 'Crear equipo',
                              onClick: () => setIsDialogOpen(true),
                              variant: 'outline',
                              size: 'sm',
                            }}
                          />
                        </div>
                      </div>
                    ) : selectedTeamOne && Object.keys(selectedTeamOne).length > 0 ? (
                      <PokemonSlots
                        team={selectedTeamOne}
                        onAdd={(slotIndex) => {
                          setSelectedTeam(selectedTeamOne)
                          setSelectedSlot(slotIndex)
                          setOpenDialogAddPokemonToSlot(true)
                        }}
                      />
                    ) : (
                      <div className="w-full flex items-center justify-center px-4">
                        <p className="text-sm text-muted-foreground text-center max-w-52">
                          Selecciona un equipo para ver sus guerreros
                        </p>
                      </div>
                    )
                  }
                </section>
              </div>
            </div>

            {/* BATTLE FIELD */}
            <div className="w-full col-span-6 h-full" data-field="battle-field">
              <div className="flex items-start justify-center h-full p-6">
                {teams.length === 0 ? (
                  <div className="w-full flex items-center justify-center flex-col px-8 py-32 mx-auto max-w-3xl rounded-3xl bg-foreground/2">
                    <PackageOpen strokeWidth="1" size={36} />
                    <div className="grid gap-1 mt-2 text-center w-full mx-auto max-w-lg place-items-center">
                      <h4 className="font-semibold">Sin equipos</h4>
                      <p className="text-sm">
                        Aun no hay equipos creados. Si quieres, puedes crear uno
                        nuevo.
                      </p>
                      <Button
                        className="mt-4"
                        onClick={() => setIsDialogOpen(true)}
                        variant="outline"
                      >
                        Crear equipo
                      </Button>
                    </div>
                  </div>
                ) : teams.length === 1 ? (
                  <div className="w-full flex items-center justify-center flex-col px-8 py-32 mx-auto max-w-3xl rounded-3xl bg-foreground/2">
                    <PackageCheck strokeWidth="1" size={36} />
                    <div className="grid gap-1 mt-2 text-center w-full mx-auto max-w-lg place-items-center">
                      <h4 className="font-semibold">Solo tienes un equipo</h4>
                      <p className="text-sm">
                        Para iniciar una batalla necesitas al menos dos equipos.
                        Crea un nuevo equipo para poder comenzar.
                      </p>
                      <Button
                        className="mt-4"
                        onClick={() => setIsDialogOpen(true)}
                        variant="outline"
                      >
                        Crear equipo
                      </Button>
                    </div>
                  </div>
                ) : battleEnabled ? (
                  <div>Campo de batalla activo</div>
                ) : (
                  <div className="w-full flex items-center text-center justify-center flex-col px-8 py-32 mx-auto max-w-3xl rounded-3xl bg-foreground/2">
                    <h4 className="font-semibold">Campo de Batalla</h4>
                    <p className="text-sm">
                      Aquí se desarrollará la batalla entre los equipos
                      seleccionados. Aun se está preparando el terreno.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* TEAM TWO */}
            <div className="w-full col-span-3 p-6" data-team="team-two">
              <div className="w-full flex flex-col gap-4 items-start">
                <header className="flex flex-col items-start gap-1">
                  <h2 className="text-base font-semibold">Seleccionar equipo</h2>
                  <p className="text-sm text-muted-foreground">
                    Selecciona un equipo para iniciar la batalla
                  </p>
                </header>
                <select
                  defaultValue=""
                  id="teamTwoId"
                  className="w-full border border-border rounded p-2"
                  {...register('teamTwoId')}
                >
                  <option value="" disabled> Selecciona un equipo </option>
                  {teams
                  // si hay seleccionado en teamOne, lo excluimos
                    .filter((t) => String(t.id) !== String(teamOneId))
                    .map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="mt-6">
                <h2 className="text-base font-semibold mb-4">Guerreros</h2>
                <section className='mt-4'>
                  {
                    teams.length === 0 ? (
                      <div className='w-full flex items-center justify-center flex-col'>
                        <div className='grid gap-1 mt-2 text-center w-full mx-auto max-w-xs place-items-center'>
                          <StatusRender
                            title='Sin equipos'
                            message='Crea un equipo para comenzar una batalla épica'
                            icon={<PackageOpen strokeWidth='1.5' size={26}/>}
                            action={{
                              label: 'Crear equipo',
                              onClick: () => setIsDialogOpen(true),
                              variant: 'outline',
                              size: 'sm',
                            }}
                          />
                        </div>
                      </div>
                    ) : selectedTeamTwo && Object.keys(selectedTeamTwo).length > 0 ? (
                      <PokemonSlots
                        team={selectedTeamTwo}
                        onAdd={(slotIndex) => {
                          setSelectedTeam(selectedTeamTwo)
                          setSelectedSlot(slotIndex)
                          setOpenDialogAddPokemonToSlot(true)
                        }}
                      />
                    ) : (
                      <div className="w-full flex items-center justify-center px-4">
                        <p className="text-sm text-muted-foreground text-center max-w-52">
                          Selecciona un equipo para ver sus guerreros
                        </p>
                      </div>
                    )
                  }
                </section>
              </div>
            </div>
          </div>
        </div>
      </section>

      <DialogCreateTeam open={isDialogOpen} setOpen={setIsDialogOpen} />

      {
        teams?.length > 0 && (
          <DialogAddPokemonToSlot
            open={openDialogAddPokemonToSlot}
            setOpen={setOpenDialogAddPokemonToSlot}
            team={selectedTeam as Team}
            selectedSlot={selectedSlot}
            onSelected={(pokemonId) => {
              handleAddPokemonToSlot(pokemonId as number)
              setOpenDialogAddPokemonToSlot(false)
            }}
          />
        )
      }
    </React.Fragment>
  )
}
