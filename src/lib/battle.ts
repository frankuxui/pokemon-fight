// src/lib/battle.js
// getStats(name) => { attack, defense, speed }
export async function simulateBattle (teamA, teamB, getStats) {
  // Arrays de nombres en orden
  let i = 0, j = 0
  const rounds = []

  while (i < teamA.length && j < teamB.length) {
    const a = teamA[i], b = teamB[j]
    const sa = await getStats(a)
    const sb = await getStats(b)

    // 1) El más rápido ataca primero
    const first = sa.speed >= sb.speed ? { name: a, s: sa, idx: 'A' } : { name: b, s: sb, idx: 'B' }
    const second = first.idx === 'A' ? { name: b, s: sb, idx: 'B' } : { name: a, s: sa, idx: 'A' }

    let winner = null
    if (first.s.attack > second.s.defense) {
      winner = first
    } else if (second.s.attack > first.s.defense) {
      winner = second
    } else {
      // 4) Nadie supera defensa -> gana el más rápido (first)
      winner = first
    }

    rounds.push({ winner: winner.name, loser: winner.idx === 'A' ? second.name : first.name })

    // 5) El ganador sigue, el perdedor cae
    if (winner.idx === 'A') {
      j++ // cae B
    } else {
      i++ // cae A
    }
  }

  return {
    rounds,
    remainingA: teamA.length - i,
    remainingB: teamB.length - j,
    winner: (teamA.length - i) > (teamB.length - j) ? 'A' : 'B',
  }
}
