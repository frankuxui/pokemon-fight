import React from 'react'
import TableCheckbox from './table-checkbox'
import { cn } from 'src/lib/utils'

interface Props {
  table: any
  rowSelection: Record<string, any>
  className?: string
}
export default function TableMetaData ({ table, rowSelection, className }: Props) {
  return (
    <div className={cn('sticky bottom-16 right-0 items-center w-full p-4 bg-background border-t border-border sm:flex sm:justify-between', className)}>
      <div className='flex items-center gap-2'>
        <TableCheckbox
          {...{
            checked: table.getIsAllPageRowsSelected(),
            indeterminate: table.getIsSomePageRowsSelected(),
            onChange: table.getToggleAllPageRowsSelectedHandler(),
          }}
        />
        <div className='text-sm font-semibold text-foreground'>
          ({table.getRowModel().rows.length})
        </div>
        <div>
          <span className='text-sm font-normal text-foreground/60'>
            <span className='font-semibold text-foreground '>
              {Object.keys(rowSelection).length}{' '}
            </span>
            de{' '}
            <span className='font-semibold text-foreground'>
              {table.getPreFilteredRowModel().rows.length}
            </span>{' '}
          </span>
        </div>
      </div>
    </div>
  )
}
