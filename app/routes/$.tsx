
export default function NotFound () {
  return (
    <div className="w-full flex flex-col items-center justify-center px-10 pt-52">
      <img
        src="../pokemon-404.webp"
        alt="Página no encontrada"
        className="w-full max-w-44"
      />
      <h1 className="text-6xl font-bold mb-4 mt-6">404</h1>
      <p className="text-xl mb-4">Página no encontrada</p>
      <p className="text-center max-w-md">
        Lo sentimos, pero la página que estás buscando no existe o ha sido
        movida.
      </p>
    </div>
  )
}