# Kickz — Backend

API REST para Kickz, una tienda online de zapatillas deportivas. Construida con Express 5, Mongoose (MongoDB Atlas), autenticación JWT con roles (`cliente`/`admin`), y subida de imágenes de producto a Cloudinary.

## Requisitos

- Node.js 18+
- Una base de datos MongoDB Atlas
- Una cuenta de Cloudinary (gratuita) para las imágenes de producto

## Configuración local

1. `npm install`
2. Copia `.env.example` a `.env` y rellena `MONGODB_URI`, `JWT_SECRET`, `CORS_ORIGIN` y las credenciales de Cloudinary.
3. Genera el Excel de datos de semilla y carga la base de datos:
   ```bash
   npm run generate:data
   npm run seed
   ```
   `npm run generate:data` crea `seed/data/kickz-data.xlsx`, un único Excel con tres hojas (`users`, `sneakers`, `orders`). `npm run seed` lee ese Excel directamente (con `exceljs`) y siembra las tres colecciones en MongoDB, en ese orden (`users` y `sneakers` son independientes, `orders` referencia a ambas por email y SKU).
4. Arranca el servidor en modo desarrollo:
   ```bash
   npm run dev
   ```
   La API queda disponible en `http://localhost:4000`. Compruébalo con `GET /api/health`.

## Usuarios de prueba (tras `npm run seed`)

- Admin: `admin@kickz.com` / `Admin1234!`
- Cliente: cualquiera de los emails generados en la hoja `users` de `seed/data/kickz-data.xlsx` (todos usan la contraseña `Cliente1234!`)

## Rutas principales

- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- `GET /api/sneakers`, `GET /api/sneakers/:id` (públicas), `POST` / `PUT` / `DELETE` (solo admin)
- `POST /api/orders` (checkout, solo cliente), `GET /api/orders/mine` (solo cliente), `GET /api/orders` y `PATCH /api/orders/:id/status` (solo admin)

## Despliegue en Render

API en producción: https://proyecto-final-7ojh.onrender.com/api

1. Nuevo Web Service apuntando a este repositorio, con "Root Directory" = `backend`.
2. Build command: `npm install`. Start command: `npm start`.
3. Variables de entorno: las mismas que `.env` (`MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CORS_ORIGIN`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`), con `CORS_ORIGIN` apuntando al dominio final de Vercel.
4. La semilla (`npm run seed`) se ejecuta una única vez desde local, apuntando al mismo `MONGODB_URI` que usará Render.
