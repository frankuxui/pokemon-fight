
# Pokémon Fight

Aplicación web para gestión y combate de equipos Pokémon.

## Tecnologías principales

- **ReactJS**
- **React Router**
- **TanStack Query** (react-query)
- **Zustand** (estado global)
- **TailwindCSS** (estilos)
- **Axios** (fetching)
- **Moment.js** (fechas)
- **Lucide React** (iconos)
- **Testing Library / Jest** (tests)

## Instalación

Instala las dependencias:

```bash
pnpm install
# o
npm install
```

## Arranque en desarrollo

Inicia el servidor de desarrollo:

```bash
pnpm run dev
# o
npm run dev
```

La app estará disponible en `http://localhost:5173`

## Build para producción

Genera el build optimizado:

```bash
pnpm run build
# o
npm run build
```

## Docker

Para construir y correr con Docker:

```bash
docker build -t pokemon-fight .
docker run -p 3000:3000 pokemon-fight
```

## Estructura de carpetas

- `src/` Código fuente principal
- `src/store/` Estado global (equipos, favoritos)
- `src/services/` Lógica de fetching y queries
- `src/views/` Vistas y componentes principales
- `public/` Recursos estáticos
- `app/` Configuración y layout

## Proxy API

Las llamadas a la PokéAPI se hacen vía proxy configurado en Vite (`vite.config.ts`).

## Testing

Incluye pruebas unitarias con Testing Library y Jest.

## Versiones usadas

- Node: 20.x
- React: 19.x
- Vite: 6.x
- TailwindCSS: 4.x
- Zustand: 5.x
- TanStack Query: 5.x

---

Desarrollado para prueba técnica ReactJS 2025.
