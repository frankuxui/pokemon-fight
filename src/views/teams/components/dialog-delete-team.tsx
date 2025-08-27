import { toast } from 'sonner'
import { Button, Dialog } from 'src/components/ui'
import { useTeamStore } from 'src/store'
import { useNavigate } from 'react-router'
import React from 'react'

interface Props {
  open: boolean
  setOpen: (_open: boolean) => void
  team: any
}

export default function DialogDeleteTeam ({ open, setOpen, team }: Props) {
  const { deleteTeam } = useTeamStore()

  const navigate = useNavigate()

  // Redirigir a /teams después de eliminar el equipo

  const handleDelete = () => {
    deleteTeam(team.id)
    setOpen(false)
    setTimeout(() => {
      toast.success('Equipo eliminado correctamente')
    }, 200)
    setTimeout(() => {
      navigate('/teams')
    }, 400)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen} staticOverlay>
      <Dialog.Content className="max-w-sm">
        <Dialog.Header className="grid gap-1 w-full p-6">
          <h2 className="text-base font-semibold">Eliminar equipo</h2>
          <p className="text-sm">Al eliminar este equipo no podrás recuperarlo. Se consciente de las consecuencias.</p>
        </Dialog.Header>
        <Dialog.Footer className="flex justify-end px-6 pb-6 gap-2">
          <Dialog.Close asChild>
            <Button variant="outline">Cancelar</Button>
          </Dialog.Close>
          <Button variant="destructive" onClick={handleDelete}>Eliminar</Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  )
}
