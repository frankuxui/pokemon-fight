import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { getPokemonById, getPokemonList } from './api'
import type { Pokemon } from 'src/types/Pokemon'

// Obtener los datos e insertar la imagen del pokemon
// Aquiu transforme los datos obtenidos para incluir la imagen del pokemon

export function usePokemonList ({ limit = 20, offset = 0 } = {}) {
  return useQuery<Pokemon[]>({
    queryKey: [ 'pokemonList', limit, offset ],
    queryFn: async () => {
      const data = await getPokemonList({ limit, offset })

      return Promise.all(
        data.map(async (p: { name: string; url: string }) => {
          const id = Number(p.url.split('/').filter(Boolean).pop())
          const res = await fetch(p.url)
          const full = await res.json()

          return {
            id,
            name: full.name,
            order: null,
            base_experience: full.base_experience,
            height: full.height / 10, // metros
            weight: full.weight / 10, // kg
            types: full.types.map((t: any) => t.type.name),
            abilities: full.abilities.map((a: any) => a.ability.name),
            stats: full.stats.map((s: any) => ({
              name: s.stat.name,
              base_stat: s.base_stat,
              effort: s.effort
            })),
            sprite: full.sprites.other['official-artwork'].front_default
          } as Pokemon
        })
      )
    }
  })
}

export function useInfinitePokemonList ({
  limit = 20,
  enabled = true
}: { limit?: number; enabled?: boolean }) {
  return useInfiniteQuery<Pokemon[], Error>({
    queryKey: [ 'pokemonListInfinite', limit ],
    queryFn: async ({ pageParam = 0 }) => {
      const offset: number = typeof pageParam === 'number' ? pageParam : 0
      const data = await getPokemonList({ limit, offset })

      // Traer detalles de cada Pokémon
      const pokemons = await Promise.all(
        data.map(async (p: { name: string; url: string }) => {
          const id = Number(p.url.split('/').filter(Boolean).pop())
          const res = await fetch(p.url)
          const full = await res.json()

          return {
            id,
            name: full.name,
            order: null,
            base_experience: full.base_experience,
            height: full.height / 10, // en metros
            weight: full.weight / 10, // en kg
            types: full.types.map((t: any) => t.type.name),
            abilities: full.abilities.map((a: any) => a.ability.name),
            stats: full.stats.map((s: any) => ({
              name: s.stat.name,
              base_stat: s.base_stat,
              effort: s.effort
            })),
            sprite: full.sprites.other['official-artwork'].front_default
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
    staleTime: 1000 * 60 * 5, // 5 minutos
    enabled: enabled ?? true
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

//
// Query para obtener varios pokemones por sus ids
export function usePokemonsByIds ({ ids, enabled }: { ids: (string | number)[]; enabled?: boolean }) {
  return useQuery<Pokemon[]>({
    queryKey: [ 'pokemonsByIds', ids ],
    queryFn: async () => {
      if (!ids || ids.length === 0) return []

      const pokemons = await Promise.all(
        ids.map(async (id) => {
          const full = await getPokemonById(id.toString())

          return {
            id: full.id,
            name: full.name,
            order: null,
            base_experience: full.base_experience,
            height: full.height / 10, // metros
            weight: full.weight / 10, // kg
            types: full.types.map((t: any) => t.type.name),
            abilities: full.abilities.map((a: any) => a.ability.name),
            stats: full.stats.map((s: any) => ({
              name: s.stat.name,
              base_stat: s.base_stat,
              effort: s.effort
            })),
            sprite: full.sprites.other['official-artwork'].front_default
          } as Pokemon
        })
      )

      return pokemons
    },
    enabled: enabled ?? true
  })
}