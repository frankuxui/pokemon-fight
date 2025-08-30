import React from 'react'

export default function PokemonMoves ({ moves }: { moves: { move: { name: string; url: string } }[] }) {
  const [ showAll, setShowAll ] = React.useState(false)
  const visibleMoves = showAll ? moves : moves.slice(0, 10)

  return (
    <div className='inline-flex flex-wrap justify-start items-center gap-2 mt-2'>
      {
        visibleMoves.map((m, index) => (
          <span
            key={index}
            className='gap-2 rounded-full font-semibold text-xs inline-flex items-center justify-center border border-border h-8 px-3 bg-background'
          >
            <span>⚡</span>
            <span className='mt-px capitalize'>{m.move.name}</span>
          </span>
        ))}
      {
        moves.length > 10 && (
          <button
            onClick={() => setShowAll(prev => !prev)}
            className='text-xs font-medium text-foreground/70 hover:text-foreground transition-colors rounded-full bg-foreground/5 h-8 px-3'
          >
            {showAll ? 'Ver menos' : `Ver más (+${moves.length - 10})`}
          </button>
        )
      }
    </div>
  )
}