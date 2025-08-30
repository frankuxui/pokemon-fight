// src/store/teamStore.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import moment from 'moment'
import type { Team } from 'src/types/Team'

// -----------------------------
// Configuración de vista
// -----------------------------
type StoreViewConfigProps = {
  view: 'table' | 'card'
  setView: (_v: 'table' | 'card') => void
}

export const useViewConfigStore = create<StoreViewConfigProps>()(
  persist(
    (set) => ({
      view: 'table',
      setView: (v) => set({ view: v }),
    }),
    {
      name: 'view-config',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

// -----------------------------
// Store de equipos
// -----------------------------
const STORE_KEY = 'teams-store'
const MAX_MEMBERS = 6

// Tipo de equipo guardado en la store
// Use Team directly instead of TeamEntity

type TeamDraft = Partial<Omit<Team, 'id' | 'createdAt' | 'updatedAt'>> & {
  id?: string
}

interface TeamStore {
  teams: Team[]
  draft: TeamDraft | null

  // CRUD
  createTeam: (_team: Omit<Team, 'id' | 'createdAt' | 'updatedAt'> & Partial<Pick<Team, 'id'>>) => Team
  updateTeam: (_id: string, _patch: Partial<Omit<Team, 'id' | 'createdAt'>>) => void
  deleteTeam: (_id: string) => void

  // Draft
  setDraft: (_draft: TeamDraft | null) => void
  clearDraft: () => void
}

export const useTeamStore = create<TeamStore>()(
  persist(
    (set, get) => ({
      teams: [],
      draft: null,

      // Crear equipo con timestamps usando moment
      createTeam: (input) => {
        const now = moment().toISOString()
        const id = input.id ?? crypto.randomUUID()
        const safePokemons = Array.isArray(input.pokemons)
          ? input.pokemons.slice(0, MAX_MEMBERS)
          : []

        const newTeam: Team = {
          id,
          name: input.name,
          pokemons: safePokemons,
          slogan: input.slogan ?? '',
          avatar: input.avatar ?? '',
          description: input.description ?? '',
          createdAt: now,
          updatedAt: now,
        }

        set((s) => ({ teams: [ newTeam, ...s.teams ] }))
        return newTeam
      },

      // Editar / renombrar: siempre actualiza updatedAt, respeta createdAt
      updateTeam: (id, patch) => {
        const now = moment().toISOString()
        set((s) => ({
          teams: s.teams.map((t) => {
            if (t.id !== id) return t
            const nextPokemons = patch.pokemons
            const safePatch = {
              ...patch,
              ...(Array.isArray(nextPokemons)
                ? { pokemons: nextPokemons.slice(0, MAX_MEMBERS) }
                : {}),
            }
            return {
              ...t,
              ...safePatch,
              // createdAt se preserva tal cual estaba
              updatedAt: now,
            }
          }),
        }))
      },

      deleteTeam: (id) => {
        set((s) => ({ teams: s.teams.filter((t) => t.id !== id) }))
        const favStore = useFavoriteTeamStore.getState()
        if (favStore.teams.some(t => t.id === id)) {
          favStore.remove(id)
        }
      },

      // Draft libre (no hace fetch, no impone timestamps obligatorios)
      setDraft: (draft) => set({ draft }),
      clearDraft: () => set({ draft: null }),
    }),
    {
      name: STORE_KEY,
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        teams: state.teams,
        draft: state.draft,
      }),
    }
  )
)

// -----------------------------
// Store de equipos favoritos
// -----------------------------

type FavoriteTeamStore = {
  teams: Team[]
  add: (_team: Team) => void
  remove: (_id: string) => void
}

export const useFavoriteTeamStore = create<FavoriteTeamStore>()(
  persist(
    (set, get) => ({
      teams: [],
      add: (team) => {
        const exists = get().teams.some(t => t.id === team.id)
        if (!exists) {
          set((s) => ({ teams: [ team, ...s.teams ] }))
        }
      },
      remove: (id) => {
        set((s) => ({ teams: s.teams.filter(t => t.id !== id) }))
      },
    }),
    {
      name: 'favorite-teams',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

// -----------------------------
// Sidebar para vista móvil
// -----------------------------

type MobileSidebarStore = {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
}

export const useMobileSidebarStore = create<MobileSidebarStore>()((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}))

// ----------------------------
// Hooh para almacenar provisionalmente los pokemones seleccionados
// ----------------------------

type SelectedPokemonsStore = {
  pokemons: string[] // Array de id
  add: (_pokemon: string) => void
  remove: (_id: string) => void
  toggle: (_id: string) => void
}

export const useSelectedPokemonsStore = create<SelectedPokemonsStore>()((set) => ({
  pokemons: [],
  add: (pokemon) => set((state) => ({ pokemons: [ ...state.pokemons, pokemon ] })),
  remove: (id) => set((state) => ({ pokemons: state.pokemons.filter((p) => p !== id) })),
  toggle: (id) => set((state) => {
    if (state.pokemons.includes(id)) {
      return { pokemons: state.pokemons.filter((p) => p !== id) }
    } else {
      return { pokemons: [ ...state.pokemons, id ] }
    }
  })
}))
