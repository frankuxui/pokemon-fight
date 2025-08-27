import { Menu } from 'lucide-react'
import { useMobileSidebarStore } from 'src/store'

export default function HeaderMenuMobile () {

  // Zustand store
  // Gestion del menu mobile
  const { open } = useMobileSidebarStore()

  return (
    <button className="w-10 h-10 inline-flex items-center justify-center rounded-full hover:bg-foreground/5 md:hidden" onClick={open}>
      <span className="sr-only">Abrir menú</span>
      <Menu size="26" strokeWidth={1.5}/>
    </button>
  )
}