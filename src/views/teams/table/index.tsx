import React from 'react'
import { compareItems, rankItem, type RankingInfo } from '@tanstack/match-sorter-utils'
import { 
  type Column, 
  type ColumnFiltersState, 
  type FilterFn, 
  type SortingFn, 
  type SortingState, 
  createColumnHelper, 
  flexRender, 
  getCoreRowModel, 
  getFacetedMinMaxValues, 
  getFacetedRowModel, 
  getFacetedUniqueValues, 
  getFilteredRowModel, 
  getPaginationRowModel, 
  getSortedRowModel, 
  sortingFns, 
  useReactTable 
} from '@tanstack/react-table'

import type { Team } from 'src/types/Team'

// Store de Zustand
import { useTeamStore } from 'src/store'

// Utils
import { cn } from 'src/lib/utils'

// Ui components
import { Button, Close } from 'src/components/ui'

// Tanstack table render components
import TableCheckbox from 'src/components/tanstack-table/table-checkbox'
import TableMetaData from 'src/components/tanstack-table/table-metadata'
import TablePagination from 'src/components/tanstack-table/table-pagination'
import { CircleEllipsis, FileJson } from 'lucide-react'
import DialogJSONView from 'src/components/dialogs/dialog-json-view'
import TeamOptions from '../components/team-options'

declare module '@tanstack/react-table' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }

}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({
    itemRank
  })

  // Return if the item should be filtered in/out
  return itemRank.passed
}

const ROWJSONView = ({ row }: any) => {
  const [ open, setOpen ] = React.useState(false)
  return (
    <>
      <span className='inline-flex items-center justify-end'>
        <button className='w-10 h-10 rounded-full inline-flex items-center justify-center flex-none hover:bg-foreground/10 motion-safe:transition-all duration-300 focus:ring-2 focus:ring-foreground' onClick={() => setOpen(true)}>
          <FileJson size={20} strokeWidth={1.5}/>
        </button>
      </span>
      <DialogJSONView
        open={open}
        setOpen={setOpen}
        data={row.original}
        title='JSON de la fila'
        subtitle='Datos de la fila en formato JSON'
      />
    </>
  )
}



const columnHelper = createColumnHelper<Team>()
export const columns = [
  {
    id: 'select',
    enableHiding: false,
    header: ({ table }: any) => (
      <TableCheckbox
        {...{
          checked: table.getIsAllRowsSelected(),
          indeterminate: table.getIsSomeRowsSelected(),
          onChange: table.getToggleAllRowsSelectedHandler()
        }}
      />

    ),
    cell: ({ row }: any) => (
      <div className='inline-block'>
        <TableCheckbox
          {...{
            checked: row.getIsSelected(),
            /* eslint-disable */
            disabled: !row.getCanSelect(),
            /* eslint-enable */
            indeterminate: row.getIsSomeSelected(),
            onChange: row.getToggleSelectedHandler()
          }}
        />
      </div>
    )
  },
  columnHelper.accessor('id', {
    id: 'id',
    header: () => <span>ID</span>,
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
    filterFn: 'includesStringSensitive'
  }),
  columnHelper.accessor('avatar', {
    id: 'avatar',
    header: () => (<span>Avatar</span>),
    cell: (info) => <img src={info.getValue()} alt={info.getValue()} className="h-10 w-10 rounded-full" />,
    footer: (info) => info.column.id,
    filterFn: 'includesStringSensitive'
  }),
  columnHelper.accessor('name', {
    id: 'name',
    header: () => 'Nombre',
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
    filterFn: 'includesString'
  }),
  columnHelper.accessor('slogan', {
    id: 'slogan',
    header: () => 'Nombre',
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
    filterFn: 'includesString'
  }),
  columnHelper.display({
    id: 'options',
    enableColumnFilter: false,
    enableSorting: false,
    enableHiding: false,
    header: () => (
      <div className='flex flex-col items-center gap-2.5 text-center w-full'>
        <span>Opciones</span>
        <span className='inline-flex items-center justify-center w-9 h-9 rounded-full bg-foreground/10'>
          <CircleEllipsis size={22} strokeWidth={1.5} />
        </span>
      </div>
    ),
    cell: (props) => (
      <div className='inline-flex items-center justify-center w-full'>
        <TeamOptions data={props.row.original} />
      </div>
    ),
    footer: (info) => info.column.id
  }),
  columnHelper.display({
    id: 'JSON',
    enableHiding: false,
    cell: ({ row }) => <ROWJSONView row={row} />,
    header: () => (
      <div className='flex flex-col gap-2.5'>
        <span className='font-semibold text-sm'>JSON</span>
        <span className='inline-flex items-center justify-center w-9 h-9 rounded-full bg-foreground/10'>
          <FileJson size={20} strokeWidth={1.5}/>
        </span>
      </div>
    ),
    footer: (info) => info.column.id
  })
]

// Filtrar por columnas
function Filter ({ column }: { column: Column<any, unknown> }) {
  const columnFilterValue = column.getFilterValue()

  return (
    <DebouncedInput
      type='text'
      value={(columnFilterValue ?? '') as string}
      onChange={value => column.setFilterValue(value)}
      placeholder='Buscar...'
      className='w-full px-4 h-10 rounded focus-0 focus:outline focus:ring-0 border-2 bg-background border-border focus:border-foreground !pr-8 focus:bg-background'
    />
  )
}

