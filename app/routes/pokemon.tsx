import { usePokemonById } from 'src/services/queries'
import type { Route } from './+types/pokemon'
import { Spinner } from 'src/components/ui'
import StatusRender from 'src/components/status-render'
import { ArrowLeft, Dot, PackageOpen } from 'lucide-react'
import PokemonOptions from 'src/views/pokemons/components/pokemon-option'
import { Link } from 'react-router'
import { motion } from 'motion/react'
import type { PokemonProfile } from 'src/types/PokemonProfile'
import { StringUtils } from 'src/lib/string'
import React from 'react'
import PokkemonPowerChart from 'src/views/pokemons/components/pokemon-power-chart'
import PokemonMoves from 'src/views/pokemons/components/pokemon-moves'

export const meta = ({ params }: Route.MetaArgs) => {
  return [
    {
      title: `Perfil del pokemon ${params.id} - Pokémon Fight`,
      description: `Perfil y detalles del pokemon con ID ${params.id} - Pokémon Fight`
    }
  ]
}

export default function PokemonPage ({ params }: { params: { id: string } }) {

  let pokemon = null as unknown as PokemonProfile

  const { data, isLoading } = usePokemonById(params.id)

  if (isLoading) {
    return (
      <div className='mx-auto max-w-sm flex items-center justify-center gap-6 mt-20 min-h-96'>
        <Spinner size='2xl' />
      </div>
    )
  }

  if (!data) {
    return (
      <div className='mx-auto max-w-sm flex items-center justify-center gap-6 mt-20 min-h-96'>
        <div className='w-full mx-auto max-w-sm'>
          <StatusRender
            title='No se ha podido encontrar ningun dato'
            message='Parece que el pokemon que esta buscando no existe o se ha eliminado de la base de datos'
            icon={<PackageOpen size="36" strokeWidth="1.5" />}
          />
        </div>
      </div>
    )
  }

  if (data) {
    pokemon = [ data ][0] as unknown as PokemonProfile
  }

  return (
    <section className="w-full h-full flex items-start justify-center pb-20">
      <div className="w-full mx-auto max-w-7xl px-10">
        <div className='mx-auto max-w-md flex flex-col items-start gap-6 mt-20'>
          <Link to="/pokemons" className='inline-flex items-center justify-center gap-2 text-sm font-medium group'>
            <div className='w-10 h-10 relative inline-flex items-center justify-center'>
              <motion.span
                initial={{ scale: 0 }}
                whileHover={{ scale: 1.2 }}
                transition={{ duration: 0.3 }}
                whileTap={{ scale: 0.9 }}
                whileInView={{ scale: 1 }}
                className='absolute w-10 h-10 top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 scale-0 rounded-full bg-foreground/10 group-hover:scale-100 transition-all duration-300'
              />
              <ArrowLeft />
            </div>
            <span className='relative'>Pokemones</span>
          </Link>

          <div className="overflow-hidden flex flex-col items-start w-full rounded-2xl border border-border divide-y divide-border">
            <header className='relative w-full flex flex-row items-start justify-between gap-4 pt-6 pb-6 sm:pt-10'>
              <div className='flex items-start flex-col px-6 sm:px-10'>
                <figure className='rounded-full max-w-full w-28 h-28 overflow-hidden p-2 border border-border'>
                  <picture>
                    <img
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon?.id}.png`}
                      alt={pokemon?.name}
                      className='w-full h-full aspect-square rounded-full'
                    />
                  </picture>
                </figure>
                <div className='flex items-start flex-col mt-4'>
                  <h1 className='text-lg sm:text-xl xl:text-2xl font-bold'>{StringUtils.capitalizeFirstLetter(pokemon?.name)}</h1>
                  <div className='mt-2 flex items-start flex-wrap gap-2 text-xs text-foreground/80'>
                    {pokemon?.game_indices?.length ? (
                      <span> Primera aparición en {StringUtils.capitalizeFirstLetter(pokemon?.game_indices?.[0]?.version?.name)} </span>
                    ) : (
                      <span>Sin datos de primera aparición</span>
                    )}
                    <Dot className="w-4 h-4 text-foreground/40" />
                    <span>Peso: {pokemon?.weight / 10} kg</span>
                    <Dot className="w-4 h-4 text-foreground/40" />

                    <span>Altura: {pokemon?.height / 10} m</span>
                  </div>
                  <div className='mt-4 inline-flex flex-wrap justify-start items-center gap-2'>
                    {
                      pokemon?.types.map((t: any, index: number) => (
                        <span key={index} className='gap-2 rounded-full font-semibold text-xs inline-flex items-center justify-center border border-border h-8 px-3 bg-background'>
                          <span>✔️</span>
                          <span className='mt-px'>{t?.type?.name}</span>
                        </span>
                      ))
                    }
                  </div>
                </div>
                <div className='absolute top-8 right-8'>
                  <PokemonOptions data={pokemon as any} placement='left-start' />
                </div>
              </div>
            </header>
            <section className='p-6 pb-16 sm:px-10 w-full'>
              <h3 className='font-semibold text-base'>Habilidades</h3>
              <div className='inline-flex flex-wrap justify-start items-center gap-2 mt-2'>
                {
                  pokemon?.abilities.map((a: { ability: { name: string; url: string }; is_hidden: boolean; slot: number }, index: number) => (
                    <span key={index} className='gap-2 rounded-full font-semibold text-xs inline-flex items-center justify-center border border-border h-8 px-3 bg-background'>
                      <span>✨</span>
                      <span className='mt-px'>{a?.ability?.name}</span>
                    </span>
                  ))
                }
              </div>
            </section>
            <section className='p-6 pt-14 sm:px-10 w-full relative'>
              <div className='w-24 h-24 inline-flex items-center justify-center absolute bg-gray-50 rounded-full border -top-12 border-border ring-border dark:bg-background'>
                <PokkemonPowerChart stats={pokemon?.stats} />
              </div>
              <h3 className='font-semibold text-base mt-6'>Estadísticas</h3>
              <div className='w-full mt-4 flex flex-col gap-4'>
                {
                  pokemon?.stats.map((s: { base_stat: number; effort: number; stat: { name: string; url: string } }, index: number) => (
                    <div key={index} className='w-full flex flex-col gap-1'>
                      <div className='w-full flex items-center justify-between'>
                        <span className='text-sm font-medium capitalize'>{s?.stat?.name}</span>
                        <span className='text-sm font-medium'>{s?.base_stat}</span>
                      </div>
                      <div className='w-full bg-foreground/5 h-2 rounded-full overflow-hidden'>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(s?.base_stat / 255) * 100}%` }}
                          transition={{ duration: 0.5, ease: 'easeInOut' }}
                          className='h-2 bg-emerald-500 rounded-full'
                        />
                      </div>
                    </div>
                  ))
                }
              </div>
            </section>
            <section className='p-6 sm:px-10 w-full'>
              <h3 className='font-semibold text-base'>Movimientos</h3>
              <div className='inline-flex flex-wrap justify-start items-center gap-2 mt-2'>
                <PokemonMoves moves={pokemon?.moves?.map(m => ({ move: m.move })) ?? []} />
              </div>
            </section>
          </div>
        </div>
      </div>
    </section>
  )
}
