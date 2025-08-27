import axios, { isAxiosError } from 'axios'

// VITE_SITE_URL=http://localhost:5173
// VITE_SITE_DOMAIN=localhost

/**
 * Obtiene la lista de Pokémon desde la PokeAPI.
 *
 * Nota sobre el uso de proxy en Vite:
 * En vez de llamar directamente a `https://pokeapi.co/api/v2/pokemon`,
 * hacemos la petición contra `/api/v2/pokemon`.
 *
 * Esto funciona porque en `vite.config.js` tenemos configurado:
 *
 * ```js
 * server: {
 *   proxy: {
 *     '/api': {
 *       target: 'https://pokeapi.co',
 *       changeOrigin: true,
 *     },
 *   },
 * }
 * ```
 *
 * ✅ Ventajas de usar el proxy de Vite:
 * - Evita problemas de **CORS**: el navegador piensa que llama a la misma URL base de la app.
 * - El código queda más **limpio y portable**, no dependemos de una URL absoluta en cada llamada.
 * - Permite cambiar fácilmente el backend en distintos entornos (dev, prod, staging).
 * - Podemos unificar múltiples APIs con distintos prefijos sin cambiar el código fuente.
 *
 * @param {Object} params - Parámetros para la query.
 * @param {number} [params.limit=20] - Número de Pokémon a obtener.
 * @param {number} [params.offset=0] - Desplazamiento en la lista (para paginación).
 * @returns {Promise<any>} - Lista de Pokémon con nombre y URL.
 */

export async function getPokemonList ({ limit = 20, offset = 0 }) {
  const url = `${import.meta.env.VITE_SITE_URL}/api/v2/pokemon?limit=${limit}&offset=${offset}`
  try {
    const response = await axios.get(url)
    if (response.status === 200) {
      return response.data.results
    } else {
      throw new Error(`Error fetching Pokémon list (${response.status}): ${response.statusText}`)
    }
  } catch (error) {
    const status = isAxiosError(error) ? error.response?.status : 500
    const message = isAxiosError(error) ? error.message : 'Unknown error'
    throw new Error(`Error fetching Pokémon list (${status}): ${message}`)
  }
}

// Obtener un pokemon por id
export async function getPokemonById (id: string) {
  const url = `${import.meta.env.VITE_SITE_URL}/api/v2/pokemon/${id}`
  try {
    const response = await axios.get(url)
    if (response.status === 200) {
      return response.data
    } else {
      throw new Error(`Error fetching Pokémon (${response.status}): ${response.statusText}`)
    }
  } catch (error) {
    const status = isAxiosError(error) ? error.response?.status : 500
    const message = isAxiosError(error) ? error.message : 'Unknown error'
    throw new Error(`Error fetching Pokémon (${status}): ${message}`)
  }
}