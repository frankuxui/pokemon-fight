import React, { useMemo, useRef, useEffect } from 'react'
import { Button, Spinner } from 'src/components/ui'
import { useForm } from 'react-hook-form'
import { useInfinitePokemonList } from 'src/services/queries'
import type { Pokemon } from 'src/types/Pokemon'
import PokemonCard from './components/pokemon-card'
import { useDebounce } from 'src/hooks/useDebounce'
import { SearchInput } from 'src/components/search-input'
import { cn } from 'src/lib/utils'
import { Ban } from 'lucide-react'
import { useSelectedPokemonsStore } from 'src/store'
import { AnimatePresence, motion } from 'motion/react'

/*

 # Componente de lista de Pokémon

 En esta página podrás ver y buscar todos los Pokémon disponibles en la API. He creado una lista donde se cargan los pokemones usando `useInfiniteQuery` para el manejo de la paginación y la búsqueda.

*/

// Lazy components
const DialogAddPokemonToTeams = React.lazy(() => import('src/components/dialogs/dialog-add-pokemons-to-team'))

type SearchForm = {
  name: string
  types: string[]
}

export default function PokemonList () {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfinitePokemonList({ limit: 20 })

  const { register, watch, setValue } = useForm<SearchForm>({
    defaultValues: { name: '', types: [] }
  })
  const filters = watch()
  const debouncedName = useDebounce(filters.name, 400)

  // normalizar types
  const selectedTypes = Array.isArray(filters.types)
    ? filters.types
    : [ filters.types ].filter(Boolean)

  // aplanar todas las páginas
  const pokemons: Pokemon[] = data?.pages.flat() ?? []

  // obtener todos los tipos únicos
  const allTypes = Array.from(
    new Set(pokemons.flatMap((p: Pokemon) => p.types) ?? [])
  )

  // aplicar filtros
  const filteredPokemons = useMemo(() => {
    return pokemons.filter(p => {
      const matchName = p.name?.toLowerCase().includes(debouncedName.toLowerCase())
      const matchTypes =
        selectedTypes.length === 0 ||
        selectedTypes.every(type => p.types.includes(type))
      return matchName && matchTypes
    })
  }, [ pokemons, debouncedName, selectedTypes ])

  // Intersection Observer
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!loadMoreRef.current) return

    // si hay filtros activos no observar
    if (debouncedName || selectedTypes.length > 0) return

    const observer = new IntersectionObserver(entries => {
      const [ entry ] = entries
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    }, {
      threshold: 0.1,
      rootMargin: '100px' // anticipar carga antes de llegar al final
    })

    observer.observe(loadMoreRef.current)
    return () => observer.disconnect()
  }, [ hasNextPage, isFetchingNextPage, fetchNextPage, debouncedName, selectedTypes ])

  // Zustand, hook para almacenar el id del pokkemon seleccionado
  const { pokemons: pokemonIds } = useSelectedPokemonsStore()

  // Estado para abrir el dialogo de enviar pokemones al equipo
  const [ openDialog, setOpenDialog ] = React.useState(false)

  return (
    <React.Fragment>
      <div className='w-full border-b border-border sticky top-22 py-6 z-10 bg-background'>
        <div className='w-full mx-auto max-w-7xl px-10'>
          {/* Buscador */}
          <form className="space-y-4">
            <SearchInput<SearchForm>
              name="name"
              register={register}
              setValue={setValue}
              value={filters.name}
              placeholder="Buscar por nombre..."
            />
            <div className="flex flex-wrap gap-2">
              {
                allTypes.map(type => (
                  <label
                    key={type}
                    className={cn(
                      'inline-flex px-4 items-center gap-1 text-sm rounded-full border h-7 font-medium justify-center',
                      selectedTypes.includes(type) ? 'bg-foreground text-background border-foreground' : 'bg-background text-foreground border-border'
                    )}
                  >
                    <input type="checkbox" value={type} {...register('types')} />
                    <span className="capitalize">{type}</span>
                  </label>
                ))
              }
            </div>
          </form>
        </div>
      </div>

      <div className='w-full mx-auto max-w-7xl px-10 mt-10'>
        {
          isLoading ? (
            <div className='w-full min-h-96 flex items-center justify-center'>
              <Spinner size="2xl" />
            </div>
          ) : isError ? (
            <div className='w-full min-h-96 flex items-center justify-center'>
              <div className='flex flex-col items-center justify-center text-center'>
                <Ban size={32} strokeWidth={1.5} />
                <h3 className='font-semibold text-lg mt-4'>Ha ocurrido un error</h3>
                <p>Ha ocurrido un error al cargar los pokémon: {(error as Error)?.message}</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredPokemons.map((pokemon: Pokemon) => (
                <PokemonCard key={pokemon.id} pokemon={pokemon} />
              ))}
            </div>

          )
        }

        {
          selectedTypes.length === 0 && !debouncedName && (
            <div ref={loadMoreRef} className="flex justify-center p-20">
              {isFetchingNextPage && <Spinner size="xl" />}
            </div>
          )
        }

        {
          <AnimatePresence mode='wait'>
            {
              pokemonIds.length > 0 && (
                <motion.div
                  initial={{ y: 100 }}
                  animate={{ y: 0 }}
                  exit={{ y: 100 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className='bottom-0 left-0 w-full h-20 bg-black/80 fixed z-20 backdrop-blur-sm'
                >
                  <div className='w-full h-full max-w-7xl mx-auto px-10'>
                    <div className='w-full h-full flex items-center justify-center gap-10'>
                      <h6 className='font-medium text-white'>
                        Agrega {pokemonIds.length > 1 ? 'los' : null} {pokemonIds.length} {pokemonIds.length > 1 ? 'pokemones' : 'pokémon'} { pokemonIds.length > 1 ? 'seleccionados' : 'seleccionado' }
                      </h6>
                      <Button
                        onClick={() => setOpenDialog(true)}
                        className='bg-white text-black hover:bg-white/80'>
                          Agregar a equipos
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )
            }
          </AnimatePresence>
        }
      </div>

      <DialogAddPokemonToTeams open={openDialog} setOpen={setOpenDialog} pokemonIds={pokemonIds} />
    </React.Fragment>
  )
}
