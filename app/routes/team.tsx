import { useTeamStore } from 'src/store'
import TeamOptions from 'src/views/teams/components/team-options'
import type { Team } from 'src/types/Team'
import React from 'react'
import { Link, useNavigate } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import { motion } from 'motion/react'
import { Spinner } from 'src/components/ui'
import type { Route } from './+types/team'

export const meta = ({ params }: Route.MetaArgs) => {
  return [
    {
      title: `Equipo ${params.id} - Pokémon Fight`,
      description: `Perfil y detalles del equipo con ID ${params.id} - Pokémon Fight`
    }
  ]
}

export default function TeamPage ({ params }: { params: { id: string } }) {

  const team = useTeamStore().teams.find((team) => team.id === params.id)
  const [ mounted, setHasMounted ] = React.useState(false)
  const [ loading, setLoading ] = React.useState(true)

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setHasMounted(true)
      setLoading(false)
    }
  }, [])

  // Si el equipo ha sido eliminado desde su perfil lo vamos a redireccionar a la vista '/teams'
  const navigate = useNavigate()

  React.useEffect(() => {
    if (!mounted) return
    if (!team) {
      navigate('/teams')
    }
  }, [ team ])

  if (loading) {
    return (
      <div className='mx-auto max-w-sm flex items-center justify-center gap-6 mt-20 min-h-96'>
        <Spinner size='2xl' />
      </div>
    )
  }

  if (!team) {
    return navigate('/teams')
  }

  return (
    <section className="w-full h-full flex items-start justify-center">
      <div className="w-full mx-auto max-w-7xl px-10">
        <div className='mx-auto max-w-sm flex flex-col items-start gap-6 mt-20'>
          <Link to="/teams" className='inline-flex items-center justify-center gap-2 text-sm font-medium group'>
            <div className='w-10 h-10 relative inline-flex items-center justify-center'>
              <motion.span
                initial={{ scale: 0 }}
                whileHover={{ scale: 1.2 }}
                transition={{ duration: 0.3 }}
                whileTap={{ scale: 0.9 }}
                whileInView={{ scale: 1 }}
                className='absolute w-10 h-10 top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 scale-0 rounded-full bg-foreground/10 group-hover:scale-100 transition-all duration-300'
              />
              <ArrowLeft />
            </div>
            <span className='relative'>Volver a equipos</span>
          </Link>
          <div className="overflow-hidden flex flex-col items-start w-full rounded-2xl border border-border">
            <header className='relative w-full flex flex-row items-start justify-between gap-4 p-6 sm:p-10'>
              <div className='flex items-start flex-col'>
                <figure className='rounded-full max-w-full w-28 h-28 overflow-hidden p-2 border border-border'>
                  <picture>
                    <img
                      src={team?.avatar}
                      alt={team?.name}
                      className='w-full h-full aspect-square rounded-full'
                    />
                  </picture>
                </figure>
                <div className='flex items-start flex-col mt-4'>
                  <h1 className='text-lg sm:text-xl xl:text-2xl font-bold'>{team?.name}</h1>
                  <p className='text-sm text-muted-foreground'>{team?.slogan}</p>
                  <p className='text-base mt-2'>{team?.description}</p>
                </div>
                <div className='absolute top-8 right-8'>
                  <TeamOptions data={team as Team} placement='left-start' />
                </div>
              </div>
            </header>
            <section className='p-6  sm:px-10 w-full bg-foreground/5'>
              <div className=''>
                <div className='flex items-start flex-col gap-2 text-xs text-foreground/80'>
                  <span>Creado el {new Date(team?.createdAt as string).toLocaleDateString()}</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </section>
  )
}