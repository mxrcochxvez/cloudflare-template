# EdgeShop - Serverless Consulting Template

A production-ready Remix template for tech consulting businesses, optimized for Cloudflare Workers with 0ms cold starts.

## Tech Stack

- **Framework:** [Remix](https://remix.run) (via Vite)
- **Runtime:** [Cloudflare Workers](https://workers.cloudflare.com)
- **Database:** [Cloudflare D1](https://developers.cloudflare.com/d1/) (SQLite)
- **ORM:** [Drizzle ORM](https://orm.drizzle.team)
- **Styling:** [Tailwind CSS](https://tailwindcss.com)
- **AI:** [Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai/) (Llama 3)

## Features

- ⚡ **Zero Cold Starts** - Cloudflare Workers edge deployment
- 🗄️ **Serverless Database** - D1 with Drizzle ORM for type-safe queries
- 🤖 **AI Integration** - Text polishing API using Llama 3
- 📱 **Responsive Design** - Mobile-first Tailwind CSS
- 🔐 **Admin Dashboard** - Manage leads and site configuration
- 📝 **Contact Form** - Leads captured to D1 database
- 🎨 **Customizable Branding** - Dynamic primary color and business info

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) >= 20.0.0
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)
- A Cloudflare account

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/edgeshop.git
cd edgeshop

# Install dependencies
npm install
```

### Database Setup

1. Create a D1 database:

```bash
wrangler d1 create edgeshop-db
```

2. Copy the database ID from the output and update `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "edgeshop-db"
database_id = "YOUR_DATABASE_ID_HERE"  # ← Replace this
```

3. Generate and apply migrations:

```bash
# Generate migrations from schema
npm run db:generate

# Apply migrations locally
npm run db:migrate

# Apply migrations to production
npm run db:migrate:prod
```

### Development

```bash
# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Deployment

```bash
# Build the application
npm run build

# Deploy to Cloudflare Pages
npm run deploy
```

## Project Structure

```
├── app/
│   ├── components/       # Reusable UI components
│   ├── lib/              # Server utilities (db, env)
│   ├── routes/           # Remix routes
│   │   ├── _index.tsx    # Landing page
│   │   ├── admin.tsx     # Admin layout
│   │   ├── admin._index.tsx  # Dashboard
│   │   ├── admin.config.tsx  # Site settings
│   │   ├── admin.leads.tsx   # Lead management
│   │   └── api.ai-polish.ts  # AI API endpoint
│   └── styles/           # Tailwind CSS
├── db/
│   └── schema.ts         # Drizzle schema definitions
├── .workflows/           # AI agent audit workflows
│   ├── seo-audit.md      # SEO checklist
│   ├── a11y-check.md     # Accessibility checklist
│   ├── code-quality.md   # Code quality rules
│   └── code-review.md    # Code smell detection
├── drizzle/              # Generated migrations
├── wrangler.toml         # Cloudflare configuration
└── drizzle.config.ts     # Drizzle Kit configuration
```

## Environment Variables

For Drizzle Kit migrations to production, set these environment variables:

```bash
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_DATABASE_ID=your_database_id
CLOUDFLARE_D1_TOKEN=your_api_token
```

## API Endpoints

### POST `/api/ai-polish`

Polish rough text into marketing copy using AI.

**Request:**

```json
{
  "text": "We sell good coffee"
}
```

**Response:**

```json
{
  "polished": "Experience our artisanal, hand-crafted coffee...",
  "originalLength": 19,
  "polishedLength": 48
}
```

## Admin Access

Visit `/admin` to access the admin dashboard. In development mode, authentication is bypassed.

> ⚠️ **Production Note:** Implement proper authentication before deploying. Consider using [Cloudflare Access](https://developers.cloudflare.com/cloudflare-one/applications/configure-apps/) for zero-trust security.

## Agentic Workflows

The `.workflows/` directory contains markdown checklists for AI agents to audit the codebase:

| Workflow          | Purpose                                  |
| ----------------- | ---------------------------------------- |
| `seo-audit.md`    | SEO best practices verification          |
| `a11y-check.md`   | WCAG 2.1 AA accessibility compliance     |
| `code-quality.md` | TypeScript strictness and best practices |
| `code-review.md`  | Code smell and antipattern detection     |

## Scripts

| Script                    | Description                    |
| ------------------------- | ------------------------------ |
| `npm run dev`             | Start development server       |
| `npm run build`           | Build for production           |
| `npm run deploy`          | Deploy to Cloudflare           |
| `npm run typecheck`       | Run TypeScript checks          |
| `npm run lint`            | Run ESLint                     |
| `npm run db:generate`     | Generate Drizzle migrations    |
| `npm run db:migrate`      | Apply migrations locally       |
| `npm run db:migrate:prod` | Apply migrations to production |
| `npm run db:studio`       | Open Drizzle Studio            |

## License

MIT
