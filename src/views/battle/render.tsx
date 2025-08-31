import React from 'react'
import { Button, Spinner } from 'src/components/ui'
import { usePokemonsByIds } from 'src/services/queries'
import { useTeamStore } from 'src/store'
import type { Team } from 'src/types/Team'
import { useForm } from 'react-hook-form'
import { StringUtils } from 'src/lib/string'
import { createSwapy, type Swapy } from 'swapy'
import { Grip } from 'lucide-react'

// Lazy components
const DialogAddPokemon = React.lazy(() => import('src/views/teams/components/dialog-add-pokemon'))

export default function Render () {
  const { teams, updateTeam } = useTeamStore()

  // React Hook Form para manejar selects
  const { register, watch } = useForm()

  const teamOneId = watch('teamOneId')
  const teamTwoId = watch('teamTwoId')

  // Encontrar los equipos seleccionados
  const selectedTeamOne: Team | null = teams.find((t) => t.id === teamOneId) || null
  const selectedTeamTwo: Team | null = teams.find((t) => t.id === teamTwoId) || null

  // Traer los pokemons de los equipos seleccionados
  const { data: pokemons, isLoading, isError } = usePokemonsByIds({
    ids: [
      ...(selectedTeamOne?.pokemons.map((p) => p.id) || []),
      ...(selectedTeamTwo?.pokemons.map((p) => p.id) || [])
    ],
    enabled: !!selectedTeamOne || !!selectedTeamTwo
  })

  //
  // DRAG & DROP con SWAPY
  // Refs de los contenedores
  const containerRefOne = React.useRef<HTMLDivElement>(null)
  const containerRefTwo = React.useRef<HTMLDivElement>(null)

  // Swapy Team One
  // Swapy Team One
  React.useEffect(() => {
    if (!containerRefOne.current || !selectedTeamOne) return

    const swapyOne = createSwapy(containerRefOne.current, {
      animation: 'spring',
      swapMode: 'hover',
    })

    swapyOne.onSwap(() => {
      const nodes = containerRefOne.current?.querySelectorAll<HTMLElement>('[data-swapy-item]')
      if (!nodes) return

      // extraemos el index desde el id completo "teamId-item-INDEX"
      const newOrderIdx = Array.from(nodes).map(el => {
        const id = el.dataset.swapyItem || ''
        const parts = id.split('-')
        return Number(parts[parts.length - 1]) // último segmento es el index
      })

      const reordered = newOrderIdx
        .map(idx => selectedTeamOne.pokemons[idx])
        .filter(Boolean)

      updateTeam(selectedTeamOne.id, { pokemons: reordered })
    })

    return () => swapyOne.destroy()
  }, [ selectedTeamOne, updateTeam ])

  // Swapy Team Two
  React.useEffect(() => {
    if (!containerRefTwo.current || !selectedTeamTwo) return

    const swapyTwo = createSwapy(containerRefTwo.current, {
      animation: 'spring',
      swapMode: 'hover',
    })

    swapyTwo.onSwap(() => {
      const nodes = containerRefTwo.current?.querySelectorAll<HTMLElement>('[data-swapy-item]')
      if (!nodes) return

      const newOrderIdx = Array.from(nodes).map(el => {
        const id = el.dataset.swapyItem || ''
        const parts = id.split('-')
        return Number(parts[parts.length - 1])
      })

      const reordered = newOrderIdx
        .map(idx => selectedTeamTwo.pokemons[idx])
        .filter(Boolean)

      updateTeam(selectedTeamTwo.id, { pokemons: reordered })
    })

    return () => swapyTwo.destroy()
  }, [ selectedTeamTwo, updateTeam ])

  return (
    <React.Fragment>
      <section className='w-full'>
        <header className='py-6 border-b border-border sticky top-0 z-10 bg-background'>
          <div className='w-full mx-auto max-w-7xl px-10'>
            <div className='flex items-center justify-between'>
              <div className='flex flex-col items-start gap-2'>
                <h1 className='text-xl font-bold'>Batallas</h1>
                <p className='text-base'>Campo de batalla entre equipos</p>
              </div>
              <div className='flex flex-none items-center justify-end gap-2'>
                <Button size="sm" variant='default'>Crear Batalla</Button>
                <Button size="sm" variant='outline'>Reiniciar Batalla</Button>
              </div>
            </div>
          </div>
        </header>
      </section>

      <section className='w-full h-full'>
        <div className='w-full mx-auto max-w-7xl px-10 h-full'>
          <div id="battle-field" className='w-full grid grid-cols-12 divide-x divide-border border-x border-border min-h-screen'>

            {/* TEAM ONE */}
            <div className='w-full col-span-3 p-6' data-team='team-one'>
              <div className='w-full flex flex-col gap-4 items-start'>
                <header className='flex flex-col items-start gap-1'>
                  <h2 className='text-base font-semibold'>Seleccionar equipo</h2>
                  <p className='text-sm text-muted-foreground'>Selecciona un equipo para iniciar la batalla</p>
                </header>
                <select
                  className="w-full border border-border rounded p-2"
                  defaultValue=""
                  {...register('teamOneId')}
                >
                  <option value="" disabled>Selecciona un equipo</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className='mt-6'>
                <header className='flex items-center justify-between'>
                  <h2 className='text-base font-semibold'>Guerreros</h2>
                  <span className='text-sm text-muted-foreground'>{pokemons?.length || 0} / 6</span>
                </header>
                <div className='w-full grid grid-cols-2 gap-4 mt-4' ref={containerRefOne}>
                  {
                    selectedTeamOne && (
                      <React.Fragment>
                        {
                          selectedTeamOne.pokemons.map((p, index) => {
                            if (index >= 6) return null

                            const slotId = `${selectedTeamOne.id}-slot-${index}`

                            if (isLoading) {
                              return (
                                <div key={slotId} className="h-24 p-2 flex items-center justify-center rounded-xl w-full bg-foreground/5">
                                  <div className="w-full flex items-center justify-center">
                                    <Spinner size='xl' />
                                  </div>
                                </div>
                              )
                            }

                            const pokemonImg = pokemons?.find((pk: any) => pk.id === p.id)

                            return (
                              <div
                                key={slotId}
                                data-swapy-slot={selectedTeamOne.id}
                                className="pokemon w-full grid"
                              >
                                <div
                                  data-swapy-item={selectedTeamOne.id}
                                  className="w-full flex flex-col items-center justify-center gap-2"
                                >
                                  <div className='relative h-28 p-2 flex items-center justify-center rounded-xl w-full bg-foreground/5' >
                                    <div
                                      data-swapy-handle
                                      className='w-7 h-7 rounded-md border border-border inline-flex items-center justify-center absolute top-2 right-2 cursor-grabbing bg-background'
                                    >
                                      <Grip size={16}/>
                                    </div>
                                    <img src={pokemonImg?.sprite} alt={p.name} className='w-full max-w-18 object-cover' />
                                  </div>
                                  <p className='font-medium text-sm'>
                                    {StringUtils.capitalizeFirstLetter(p.name)}
                                  </p>
                                </div>
                              </div>
                            )
                          })
                        }

                        {/* Slots vacíos → Botón Agregar */}
                        {
                          Array.from({ length: 6 - selectedTeamOne.pokemons.length }).map((_, i) => {
                            return (
                              <div
                                key={`${selectedTeamOne.id}-slot-empty-${i}`}
                                className="pokemon w-full grid"
                              >
                                <div className='h-24 p-2 flex items-center justify-center rounded-xl w-full bg-foreground/5' >
                                  <Button size="sm" variant="outline">Agregar</Button>
                                </div>
                              </div>
                            )
                          })
                        }
                      </React.Fragment>
                    )
                  }
                </div>
              </div>

            </div>

            {/* BATTLE FIELD */}
            <div className='w-full col-span-6 h-full' data-field='battle-field'>
              <div className=' flex items-start justify-center h-full'>
                <div className='grid text-center mx-auto max-w-lg px-6 mt-40 place-items-center'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 48 48"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="m5.5 18.622l34-13.154l1.596 4.125l-34 13.154z" strokeWidth="1"/><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M28.642 18.16s.551 3.573 1.388 5.735l-4.99 1.931l-2.903-.483c-1.974 2.905-.364 11.615-.042 12.447s-.493 1.988-.493 1.988l-7.12 2.754l-2.755-1.19c-1.403-3.626 1.474-12.504.277-15.597c-1.197-3.095-4.79-.519-4.79-.519l-1.018-.256l.9-2.222l34-13.155l1.262 3.26l-19.43 7.517c-2.361.914-.79 4.973-.79 4.973" strokeWidth="1"/><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M23.511 20.145c.618 1.597 2.403 3.048 2.403 3.048l-1.713.663c-.87-.371-1.813-.718-2.453-2.132M39.886 6.466l1.796-.695l.818 2.112l-1.797.695zM8.954 20.431l-.522-1.347m2.202.697l-.521-1.347m2.202.696l-.521-1.346m2.202.696l-.521-1.347m2.202.697l-.521-1.347m-7.409.071l.403 1.043m11.355-4.393l6.022-2.33l.799 2.063l-6.022 2.33zm14.21 15.157l-3.05 3.402m4.526-1.156l-2.086 3.595m4.397-4.718l-.321 4.365m1.123-7.366l3.146 3.145" strokeWidth="1"/></svg>
                  <h2 className='text-lg font-semibold'>Campo de Batalla</h2>
                  <p className='text-sm text-muted-foreground'>Aquí se desarrollará la batalla entre los equipos seleccionados. Aun se está preparando el terreno.</p>
                </div>
              </div>
            </div>

            {/* TEAM TWO */}
            <div className='w-full col-span-3 p-6' data-team='team-two'>
              <div className='w-full flex flex-col gap-4 items-start'>
                <header className='flex flex-col items-start gap-1'>
                  <h2 className='text-base font-semibold'>Seleccionar equipo</h2>
                  <p className='text-sm text-muted-foreground'>Selecciona un equipo para iniciar la batalla</p>
                </header>
                <select
                  className="w-full border border-border rounded p-2"
                  defaultValue=""
                  {...register('teamTwoId')}
                >
                  <option value="" disabled>Selecciona un equipo</option>
                  {teams
                    .filter((t) => t.id !== teamOneId)
                    .map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className='mt-6'>
                <h2 className='text-base font-semibold mb-4'>Guerreros</h2>
                <div className='w-full grid grid-cols-2 gap-4 mt-4' ref={containerRefTwo}>
                  {
                    selectedTeamTwo && (
                      <React.Fragment>
                        {
                          selectedTeamTwo.pokemons.map((p, index) => {
                            if (index >= 6) return null

                            const slotId = `${selectedTeamTwo.id}-slot-${index}`

                            if (isLoading) {
                              return (
                                <div key={slotId} className="h-24 p-2 flex items-center justify-center rounded-xl w-full bg-foreground/5">
                                  <div className="w-full flex items-center justify-center">
                                    <Spinner size='xl' />
                                  </div>
                                </div>
                              )
                            }

                            const pokemonImg = pokemons?.find((pk: any) => pk.id === p.id)

                            return (
                              <div
                                key={`${selectedTeamTwo.id}-slot-${index}`}
                                data-swapy-slot={selectedTeamTwo.id}
                                className="pokemon w-full grid"
                              >
                                <div
                                  data-swapy-item={selectedTeamTwo.id}
                                  className="w-full flex flex-col items-center justify-center gap-2"
                                >
                                  <div className='relative h-28 p-2 flex items-center justify-center rounded-xl w-full bg-foreground/5' >
                                    <div
                                      data-swapy-handle
                                      className='w-7 h-7 rounded-md border border-border inline-flex items-center justify-center absolute top-2 right-2 cursor-grabbing bg-background'
                                    >
                                      <Grip size={16}/>
                                    </div>
                                    <img src={pokemonImg?.sprite} alt={p.name} className='w-full max-w-18 object-cover' />
                                  </div>
                                  <p className='font-medium text-sm'>
                                    {StringUtils.capitalizeFirstLetter(p.name)}
                                  </p>
                                </div>
                              </div>
                            )
                          })
                        }

                        {/* Slots vacíos → Botón Agregar */}
                        {
                          Array.from({ length: 6 - selectedTeamTwo.pokemons.length }).map((_, i) => {
                            return (
                              <div
                                key={`${selectedTeamTwo.id}-slot-empty-${i}`}
                                className="pokemon w-full grid"
                              >
                                <div
                                  className='h-24 p-2 flex items-center justify-center rounded-xl w-full bg-foreground/5'
                                >
                                  <Button size="sm" variant="outline">Agregar</Button>
                                </div>
                              </div>
                            )
                          })
                        }
                      </React.Fragment>
                    )
                  }
                </div>

              </div>

            </div>

          </div>
        </div>
      </section>
    </React.Fragment>
  )
}
