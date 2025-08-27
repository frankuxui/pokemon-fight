import type { Placement } from '@floating-ui/react-dom'
import React from 'react'
import type { ContextMenuOption } from 'src/components/contextual-menu'
import ContextMenu from 'src/components/contextual-menu'
import type { Pokemon } from 'src/types/Pokemon'

// Dialogos dinamicos
const DynamicDialogJSONView = React.lazy(() => import('src/components/dialogs/dialog-json-view'))
const DynamicViewPokemon = React.lazy(() => import('src/views/pokemons/components/dialog-view-pokemon'))

interface Props {
  data: Pokemon
  placement?: Placement
}
export default function PokemonOptions ({ data, placement }: Props) {

  // Ver datos en JSON
  const [ openDialogJSON, setOpenDialogJSON ] = React.useState(false)

  // Estado para el diálogo de detalles
  const [ openDialogDetails, setOpenDialogDetails ] = React.useState(false)

  // Estado para el diálogo de enviar pokemon a un equipo
  const [ openDialogAddPokemon, setOpenDialogAddPokemon ] = React.useState(false)

  // Render items
  const items: ContextMenuOption[] = [
    { label: 'JSON', onClick: () => setOpenDialogJSON(true) },
    { label: "Perfil del pokemon", href: `/pokemons/${data.id}` },
    { label: 'Ver detalles', onClick: () => setOpenDialogDetails(true) },
    { label: 'Enviar a equipo', onClick: () => setOpenDialogAddPokemon(true) },
  ]

  return (
    <>
      <ContextMenu renderItems={items} placement={placement} />

      <DynamicDialogJSONView
        title='Datos del pokemon'
        subtitle='Vista previa de los datos del pokemon en formato JSON'
        data={data}
        open={openDialogJSON}
        setOpen={setOpenDialogJSON}
      />

      <DynamicViewPokemon open={openDialogDetails} setOpen={setOpenDialogDetails} item={data} />
    </>
  )
}