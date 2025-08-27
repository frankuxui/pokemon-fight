export interface Pokemon {
  id: number
  name: string
  sprite: string
  types: string[]
  stats: {
    hp: number
    attack: number
    defense: number
    speed: number
  }
}