import { cn } from 'src/lib/utils'

interface Props {
  table: any
  className?: string
}
export default function TablePagination ({ table, className }: Props) {
  return (
    <>
      <div className={cn('sticky bottom-0 right-0 items-center w-full p-4 bg-background border-t border-border flex justify-between', className)}>
        <div className='flex items-center'>
          <span className='text-sm font-normal text-foreground/60 '>
            Mostrando pagina{' '}
            <span className='font-semibold text-foreground'>
              {table.getState().pagination.pageIndex + 1} de{' '}
            </span>{' '}
            <span className='font-semibold text-foreground'>
              {table.getPageCount()}
            </span>
          </span>

          <div className='ml-4'>
            <select
              className='select select-outline'
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value))
              }}
            >
              {[ 10, 20, 30, 40, 50 ].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Mostrar {pageSize}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className='flex items-center gap-3'>
          <button
            className='flex items-center justify-center rounded-full w-8 h-8 border disabled:pointer-events-none disabled:opacity-20 border-border bg-foreground text-background'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 16 16'><path fill='currentColor' d='M10.26 3.2a.75.75 0 0 1 .04 1.06L6.773 8l3.527 3.74a.75.75 0 1 1-1.1 1.02l-4-4.25a.75.75 0 0 1 0-1.02l4-4.25a.75.75 0 0 1 1.06-.04'></path></svg>
            <span className='sr-only'>Anteriores</span>
          </button>
          <button
            className='flex items-center justify-center rounded-full w-8 h-8 border disabled:pointer-events-none disabled:opacity-20 border-border bg-foreground text-background'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className='sr-only'>Próximos</span>
            <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 16 16'><path fill='currentColor' d='M5.74 3.2a.75.75 0 0 0-.04 1.06L9.227 8L5.7 11.74a.75.75 0 1 0 1.1 1.02l4-4.25a.75.75 0 0 0 0-1.02l-4-4.25a.75.75 0 0 0-1.06-.04'></path></svg>
          </button>
        </div>
      </div>
    </>
  )
}
