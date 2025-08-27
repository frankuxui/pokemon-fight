import type { Placement } from '@floating-ui/react-dom'
import React from 'react'
import type { ContextMenuOption } from 'src/components/contextual-menu'
import ContextMenu from 'src/components/contextual-menu'
import type { Team } from 'src/types/Team'

// Dialogos dinamicos
const DynamicDialogJSONView = React.lazy(() => import('src/components/dialogs/dialog-json-view'))
const DynamicDialogDeleteTeam = React.lazy(() => import('src/views/teams/components/dialog-delete-team'))
const DynamiDialogTeamDetails = React.lazy(() => import('src/views/teams/components/dialog-view-team'))
const DynamicDialogEditTeams = React.lazy(() => import('src/views/teams/components/dialog-edit-team'))
const SynamicDialogAddPokemon = React.lazy(() => import('src/views/teams/components/dialog-add-pokemon'))

interface Props {
  data: Team
  placement?: Placement
}
export default function TeamOptions ({ data, placement }: Props) {

  // Ver datos en JSON
  const [ openDialogJSON, setOpenDialogJSON ] = React.useState(false)

  // Estado para el diálogo de eliminación
  const [ openDialogDelete, setOpenDialogDelete ] = React.useState(false)

  // Estado para el diálogo de detalles
  const [ openDialogDetails, setOpenDialogDetails ] = React.useState(false)

  // Estado para el diálogo de edición
  const [ openDialogEdit, setOpenDialogEdit ] = React.useState(false)

  // Estado para el diálogo de agregar Pokémon
  const [ openDialogAddPokemon, setOpenDialogAddPokemon ] = React.useState(false)

  // Render items
  const items: ContextMenuOption[] = [
    { label: 'JSON', onClick: () => setOpenDialogJSON(true) },
    { label: "Perfil del equipo", href: `/teams/${data.id}` },
    { label: 'Ver detalles', onClick: () => setOpenDialogDetails(true) },
    { label: 'Editar', onClick: () => setOpenDialogEdit(true) },
    { label: 'Agregar Pokémon', onClick: () => setOpenDialogAddPokemon(true) },
    { label: 'Eliminar', onClick: () => setOpenDialogDelete(true), className: 'text-rose-600 hover:bg-rose-500/10' }
  ]

  return (
    <>
      <ContextMenu renderItems={items} placement={placement} />

      <DynamicDialogJSONView
        title='Datos del equipo'
        subtitle='Vista previa de los datos del equipo en formato JSON'
        data={data}
        open={openDialogJSON}
        setOpen={setOpenDialogJSON}
      />

      <DynamicDialogDeleteTeam open={openDialogDelete} setOpen={setOpenDialogDelete} team={data} />
      <DynamiDialogTeamDetails open={openDialogDetails} setOpen={setOpenDialogDetails} team={data} />
      <DynamicDialogEditTeams open={openDialogEdit} setOpen={setOpenDialogEdit} team={data} />
      <SynamicDialogAddPokemon open={openDialogAddPokemon} setOpen={setOpenDialogAddPokemon} team={data} />
    </>
  )
}