# Cloudflare Template

A modern, customizable business website template built on Cloudflare's edge platform.

## Features

- **First-Run Setup Wizard** - Configure your site in minutes (production only)
- **Provisioning Handoff** - Setup generates email with commands for admin
- **Admin Confirmation** - `/admin/provision` to activate the site
- **Local Dev Mode** - Mock data for testing without DB
- **AI Layout Assistant** - Generate content from business description
- **Dynamic Branding** - Change colors, logo, and content
- **Email Notifications** - Resend integration for lead alerts

## Tech Stack

- [Remix](https://remix.run) - Full-stack React framework
- [Cloudflare Workers](https://workers.cloudflare.com) - Edge runtime
- [D1](https://developers.cloudflare.com/d1/) - SQLite database
- [Workers AI](https://developers.cloudflare.com/workers-ai/) - AI generation
- [Drizzle ORM](https://orm.drizzle.team) - TypeScript ORM
- [Tailwind CSS](https://tailwindcss.com) - Styling

## Quick Start

### Local Development (Mock Data)

```bash
npm install
npm run dev
```

This runs with **mock data** - no database needed. You'll see a demo site with "Acme Corporation" branding.

### Production Deployment

1. **Deploy to Cloudflare**:

   ```bash
   npm run deploy
   ```

2. **Customer completes Setup Wizard** at `/setup`

3. **Customer clicks "Send Provisioning Request"** - opens email with commands

4. **Admin runs commands**:

   ```bash
   # Create database
   wrangler d1 create cloudflare-template-db

   # Update wrangler.toml with database_id

   # Run migrations
   wrangler d1 execute cloudflare-template-db --remote --file=./drizzle/0000_initial.sql

   # (Optional) Set email API key
   wrangler secret put RESEND_API_KEY
   ```

5. **Admin confirms** at `/admin/provision`

6. **Site goes live!**

## Development

| Command                | Description                               |
| ---------------------- | ----------------------------------------- |
| `npm run dev`          | Start with mock data (local testing)      |
| `npm run dev:wrangler` | Start with D1 binding (test setup wizard) |
| `npm run build`        | Production build                          |
| `npm run deploy`       | Deploy to Cloudflare                      |

## Project Structure

```
├── app/
│   ├── components/     # UI components
│   ├── context/        # BrandingContext
│   ├── lib/            # Server utilities, mock data
│   ├── routes/
│   │   ├── setup.tsx         # Setup wizard
│   │   ├── setup.pending.tsx # Waiting for provisioning
│   │   ├── admin.provision.tsx # Admin confirmation
│   │   └── _index.tsx        # Landing page
│   └── styles/
├── db/
│   └── schema.ts       # Drizzle schema
└── wrangler.toml       # Cloudflare config
```

## Flow Diagram

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Customer  │     │    Admin    │     │    Site     │
│  completes  │────▶│   gets      │────▶│   goes      │
│   /setup    │     │   email     │     │   live      │
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                    Runs wrangler
                    commands, then
                    /admin/provision
```

## Configuration

### Admin Email

Edit `app/routes/setup.pending.tsx`:

```typescript
const ADMIN_EMAIL = "your-email@example.com";
```

### Mock Data

Edit `app/lib/mock-config.ts` to customize local development data.

## License

MIT
