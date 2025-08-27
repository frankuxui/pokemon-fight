import { Button, Close, Dialog } from 'src/components/ui'
import type { Pokemon } from 'src/types/Pokemon'

interface Props {
  open: boolean
  setOpen: (_open: boolean) => void
  item: Pokemon
}

export default function DialogPokemonDetails ({ open, setOpen, item }: Props) {

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Dialog.Content className="max-w-xl">
        <Dialog.Header className="w-full p-6 flex items-center justify-between">
          <div className='flex flex-row items-center justify-start gap-4'>
            <figure>
              <img src={item?.sprite} alt={item?.name} className="w-14 h-14 rounded-full" />
            </figure>
            <div className='flex flex-col items-start'>
              <h2 className="text-lg font-semibold">{item?.name}</h2>
              <p className="text-sm">Detalles y características del equipo</p>
            </div>
          </div>
          <Dialog.Close asChild>
            <Close />
          </Dialog.Close>
        </Dialog.Header>
        <Dialog.Body className='px-6'>
          <p>
            Este dialogo es ideal para mostrar mas caracteristicas y detalles del equipo, como su composicion, habilidades y estrategias.
          </p>
        </Dialog.Body>
        <Dialog.Footer className="flex justify-end p-6 gap-2">
          <Dialog.Close asChild>
            <Button variant="outline">Cancelar</Button>
          </Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  )
}