// Input con debounce para filtrar la tabla
function DebouncedInput ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (_value: string | number) => void
  debounce?: number
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
  const [ value, setValue ] = React.useState(initialValue)

  React.useEffect(() => {
    setValue(initialValue)
  }, [ initialValue ])

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [ value ])

  return (
    <div className='group w-full relative max-w-[15rem]'>
      <input {...props} value={value} onChange={e => setValue(e.target.value)} />
      {
        value && (
          <Close
            className='absolute right-2 top-1/2 transform -translate-y-1/2 w-7 h-7 !p-[5px] dark:group-focus-within:text-foreground dark:group-focus-within:hover:bg-foreground/10 dark:hover:bg-foreground/10'
            onClick={() => setValue('')}
          />
        )
      }
    </div>
  )
}

export default function Table () {

  // @Tanstack - React query
  // Hook para obtener los equipos

  const { teams } = useTeamStore() as  { teams: Team[] }


  const [ sorting, setSorting ] = React.useState<SortingState>([])
  const [ rowSelection, setRowSelection ] = React.useState({})
  const [ globalFilter, setGlobalFilter ] = React.useState('')
  const [ columnFilters, setColumnFilters ] = React.useState<ColumnFiltersState>([])
  const [ columnVisibility, setColumnVisibility ] = React.useState({
    id: false,
    name: true,
    options: true,
    JSON: true
  })

  // Efecto para almacenar los equipos en un estado provisional

  const [ data, setData ] = React.useState<Team[]>([])
  React.useEffect(() => {
    if (teams.length > 0) {
      setData(teams)
    }
  }, [ teams ])

  // Hook para omitir la actualización del estado
  function useSkipper (): any {
    const shouldSkipRef = React.useRef(true)
    const shouldSkip = shouldSkipRef.current

    const skip = React.useCallback(() => {
      shouldSkipRef.current = false
    }, [])

    React.useEffect(() => {
      shouldSkipRef.current = true
    })

    return [ shouldSkip, skip ] as const
  }

  const [ autoResetPageIndex, skipAutoResetPageIndex ] = useSkipper()

  const table = useReactTable({
    data: data,
    columns,
    initialState: {
      pagination: {
        pageSize: 20, //custom default page size
      },
    },
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      sorting,
      rowSelection,
      globalFilter,
      columnFilters,
      columnVisibility
    },
    autoResetPageIndex,
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility as (_updater: any) => void,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    meta: {
      updateData: (rowIndex: number, columnId: string, value: any) => {
        skipAutoResetPageIndex()
        setData((old: Team[]) =>
          old.map((row: Team, index: number) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex]!,
                [columnId]: value,
              }
            }
            return row
          })
        )
      },
    }
  })

  return (
    <React.Fragment>
      <div className='flex flex-col w-full border rounded-2xl overflow-hidden border-border'>

        {/* Toolbar */}
        <nav className='flex items-center min-h-14 border-b z-10 md:sticky md:top-0 bg-background border-border'>
          <div className='flex items-center justify-between flex-1 w-full p-4'>
            <DebouncedInput
              value={globalFilter ?? ''}
              onChange={value => setGlobalFilter(String(value))}
              className='w-full px-4 h-10 rounded focus-0 focus:outline focus:ring-0 border-2 border-border focus:border-foreground placeholder:text-sm placeholder:font-normal font-medium'
              placeholder='Buscar en la tabla...'
            />
          </div>
        </nav>
        {/* End Toolbar */}

        <div className='w-full'>
          <div className='flex flex-col rounded-b'>
            <div className='overflow-x-auto'>
              <div className='inline-block min-w-full align-middle'>
                <div className='overflow-hidden shadow'>
                  <table className='min-w-full divide-y divide-foreground/10 table-fixed'>
                    <thead className='bg-foreground/2'>
                      {
                        table.getHeaderGroups().map(headerGroup => (
                          <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => {
                              return (
                                <th
                                  key={header.id}
                                  colSpan={header.colSpan}
                                  scope='col'
                                  className='p-4 text-sm font-medium text-left text-foreground'
                                >
                                  {header.isPlaceholder ? null : (
                                    <>
                                      <div
                                        {...{
                                          className: cn(
                                            'inline-flex gap-1 w-full',
                                            header.column.getCanSort()
                                              ? 'cursor-pointer select-none'
                                              : ''
                                          ),
                                          onClick: header.column.getToggleSortingHandler(),
                                        }}
                                      >
                                        {flexRender(
                                          header.column.columnDef.header,
                                          header.getContext()
                                        )}
                                        {{
                                          asc: ' 🔼',
                                          desc: ' 🔽',
                                        }[header.column.getIsSorted() as string] ?? null}
                                      </div>
                                      {header.column.getCanFilter() ? (
                                        <div className='relative max-w-40 mt-2'>
                                          <Filter column={header.column} />
                                        </div>
                                      ) : null}
                                    </>
                                  )}
                                </th>
                              )
                            })}
                          </tr>
                        ))
                      }
                    </thead>
                    <tbody className='bg-background divide-y divide-foreground/10 '>
                      {table?.getRowModel()?.rows?.map((row) => (
                        <tr
                          key={row.id}
                          className={cn(
                            row.getIsSelected()
                              ? 'bg-foreground/5'
                              : 'hover:bg-foreground/2'
                          )}
                        >
                          {row.getVisibleCells().map((cell) => {
                            if (cell.id.includes('image')) {
                              return (
                                <td
                                  key={cell.id}
                                  className='flex items-center p-4 mr-12 space-x-6 whitespace-nowrap'
                                >
                                  {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                  )}
                                </td>
                              )
                            } else {
                              return (
                                <td
                                  key={cell.id}
                                  className={cn(
                                    'p-4 text-sm text-foreground whitespace-nowrap',
                                    row.getIsSelected() ? 'font-bold' : 'font-medium'
                                  )}
                                >
                                  {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                  )}
                                </td>
                              )
                            }
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <TableMetaData table={table} rowSelection={rowSelection} />
          <TablePagination table={table} />
        </div>

      </div>
    </React.Fragment>
  )
}