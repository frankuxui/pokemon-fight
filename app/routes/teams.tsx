import Render from 'src/views/teams/render'

export function meta () {
  return [
    {
      title: 'Teams | Pokemon Fight'
    },
    {
      name: 'description',
      content: 'Lista de equipos creados por los usuarios'
    },
  ]
}

export default function Teams () {

  return (
    <Render />
  )
}
