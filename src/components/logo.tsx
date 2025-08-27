import { Link } from 'react-router'
import { getConfig } from 'src/config'

export default function Logo () {
  const config = getConfig()
  return (
    <Link to="/" className="flex items-center flex-none">
      <img
        src="/logo-redondo.png"
        alt={`Imagen del logo de ${config.appName}`}
        className="h-11 w-11 rounded-full object-cover"
        title={`Logo de ${config.appName}`}
      />
    </Link>
  )
}