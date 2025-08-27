import {
  type RouteConfig,
  route,
  index,
  layout
} from '@react-router/dev/routes'

export default [
  layout('layouts/root.tsx', [
    index('routes/home.tsx'),
    route('pokemons', 'routes/pokemons.tsx'),
    route('pokemons/:id', 'routes/pokemon.tsx'),
    route('teams', 'routes/teams.tsx'),
    route('teams/:id', 'routes/team.tsx'),
    route('*', 'routes/$.tsx')
  ]),
] satisfies RouteConfig
