const SITE_URL = import.meta.env.VITE_SITE_URL as string
const DOMAIN = import.meta.env.VITE_SITE_DOMAIN as string

export function getConfig () {
  return {
    appName: 'Pokémon Fight',
    seo: {
      title: 'Batalla de Pokémon | Crea, entrena y enfrenta tus equipos',
      applicationName: 'Batallas Pokémon en línea',
      author: 'Frankuxui',
      creator: '@Frankuxui',
      colorTheme: '#ffffff',
      robots: 'index, follow',
      siteUrl: SITE_URL || 'http://localhost:5173',
      domain: DOMAIN || 'localhost',
      description: 'Crea tus equipos Pokémon personalizados, organiza estrategias y enfréntate en batallas épicas. Conviértete en el mejor entrenador en línea.',
      keywords: [
        'Pokémon',
        'batallas Pokémon',
        'equipos Pokémon',
        'estrategia Pokémon',
        'simulador de combate',
        'entrenador Pokémon',
        'Pokédex online',
      ],
      logo: `${SITE_URL}/logo.png`,
      openGraph: {
        title: 'Batallas Pokémon en línea | Estrategia y diversión',
        description: 'Construye tu equipo Pokémon de hasta 6 miembros, desafía a otros entrenadores y revive la emoción de los combates clásicos con estadísticas reales.',
        url: SITE_URL,
        type: 'website',
        image: `${SITE_URL}/imagen-de-pelea-de-pockemones.webp`,
      },
    },
  }
}

// Limite de pokemones por equipo
export const MAX_POKEMONS_PER_TEAM = 6