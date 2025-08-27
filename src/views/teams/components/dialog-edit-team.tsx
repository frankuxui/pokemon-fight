import { Button, Close, Dialog } from 'src/components/ui'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { useTeamStore } from 'src/store'
import type { Team } from 'src/types/Team'
import { teamAvatars } from 'src/data/avatars'
import React from 'react'
import SvgSuccessAnimation from 'src/components/svg-success-animation'
import { motion } from 'motion/react'
import { cn } from 'src/lib/utils'
import { toast } from 'sonner'

interface FormProps extends Omit<Team, 'id' | 'createdAt' | 'updatedAt'> {
  name: string
  slogan: string
  description: string
  avatarUrl?: string
}

const CHARACTERS_LIMIT = 200

interface Props {
  open: boolean
  setOpen: (_open: boolean) => void
  team: Team
}

export default function DialogEditTeams ({ open, setOpen, team }: Props) {

  // React Hook Form
  const { register, handleSubmit, formState: { errors }, watch, trigger, reset } = useForm<FormProps>({
    defaultValues: {
      name: team.name,
      slogan: team.slogan,
      description: team.description,
      avatar: team.avatar
    }
  })

  // Zustand store
  const { updateTeam } = useTeamStore()

  // Validación básica
  const isValidForm = watch('name') && watch('slogan')?.length > 3 && watch('description')?.length > 3 && watch('description')?.length <= CHARACTERS_LIMIT

  // Avatar state
  const [ selectedAvatar, setSelectedAvatar ] = React.useState<string>('') // galería

  // Seleccionar avatar de la galería
  const handleSelectedAvatar = (avatar: string) => {
    setSelectedAvatar(avatar) // activo galería
  }

  // React transition
  const [ isPending, startTransition ] = React.useTransition()

  // Crear equipo
  const onSubmit: SubmitHandler<FormProps> = (data: FormProps) => {
    startTransition(() => {
      updateTeam(team.id, { ...data, avatar: selectedAvatar })
      toast.success('Equipo actualizado correctamente')
      reset()
    })
  }

  // Textarea resize
  const [ textareaHeight, setTextareaHeight ] = React.useState('auto')
  const handleTextareaResize = () => {
    const textarea = Array.from(document.querySelectorAll('textarea')) as HTMLTextAreaElement[]
    if (textarea.length > 0) {
      textarea.forEach((element) => {
        element.style.height = 'auto'
        element.style.height = element.scrollHeight + 'px'
        setTextareaHeight(element.style.height)
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Dialog.Content className="max-w-xl overflow-hidden max-h-[calc(100vh_-_4rem)] flex flex-col">
        <Dialog.Header className='flex items-center justify-between p-6'>
          <div className="grid">
            <h2 className="text-lg font-semibold">Editar Equipo</h2>
            <p className="text-sm">Formulario para editar el equipo existente</p>
          </div>
          <Dialog.Close asChild>
            <Close />
          </Dialog.Close>
        </Dialog.Header>
        <Dialog.Body className='w-full'>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='px-6'>
              <div className='w-full grid grid-cols-2 gap-4 place-items-start'>
                {/* Inputs name + slogan */}
                <div className='w-full grid gap-2'>
                  <label htmlFor="name" className='font-medium'>Nombre del equipo</label>
                  <input
                    id="name"
                    className={cn(
                      'w-full px-4 h-10 rounded focus-0 focus:ring-0 border-2 border-border focus:outline-0',
                      errors?.name ? 'border-rose-500 focus:border-rose-500' : 'focus:border-foreground'
                    )}
                    {...register('name', {
                      required: true,
                      validate: (value) => value.trim() !== '' && value.length > 3,
                      onBlur: () => trigger('name'),
                      onChange: () => trigger('name')
                    })}
                  />
                  {errors.name?.type === 'required' && <span className='text-xs text-rose-500'>Este campo es obligatorio</span>}
                  {errors.name?.type === 'validate' && <span className='text-xs text-rose-500'>El nombre debe tener más de 3 caracteres</span>}
                </div>

                <div className='w-full grid gap-2'>
                  <label htmlFor="slogan" className='font-medium'>Slogan</label>
                  <input
                    id="slogan"
                    className={cn(
                      'w-full px-4 h-10 rounded focus-0 focus:ring-0 border-2 border-border focus:outline-0',
                      errors?.slogan ? 'border-rose-500 focus:border-rose-500' : 'focus:border-foreground'
                    )}
                    {...register('slogan', {
                      required: true,
                      validate: (value) => value.trim() !== '' && value.length > 3,
                      onBlur: () => trigger('slogan'),
                      onChange: () => trigger('slogan')
                    })}
                  />
                  {errors.slogan?.type === 'required' && <span className='text-xs text-rose-500'>Este campo es obligatorio</span>}
                  {errors.slogan?.type === 'validate' && <span className='text-xs text-rose-500'>El nombre debe tener más de 3 caracteres</span>}
                </div>

                {/* Descripción */}
                <div className='w-full grid gap-2 col-span-2'>
                  <div className='w-full flex items-center justify-between'>
                    <label htmlFor='message' className='font-medium text-sm'>Mensaje</label>
                    <span
                      className={cn(
                        'rounded min-w-20 px-2 h-7 inline-flex items-center justify-center border border-border text-sm',
                        watch('description')?.length > CHARACTERS_LIMIT && 'text-destructive'
                      )}
                    >
                      {watch('description')?.length} - {CHARACTERS_LIMIT}
                    </span>
                  </div>
                  <textarea
                    id='description'
                    style={{ height: textareaHeight }}
                    {...register('description', {
                      required: true,
                      validate: (value) => value.length > 3,
                      maxLength: CHARACTERS_LIMIT,
                      onChange: () => {
                        handleTextareaResize()
                      }
                    })}
                    className={cn(
                      'w-full min-h-20 h-12 resize-y p-4 rounded border-2 border-border ring-0 focus:outline-0 focus:ring-0 transition-colors duration-300 focus:border-foreground',
                      errors?.description && 'border-destructive focus:border-destructive'
                    )}
                  />
                </div>

                {/* Avatar */}
                <div className='grid col-span-2 w-full'>
                  <div className='w-full flex items-center justify-between gap-6'>
                    <div className='flex-1 grid gap-2 place-items-start'>
                      <h5 className='font-medium text-sm'>Seleccionar avatar</h5>
                      <div className="grid grid-cols-6 gap-4">
                        {
                          teamAvatars.map((team) => (
                            <motion.button
                              whileFocus={{ scale: 1.1 }}
                              key={team.id}
                              type="button"
                              onClick={() => handleSelectedAvatar(team.name)}
                              aria-label={`Seleccionar ${team.name}`}
                              className={cn(
                                'relative aspect-square rounded-full border border-border p-2 hover:shadow-md transition',
                                selectedAvatar === team.name && 'shadow-2xl'
                              )}
                            >
                              <img
                                src={`./avatars/${team.name}.png`}
                                alt={team.name}
                                className="h-full w-full object-cover rounded-xl"
                                loading="lazy"
                                width={128}
                                height={128}
                              />
                              <span className="sr-only">{team.name}</span>
                              {
                                selectedAvatar === team.name && (
                                  <div className="absolute w-7 h-7 left-1/2 -translate-x-1/2 -bottom-2 rounded-full ring-2 ring-background bg-background" >
                                    <SvgSuccessAnimation className='w-full h-full' background='#2410e8' />
                                  </div>
                                )
                              }
                            </motion.button>
                          ))
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className='p-6 flex items-center justify-end gap-2'>
              <Dialog.Close asChild>
                <Button type="button" variant="outline">Cancelar</Button>
              </Dialog.Close>
              <Button type="submit" disabled={!isValidForm || isPending} aria-disabled={!isValidForm || isPending}>
                {isPending ? 'Guardando...' : 'Guardar cambios'}
              </Button>
            </div>
          </form>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog>
  )
}
