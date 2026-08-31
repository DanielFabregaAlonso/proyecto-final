# Kickz

Kickz es una tienda online de zapatillas deportivas multi-marca (Nike, Adidas, Puma, New Balance, Asics, Vans, Converse, Reebok, Under Armour, Jordan...). Proyecto final FullStack: backend REST propio + frontend SPA, ambos con despliegue independiente.

Dos perfiles de usuario:
- **Cliente**: busca por marca/categoría/talla, ve stock real por talla, compra (checkout simulado) y consulta su historial de pedidos.
- **Admin**: gestiona el catálogo (alta/edición/baja de zapatillas, incluida la foto de producto) y el estado de los pedidos.

## Arquitectura

Monorepo con dos proyectos independientes, cada uno con su propio `package.json`, `.env` y README de arranque:

```
proyecto final/
├── backend/     # API REST (Express + Mongoose + MongoDB Atlas) — despliegue en Render
└── frontend/    # SPA (React + Vite + Tailwind CSS) — despliegue en Vercel
```

- **[backend/README.md](backend/README.md)** — instalación, variables de entorno, generación de la base de datos desde Excel, rutas de la API, despliegue en Render.
- **[frontend/README.md](frontend/README.md)** — instalación, variables de entorno, páginas de la app, despliegue en Vercel.

## Stack técnico

**Backend:** Node.js, Express 5, Mongoose, MongoDB Atlas, JWT (`jsonwebtoken` + `bcryptjs`), Cloudinary + `multer` (subida de imágenes), `exceljs` (semilla de datos desde Excel), `dotenv`, `cors`, `morgan`.

**Frontend:** React 18, Vite, React Router v7, Tailwind CSS v3, `fetch` nativo (sin librerías HTTP externas), Context API + `useReducer` para estado global (auth, carrito, notificaciones).

## Modelo de datos

Tres colecciones relacionadas en MongoDB:
- **`User`** — `name`, `email`, `passwordHash`, `role` (`cliente` | `admin`).
- **`Sneaker`** — catálogo: `sku`, `name`, `brand`, `category`, `gender`, `price`, `color`, `sizes: [{size, stock}]` (stock por talla, no global), `images`, `featured`.
- **`Order`** — referencia a `User` y a `Sneaker` dentro de `items`; `shippingAddress`, `status` (`pendiente` | `pagado` | `enviado` | `entregado` | `cancelado`), `total`.

La base de datos se genera a partir de un Excel real (`backend/seed/data/kickz-data.xlsx`, tres hojas: `users`, `sneakers`, `orders`) — ver el flujo completo en [backend/README.md](backend/README.md#configuración-local).

## Arranque rápido en local

Backend y frontend se arrancan por separado, cada uno desde su propia carpeta:

```bash
# Terminal 1 — backend
cd backend
npm install
cp .env.example .env   # rellena MONGODB_URI, JWT_SECRET, credenciales de Cloudinary
npm run generate:data  # genera seed/data/kickz-data.xlsx
npm run seed            # siembra MongoDB desde ese Excel
npm run dev              # http://localhost:4000

# Terminal 2 — frontend
cd frontend
npm install
cp .env.example .env   # VITE_API_URL=http://localhost:4000/api por defecto
npm run dev              # http://localhost:5173
```

## Usuarios de prueba (tras `npm run seed`)

- **Admin:** `admin@kickz.com` / `Admin1234!`
- **Cliente:** cualquier email generado en la hoja `users` del Excel de semilla, contraseña `Cliente1234!`

## Despliegue

- **Backend → Render**: Root Directory `backend`, build `npm install`, start `npm start`. Detalles en [backend/README.md](backend/README.md#despliegue-en-render).
- **Frontend → Vercel**: Root Directory `frontend`, variable `VITE_API_URL` apuntando al backend en Render. Detalles en [frontend/README.md](frontend/README.md#despliegue-en-vercel).

Tras desplegar, recuerda actualizar `CORS_ORIGIN` en el backend (Render) para incluir el dominio final de Vercel.

## Decisiones de diseño

- **Checkout simulado**: no hay pasarela de pago; el pedido se crea directamente en estado `pagado`.
- **Sin tests automatizados**: verificación manual documentada en cada README, decisión explícita para centrar el esfuerzo en funcionalidad, modelo de datos y UX/UI.
- **Stock por talla**: nunca un número global de stock, siempre `sizes: [{size, stock}]`.
