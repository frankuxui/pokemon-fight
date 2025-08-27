import { FileJson } from 'lucide-react'
import React from 'react'

import { Button, Close } from 'src/components/ui'
import { Dialog } from 'src/components/ui'
import { useCopyToClipboard } from 'src/hooks/useCopyClipboard'
import { cn } from 'src/lib/utils'

interface Props {
  data: any
  title: string
  subtitle?: string
  open: boolean
  setOpen: (_value: boolean) => void
}
const DialogJSONView = React.memo(({ data, title, subtitle, open, setOpen, ...props }: Props) => {

  const [ text, copy ] = useCopyToClipboard()

  return (
    <Dialog open={open} onOpenChange={setOpen} {...props}>
      <Dialog.Content className='max-w-2xl overflow-hidden max-h-[calc(100vh_-_4rem)] flex flex-col'>
        <Dialog.Header className='flex items-center justify-between p-6 w-full flex-none'>
          <div className='flex items-center gap-3 sm:gap-4'>
            <span className='w-12 h-12 sm:w-14 sm:h-14 inline-flex items-center flex-none justify-center rounded-full border border-border'>
              <FileJson size={24} strokeWidth={1.5}/>
            </span>
            <div className='grid'>
              <h2 className='text-base font-semibold'>{title}</h2>
              <p className='text-sm'>{subtitle}</p>
            </div>
          </div>
          <Dialog.Close asChild>
            <Close />
          </Dialog.Close>
        </Dialog.Header>

        <Dialog.Body className='overflow-auto p-6 bg-gray-950 text-amber-500'>
          <pre className='text-sm p-6 bg-gray-950 text-amber-500'>{JSON.stringify(data, null, 2)}</pre>
        </Dialog.Body>

        <Dialog.Footer className='w-full flex-none flex items-center justify-between p-6 gap-12'>
          <p className='text-xs'>
            Este diálogo muestra los datos reales del elemento de la tabla, útil para depurar y verificar la información manejada.
          </p>
          <div className='flex items-center justify-end gap-2'>
            <button
              onClick={() => copy(JSON.stringify(data, null, 2))}
              className={cn(
                'inline-flex items-center justify-center h-9 px-4 rounded-full transition-colors duration-300',
                text === JSON.stringify(data, null, 2) ? 'bg-emerald-200 text-emerald-950' : 'bg-gray-200 hover:bg-gray-300 text-gray-950'
              )}
            >
              {
                text === JSON.stringify(data, null, 2)
                  ? (
                    <div className='text-xs font-semibold uppercase inline-flex items-center gap-2'>
                      <span className='mt-[1px]'>Copiado</span>
                      <svg width='14' height='14' fill='none' strokeWidth='2.5' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' aria-hidden='true'> <path strokeLinecap='round' strokeLinejoin='round' d='m4.5 12.75 6 6 9-13.5'></path> </svg>
                    </div>
                  )
                  : (
                    <div className='text-xs font-semibold uppercase inline-flex items-center gap-2'>
                      <span className='mt-[1px]'>Copiar</span>
                      <svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' > <rect width='8' height='4' x='8' y='2' rx='1' ry='1'></rect> <path d='M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2'></path> </svg>
                    </div>
                  )
              }
            </button>
            <Dialog.Close asChild>
              <Button >Cerrar</Button>
            </Dialog.Close>
          </div>
        </Dialog.Footer>
      </Dialog.Content>

    </Dialog>
  )
})

DialogJSONView.displayName = 'DialogJSONView'
export default DialogJSONView