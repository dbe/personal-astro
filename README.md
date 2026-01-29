# Personal Website - davidbrianethier.com

Personal portfolio website built with [Astro](https://astro.build), hosted on GitHub Pages.

## Overview

This site was migrated from a Rails 4.2 application to a static Astro site for simpler hosting and maintenance. The original Rails app required a Heroku dyno; this version runs entirely on GitHub Pages for free.

### Tech Stack

- **Framework:** Astro 5.x
- **Styling:** Bootstrap 5, SCSS
- **Hosting:** GitHub Pages
- **Domain:** davidbrianethier.com

## Development

### Prerequisites

- Node.js 22+
- npm

### Running Locally

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:4321)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

Deployment is automatic via GitHub Actions. Every push to `main` triggers a build and deploy.

### GitHub Actions Workflow

The workflow (`.github/workflows/deploy.yml`) runs on every push to `main`:
1. Checks out code
2. Installs dependencies
3. Builds with Astro
4. Deploys to GitHub Pages

### GitHub Pages Setup

1. Go to repo **Settings → Pages**
2. Set Source to **GitHub Actions**
3. Enter custom domain: `davidbrianethier.com`
4. Enable **Enforce HTTPS**

### DNS Configuration (Namecheap)

Configure these records in **Advanced DNS**:

| Type | Host | Value |
|------|------|-------|
| A Record | `@` | `185.199.108.153` |
| A Record | `@` | `185.199.109.153` |
| A Record | `@` | `185.199.110.153` |
| A Record | `@` | `185.199.111.153` |
| CNAME | `www` | `dbe.github.io.` |

The A records point the apex domain to GitHub Pages. The CNAME handles the www subdomain.

## Project Structure

```
├── public/
│   ├── CNAME              # Custom domain config
│   ├── resume.pdf         # Resume download
│   ├── robots.txt         # SEO
│   ├── images/
│   │   ├── career/        # Company logos
│   │   ├── projects/      # Project screenshots
│   │   └── emerge/        # Game assets
│   └── js/
│       ├── p5/            # P5.js demo scripts
│       ├── idle/          # Idle Dungeon game
│       └── emerge/        # Emerge game
├── src/
│   ├── components/
│   │   ├── LeftNav.astro      # Sidebar navigation
│   │   ├── Breadcrumb.astro   # Breadcrumb trail
│   │   └── CareerEntry.astro  # Career timeline entry
│   ├── layouts/
│   │   ├── MainLayout.astro       # Main site layout
│   │   ├── StandaloneLayout.astro # Games (no nav)
│   │   └── P5Layout.astro         # P5.js demos
│   ├── pages/
│   │   ├── index.astro            # About/Home
│   │   ├── contact.astro          # Contact
│   │   ├── 404.astro              # Error page
│   │   ├── idle.astro             # Idle Dungeon game
│   │   ├── emerge.astro           # Emerge game
│   │   ├── experience/
│   │   │   ├── career.astro       # Career timeline
│   │   │   └── projects/          # 10 project pages
│   │   └── p5/                    # 7 P5.js demos
│   └── styles/
│       ├── global.scss    # Main styles
│       └── p5.scss        # P5 demo styles
├── astro.config.mjs       # Astro configuration
└── package.json
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | About/Home page |
| `/contact` | Contact information |
| `/experience/career` | Career timeline |
| `/experience/projects` | Projects list |
| `/experience/projects/[slug]` | Individual project pages (10 total) |
| `/p5` | P5.js creative coding demos |
| `/p5/[demo]` | Individual demos (7 total) |
| `/idle` | Idle Dungeon game (standalone) |
| `/emerge` | Emerge game (standalone) |

## Migration Notes

This site was migrated from [dbe/personal](https://github.com/dbe/personal) (Rails 4.2.8, Ruby 2.7.7, HAML).

Key changes:
- HAML templates → Astro components
- Rails asset pipeline → Vite (via Astro)
- Heroku hosting → GitHub Pages
- CoffeeScript (Idle game) → JavaScript

The original Rails repo is preserved for reference.
