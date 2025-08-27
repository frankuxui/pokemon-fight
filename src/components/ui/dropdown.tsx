import React from 'react'
import { autoPlacement, autoUpdate, flip, type FloatingContext, FloatingFocusManager, FloatingPortal, offset, shift, useClick, useDismiss, useFloating, useInteractions, useMergeRefs } from '@floating-ui/react'
import { cn } from 'src/lib/utils'
import { FloatingOverlay } from '@floating-ui/react'

type Placement =
'top' |
'top-start' |
'top-end' |
'right' |
'right-start' |
'right-end' |
'bottom' |
'bottom-start' |
'bottom-end' |
'left' |
'left-start' |
'left-end'

interface ContextProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refs: {
    setReference: (_node: HTMLElement | null) => void;
    setFloating: (_node: HTMLElement | null) => void;
  };
  floatingStyles: React.CSSProperties;
  getFloatingProps: (_userProps?: React.HTMLProps<HTMLElement>) => Record<string, any>;
  getReferenceProps: (_userProps?: React.HTMLProps<HTMLElement>) => Record<string, any>;
  placementState: Placement;
  setPlacementState: React.Dispatch<React.SetStateAction<Placement>>;
  context: FloatingContext
}

// Crear el contexto
const DropdownContext = React.createContext<ContextProps | undefined>(undefined)

export const useDropdownContext = () => {
  const context = React.useContext(DropdownContext)

  if (context == null) {
    throw new Error('useDropdownContext must be used within a DropdownProvider')
  }

  return context
}

// DropdownProvider para manejar el estado y las interacciones
function DropdownProvider ({ children }: { children: React.ReactNode }) {
  const [ isOpen, setIsOpen ] = React.useState(false)
  const [ placementState, setPlacementState ] = React.useState<Placement>('bottom-start')

  // Inicializar useFloating con autoPlacement y lógica de apertura/cierre
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    strategy: 'absolute',
    placement: placementState,
    middleware: [
      autoPlacement({
        autoAlignment: true,
        alignment: 'start',
        crossAxis: true,
        allowedPlacements: [ 'top', 'bottom' ],
      }),
      offset(2),
      flip({ fallbackAxisSideDirection: 'end' }),
      shift()
    ],
    whileElementsMounted: autoUpdate,
  })

  // Manejo de clicks y cierre del dropdown
  const click = useClick(context, {
    toggle: true
  })

  const dismiss = useDismiss(context, {
    escapeKey: true,
    outsidePressEvent: 'click'
  })

  // Combinar interacciones
  const { getReferenceProps, getFloatingProps } = useInteractions([ click, dismiss ])

  // Memorizar el valor del contexto para evitar renders innecesarios
  const value = React.useMemo(() => ({
    isOpen,
    setIsOpen,
    refs,
    floatingStyles,
    getReferenceProps,
    getFloatingProps,
    context,
    placementState,
    setPlacementState
  }),
  [ isOpen, refs, floatingStyles, getReferenceProps, getFloatingProps, context, setPlacementState ]
  )

  return <DropdownContext.Provider value={value}>{children}</DropdownContext.Provider>
}

//
// DropdownTrigger

interface DropdownTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

export const DropdownTrigger = React.forwardRef<
  HTMLElement,
  React.HTMLProps<HTMLElement> & DropdownTriggerProps
>(function DropdownTrigger ({ children, asChild = false, ...props }, propRef) {
  const context = useDropdownContext()
  const childrenRef = (children as any).ref
  const ref = useMergeRefs([ context.refs.setReference, propRef, childrenRef ])

  // `asChild` allows the user to pass any element as the anchor
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(
      children,
      context.getReferenceProps({
        ref,
        ...props,
        ...(children.props as any),
        'data-state': context.isOpen ? 'open' : 'closed',
      })
    )
  }

  return (
    <button
      ref={ref}
      // The user can style the trigger based on the state
      data-state={context.isOpen ? 'open' : 'closed'}
      {...context.getReferenceProps(props)}
    >
      {children}
    </button>
  )
})

type ClickHandler = React.MouseEventHandler<HTMLElement>

type WithCommon = {
  className?: string
  onClick?: ClickHandler
}

type DropdownCloseProps<T extends WithCommon = WithCommon> = {
  /** Único elemento React que será clonado y enriquecido */
  children: React.ReactElement<T>
} & Partial<T>

//
// DropdownClose

