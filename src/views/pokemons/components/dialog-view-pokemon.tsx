import { Dot } from 'lucide-react'
import { Button, Close, Dialog } from 'src/components/ui'
import { StringUtils } from 'src/lib/string'
import { motion } from 'motion/react'
import PokkemonPowerChart from './pokemon-power-chart'
import PokemonMoves from './pokemon-moves'

interface Props {
  open: boolean
  setOpen: (_open: boolean) => void
  pokemon: any
}

export default function DialogPokemonDetails ({ open, setOpen, pokemon }: Props) {

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Dialog.Content className="max-w-xl">
        <Dialog.Header className="w-full p-6 px-10 border-b border-border">
          <div className='flex items-start flex-col justify-start gap-4'>
            <figure className='w-20 h-20 rounded-full overflow-hidden border border-border inline-flex flex-none items-center justify-center'>
              <img
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon?.id}.png`}
                alt={pokemon?.name}
                className="w-12 h-12 rounded-full"
              />
            </figure>
            <div className='w-full flex items-center justify-between gap-10'>
              <div className='flex items-start flex-col'>
                <h1 className='text-lg sm:text-xl xl:text-2xl font-bold'>{StringUtils.capitalizeFirstLetter(pokemon?.name)}</h1>
                <p className="text-sm">Detalles y características del equipo</p>
                <div className='mt-2 flex items-start flex-wrap gap-2 text-xs text-foreground/80'>
                  {pokemon?.game_indices?.length ? (
                    <span> Primera aparición en {StringUtils.capitalizeFirstLetter(pokemon?.game_indices?.[0]?.version?.name)} </span>
                  ) : (
                    <span>Sin datos de primera aparición</span>
                  )}
                  <Dot className="w-4 h-4 text-foreground/40" />
                  <span>Peso: {pokemon?.weight / 10} kg</span>
                  <Dot className="w-4 h-4 text-foreground/40" />

                  <span>Altura: {pokemon?.height / 10} m</span>
                </div>
                <div className='mt-4 inline-flex flex-wrap justify-start items-center gap-2'>
                  {
                    pokemon?.types.map((t: any, index: number) => (
                      <span key={index} className='gap-2 rounded-full font-semibold text-xs inline-flex items-center justify-center border border-border h-8 px-3 bg-background'>
                        <span>✔️</span>
                        <span className='mt-px'>{t?.type?.name}</span>
                      </span>
                    ))
                  }
                </div>
              </div>
              <div className='w-20 h-20 flex-none inline-flex items-center justify-center'>
                <PokkemonPowerChart stats={pokemon?.stats} />
              </div>
            </div>
          </div>
          <Dialog.Close asChild>
            <Close className='absolute top-8 right-8 '/>
          </Dialog.Close>
        </Dialog.Header>
        <Dialog.Body className='divide-y divide-border'>
          <section className='w-full px-10 p-6'>
            <h3 className='font-semibold text-base'>Habilidades</h3>
            <div className='inline-flex flex-wrap justify-start items-center gap-2 mt-2'>
              {
                pokemon?.abilities.map((a: { ability: { name: string; url: string }; is_hidden: boolean; slot: number }, index: number) => (
                  <span key={index} className='gap-2 rounded-full font-semibold text-xs inline-flex items-center justify-center border border-border h-8 px-3 bg-background'>
                    <span>✨</span>
                    <span className='mt-px'>{a?.ability?.name}</span>
                  </span>
                ))
              }
            </div>
          </section>
          <section className='w-full px-10 p-6'>
            <h3 className='font-semibold text-base'>Estadísticas</h3>
            <div className='w-full mt-4 flex flex-col gap-4'>
              {
                pokemon?.stats.map((s: { base_stat: number; effort: number; stat: { name: string; url: string } }, index: number) => (
                  <div key={index} className='w-full flex flex-col gap-1'>
                    <div className='w-full flex items-center justify-between'>
                      <span className='text-sm font-medium capitalize'>{s?.stat?.name}</span>
                      <span className='text-sm font-medium'>{s?.base_stat}</span>
                    </div>
                    <div className='w-full bg-foreground/5 h-2 rounded-full overflow-hidden'>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(s?.base_stat / 255) * 100}%` }}
                        transition={{ duration: 0.5, ease: 'easeInOut' }}
                        className='h-2 bg-emerald-500 rounded-full'
                      />
                    </div>
                  </div>
                ))
              }
            </div>
          </section>
          <section className='w-full px-10 p-6'>
            <h3 className='font-semibold text-base'>Movimientos</h3>
            <div className='inline-flex flex-wrap justify-start items-center gap-2 mt-2'>
              <PokemonMoves moves={pokemon?.moves?.map((m: any) => ({ move: m.move })) ?? []} />
            </div>
          </section>
        </Dialog.Body>
        <Dialog.Footer className="flex justify-end p-6 px-10 gap-2">
          <Dialog.Close asChild>
            <Button variant="outline">Cancelar</Button>
          </Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  )
}
