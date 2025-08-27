import { useTeamStore } from 'src/store'

export default function Teams () {
  const { teams, clearDraft, createTeam, deleteTeam, draft, setDraft, updateTeam } = useTeamStore()

  const onCreate = () => {
    // Ajusta a tu shape real de Team (name/members/etc.)
    const team = createTeam({ name: 'Mi nuevo equipo', members: [] })
    console.log('creado', team)
  }

  const onRename = (id: string) => {
    updateTeam(id, { name: 'Nombre actualizado' })
  }

  const onDelete = (id: string) => {
    deleteTeam(id)
  }

  return (
    <div>
      <button onClick={onCreate}>Crear equipo</button>
      <ul>
        {teams.map((t) => (
          <li key={(t as any).id}>
            {(t as any).name}
            <button onClick={() => onRename((t as any).id)}>Renombrar</button>
            <button onClick={() => onDelete((t as any).id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
