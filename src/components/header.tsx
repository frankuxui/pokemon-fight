import { NavLink } from 'react-router'
import Logo from './logo'
import { cn } from 'src/lib/utils'
import HeaderProfile from './header-profile'
import ThemeToggle from './theme-toggle'
import HeaderMenuMobile from './header-menu-mobile'

export default function Header () {

  return (
    <header className="sticky z-[15] top-0 w-full py-6 max-w-full border-b border-border bg-background/90 backdrop-blur-md">
      <div className="w-full mx-auto max-w-7xl px-10">
        <div className="w-full rounded-full">
          <nav className='h-full flex items-center justify-between'>
            <Logo />
            <ul className='h-full hidden md:flex items-center justify-center gap-1 flex-1'>
              <li className='inline-block'>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    cn(
                      'px-6 xl:px-8 h-10 uppercase rounded-full inline-flex items-center justify-center text-sm font-semibold motion-safe:transition-colors duration-300 ',
                      isActive ? 'bg-foreground text-background hover:bg-foreground' : 'hover:bg-foreground/5'
                    )
                  }
                >
                  Inicio
                </NavLink>
              </li>
              <li className='inline-block'>
                <NavLink
                  to="/pokemons"
                  className={({ isActive }) =>
                    cn(
                      'px-6 xl:px-8 h-10 uppercase rounded-full inline-flex items-center justify-center text-sm font-semibold motion-safe:transition-colors duration-300 ',
                      isActive ? 'bg-foreground text-background hover:bg-foreground' : 'hover:bg-foreground/5'
                    )
                  }
                >
                  Pokémon
                </NavLink>
              </li>
              <li className='inline-block'>
                <NavLink
                  to="/teams"
                  className={({ isActive }) =>
                    cn(
                      'px-6 xl:px-8 h-10 uppercase rounded-full inline-flex items-center justify-center text-sm font-semibold motion-safe:transition-colors duration-300 ',
                      isActive ? 'bg-foreground text-background hover:bg-foreground' : 'hover:bg-foreground/5'
                    )
                  }
                >
                Equipos
                </NavLink>
              </li>
            </ul>
            <div className='flex items-center justify-end gap-2'>
              <HeaderProfile />
              <ThemeToggle />
              <HeaderMenuMobile />
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
