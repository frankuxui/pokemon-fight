import { Button } from 'src/components/ui'
import type { Pokemon } from 'src/types/Pokemon'
import PokemonOptions from './pokemon-option'

interface Props {
  pokemon: Pokemon
  onAdd?: (_pokemon: Pokemon) => void
}

export default function PokemonCard ({ pokemon, onAdd }: Props) {
  return (
    <article
      key={pokemon.id}
      className="border rounded-2xl flex flex-col py-2 items-center justify-center hover:shadow-md border-border motion-safe:transition-all motion-safe:duration-300"
    >
      <header className='w-full flex items-center justify-center flex-col gap-2 relative p-4'>
        <figure className='w-16 h-16 sm:w-24 sm:h-24 overflow-hidden rounded-full p-3 bg-foreground/2 border-2 border-background ring-2 ring-foreground/5'>
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
                className="text-xs capitalize px-3 h-7 border inline-flex items-center justify-center rounded border-border"
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
