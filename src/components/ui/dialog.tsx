import * as React from 'react'
import { FloatingPortal, FloatingFocusManager, useFloating, FloatingOverlay } from '@floating-ui/react'
import { cn } from 'src/lib/utils'
import { motion, AnimatePresence, useDragControls } from 'motion/react'

export type DialogPlacement =
| 'top'
| 'top-start'
| 'top-end'
| 'center'
| 'center-start'
| 'center-end'
| 'bottom'
| 'bottom-start'
| 'bottom-end'

interface DialogOptions {
  initialOpen?: boolean;
  open?: boolean;
  onOpenChange?: (_open: boolean) => void;
  staticOverlay?: boolean;
  placement?: DialogPlacement;
  dragable?: boolean;
}

export function useDialog ({
  initialOpen = false,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  staticOverlay = false,
  placement = 'top',
  dragable = true
}: DialogOptions = {}) {

  const [ uncontrolledOpen, setUncontrolledOpen ] = React.useState(initialOpen)
  const [ placementState, setPlacementState ] = React.useState<DialogPlacement>(placement)
  const [ dragableState, setDragableState ] = React.useState(dragable)

  React.useEffect(() => {
    setPlacementState(placement)
  }, [ placement ])

  React.useEffect(() => {
    setDragableState(dragable)
  }, [ dragable ])

  const open = controlledOpen ?? uncontrolledOpen

  const setOpen = (value: boolean) => {
    if (!value && open) {
      setControlledOpen?.(false)
      setUncontrolledOpen(false)
    } else {
      setControlledOpen?.(value)
      setUncontrolledOpen(value)
    }
  }

  React.useEffect(() => {
    if (initialOpen === true) {
      setOpen(true)
    } else {
      setOpen(false)
    }

    return () => {
      setOpen(false)
    }
  }, [ initialOpen ])

  return React.useMemo(
    () => ({
      open,
      setOpen,
      staticOverlay,
      placementState,
      dragableState
    }),
    [ open, setOpen, placementState, dragableState ]
  )
}

interface ContextType {
  open: boolean;
  setOpen: (_open: boolean) => void;
  staticOverlay: boolean;
  placementState: DialogPlacement;
  dragableState: boolean;
}

const DialogContext = React.createContext<ContextType>({} as ContextType)

export const useDialogContext = () => {
  const context = React.useContext(DialogContext)

  if (context == null) {
    throw new Error('Dialog components must be wrapped in <Dialog />')
  }

  return context
}

interface DialogProps {
  children: React.ReactNode;
}

export function Dialog ({ children, ...options }: DialogProps & DialogOptions) {
  const dialog = useDialog(options)
  return (
    <DialogContext.Provider value={dialog}>
      {children}
    </DialogContext.Provider>
  )
}

interface DialogTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

export const DialogTrigger = ({ children, asChild = false, ...props }: DialogTriggerProps) => {

  const { open } = useDialogContext()

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(
      children,
      {
        ...(children.props as any),
        ...props,
        'data-state': open ? 'open' : 'closed'
      }
    )
  }

  return (
    <button {...props} data-state={open ? 'open' : 'closed'} > {children} </button>
  )
}

