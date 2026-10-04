# Kickz — Frontend

SPA de Kickz, una tienda online de zapatillas deportivas. Construida con React + Vite + Tailwind CSS v3, consumiendo la API REST del backend (Express + MongoDB).

## Requisitos

- Node.js ^20.19.0 o >=22.12.0 (requerido por Vite 7 / `@vitejs/plugin-react`)
- El backend corriendo (ver `../backend/README.md`), con la base de datos ya sembrada (`npm run seed`).

## Configuración local

1. `npm install`
2. Copia `.env.example` a `.env` y ajusta `VITE_API_URL` a la URL de la API (por defecto `http://localhost:4000/api`).
3. Arranca el servidor de desarrollo:
   ```bash
   npm run dev
   ```
   La app queda disponible en `http://localhost:5173`.

## Usuarios de prueba (requiere que el backend esté sembrado)

- Admin: `admin@kickz.com` / `Admin1234!`
- Cliente: cualquier email de la hoja `users` de `seed/data/kickz-data.xlsx` del backend, contraseña `Cliente1234!`

## Páginas principales

- `/` Home (destacadas), `/catalogo` (filtros, búsqueda, scroll infinito), `/catalogo/:id` (detalle + talla)
- `/carrito`, `/checkout` (checkout simulado, requiere sesión)
- `/mis-pedidos` (historial del cliente logueado)
- `/admin` (solo rol admin: CRUD de zapatillas con imagen, gestión de pedidos)
- `/login`, `/registro`

## Despliegue en Vercel

1. Nuevo proyecto apuntando a este repositorio, con "Root Directory" = `frontend`.
2. Framework preset: Vite (autodetectado). Build command: `npm run build`. Output directory: `dist`.
3. Variable de entorno: `VITE_API_URL` apuntando a la URL pública del backend en Render (en producción: `https://proyecto-final-7ojh.onrender.com/api`).
4. `vercel.json` ya incluye el rewrite necesario para que las rutas de React Router no den 404 al recargar.
5. Actualiza `CORS_ORIGIN` en el backend desplegado (Render) para incluir el dominio de Vercel — recuerda que los preview deployments de Vercel tienen dominios distintos cada vez, así que puede que necesites una lista separada por comas o un patrón más permisivo.
