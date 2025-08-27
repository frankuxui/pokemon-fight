import { PackageOpen } from 'lucide-react'
import React from 'react'
import type { MenuDropdownItem } from 'src/components/menu-dropdown'
import { Button, Spinner } from 'src/components/ui'
import { useTeamStore, useViewConfigStore } from 'src/store'
import Table from './table'
import ViewConfig from './components/view-config'
import CardView from './card/card-view'

// Menu desplegable
const MenuOptions = React.lazy(() => import('src/components/menu-dropdown'))

// Dialog de creación de equipos
const DialogCreateTeams = React.lazy(() => import('src/views/teams/components/dialog-create-team'))

export default function Render () {

  // Hook de zustand para la gestion de equipos
  const { teams } = useTeamStore()

  // Estado para simular un loadin, simulando una llamada a la API de equipos
  const [ isLoading, setIsLoading ] = React.useState(true)
  const [ mounted, setMounted ] = React.useState(false)

  const promise = new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve()
    }, 1000)
  })

  // Detectar si esta hidratado
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setMounted(true)
    }
  }, [])

  // Simular carga de datos
  React.useEffect(() => {
    if (mounted) {
      promise.finally(() => setIsLoading(false))
    }
  }, [ mounted ])

  // Estado para abrir el diálogo de creación de equipos
  const [ isDialogOpen, setIsDialogOpen ] = React.useState(false)

  // Menu items
  const menuItems: MenuDropdownItem[] = [
    { label: 'Crear equipo', onClick: () => setIsDialogOpen(true) },
  ]

  // Configuración de la vista
  const { view } = useViewConfigStore()

  return (
    <React.Fragment>
      <section className='w-full'>
        <header className='py-6 border-b border-border sticky top-0 z-10 bg-background'>
          <div className='w-full mx-auto max-w-7xl px-10'>
            <div className='flex items-center justify-between'>
              <div className='flex flex-col items-start gap-2'>
                <h1 className='text-xl font-bold'>Equipos </h1>
                <p className='text-base'> En este panel podrás gestionar y crear tus equipos de Pokémon. </p>
              </div>
              <div>
                <MenuOptions items={menuItems} />
              </div>
            </div>
          </div>
        </header>
      </section>

      <section className='w-full py-10'>
        <div className='w-full px-10 mx-auto max-w-7xl'>
          <div className='w-full flex items-center justify-between'>
            <ViewConfig />
            <Button onClick={() => setIsDialogOpen(true)}>Crear equipo</Button>
          </div>
        </div>
      </section>

      {
        isLoading ? (
          <section className='w-full'>
            <div className='w-full mx-auto max-w-7xl px-10 flex items-center justify-center'>
              <div className='min-h-96 w-full border rounded-2xl border-border flex items-center justify-center p-10'>
                <Spinner size='xl' />
              </div>
            </div>
          </section>
        ) : teams.length === 0 ? (
          <section className='w-full py-20'>
            <div className='w-full mx-auto max-w-7xl px-10'>
              <div className='w-full flex items-center justify-center flex-col p-8 sm:p-10 md:p-20 mx-auto max-w-3xl rounded-3xl bg-foreground/2'>
                <PackageOpen strokeWidth='1' size={36}/>
                <div className='grid gap-1 mt-2 text-center w-full mx-auto max-w-xs place-items-center'>
                  <h4 className='font-semibold'>Sin equipos</h4>
                  <p className='text-sm'>Aun no hay equipos creados. Si quieres, puedes crear uno nuevo.</p>
                  <Button className='mt-4' onClick={() => setIsDialogOpen(true)} variant="outline" >Crear equipo</Button>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <section className='w-full'>
            <div className='w-full mx-auto max-w-7xl px-10'>
              {view === 'table' && <Table /> }
              {view === 'card' && <CardView /> }
            </div>
          </section>
        )
      }

      {/** Dialog de crear equipo */}
      <DialogCreateTeams open={isDialogOpen} setOpen={setIsDialogOpen} />

      {/* <ul>
        {
          teams.map((t) => (
            <li key={(t as any).id}>
              {(t as any).name}
              <button onClick={() => onRename((t as any).id)}>Renombrar</button>
              <button onClick={() => onDelete((t as any).id)}>Eliminar</button>
            </li>
          ))
        }
      </ul> */}

    </React.Fragment>
  )
}
