# eMarket — catálogo tipo Kyte (gratis)

Tienda/catálogo con **Next.js + TypeScript + Supabase + WhatsApp**.
Hosting en Vercel (plan Hobby) y base de datos en Supabase (Free).

## Qué incluye

- Catálogo público con filtros (estado, categoría) y orden
- Detalle de producto
- Pedido por WhatsApp con mensaje prellenado
- Admin protegido: crear/editar, subir foto, marcar vendido

## 1. Supabase (gratis)

1. Crea un proyecto en [supabase.com](https://supabase.com)
2. Ve a **SQL Editor** y ejecuta todo el archivo
   [`supabase/schema.sql`](supabase/schema.sql)
3. En **Authentication → Users**, crea un usuario (email + password)
   para el admin
4. Copia en **Project Settings → API**:
   - Project URL
   - `anon` `public` key

## 2. Variables de entorno

Copia `.env.example` a `.env.local` y completa:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
WHATSAPP_NUMBER=591XXXXXXXX
NEXT_PUBLIC_STORE_NAME=eMarket
NEXT_PUBLIC_CURRENCY=BOB
```

`WHATSAPP_NUMBER` va **sin** `+` ni espacios (código de país + número).
Se lee en el servidor en cada visita, así que al cambiarlo
en Vercel basta con redesplegar.

## 3. Desarrollo local

```bash
cd emarket
yarn install
yarn dev
```

Abre [http://localhost:3000](http://localhost:3000)  
Admin: [http://localhost:3000/admin](http://localhost:3000/admin)

## 4. Deploy en Vercel (gratis)

1. Sube el repo a GitHub (o importa la carpeta `emarket`)
2. En [vercel.com](https://vercel.com) → **Add New Project**
3. Root Directory: `emarket` (si el repo es el padre)
4. Framework: Next.js (auto)
5. Añade las mismas variables de `.env.local` en
   **Project Settings → Environment Variables**
6. Deploy

URL típica: `https://tu-proyecto.vercel.app`

## Checklist de uso diario

1. Llega el artículo (Amazon u otro)
2. Entra a `/admin` → **Nuevo producto**
3. Sube foto, precio, talla/medidas → Guardar
4. Cuando se venda por WhatsApp → **Marcar vendido**
5. El catálogo público se actualiza solo

## Scripts

| Comando      | Uso              |
| ------------ | ---------------- |
| `yarn dev`   | Desarrollo       |
| `yarn build` | Build producción |
| `yarn start` | Servir build     |
| `yarn lint`  | ESLint           |

## Límites del plan gratis

- **Vercel Hobby**: suficiente para empezar
- **Supabase Free**: el proyecto puede pausarse si no hay uso;
  se reactiva al abrir el dashboard
- Primer gasto opcional: dominio propio (~10–15 USD/año)
