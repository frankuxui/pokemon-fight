import Hits from 'src/components/hits'
import Teams from 'src/components/teams'
import { usePokemonList } from 'src/services/queries'
import type { Pokemon } from 'src/types/Pokemon'

export function Welcome () {
  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <Hits
        useDataHook={() => usePokemonList({ limit: 30 })}
        loadingComponent={<p>Cargando…</p>}
        refetchingComponent={<p>Actualizando…</p>}
        errorComponent={({ error, refetch }) => (
          <div>
            <p>Error: {error.message}</p>
            <button onClick={refetch}>Reintentar</button>
          </div>
        )}
        emptyDataComponent={<p>No hay Pokémon.</p>}
      >
        {({ data }: { data: Pokemon[] | undefined }) => {
          console.log('data', data)
          return (
            <ul>
              {data!.map(p => <li key={p.name}>{p.name}</li>)}
            </ul>
          )
        }}
      </Hits>

      <Teams />

    </main>
  )
}
