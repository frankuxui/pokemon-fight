export type Team = {
  id: string
  name: string
  description: string
  pokemons: {
    id: number,
    name: string,
    order: number
  }[]
  slogan: string
  avatar: string
  createdAt?: string
  updatedAt?: string
}
