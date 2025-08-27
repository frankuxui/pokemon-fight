import { Ban } from 'lucide-react'
import type React from 'react'
import { cn } from 'src/lib/utils'
import { Button, type ButtonSizes, type ButtonVariants } from 'src/components/ui'

/**
Componente reutilizable para mostrar mensajes de estado con opciones de personalización.
@component

@param {string} [title] - Título del estado. Si no se proporciona, se muestra "Mensaje de estado".
@param {string} [message] - Mensaje principal del estado. Si no se proporciona, se muestra un mensaje por defecto.
@param {string} [optionalMessage] - Mensaje opcional debajo del mensaje principal.
@param {React.ReactNode} [icon] - Icono personalizado para el estado. Si no se proporciona, se usa un icono por defecto.
@param {string} [className] - Clases adicionales para el contenedor principal.
@param {ClassNames} [classNames] - Clases personalizadas para los elementos internos.
@param {Action} [action] - Objeto de configuración para el botón de acción.

@typedef {Object} ClassNames
@property {string|string[]} [root] - Clases del contenedor principal.
@property {string|string[]} [header] - Clases del encabezado.
@property {string|string[]} [title] - Clases del título.
@property {string|string[]} [message] - Clases del mensaje principal.
@property {string|string[]} [optionalMessage] - Clases del mensaje opcional.
@property {string|string[]} [icon] - Clases del icono.
@property {string|string[]} [actionButton] - Clases del botón de acción.

@typedef {Object} Action
@property {Function} [onClick] - Función que se ejecuta al hacer clic en el botón de acción.
@property {ButtonVariants} [variant="primary"] - Variante del botón de acción.
@property {ButtonSizes} [size="sm"] - Tamaño del botón de acción.
@property {string} [label="Acción"] - Texto del botón de acción.
@property {string} [classNames] - Clases adicionales para el botón de acción.
@example
<StatusRender
  title="Error de conexión"
  message="No se pudo conectar al servidor."
  optionalMessage="Inténtalo de nuevo más tarde."
  action={{
    onClick: () => console.log("Reintentar"),
    label: "Reintentar",
    variant: "secondary"
  }}
/>

*/

interface ClassNames {
  root?: string[] | string
  header?: string[] | string
  title?: string[] | string
  message?: string[] | string
  optionalMessage?: string[] | string
  icon?: string[] | string
  actionButton?: string[] | string
}

interface Action {
  onClick?: () => void
  variant?: ButtonVariants
  size?: ButtonSizes
  label?: string
  classNames?: string
}

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  message?: string
  optionalMessage?: string
  icon?: React.ReactNode
  classNames?: ClassNames
  className?: string
  action?: Action
}
export default function StatusRender ({
  title,
  message,
  optionalMessage,
  icon,
  className,
  classNames = {},
  action = {},
  ...rest
}: Props) {
  return (
    <div className={cn('w-full', className, classNames.root)} {...rest} >
      <header className={cn('grid gap-2 place-items-center text-center', classNames.header)} >
        { icon ? icon : <Ban className={cn('w-8 h-8', classNames.icon)} strokeWidth={1.5} /> }
        <div className='grid'>
          <h3 className={cn('text-base font-semibold', classNames.title)}> { title ?? 'Mensaje de estado' } </h3>
          <p className={cn('text-sm', classNames.message)}> { message ?? 'Esto es el mensaje principal del estado' } </p>
          {
            optionalMessage && (
              <p className={cn('text-sm', classNames.optionalMessage)}>{optionalMessage}</p>
            )
          }
        </div>
      </header>
      {
        Object.keys(action).length > 0 && (
          <div className='flex items-center justify-center w-full mt-4'>
            <Button
              variant={action.variant ?? 'default'}
              size={action.size ?? 'sm'}
              className={cn(
                action.classNames
              )}
              onClick={typeof action.onClick === 'function' ? action.onClick : () => {}}
            >
              {action.label ?? 'Acción'}
            </Button>
          </div>
        )
      }
    </div>
  )
}