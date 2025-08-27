// react-router.config.ts
import type { Config } from '@react-router/dev/config'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

export default {
  ssr: true, // o false si vas en modo SPA
  // Opcional: personaliza la URL del manifest de rutas lazy
  routeDiscovery: {
    mode: 'lazy',
    manifestPath: '/__manifest', // cambia esto si quieres otra ruta
  },
  buildEnd: async ({ buildManifest }) => {
    // 1) Elige dónde quieres dejar el archivo
    const outDir = path.resolve('build') // o 'public', 'dist', etc.
    await mkdir(outDir, { recursive: true })

    // 2) Escríbelo como JSON legible
    await writeFile(
      path.join(outDir, '__build-manifest.json'),
      JSON.stringify(buildManifest, null, 2),
      'utf-8'
    )

    console.log('Build manifest escrito en build/__build-manifest.json')
  },
} satisfies Config
