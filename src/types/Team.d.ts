import type { Pokemon } from './Pokemon'

export type Team = {
  id: string
  name: string
  description: string
  pokemons: Pokemon[]
  slogan: string
  avatar: string
  createdAt?: string
  updatedAt?: string
}
