import { autoPlacement, FloatingPortal, useClick, useDismiss, useFloating, useInteractions } from '@floating-ui/react'
import React from 'react'
import { Link } from 'react-router'
import { cn } from 'src/lib/utils'

export default function HeaderProfile () {

  const [ isOpen, setIsOpen ] = React.useState(false)

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'bottom',
    middleware: [
      autoPlacement({
        allowedPlacements: [ 'bottom', 'bottom-end', 'bottom-start', 'top', 'top-end', 'top-start', 'right', 'right-end', 'right-start', 'left', 'left-end', 'left-start' ],
        crossAxis: true,
        autoAlignment: true,
      })
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
      <button
        className="flex-none w-10 h-10 p-1 inline-flex items-center justify-center rounded-full overflow-hidden hover:bg-foreground/5 transition-all duration-300"
        ref={refs.setReference}
        {...getReferenceProps()}
        onClick={() => setIsOpen(!isOpen)}
        data-testid='menu-trigger'
        data-open={isOpen}
      >
        <img
          src="https://www.untitledui.com/images/avatars/transparent/drew-cano?bg=%23D9E5CC"
          alt="User Avatar"
          className="w-full h-full object-cover aspect-square rounded-full"
        />
      </button>
      {
        isOpen && (
          <FloatingPortal preserveTabOrder>
            <div
              className={cn(
                'overlay absolute inset-0 z-10 bg-foreground/10',
              )}
              onClick={() => setIsOpen(false)}
            />
            <div
              ref={refs.setFloating}
              style={floatingStyles}
              {...getFloatingProps()}
              className={cn('z-20')}
            >
              <div className={cn(
                'mt-2 z-20 relative flex flex-col w-full min-w-[12rem] p-4 rounded-lg border border-border bg-background text-foreground shadow-xl',
              )}>
                <ul>
                  <li>
                    <Link
                      to="/"
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        'rounded-md w-full h-10 px-4 text-sm font-medium flex items-center gap-4 justify-between transition-colors duration-200 hover:bg-foreground/5',
                      )}
                    >
                      <span>Mi cuenta</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/"
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        'rounded-md w-full h-10 px-4 text-sm font-medium flex items-center gap-4 justify-between transition-colors duration-200 hover:bg-foreground/5',
                      )}
                    >
                      <span>Ajustes</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/"
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        'rounded-md w-full h-10 px-4 text-sm font-medium flex items-center gap-4 justify-between transition-colors duration-200 hover:bg-foreground/5',
                      )}
                    >
                      <span>Cerrar sesión</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </FloatingPortal>
        )
      }
    </React.Fragment>
  )
}