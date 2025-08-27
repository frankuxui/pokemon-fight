import React from 'react'
import { autoPlacement, FloatingOverlay, FloatingPortal, type Placement, useClick, useDismiss, useFloating, useInteractions } from '@floating-ui/react'
import { Ellipsis, X } from 'lucide-react'
import { cn } from 'src/lib/utils'
import { Link } from 'react-router'


/**
 * @param data -> Es un objeto que contiene los datos del vehículo
 * @params title -> Es el título del menú contextual
 * @params options -> Son las opciones que se mostrarán en el menú contextual
 * @params options.label -> Es el texto de la opción
 * @params options.onClick -> Es la función que se ejecutará al hacer click en la opción
 * @params options.href -> Es la url a la que se redirigirá al hacer click en la opción
 * @params options.danger -> Es un booleano que indica si la opción es peligrosa
 * @returns
 *
 */

export interface ContextMenuOption {
  label: string
  onClick?: () => void
  href?: string
  danger?: boolean
  className?: string
  enabled?: boolean
  icon?: React.ReactNode
}

interface Props {
  title?: string
  renderItems: ContextMenuOption[]
  placement?: Placement
  autoplacement?: boolean
  header?: boolean
}

const ContextMenu = React.memo(({ title, renderItems, placement, autoplacement = true, header = true }: Props) => {

  // Menu dropdown
  const [ isOpen, setIsOpen ] = React.useState(false)

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: placement ? 'bottom' : undefined,
    middleware: [
      autoplacement === true ? autoPlacement({
        allowedPlacements: placement ? [ placement ] : [ 'bottom', 'bottom-end', 'bottom-start', 'top', 'top-end', 'top-start', 'right', 'right-end', 'right-start', 'left', 'left-end', 'left-start' ],
        crossAxis: true,
        autoAlignment: true,
      }) : null
    ],
  })

  const click = useClick(context, {
    toggle: true,
  })
  useDismiss(context, {
    escapeKey: true,
    outsidePressEvent: 'click'
  })

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
  ])

  return (
    <React.Fragment>
      <div className='relative'>
        <button
          ref={refs.setReference}
          {...getReferenceProps()}
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'w-10 h-10 inline-flex items-center justify-center rounded-full flex-none hover:bg-foreground/5 focus:ring-2 focus:ring-foreground',
            isOpen ? 'bg-foreground/5' : ''
          )}
        >
          <Ellipsis size={26} />
        </button>
        <>

          {
            isOpen && (
              <FloatingPortal>
                <FloatingOverlay
                  lockScroll
                  className='overlay absolute inset-0 z-[200] bg-foreground/20'
                  onClick={() => setIsOpen(false)}
                />
                <div
                  ref={refs.setFloating}
                  style={floatingStyles}
                  {...getFloatingProps()}
                  className='z-[900]'
                >
                  <div className='mt-2 z-[900] relative flex flex-col w-full min-w-[12rem] rounded-lg overflow-hidden bg-background text-foreground shadow-xl'>
                    {
                      header && (
                        <header className='flex w-full items-center justify-between h-12 px-6 border-b border-foreground/10'>
                          <h3 className='text-base font-semibold'>{title ?? 'Opciones'}</h3>
                          <button
                            type='button'
                            aria-label='Close menu'
                            onClick={() => setIsOpen(false)}
                            className='w-7 h-7 rounded-full inline-flex items-center justify-center transition-colors duration-300 hover:bg-foreground/15'
                          >
                            <X size={20} strokeWidth={2.5} />
                          </button>
                        </header>
                      )
                    }
                    <section className='flex flex-col p-3'>

                      {
                        renderItems?.filter(option => option.enabled !== false).map((option: ContextMenuOption, index) =>
                          option.href ? (
                            <Link
                              key={index}
                              to={option.href}
                              className={cn(
                                'rounded w-full h-8 px-3 text-sm flex items-center justify-between gap-4 transition-colors duration-200 hover:bg-foreground/10',
                                option.danger ? 'hover:bg-rose-500/20 text-rose-600' : 'hover:bg-foreground/10',
                                option.className
                              )}
                              onClick={() => setIsOpen(false)}
                            >
                              <span>{option.label}</span>
                              {option.icon && <span>{option.icon}</span>}
                            </Link>
                          ) : (
                            <button
                              key={index}
                              onClick={() => {
                                option.onClick?.()
                                setIsOpen(false)
                              }}
                              className={cn(
                                'rounded w-full h-8 px-3 text-sm flex items-center justify-between transition-colors duration-200 hover:bg-foreground/10',
                                option.danger ? 'hover:bg-rose-500/20 text-rose-600 dark:hover:bg-rose-500/20' : 'hover:bg-foreground/10',
                                option.className
                              )}
                            >
                              <span>{option.label}</span>
                              {option.icon && <span>{option.icon}</span>}
                            </button>
                          )
                        )
                      }

                    </section>
                  </div>
                </div>
              </FloatingPortal>
            )
          }
        </>
      </div>
    </React.Fragment>
  )
})

ContextMenu.displayName = 'ContextMenu'
export default ContextMenu
