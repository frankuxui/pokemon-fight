import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { getPokemonById, getPokemonList } from './api'
import type { Pokemon } from 'src/types/Pokemon'

// Obtener la lista de Pokémon
/* export function usePokemonList ({ limit = 20, offset = 0 } = {}) {
  return useQuery({
    queryKey: [ 'pokemonList', limit, offset ],
    queryFn: () => getPokemonList({ limit, offset }),
    staleTime: 1000 * 60 * 5, // 5 minutos
  })
}
 */

// Obtener los datos e insertar la imagen del pokemon
// Aquiu transforme los datos obtenidos para incluir la imagen del pokemon

export function usePokemonList ({ limit = 20, offset = 0 } = {}) {
  return useQuery<Pokemon[]>({
    queryKey: [ 'pokemonList', limit, offset ],
    queryFn: async () => {
      const data = await getPokemonList({ limit, offset })
      return Promise.all(
        data.map(async (p: { name: string; url: string }) => {
          const id = p.url.split('/').filter(Boolean).pop()
          const res = await fetch(p.url)
          const full = await res.json()

          return {
            id: Number(id),
            name: p.name,
            sprite: full.sprites.other['official-artwork'].front_default,
            types: full.types.map((t: any) => t.type.name),
          } as Pokemon
        })
      )
    }
  })
}

/* export function useInfinitePokemonList ({ limit = 20 } = {}) {
  return useInfiniteQuery<Pokemon[]>({
    queryKey: [ 'pokemonListInfinite', limit ],
    initialPageParam: 0,
    queryFn: async ({ pageParam = 0 }) => {
      const offset = typeof pageParam === 'number' ? pageParam : 0
      const data = await getPokemonList({ limit, offset })
      return data.map(async (p: { name: string; url: string }) => {
        const id = p.url.split('/').filter(Boolean).pop()
        const res = await fetch(p.url)
        const full = await res.json()
        return {
          id: Number(id),
          name: p.name,
          sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
          types: full.types.map((t: any) => t.type.name),
        } as Pokemon
      })
    },
    getNextPageParam: (lastPage, allPages) => {
      // ⚡ Cada "page" es un array de pokémon
      const nextOffset = allPages.length * limit
      // Si la última página está vacía, no hay más
      return lastPage.length > 0 ? nextOffset : undefined
    }
  })
} */

export function useInfinitePokemonList ({ limit = 20 } = {}) {
  return useInfiniteQuery<Pokemon[], Error>({
    queryKey: [ 'pokemonListInfinite', limit ],
    queryFn: async ({ pageParam = 0 }) => {
      const offset: number = typeof pageParam === 'number' ? pageParam : 0
      const data = await getPokemonList({ limit, offset })

      // Traer detalles de cada Pokémon
      const pokemons = await Promise.all(
        data.map(async (p: { name: string; url: string }) => {
          const id = p.url.split('/').filter(Boolean).pop()
          const res = await fetch(p.url)
          const full = await res.json()
          return {
            id: Number(id),
            name: p.name,
            sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
            types: full.types.map((t: any) => t.type.name),
          } as Pokemon
        })
      )

      return pokemons
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const nextOffset = allPages.length * limit
      return lastPage.length < limit ? undefined : nextOffset
    },
  })
}

//
// Query para obtener un pokemon por id
export function usePokemonById (id: string) {
  return useQuery<Pokemon, Error>({
    queryKey: [ 'pokemon', id ],
    queryFn: () => getPokemonById(id),
  })
}