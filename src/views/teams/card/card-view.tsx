import React from 'react'
import { useTeamStore } from 'src/store'
import type { Team } from 'src/types/Team'
import { createSwapy, type Swapy } from 'swapy'
import { Grip } from 'lucide-react'
import { Link } from 'react-router'
import { buttonVariants } from 'src/components/ui'
import TeamOptions from '../components/team-options'

export default function CardView () {
  const { teams } = useTeamStore() as { teams: Team[] }

  const swapyRef = React.useRef<Swapy | null>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)

  // Helper: obtener el orden actual de los items en el DOM
  const getOrderIds = React.useCallback((): string[] => {
    if (!containerRef.current) return []
    const nodes = containerRef.current.querySelectorAll<HTMLElement>('[data-swapy-item]')
    return Array.from(nodes).map((el) => el.dataset.swapyItem!).filter(Boolean)
  }, [])

  React.useEffect(() => {
    if (!containerRef.current) return

    // Instancia Swapy sobre el contenedor
    swapyRef.current = createSwapy(containerRef.current, {
      animation: 'spring',
      swapMode: 'hover',
    })

    // Al completar un swap, leemos el orden visual y lo persistimos en la store
    swapyRef.current.onSwap(() => {
      const ids = getOrderIds()
      if (!ids.length) return

      // Reordena la lista de equipos según el DOM
      const current = useTeamStore.getState().teams as Team[]
      const byId = new Map(current.map((t) => [ t.id, t ]))
      const next: Team[] = ids.map((id) => byId.get(id)!).filter(Boolean)

      // Si falta alguno (p. ej. por slots vacíos), añade los restantes al final en su orden actual
      if (next.length < current.length) {
        const remaining = current.filter((t) => !ids.includes(t.id))
        next.push(...remaining)
      }

      // Actualiza la store sin fetch
      useTeamStore.setState({ teams: next })
    })

    return () => {
      swapyRef.current?.destroy()
      swapyRef.current = null
    }
  }, [ getOrderIds ])

  return (
    <React.Fragment>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 place-items-start" ref={containerRef}>
        {
          teams.map((team: Team, _index) => (
            <React.Fragment key={team.id}>
              <div
                key={team.id}
                data-swapy-slot={team.id}
                className='w-full rounded-xl data-[swapy-highlighted]:bg-emerald-500/10 data-[swapy-highlighted]:border-2 data-[swapy-highlighted]:border-dashed data-[swapy-highlighted]:border-emerald-500/20'
              >
                <article
                  data-swapy-item={team.id}
                  className="flex flex-col items-start gap-4 w-full relative p-4 border rounded-xl hover:shadow-sm transition-shadow bg-background border-border data-[swapy-dragging]:ring-2 data-[swapy-dragging]:ring-foreground/5"

                >
                  <div
                    className='w-7 h-8 rounded border border-border inline-flex items-center justify-center absolute top-4 right-4 cursor-grabbing'
                    data-swapy-handle
                  >
                    <Grip size={16}/>
                  </div>
                  <header className="w-full">
                    <figure>
                      <picture>
                        <img
                          src={team.avatar}
                          alt={team.name}
                          className="h-16 w-16 object-cover rounded-full"
                          loading="lazy"
                          width={64}
                          height={64}
                        />
                      </picture>
                    </figure>
                    <div className="flex flex-col items-start mt-4" data-swapy-no-drag>
                      <h3 className="text-sm font-medium">{team.name}</h3>
                      <p className="text-xs text-foreground/80">{team.slogan}</p>
                    </div>
                  </header>
                  <section className='w-full flex items-center justify-between gap-4'>
                    <Link to={`/teams/${team.id}`} className={buttonVariants({ variant: 'outline', size: 'sm' })}>
                      Ver equipo
                    </Link>
                    <TeamOptions data={team} placement='left' />
                  </section>
                </article>
              </div>
            </React.Fragment>
          ))
        }
      </div>
    </React.Fragment>
  )
}
