import { Grid2x2, Table } from 'lucide-react'
import { cn } from 'src/lib/utils'
import { useViewConfigStore } from 'src/store'

export default function ViewConfig () {
  const { view, setView } = useViewConfigStore()

  return (
    <div className='inline-block rounded-full overflow-hidden border border-border divide-x divide-border'>
      <button
        className={cn(
          'inline-flex items-center justify-center h-10 px-4 relative focus:z-1 focus:bg-foreground/5',
          view === 'table' && 'bg-foreground/5'
        )}
        onClick={() => setView('table')}
        aria-label='Vista de lista'
        data-active={view === 'table'}
      >
        <Table size="20" strokeWidth="1.5"/>
      </button>
      <button
        className={cn(
          'inline-flex items-center justify-center h-10 px-4 relative focus:z-1 focus:bg-foreground/5',
          view === 'card' && 'bg-foreground/5'
        )}
        onClick={() => setView('card')}
        aria-label='Vista de tarjeta'
        data-active={view === 'card'}
      >
        <Grid2x2 size="20" strokeWidth="1.5" />
      </button>
    </div>
  )
}