export function DropdownClose<T extends WithCommon = WithCommon>({
  children,
  ...rest
}: DropdownCloseProps<T>) {
  const context = React.useContext(DropdownContext)
  if (!context) throw new Error('DropdownClose must be used within a DropdownProvider')

  const { setIsOpen } = context

  // Componer onClick: primero el del hijo, luego el pasado al wrapper, y por último cerrar
  const composedOnClick: ClickHandler = (event) => {
    children.props.onClick?.(event as React.MouseEvent<any>)
    ;(rest.onClick as ClickHandler | undefined)?.(event)
    setIsOpen(false)
  }

  // Merge de className (child + rest)
  const mergedClassName =
    [children.props.className, rest.className].filter(Boolean).join(' ') || undefined
  // Si usas cn: const mergedClassName = cn(children.props.className, rest.className)

  // Props finales a clonar
  const clonedProps: T & {
    onClick: ClickHandler
    className?: string
    'data-dropdown-close': string
  } = {
    ...(children.props as T),
    ...((rest as unknown) as T),
    className: mergedClassName,
    onClick: composedOnClick,
    'data-dropdown-close': 'true',
  }

  return React.cloneElement(children, clonedProps)
}

//
// DropdownItem

type DropdownItemProps<T extends WithCommon = WithCommon> = {
  /** Debe ser un único elemento React clonado por el item */
  children: React.ReactElement<T>
} & Partial<T>

export function DropdownItem<T extends WithCommon = WithCommon>({
  children,
  ...rest
}: DropdownItemProps<T>) {
  const context = React.useContext(DropdownContext)
  if (!context) throw new Error('DropdownItem must be used within a DropdownProvider')

  const { setIsOpen } = context

  // compone los handlers: primero el del hijo, luego el del prop del item, después cerrar
  const composedOnClick: ClickHandler = (event) => {
    children.props.onClick?.(event as React.MouseEvent<any>)
    ;(rest.onClick as ClickHandler | undefined)?.(event)
    setIsOpen(false)
  }

  // merge de className (child + rest)
  const mergedClassName =
    [children.props.className, rest.className].filter(Boolean).join(' ') || undefined
  // si usas cn: const mergedClassName = cn(children.props.className, rest.className)

  // props finales a clonar (respetamos el orden: child's → rest → overrides)
  const clonedProps: T & {
    onClick: ClickHandler
    className?: string
    'data-dropdown-item': string
  } = {
    ...(children.props as T),
    ...((rest as unknown) as T),
    className: mergedClassName,
    onClick: composedOnClick,
    'data-dropdown-item': 'true',
  }

  return React.cloneElement(children, clonedProps)
}

//
// DropdownBackdrop

function DropdownBackdrop ({ ...props }) {
  const context = React.useContext(DropdownContext)
  if (!context) throw new Error('DropdownBackdrop must be used within a DropdownProvider')

  const { isOpen, setIsOpen } = context

  if (!isOpen) return null

  return (
    <FloatingPortal>
      <FloatingOverlay
        lockScroll
        onClick={() => setIsOpen(false)}
        {...props}
        className={cn('left-0 top-0 overlay fixed w-full h-full z-40 bg-black/20 animate-fade')}
      />
    </FloatingPortal>
  )
}

//
// DropdownContent

interface DropdownContentProps extends React.HTMLAttributes<HTMLDivElement> {
  placement?: Placement;
}
function DropdownContent (props: DropdownContentProps) {

  const { children, className, placement } = props

  const dropdownContext = React.useContext(DropdownContext)

  if (!dropdownContext) throw new Error('DropdownContent must be used within a DropdownProvider')

  const { isOpen, refs, floatingStyles, getFloatingProps, setPlacementState } = dropdownContext

  // Actualizar el estado de la posición del dropdown
  React.useEffect(() => {
    if (placement) {
      setPlacementState(placement)
    }
  }, [ placement, setPlacementState ])

  const { context } = useFloating()

  if (!isOpen) return null

  return (
    <>
      <FloatingPortal>
        <FloatingFocusManager context={context} >
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            {...props}
            className={cn('frankuxui-dropdown-content min-w-0 max-w-min z-50', className)}>
            {children}
          </div>
        </FloatingFocusManager>
      </FloatingPortal>
    </>
  )
}

// Componente principal Dropdown
export function Dropdown ({ children }: { children: React.ReactNode }) {

  return (
    <DropdownProvider>
      {children}
    </DropdownProvider>
  )
}

// Asignar componentes al componente principal
Dropdown.Trigger = DropdownTrigger
Dropdown.Content = DropdownContent
Dropdown.Close = DropdownClose
Dropdown.Item = DropdownItem
Dropdown.Backdrop = DropdownBackdrop

Object.assign(Dropdown, {
  Trigger: DropdownTrigger,
  Content: DropdownContent,
  Close: DropdownClose,
  Item: DropdownItem,
  Backdrop: DropdownBackdrop
})