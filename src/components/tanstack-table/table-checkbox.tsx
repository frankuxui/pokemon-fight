import React from 'react'
import { cn } from 'src/lib/utils'

export default function TableCheckbox ({
  indeterminate,
  className = '',
  ...rest
}: { indeterminate: boolean } & React.HTMLProps<HTMLInputElement>) {
  const ref = React.useRef<HTMLInputElement>(null!)

  React.useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      ref.current.indeterminate = !rest.checked && indeterminate
    }
  }, [ ref, indeterminate ])

  return (
    <input
      type='checkbox'
      ref={ref}
      checked={true}
      className={cn('checkbox checkbox-md', className, indeterminate && 'checkbox-indeterminate')}
      {...rest}
    />
  )
}
