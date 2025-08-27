import { FloatingPortal } from '@floating-ui/react'
import { AnimatePresence, motion } from 'motion/react'
import { useMobileSidebarStore } from 'src/store'
import { Close } from './ui'
import { NavLink } from 'react-router'
import { cn } from 'src/lib/utils'
import React from 'react'

export default function Aside () {

  // Zustand store
  // Gestion del menu mobile
  const { close, isOpen } = useMobileSidebarStore()

  // Cerrar dialog si redimensiona
  React.useEffect(() => {
    if (!isOpen) return

    const handleResize = () => {
      close()
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [ isOpen, close ])

  const component = (
    <AnimatePresence mode='popLayout'>
      {
        isOpen && (
          <div className='w-full fixed top-0 left-0 h-full z-50'>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className='absolute w-full h-full bg-foreground/20'
              onClick={close}
            />

            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className='w-full max-w-xs h-full absolute top-0 left-0 bg-background'
            >
              <div className='w-full h-full overflow-hidden flex flex-col'>
                <header className='h-[92px] flex-none border-border border-b px-8 flex items-center justify-between'>
                  <h2 className='text-lg font-semibold'>Menu</h2>
                  <Close onClick={close}>Close</Close>
                </header>
                <section className='w-full flex-1 overflow-y-auto px-8'>
                  <ul className='w-full flex flex-col items-start mt-6'>
                    <li className='w-full'>
                      <NavLink
                        to="/"
                        className={({ isActive }) =>
                          cn(
                            'py-4 block',
                            isActive ? 'font-bold' : 'font-normal'
                          )
                        }
                      >
                  Inicio
                      </NavLink>
                    </li>
                    <li className='w-full'>
                      <NavLink
                        to="/pokemons"
                        className={({ isActive }) =>
                          cn(
                            'py-4 block',
                            isActive ? 'font-bold' : 'font-normal'
                          )
                        }
                      >
                  Pokémon
                      </NavLink>
                    </li>
                    <li className='w-full'>
                      <NavLink
                        to="/teams"
                        className={({ isActive }) =>
                          cn(
                            'py-4 block',
                            isActive ? 'font-bold' : 'font-normal'
                          )
                        }
                      >
                Equipos
                      </NavLink>
                    </li>
                  </ul>
                </section>
                <div className='p-8 border-t border-border bg-background'>
                  <p className='text-xs text-muted-foreground'>
                    &copy; { new Date().getFullYear() } Pokemon Fight
                  </p>
                </div>
              </div>
            </motion.aside>

          </div>
        )
      }
    </AnimatePresence>
  )
  return (
    <FloatingPortal>
      {component}
    </FloatingPortal>
  )
}