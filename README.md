# QA Mafenic System - Frontend

Aplicación frontend en React para gestionar el flujo de QA (tickets, usuarios y dashboard) del sistema **QA Mafenic**.

---

## Tecnologías

- React
- TypeScript
- React Router
- CSS / Reactstrap / MUI (según lo que uses)
- Integración con backend NestJS (API de tickets y auth)

---

## Estructura principal del proyecto

- `public/`
- `src/`
  - `Auth/` → lógica de autenticación (login, helpers, etc.)
  - `components/` → componentes reutilizables
  - `environment/` → configuración de entorno (URLs, etc.)
  - `interfaces/` → tipos e interfaces TypeScript compartidos
  - `pages/`
    - `404/` → página de no encontrado
    - `Home/`
      - `dashboard/`
      - `Ticket/`
        - `Modals/` → modales para crear/editar ticket
      - `User/`
        - `Modals/` → modales para crear/editar usuario
      - `Login/`
  - `router/` → configuración de rutas
  - `service/` → llamadas a la API (auth, tickets, usuarios)
  - `App.tsx` / `index.tsx` → entrada principal de la app
- `README.md` → este archivo

---

## Instalación

Instala las dependencias:

    npm install
    # o
    yarn install

Configura las variables de entorno (si aplican), por ejemplo:

- `REACT_APP_API_URL` → URL base del backend NestJS

En un archivo `.env`:

    REACT_APP_API_URL=http://localhost:3000

---

## Scripts disponibles

Iniciar el proyecto en modo desarrollo:

    npm start
    # o
    yarn start

Construir la app para producción:

    npm run build
    # o
    yarn build

Ejecutar tests:

    npm test
    # o
    yarn test

---

## Rutas principales (React Router)

Las rutas están configuradas usando un layout principal:

    <Route element={<Layout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/setting-user" element={<User />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/custom-tickect" element={<Ticket />} />
    </Route>

Resumen de rutas:

- `/home` → Página principal / Home
- `/setting-user` → Administración de usuarios
- `/dashboard` → Dashboard de QA (métricas, gráficos, etc.)
- `/custom-tickect` → Gestión de tickets QA

> Nota: No hay problema de seguridad por documentar estas rutas en el README; la seguridad se maneja con autenticación/autorización y validación en el backend, no ocultando URLs.

---

## Integración con el backend

El frontend consume la API del backend NestJS (QA Mafenic System).  
Ejemplos típicos de servicios (ubicados en `src/service`):

- Autenticación: login, obtención de usuario actual.
- Usuarios: listar, crear, actualizar, desactivar.
- Tickets: listar, crear, actualizar, cambiar estado.

Cada servicio usa la URL base definida en `REACT_APP_API_URL`.

---

## Deploy

Para desplegar en producción:

1. Construir la app:

       npm run build
       # o
       yarn build

2. Servir el contenido de la carpeta `build/` con cualquier servidor estático (Nginx, Apache, Vercel, Netlify, etc.).

---
