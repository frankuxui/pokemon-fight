import { Grip } from 'lucide-react'
import React from 'react'
import { Button } from 'src/components/ui'
import { MAX_POKEMONS_PER_TEAM } from 'src/config'
import { StringUtils } from 'src/lib/string'
import { useTeamStore } from 'src/store'
import type { Pokemon } from 'src/types/Pokemon'
import type { Team } from 'src/types/Team'
import { createSwapy, type Swapy, utils } from 'swapy'

export default function PokemonSlots ({
  team,
  onAdd,
}: {
  team: Team
  onAdd: (_slotIndex: number) => void
}) {
  const swapy = React.useRef<Swapy | null>(null)
  const container = React.useRef<HTMLDivElement>(null)

  // Hook para actualizar el equipo
  const { updateTeam } = useTeamStore()

  // inicializar slotItemMap
  const [ slotItemMap, setSlotItemMap ] = React.useState(
    utils.initSlotItemMap(team.pokemons, 'order')
  )

  // mantener sync cuando cambie el equipo
  React.useEffect(() => {
    utils.dynamicSwapy(
      swapy.current,
      team.pokemons,
      'order',
      slotItemMap,
      setSlotItemMap
    )
  }, [ team.pokemons ])

  // actualizar equipo al hacer swap
  /* const updateTeamPokemons = (event: any) => {
    if (!event.hasChanged) return

    setSlotItemMap(event.newSlotItemMap.asArray)
    // recorrer todos los slots de la nueva disposición
    const updatedPokemons: Pokemon[] = event.newSlotItemMap.asArray
      .map(({ item }: { item: string }, index: number) => {
        if (item.startsWith('empty')) return null
        const p = team.pokemons.find((pk) => String(pk.id) === item)
        if (!p) return null
        return { ...p, order: index } // 👈 aquí reasignamos el orden según el slot
      })
      .filter(Boolean) as Pokemon[]

    updateTeam(team.id, { pokemons: updatedPokemons })
  } */

  // inicializar Swapy

  React.useEffect(() => {
    if (!container.current) return

    swapy.current = createSwapy(container.current, {
      manualSwap: false,
      enabled: true,
      swapMode: 'hover',
      dragAxis: 'both',
    })

    swapy.current.onSwap((event) => {
      const objectEvent = event.newSlotItemMap.asObject
      // recorrer cada slot -> asignar el order
      const updatedPokemons: Pokemon[] = Object.entries(objectEvent)
        .map(([ slot, item ]) => {
          if (String(item).startsWith('empty')) return null

          // obtener la posición del slot a partir de la key "slot-x"
          const index = Number(slot.split('-')[1])

          const p = team.pokemons.find((pk) => String(pk.id) === String(item))
          if (!p) return null

          return {
            ...p,
            order: index
          }
        })
        .filter(Boolean) as Pokemon[]

      // actualizar el equipo con los pokémon reordenados
      updateTeam(team.id, { pokemons: updatedPokemons })
    })

    return () => {
      swapy.current?.destroy()
    }
  }, [ team.id ])

  console.log(team, 'aaaaaaaaaaaaaaaaaaaaaaa')

  return (
    <div className="w-full grid grid-cols-2 gap-4" ref={container}>
      {Array.from({ length: MAX_POKEMONS_PER_TEAM }).map((_, index) => {
        const sortedPokemons = [ ...team.pokemons ].sort(
          (a, b) => (a.order ?? 0) - (b.order ?? 0)
        )
        const item = sortedPokemons.find((p) => p.order === index) || null
        const slotId = `slot-${index}`

        if (!item) {
          return (
            <div
              key={slotId}
              className="relative min-h-[125px] max-h-[130px] flex items-end pb-4 justify-center rounded-xl w-full bg-foreground/5"
            >
              <Button
                size="sm"
                className="text-xs h-7 px-4 font-semibold"
                variant="outline"
                onClick={() => onAdd(index)}
              >
              Agregar
              </Button>
            </div>
          )
        }

        return (
          <React.Fragment key={slotId}>
            <div
              data-swapy-slot={slotId}
              className="pokemon-slot rounded-xl data-[swapy-highlighted]:bg-emerald-500/10 data-[swapy-highlighted]:border-2 data-[swapy-highlighted]:border-dashed data-[swapy-highlighted]:border-emerald-500/20"
            >
              <div
                data-swapy-item={String(item.id)}
                className="w-full flex flex-col items-center justify-center gap-2 data-[swapy-dragging]:ring-2 data-[swapy-dragging]:ring-foreground/5"
              >
                <div className="relative min-h-[125px] max-h-[130px] p-2 flex items-center justify-center rounded-xl w-full bg-foreground/5">
                  <span className="absolute top-3 left-3 text-xs font-bold rounded-full inline-flex items-center w-5 h-5 justify-center bg-background">
                    {index + 1}
                  </span>
                  <div
                    data-swapy-handle
                    className="absolute top-2 right-2 w-7 h-7 rounded-md border border-border inline-flex items-center justify-center cursor-grab bg-background"
                  >
                    <Grip size={16} />
                  </div>
                  <img
                    src={item.sprite}
                    alt={item.name}
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <p className="font-medium text-sm" data-swapy-no-drag>
                  {StringUtils.capitalizeFirstLetter(item.name)}
                </p>
              </div>
            </div>
          </React.Fragment>
        )
      })}
    </div>
  )
}
