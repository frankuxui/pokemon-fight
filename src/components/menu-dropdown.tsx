import React from 'react'
import { cn } from 'src/lib/utils'
import { autoPlacement, FloatingOverlay, FloatingPortal, type Placement, useClick, useDismiss, useFloating, useInteractions } from '@floating-ui/react'
import { Ellipsis } from 'lucide-react'
import { Link } from 'react-router'

export interface MenuDropdownItem {
  label: string
  onClick?: () => void
  href?: string
  className?: string
  enabled?: boolean
  icon?: React.ReactNode
}
interface ClassNames {
  root?: string | string[]
  content?: string | string[]
  trigger?: string | string[]
  overlay?: string | string[]
}

interface MenuDropdownProps {
  items: MenuDropdownItem[]
  placement?: Placement
  autoplacement?: boolean
  header?: boolean
  overlay?: boolean
  classNames?: ClassNames
}

const MenuDropdown = React.memo(({
  placement,
  autoplacement = true,
  items = [],
  overlay = true,
  classNames = {},
}: MenuDropdownProps) => {

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
      <div className='relative z-1' >
        <button
          ref={refs.setReference}
          {...getReferenceProps()}
          onClick={() => setIsOpen(!isOpen)}
          data-testid='menu-trigger'
          data-open={isOpen}
          className={cn(
            'flex-none w-10 h-10 inline-flex items-center justify-center rounded-full border-2 border-transparent focus:border-foreground hover:bg-foreground/10',
            'data-[open="true"]:relative data-[open="true"]:z-20 data-[open="true"]:border-foreground data-[open="true"]:bg-foreground/10 ',
            classNames?.trigger
          )}
        >
          <Ellipsis size={26}/>
        </button>
        <>
          {
            isOpen && (
              <FloatingPortal preserveTabOrder>
                {
                  overlay && (
                    <FloatingOverlay
                      lockScroll
                      className={cn(
                        'overlay absolute inset-0 z-20 bg-foreground/10',
                        classNames?.overlay
                      )}
                      onClick={() => setIsOpen(false)}
                    />
                  )
                }
                <div
                  ref={refs.setFloating}
                  style={floatingStyles}
                  {...getFloatingProps()}
                  className={cn(
                    'z-20',
                    classNames?.root
                  )}
                >
                  <div className={cn(
                    'mt-2 z-20 relative flex flex-col w-full min-w-[12rem] p-4 rounded-lg border border-border bg-background text-foreground shadow-xl',
                    classNames?.content
                  )}>
                    {
                      items.length > 0 ? items.filter((e) => e.enabled !== false).map((item: MenuDropdownItem, index: number) => (
                        <div key={index} className='relative'>
                          {
                            item.href
                              ? (
                                <Link
                                  to={item.href}
                                  onClick={() => setIsOpen(false)}
                                  className={cn(
                                    'rounded-md w-full h-10 px-4 text-sm font-medium flex items-center gap-4 justify-between transition-colors duration-200 hover:bg-foreground/5',
                                    item.className
                                  )}
                                >
                                  <span>{item.label}</span>
                                  {item.icon && <span>{item.icon}</span>}
                                </Link>
                              )
                              : (
                                <button
                                  onClick={() => {
                                    setIsOpen(false)
                                    item?.onClick?.()
                                  }}
                                  className={cn(
                                    'rounded-md w-full h-10 px-4 text-sm font-medium flex items-center gap-4 justify-between transition-colors duration-200 hover:bg-foreground/5',
                                    item.className
                                  )}
                                >
                                  <span>{item.label}</span>
                                  {item.icon && <span>{item.icon}</span>}
                                </button>
                              )
                          }
                        </div>
                      )) : null
                    }
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

MenuDropdown.displayName = 'Menu'
export default MenuDropdown