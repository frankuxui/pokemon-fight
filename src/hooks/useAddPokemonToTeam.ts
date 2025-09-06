import { useState } from 'react'
import { MAX_POKEMONS_PER_TEAM } from 'src/config'
import { useTeamStore } from 'src/store'
import type { Pokemon } from 'src/types/Pokemon'

export function useAddPokemonToTeam () {

  // Hook para la gestion de equipo
  // Actualiza el equipo y agrega el pokemon
  const { teams, updateTeam } = useTeamStore()

  // Estados para manejar la operación
  const [ success, setSuccess ] = useState(false)
  const [ error, setError ] = useState<string | null>(null)

  function addPokemon (teamId: string | number, pokemon: Pokemon) {
    setSuccess(false)
    setError(null)

    const team = teams.find((t) => t.id === teamId)
    if (!team) {
      setError('Equipo no encontrado')
      return
    }

    // si ya existe
    if (team.pokemons.some((pk) => pk.id === pokemon.id)) {
      setError(`${pokemon.name} ya está en el equipo.`)
      return
    }

    // si ya está lleno
    if (team.pokemons.length >= MAX_POKEMONS_PER_TEAM) {
      setError('El equipo ya tiene 6 pokémon.')
      return
    }

    // calcular siguiente order libre
    // Esto es valido para asignar el orden de los pokemones
    const usedOrders = team.pokemons.map((pk) => pk.order ?? -1)
    let nextOrder = 0
    while (usedOrders.includes(nextOrder) && nextOrder < MAX_POKEMONS_PER_TEAM) {
      nextOrder++
    }

    const newPokemon: Pokemon = {
      ...pokemon,
      order: nextOrder,
    }

    const updated = [ ...team.pokemons, newPokemon ]

    updateTeam(team.id, { pokemons: updated })

    setSuccess(true)
  }

  return { addPokemon, success, error }
}
