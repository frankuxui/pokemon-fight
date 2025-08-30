import { Button } from 'src/components/ui'
import type { Pokemon } from 'src/types/Pokemon'
import PokemonOptions from './pokemon-option'
import { useSelectedPokemonsStore } from 'src/store'
import { cn } from 'src/lib/utils'
import SvgSuccessAnimation from 'src/components/svg-success-animation'

interface Props {
  pokemon: Pokemon
  onAdd?: (_pokemon: Pokemon) => void
}

export default function PokemonCard ({ pokemon, onAdd }: Props) {

  // Zustand, hook para almacenar el id del pokkemon seleccionado
  const { toggle, pokemons } = useSelectedPokemonsStore()

  return (
    <article
      key={pokemon.id}
      className={cn(
        'relative group border rounded-2xl flex flex-col py-2 items-center justify-center hover:shadow-md border-border motion-safe:transition-all motion-safe:duration-300',
        pokemons.includes(String(pokemon.id)) ? 'bg-emerald-500/10 hover:shadow-none' : 'hover:bg-foreground/5'
      )}
    >
      <button
        onClick={() => {
          toggle(String(pokemon.id))
          onAdd?.(pokemon)
        }}
        className={cn(
          'absolute cursor-pointer top-4 left-4 rounded-full z-2 w-8 h-8 bg-foreground/10',
          pokemons.includes(String(pokemon.id)) ? 'visible group-hover:visible' : 'invisible group-hover:visible'
        )
        }>
        {pokemons.includes(String(pokemon.id))
          ? (
            <SvgSuccessAnimation className='w-full h-full [&_.fill-circle]:fill-foreground [&_.circle-outline]:stroke-foreground [&_.check]:stroke-background' />
          )
          : null
        }
      </button>
      <header className='w-full flex items-center justify-center flex-col gap-2 relative p-4'>
        <figure className={cn(
          'w-16 h-16 sm:w-24 sm:h-24 overflow-hidden rounded-full p-3 bg-foreground/2 border-2 border-background ring-2 ring-foreground/5 motion-safe:transition-all motion-safe:duration-300',
          pokemons.includes(String(pokemon.id)) ? 'ring-emerald-500/30 border-emerald-500/5 bg-emerald-500/10' : 'group-hover:bg-background'
        )}>
          <img
            src={pokemon.sprite}
            alt={pokemon.name}
            className="w-full max-w-full object-cover aspect-square"
          />
        </figure>
        <h2 className="capitalize font-semibold">{pokemon.name}</h2>
        <div className='absolute top-4 right-4 sm:top-6 sm:right-6'>
          <PokemonOptions data={pokemon} />
        </div>
      </header>
      <section className='px-4 pb-4'>
        <div className="flex gap-1 mt-2">
          {
            pokemon.types.map(t => (
              <span
                key={t}
                className={cn(
                  'text-xs capitalize px-3 h-7 border inline-flex items-center justify-center rounded border-border',
                  pokemons.includes(String(pokemon.id)) && 'bg-background border-background dark:bg-emerald-500/20 dark:border-emerald-500/10'
                )}
              >
                {t}
              </span>
            ))
          }
        </div>
        <div className='w-full mx-auto flex items-center justify-center mt-3'>
          <Button size={'sm'} className='px-4'>Añadir</Button>
        </div>
      </section>
    </article>
  )
}
