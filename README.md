# Cloudflare Template

A modern, customizable business website template built on Cloudflare's edge platform.

## Features

- **First-Run Setup Wizard** - Configure your site in minutes
- **AI Layout Assistant** - Generate content from business description
- **Dynamic Branding** - Change colors, logo, and content from admin
- **Email Notifications** - Resend integration for lead alerts
- **Edge Performance** - 0ms cold starts on Cloudflare Workers
- **Database Included** - D1 for data, no external services needed

## Tech Stack

- [Remix](https://remix.run) - Full-stack React framework
- [Cloudflare Workers](https://workers.cloudflare.com) - Edge runtime
- [D1](https://developers.cloudflare.com/d1/) - SQLite database
- [Workers AI](https://developers.cloudflare.com/workers-ai/) - AI generation
- [Drizzle ORM](https://orm.drizzle.team) - TypeScript ORM
- [Tailwind CSS](https://tailwindcss.com) - Styling

## Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/your-repo/cloudflare-template
cd cloudflare-template
npm install
```

### 2. Create D1 Database

```bash
wrangler d1 create cloudflare-template-db
```

Copy the `database_id` to `wrangler.toml`.

### 3. Run Migrations

```bash
npm run db:migrate
```

### 4. Start Development

```bash
npm run dev
```

Visit `http://localhost:5173/setup` to configure your site.

## Development

| Command                | Description                  |
| ---------------------- | ---------------------------- |
| `npm run dev`          | Start Vite dev server        |
| `npm run dev:wrangler` | Build + run with Wrangler    |
| `npm run setup`        | Migrate, seed, and start dev |
| `npm run seed`         | Seed database with test data |
| `npm run build`        | Production build             |
| `npm run deploy`       | Deploy to Cloudflare         |

## Project Structure

```
├── app/
│   ├── components/     # Reusable UI components
│   ├── context/        # React context (BrandingContext)
│   ├── lib/            # Server utilities
│   ├── routes/         # Remix routes
│   └── styles/         # Tailwind CSS
├── db/
│   └── schema.ts       # Drizzle schema
├── scripts/
│   ├── seed.ts         # Database seeding
│   └── seed-data.ts    # Mock data
└── wrangler.toml       # Cloudflare config
```

## Setup Wizard

On first run, the site redirects to `/setup` where you can:

1. **Business Info** - Name, tagline, industry
2. **Contact** - Email, phone, address
3. **Branding** - Colors with live preview

## Email Integration (Resend)

To enable lead email notifications:

```bash
wrangler secret put RESEND_API_KEY
# Paste your key from resend.com/api-keys
```

## AI Content Generation

Uses Workers AI (Llama 3) to generate:

- Taglines
- Hero headlines
- Service descriptions
- SEO descriptions

Call `/api/ai-generate` with a business description.

## Customization

### Colors

Colors are stored in `site_config` and applied via CSS custom properties:

```css
:root {
  --color-primary: #0ea5e9;
  --color-secondary: #1e293b;
}
```

### Templates

Industry presets in `app/lib/presets.ts` provide starting points.

## Deployment

```bash
# Set production secrets
wrangler secret put RESEND_API_KEY

# Deploy
npm run deploy
```

## License

MIT
