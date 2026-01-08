# ⚡ Cloudflare Remix Template

A stunning, production-ready GitHub template for building modern web applications with **Remix**, **Cloudflare Workers**, and a beautiful **shadcn-style** component library.

![Remix](https://img.shields.io/badge/Remix-2.15-blue?style=flat-square)
![Cloudflare](https://img.shields.io/badge/Cloudflare-Workers-orange?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat-square)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat-square)

## ✨ Features

- **🎨 19+ UI Components** - Beautiful, accessible components built on Radix UI
- **⚡ Edge Deployment** - Deploy globally on Cloudflare Workers
- **🗃️ Drizzle ORM** - Type-safe database queries with D1
- **🌙 Dark Mode** - Light and dark themes with CSS variables
- **📱 Responsive** - Mobile-first design throughout
- **🔒 Type Safe** - Full TypeScript with strict mode
- **📊 Admin Dashboard** - Ready-to-customize admin interface

## 🚀 Quick Start

### 1. Use This Template

Click "Use this template" on GitHub, or:

```bash
git clone https://github.com/mxrcochxvez/cloudflare-template.git my-app
cd my-app
npm install
```

### 2. Start Development

```bash
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173)

### 3. Deploy to Cloudflare

```bash
npm run deploy
```

## 📁 Project Structure

```
├── app/
│   ├── components/
│   │   └── ui/           # shadcn-style components
│   ├── lib/              # Utilities & database
│   ├── routes/           # Remix routes
│   │   ├── _index.tsx    # Landing page
│   │   ├── admin.tsx     # Admin layout
│   │   └── admin.*.tsx   # Admin pages
│   └── styles/           # CSS & Tailwind
├── db/
│   └── schema.ts         # Drizzle ORM schema
├── wrangler.toml         # Cloudflare config
└── package.json
```

## 🎨 Component Library

All components are in `app/components/ui/`. They follow shadcn conventions—copy, paste, and own your code.

### Primitives

- `Button` - 6 variants, 4 sizes
- `Card` - Header, Title, Description, Content, Footer
- `Input` - Styled with focus states
- `Badge` - 6 variants including success/warning
- `Avatar` - Image with fallback
- `Skeleton` - Loading placeholders

### Layout

- `Container` - Responsive max-width wrapper
- `Section` - Page sections with variants
- `Hero` - Full-width hero sections
- `Grid` - Responsive grid layouts

### Feedback

- `Alert` - Info, success, warning, error
- `Dialog` - Modal dialogs

### Navigation

- `Tabs` - Radix-based tabs
- `Navbar` - Site navigation
- `Sidebar` - Admin sidebar

## 🗃️ Database Setup

This template uses Drizzle ORM with Cloudflare D1. The database is **not configured by default**—follow these steps:

### 1. Create a D1 Database

```bash
wrangler d1 create my-database
```

### 2. Update wrangler.toml

Copy the `database_id` from step 1 and uncomment the D1 config:

```toml
[[d1_databases]]
binding = "DB"
database_name = "my-database"
database_id = "your-database-id-here"
```

### 3. Define Your Schema

Edit `db/schema.ts`:

```typescript
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const posts = sqliteTable("posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  content: text("content"),
});
```

### 4. Generate & Apply Migrations

```bash
# Generate migrations from schema
npm run db:generate

# Apply to local database
npm run db:migrate

# Apply to production
npm run db:migrate:prod
```

### 5. Query Your Database

```typescript
import { getDb, posts } from "~/lib/db.server";

export async function loader({ context }: LoaderFunctionArgs) {
  const db = getDb(context.cloudflare.env.DB);
  const allPosts = await db.select().from(posts);
  return json({ posts: allPosts });
}
```

## 🛠️ Development Scripts

| Command                   | Description                     |
| ------------------------- | ------------------------------- |
| `npm run dev`             | Start dev server                |
| `npm run build`           | Build for production            |
| `npm run deploy`          | Build and deploy to Cloudflare  |
| `npm run db:generate`     | Generate migrations from schema |
| `npm run db:migrate`      | Apply migrations locally        |
| `npm run db:migrate:prod` | Apply migrations to production  |
| `npm run db:studio`       | Open Drizzle Studio             |

## 🎯 Customization

### Colors

Edit CSS variables in `app/styles/tailwind.css`:

```css
:root {
  --primary: 199 89% 48%;
  --secondary: 210 40% 96.1%;
  /* ... */
}
```

### Components

All components in `app/components/ui/` are yours to modify. They use:

- **class-variance-authority** for variants
- **tailwind-merge** for class merging
- **Radix UI** for accessibility

### Adding Components

Need more components? Visit [ui.shadcn.com](https://ui.shadcn.com) and adapt components for Remix (change `@/` imports to `~/`).

## 📝 Environment Variables

For development, create `.dev.vars`:

```
RESEND_API_KEY=re_xxxxxxxxxxxx
```

For production, use Wrangler:

```bash
wrangler secret put RESEND_API_KEY
```

## 📄 License

MIT © Your Name

---

**Made with ❤️ for the Cloudflare + Remix community**
