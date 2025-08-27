import type { Route } from './+types/home'
import { Welcome } from '../welcome/welcome'
import { getConfig } from 'src/config'

// eslint-disable-next-line no-empty-pattern
export function meta ({}: Route.MetaArgs) {

  const siteConfig = getConfig()
  return [
    {
      title: siteConfig.seo.title
    },
    {
      name: 'description',
      content: siteConfig.seo.description
    },
  ]
}

export default function Home () {
  return (
    <>
    <section className='pt-10'>
      <div className='w-full mx-auto max-w-7xl px-10'>
        <div className='w-full overflow-hidden rounded-4xl'>
          <img
            src="../pokemon-banner-portada.webp"
            alt="Pokemon Banner"
            className="w-full h-auto"
          />
        </div>
      </div>
    </section>
    {/** En este componente cree un componente que uso mucho a diario que me permite renderizar listas pasando la query de tanstack ( hechale un vistazo a este componente ) */}
    {/* <Welcome /> */}
    </>
  )
}