export const DialogContent = (props: React.HTMLProps<HTMLDivElement>) => {
  const { open, setOpen, staticOverlay, placementState, dragableState } = useDialogContext()
  const refOverlay = React.useRef<HTMLDivElement>(null)
  const ref = React.useRef<HTMLDivElement>(null)

  const { context } = useFloating()

  const handleStaticAnimation = React.useCallback(() => {
    if (ref.current !== null) {
      const dialog = ref.current as HTMLDivElement
      dialog.style.transition = 'transform 0.3s ease-in-out'
      dialog.style.scale = '1.01'
      setTimeout(() => {
        dialog.style.transition = 'opacity 0.3s ease-in-out'
        dialog.style.scale = '1'
      }, 40)
    }
  }, [ ref ])

  const handleKeyDown = React.useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (staticOverlay) {
        handleStaticAnimation()
        return
      } else {
        if (refOverlay.current && refOverlay.current.contains(ref.current)) {
          setOpen(false)
        }
      }
    }
  }, [ staticOverlay ])

  // Escuchar eventos de teclado globalmente
  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [ handleKeyDown ])

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      if (staticOverlay) {
        handleStaticAnimation()
        return
      } else {
        setOpen(false)
      }
    }
  }

  const controls = useDragControls()

  return (
    <FloatingPortal preserveTabOrder>
      <AnimatePresence mode="wait">
        {
          open && (
            <FloatingOverlay
              lockScroll
              ref={refOverlay}
              key="dialog-overlay"
              // initial={{ opacity: 0 }}
              // animate={{ opacity: 1 }}
              // exit={{ opacity: 0 }}
              onClick={handleOverlayClick}
              className={cn(
                'flex p-6 fixed top-0 left-0 w-full h-full z-40 transition-all duration-300 bg-black/60',
                placementState === 'top' && 'justify-center items-start',
                placementState === 'top-start' && 'justify-start items-start',
                placementState === 'top-end' && 'justify-end items-start',
                placementState === 'center' && 'justify-center items-center',
                placementState === 'center-start' && 'justify-start items-center',
                placementState === 'center-end' && 'justify-end items-center',
                placementState === 'bottom' && 'justify-center items-end',
                placementState === 'bottom-start' && 'justify-start items-end',
                placementState === 'bottom-end' && 'justify-end items-end',
              )}
            >
              <FloatingFocusManager
                guards={false}
                context={context}
                modal={false}
                restoreFocus={false}
                returnFocus={false}
              >
                <motion.div
                  drag={dragableState}
                  dragConstraints={refOverlay}
                  dragControls={controls}
                  dragTransition={{ power: 0, timeConstant: 0 }}
                  dragPropagation={false}
                  dragMomentum={false}
                  ref={ref}
                  key="dialog-panel"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: [ 0.9, 1.02, 1 ] }}
                  exit={{ scale: [ 1, 1.05, 0.9 ] }}
                  transition={{
                    duration: 0.3,
                    times: [ 0, 0.7, 1 ],
                    ease: [ 0.25, 0.1, 0.25, 1 ]
                  }}
                  style={{ transformOrigin: 'center' }}

                  data-element="dialog"
                  className={cn('w-full z-50 rounded-lg bg-background text-foreground shadow-2xl drop-shadow-xl', props.className)}
                >
                  {props.children}
                </motion.div>
              </FloatingFocusManager>
            </FloatingOverlay>
          )
        }
      </AnimatePresence>
    </FloatingPortal>
  )

}

export const DialogHeader = (props: React.HTMLProps<HTMLDivElement>) => {
  return (
    <header {...props} > {props.children} </header>
  )
}

export const DialogBody = (props: React.HTMLProps<HTMLDivElement>) => {
  return (
    <div {...props} > { props.children } </div>
  )
}

export const DialogFooter = (props: React.HTMLProps<HTMLDivElement>) => {
  return (
    <div {...props} > { props.children } </div>
  )
}

interface DialogCloseProps extends
React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  children: React.ReactNode;
}

export const DialogClose = ({ asChild = false, children, ...props }: DialogCloseProps) => {

  const { setOpen } = useDialogContext()

  // Esto es para que el usuario pueda pasar cualquier elemento como el botón de cierre
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement<React.ButtonHTMLAttributes<HTMLButtonElement>>(
      children as React.ReactElement<React.ButtonHTMLAttributes<HTMLButtonElement>>,
      {
        ...props,
        onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
          (children.props as any).onClick?.(e)
          setOpen(false)
        }
      }
    )
  }

  return (
    <button
      onClick={(e) => {
        props.onClick?.(e)
        setOpen(false)
      }}
      {...props}
    >
      {children}
    </button>
  )
}

Dialog.Trigger = DialogTrigger
Dialog.Content = DialogContent
Dialog.Body = DialogBody
Dialog.Header = DialogHeader
Dialog.Footer = DialogFooter
Dialog.Close = DialogClose

Dialog.displayName = 'Dialog'

Object.assign(Dialog, {
  Content: DialogContent,
  Trigger: DialogTrigger,
  Header: DialogHeader,
  Footer: DialogFooter,
  Close: DialogClose,
})