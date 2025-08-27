import type { Pokemon } from '../types/Pokemon'

export function mapPokemon (apiData: any): Pokemon {
  return {
    id: apiData.id,
    name: apiData.name,
    sprite: apiData.sprites.other['official-artwork'].front_default
      || apiData.sprites.front_default,
    types: apiData.types.map((t: any) => t.type.name),
    stats: {
      hp: apiData.stats.find((s: any) => s.stat.name === 'hp')?.base_stat || 0,
      attack: apiData.stats.find((s: any) => s.stat.name === 'attack')?.base_stat || 0,
      defense: apiData.stats.find((s: any) => s.stat.name === 'defense')?.base_stat || 0,
      speed: apiData.stats.find((s: any) => s.stat.name === 'speed')?.base_stat || 0,
    }
  }
}
