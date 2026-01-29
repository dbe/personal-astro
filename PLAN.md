# Personal Website Migration: Rails to Astro

## Overview

This plan converts the existing Rails portfolio site (https://github.com/dbe/personal) to a static Astro site hosted on GitHub Pages with custom domain `davidbrianethier.com`.

### Source Repository
- **Repo:** `dbe/personal`
- **Stack:** Rails 4.2.8, Ruby 2.7.7, HAML, Bootstrap, SCSS
- **Content:** ~15 static pages, P5.js demos, resume PDF, career/project images

### Target Repository
- **Repo:** `dbe/personal-astro`
- **Stack:** Astro 5.x, Bootstrap 5, SCSS
- **Hosting:** GitHub Pages (free)
- **Domain:** `davidbrianethier.com`

---

## Content Inventory

### Pages to Migrate

| Route | Source File | Description |
|-------|-------------|-------------|
| `/` | `about.html.haml` | Homepage/About |
| `/contact` | `contact.html.haml` | Contact info |
| `/experience` | `experience.html.haml` | Experience landing |
| `/experience/career` | `career.html.haml` | Career timeline |
| `/experience/projects` | `all.html.haml` | Projects list |
| `/experience/projects/amazon-bitcoins` | `amazon_bitcoins.html.haml` | Project page |
| `/experience/projects/burner-wallet` | `burner_wallet.html.haml` | Project page |
| `/experience/projects/chess-chat-bot` | `chess_chat_bot.html.haml` | Project page |
| `/experience/projects/connect4-bot-platform` | `connect4_bot_platform.html.haml` | Project page |
| `/experience/projects/eth-rip` | `eth_rip.html.haml` | Project page |
| `/experience/projects/rippld` | `rippld.html.haml` | Project page |
| `/experience/projects/saigon-tiger` | `saigon_tiger.html.haml` | Project page |
| `/experience/projects/solidcoin` | `solidcoin.html.haml` | Project page |
| `/experience/projects/touchpoints` | `touchpoints.html.haml` | Project page |
| `/experience/projects/traveljoy` | `traveljoy.html.haml` | Project page |
| `/resume` | N/A | Direct link to PDF |
| `/p5` | `p5.html.haml` | P5.js demo list |
| `/p5/[demo]` | `p5.html.haml` + JS | 7 individual demos |
| `/idle` | `idle.html.haml` | Standalone game (no layout) |
| `/emerge` | `emerge.html.haml` | Standalone game (no layout) |

### Assets to Migrate

| Category | Source Path | Files |
|----------|-------------|-------|
| Career logos | `app/assets/images/career/` | 10 PNG images |
| Project images | `app/assets/images/projects/` | 10 images (PNG/JPG/GIF) |
| Emerge game | `app/assets/images/emerge/` | 2 PNG images |
| Profile images | `app/assets/images/` | profile.png, profile-circle.png |
| Social icons | `app/assets/images/` | GitHub-Mark-*.png, linkedin-*.png |
| Resume | `public/resume.pdf` | PDF file |
| P5 demos | `app-js/p5/*/app.js` | 7 JavaScript files |
| Idle game | `app/assets/javascripts/idle/` | JavaScript files |
| Emerge game | `app/assets/javascripts/emerge/` | JavaScript files |

### Styling

| Source | Target |
|--------|--------|
| Bootstrap (via gem) | Bootstrap 5 (npm) |
| `app/assets/stylesheets/home.scss` | `src/styles/home.scss` |
| `app/assets/stylesheets/p5.scss` | `src/styles/p5.scss` |
| Google Fonts (Roboto) | Same |

---

## Phase Breakdown

Each phase is designed to be executable by an independent agent with only this PLAN.md as context.

---

## Phase 1: Astro Project Scaffolding

**Goal:** Create a working Astro project with proper configuration for GitHub Pages deployment.

### Tasks

1. **Initialize Astro project**
   ```bash
   cd ~/code/personal/personal-astro
   npm create astro@latest . -- --template minimal --install --no-git
   ```

2. **Install dependencies**
   ```bash
   npm install sass bootstrap@5
   ```

3. **Configure `astro.config.mjs`**
   ```javascript
   import { defineConfig } from 'astro/config';

   export default defineConfig({
     site: 'https://davidbrianethier.com',
     output: 'static',
     build: {
       assets: 'assets'
     },
     vite: {
       css: {
         preprocessorOptions: {
           scss: {
             quietDeps: true
           }
         }
       }
     }
   });
   ```

4. **Create `public/CNAME`**
   ```
   davidbrianethier.com
   ```

5. **Create GitHub Actions workflow `.github/workflows/deploy.yml`**
   ```yaml
   name: Deploy to GitHub Pages

   on:
     push:
       branches: [main]
     workflow_dispatch:

   permissions:
     contents: read
     pages: write
     id-token: write

   jobs:
     build:
       runs-on: ubuntu-latest
       steps:
         - name: Checkout
           uses: actions/checkout@v4
         - name: Setup Node
           uses: actions/setup-node@v4
           with:
             node-version: 22
             cache: 'npm'
         - name: Install dependencies
           run: npm ci
         - name: Build with Astro
           uses: withastro/action@v3

     deploy:
       needs: build
       runs-on: ubuntu-latest
       environment:
         name: github-pages
         url: ${{ steps.deployment.outputs.page_url }}
       steps:
         - name: Deploy to GitHub Pages
           id: deployment
           uses: actions/deploy-pages@v4
   ```

6. **Create placeholder `src/pages/index.astro`**
   ```astro
   ---
   ---
   <html lang="en">
     <head>
       <meta charset="utf-8" />
       <title>Brian Ethier</title>
     </head>
     <body>
       <h1>Coming Soon</h1>
     </body>
   </html>
   ```

7. **Verify build works**
   ```bash
   npm run build
   ```

8. **Commit and push**
   ```bash
   git add -A
   git commit -m "Phase 1: Astro project scaffolding with GitHub Pages config"
   git push
   ```

### Success Criteria
- `npm run build` completes without errors
- `.github/workflows/deploy.yml` exists
- `public/CNAME` contains `davidbrianethier.com`
- `astro.config.mjs` has correct site URL

---

## Phase 2: Layout and Navigation Components

**Goal:** Create the main layout with left sidebar navigation matching the original site structure.

### Tasks

1. **Create base styles `src/styles/global.scss`**
   - Import Bootstrap CSS
   - Import Google Fonts (Roboto)
   - Port styles from `home.scss`:
     - `#main` container (margin: 30px)
     - `#left-nav` styling
     - `#nav-links` styling (font-weight: 300, color: rgba(0,0,0,.26))
     - `.selected` state styling
     - `#social-links` styling
     - `.horizontal-line` (border-bottom: 1px solid #FFAB91)
     - Typography (h1-h6 font-weight: 300)

2. **Create `src/components/LeftNav.astro`**
   - Profile image link to home
   - Navigation links:
     - About (`/`)
     - Contact (`/contact`)
     - Experience (`/experience`)
       - Career (`/experience/career`)
       - Projects (`/experience/projects`)
         - All (`/experience/projects`)
         - Individual project links (10 projects)
     - Resume (link to `/resume.pdf`, external)
     - Writing (external link to Medium)
   - Social links (GitHub, LinkedIn)
   - Accept `currentPath` prop to highlight active nav item
   - Implement nested nav visibility logic (show sub-items only when parent is active)

3. **Create `src/components/Breadcrumb.astro`**
   - Accept `items` prop: array of {label, href}
   - Render breadcrumb trail for experience pages

4. **Create `src/layouts/MainLayout.astro`**
   - HTML head with meta tags, title, Google verification
   - Import global styles
   - Bootstrap container-fluid structure
   - Left column (col-sm-3): LeftNav component
   - Right column (col-sm-9): slot for content
   - Conditional breadcrumb for `/experience/*` routes
   - Pass `Astro.url.pathname` to LeftNav for active state

5. **Create `src/layouts/StandaloneLayout.astro`**
   - Minimal layout for `/idle` and `/emerge` pages
   - No navigation, just content slot
   - Include necessary scripts

6. **Copy static assets to `public/`**
   - `public/images/profile-circle.png`
   - `public/images/GitHub-Mark-32px.png`
   - `public/images/linkedin-32px.png`
   - `public/resume.pdf`

7. **Update `src/pages/index.astro`**
   - Use MainLayout
   - Add placeholder "About" content

8. **Test navigation**
   ```bash
   npm run dev
   ```
   - Verify layout renders correctly
   - Verify navigation links work
   - Verify responsive behavior

9. **Commit**
   ```bash
   git add -A
   git commit -m "Phase 2: Layout and navigation components"
   git push
   ```

### Success Criteria
- MainLayout renders with left sidebar
- Navigation shows correct active states
- Responsive layout works (sidebar collapses on mobile)
- All navigation links point to correct paths

---

## Phase 3: Core Pages (About, Contact, Experience)

**Goal:** Migrate the main content pages.

### Tasks

1. **Migrate About page `src/pages/index.astro`**
   - Use MainLayout
   - Convert HAML content to Astro/HTML:
     - Hero heading: "My name is Brian Ethier and I express myself with code"
     - `.horizontal-line` divider
     - Bio paragraphs with internal links to projects
     - Project highlights list
   - Set page title

2. **Create Contact page `src/pages/contact.astro`**
   - Use MainLayout
   - Heading "Contact"
   - `.horizontal-line` divider
   - "I love email" section
   - Email: david.brian.ethier@gmail.com

3. **Create Experience landing `src/pages/experience/index.astro`**
   - Use MainLayout with breadcrumb
   - Simple heading "Experience"
   - Brief intro text

4. **Commit**
   ```bash
   git add -A
   git commit -m "Phase 3: Core pages (About, Contact, Experience)"
   git push
   ```

### Success Criteria
- Homepage displays full about content
- Contact page displays email
- Experience page displays heading
- All internal links work

---

## Phase 4: Career Page

**Goal:** Migrate the career timeline page with company logos.

### Tasks

1. **Copy career images to `public/images/career/`**
   - americanExpress-128px.png
   - cognizant.png
   - copilot-128px.png
   - dream.png
   - ethereum.png
   - harris-128px.png
   - philips-128px.png
   - rapleaf-128px.png
   - rubyOnRails-128px.png
   - uf-128px.png

2. **Add career styles to `src/styles/global.scss`**
   - `.career-row` (margin-bottom: 75px)
   - `.career-logo` (128x128, centered, with vertical line pseudo-element)
   - `.circle` (border-radius: 50%, positioned)
   - `.career-description.left` (float right, text-align right)
   - `.career-description.right` (float left, text-align left)
   - Media queries for responsive behavior

3. **Create `src/components/CareerEntry.astro`**
   - Props: company, role, description, years, technologies, logoSrc, hasCircle
   - Three-column layout matching original

4. **Create Career page `src/pages/experience/career.astro`**
   - Use MainLayout with breadcrumb
   - Career entries (in order):
     1. Ethereum - OSS Project Maintainer (2018-2019)
     2. Cognizant Accelerator - Staff Engineer (2017-2018)
     3. Dream - Founder (2014-Forever)
     4. Copilot Labs - Senior Software Engineer (2012-2014)
     5. Rails Bridge - Teacher (2012-2013)
     6. Rapleaf - Software Engineer (2010-2012)
     7. Harris Corporation - Engineering Intern (Summer 2010)
     8. Philips Healthcare - Engineering Co-Op (2009-2010)
     9. American Express - Engineering Intern (Summer 2009)
     10. University of Florida - Computer Science (2006-2010)

5. **Test vertical timeline alignment**
   - Verify connecting lines between entries
   - Verify responsive collapse

6. **Commit**
   ```bash
   git add -A
   git commit -m "Phase 4: Career timeline page"
   git push
   ```

### Success Criteria
- Career page displays all 10 entries
- Logos display correctly
- Vertical timeline line connects entries
- Responsive layout works

---

## Phase 5: Projects List and Project Pages

**Goal:** Migrate all project pages.

### Tasks

1. **Copy project images to `public/images/projects/`**
   - amazon-bitcoins.png
   - eth_rip.png
   - quick-connect-elo.png
   - quick-connect.gif
   - rippld-neo4j.png
   - rippld-website.png
   - saigon-tiger.png
   - solidcoin.jpeg
   - traveljoy.png
   - xdai.jpg

2. **Add project styles to `src/styles/global.scss`**
   - `.project-image img` (width: 90%)
   - `.project-image-caption` (padding: 10px, text-center)

3. **Create `src/components/ProjectPage.astro`**
   - Props: title, tools, imageSrc, imageCaption
   - Slot for main content
   - Standard project page layout

4. **Create Projects list `src/pages/experience/projects/index.astro`**
   - Use MainLayout with breadcrumb
   - Intro paragraph
   - Categorized project lists:
     - **Crypto:** Burner Wallet, ETH.RIP, Amazon Bitcoins, Solidcoin
     - **Consulting:** Rippld, Touchpoints, Travel Joy
     - **Misc:** Chess Chat Bot, Connect4 Bot Platform, Saigon Tiger

5. **Create individual project pages in `src/pages/experience/projects/`**

   Each page uses MainLayout with breadcrumb and contains converted HAML content:

   | File | Content Summary |
   |------|----------------|
   | `amazon-bitcoins.astro` | Bitcoin/Amazon gift card exchange |
   | `burner-wallet.astro` | Web crypto wallet, ETHDenver, $100k transacted |
   | `chess-chat-bot.astro` | Google Home chess by voice |
   | `connect4-bot-platform.astro` | AI bot battle platform |
   | `eth-rip.astro` | Artistic money burning project |
   | `rippld.astro` | Social network data modeling, Neo4j |
   | `saigon-tiger.astro` | Grocery delivery in Vietnam |
   | `solidcoin.astro` | Physical crypto coins |
   | `touchpoints.astro` | Sales retargeting tech stack |
   | `traveljoy.astro` | Travel SaaS performance optimization |

6. **Verify all internal links**
   - Check all links between project pages
   - Check links from about page to projects

7. **Commit**
   ```bash
   git add -A
   git commit -m "Phase 5: Projects list and all project pages"
   git push
   ```

### Success Criteria
- Projects index lists all projects with correct links
- All 10 project pages render correctly
- Images display on project pages
- Internal navigation works

---

## Phase 6: P5.js Demos

**Goal:** Migrate the P5.js creative coding demos.

### Tasks

1. **Create P5 styles `src/styles/p5.scss`**
   - Port from original p5.scss
   - Canvas styling

2. **Copy P5.js demo scripts**
   - Create `public/js/p5/` directory
   - Copy each demo's app.js:
     - `01_infinity_circles/app.js`
     - `02_a_random_walk/app.js`
     - `03_single_dropper/app.js`
     - `04_mouse_dropper/app.js`
     - `05/app.js`
     - `06/app.js`
     - `07/app.js`

3. **Create P5 demo layout `src/layouts/P5Layout.astro`**
   - Minimal layout (no main navigation)
   - Include p5.js from CDN
   - Include demo-specific script
   - Import p5 styles

4. **Create P5 index `src/pages/p5/index.astro`**
   - List of 7 demos with links
   - Simple standalone layout

5. **Create individual demo pages**
   - `src/pages/p5/01-infinity-circles.astro`
   - `src/pages/p5/02-a-random-walk.astro`
   - `src/pages/p5/03-single-dropper.astro`
   - `src/pages/p5/04-mouse-dropper.astro`
   - `src/pages/p5/05.astro`
   - `src/pages/p5/06.astro`
   - `src/pages/p5/07.astro`

   Each page:
   - Uses P5Layout
   - Loads corresponding app.js
   - Includes p5.js from CDN: `https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/p5.min.js`

6. **Test each demo**
   - Verify canvas renders
   - Verify interactivity works

7. **Commit**
   ```bash
   git add -A
   git commit -m "Phase 6: P5.js demos"
   git push
   ```

### Success Criteria
- P5 index page lists all demos
- Each demo page loads and runs correctly
- Canvas renders and responds to interaction

---

## Phase 7: Standalone Pages (Idle, Emerge)

**Goal:** Migrate the standalone game pages.

### Tasks

1. **Copy game assets**
   - `public/images/emerge/fish.png`
   - `public/images/emerge/food.png`
   - Copy idle game JavaScript to `public/js/idle/`
   - Copy emerge game JavaScript to `public/js/emerge/`

2. **Create Idle page `src/pages/idle.astro`**
   - Use StandaloneLayout
   - Heading "Idle Dungeon"
   - Canvas element (600x600)
   - Load idle game scripts

3. **Create Emerge page `src/pages/emerge.astro`**
   - Use StandaloneLayout
   - Heading "Emerge Game"
   - Load emerge game scripts

4. **Test games**
   - Verify idle game runs
   - Verify emerge game runs

5. **Commit**
   ```bash
   git add -A
   git commit -m "Phase 7: Standalone game pages (Idle, Emerge)"
   git push
   ```

### Success Criteria
- `/idle` page loads and game runs
- `/emerge` page loads and game runs
- No layout/navigation on these pages

---

## Phase 8: Final Polish and Deployment

**Goal:** Complete the migration with final touches and verify deployment.

### Tasks

1. **Add meta tags and SEO**
   - Update MainLayout with proper meta tags:
     - `<meta name="description" content="...">`
     - `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
     - Google site verification meta tag
   - Add page-specific titles using Astro.props

2. **Add favicon**
   - Copy `public/favicon.ico` from original

3. **Add robots.txt**
   - Copy or create `public/robots.txt`

4. **Create 404 page `src/pages/404.astro`**
   - Use MainLayout
   - Friendly "Page not found" message
   - Link back to home

5. **Optional: Add analytics**
   - If keeping MixPanel, add script to MainLayout head
   - Or integrate a privacy-friendly alternative

6. **Test full site locally**
   ```bash
   npm run build
   npm run preview
   ```
   - Navigate through all pages
   - Test all links
   - Test responsive behavior
   - Verify images load

7. **Enable GitHub Pages**
   - Go to repo Settings > Pages
   - Set Source to "GitHub Actions"

8. **Configure custom domain DNS**
   - At domain registrar, set:
     - `davidbrianethier.com` → A records to GitHub Pages IPs:
       - 185.199.108.153
       - 185.199.109.153
       - 185.199.110.153
       - 185.199.111.153
     - `www.davidbrianethier.com` → CNAME to `dbe.github.io`

9. **Verify deployment**
   - Push to main branch
   - Wait for GitHub Actions to complete
   - Visit https://davidbrianethier.com
   - Verify HTTPS works

10. **Final commit**
    ```bash
    git add -A
    git commit -m "Phase 8: Final polish, SEO, and deployment verification"
    git push
    ```

### Success Criteria
- Site accessible at https://davidbrianethier.com
- HTTPS enabled
- All pages load correctly
- No broken links or images
- Responsive on mobile

---

## File Structure (Final)

```
personal-astro/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── public/
│   ├── CNAME
│   ├── favicon.ico
│   ├── robots.txt
│   ├── resume.pdf
│   ├── images/
│   │   ├── profile-circle.png
│   │   ├── GitHub-Mark-32px.png
│   │   ├── linkedin-32px.png
│   │   ├── career/
│   │   │   └── [10 logo images]
│   │   ├── projects/
│   │   │   └── [10 project images]
│   │   └── emerge/
│   │       └── [2 game images]
│   └── js/
│       ├── p5/
│       │   └── [7 demo scripts]
│       ├── idle/
│       │   └── [idle game scripts]
│       └── emerge/
│           └── [emerge game scripts]
├── src/
│   ├── components/
│   │   ├── LeftNav.astro
│   │   ├── Breadcrumb.astro
│   │   ├── CareerEntry.astro
│   │   └── ProjectPage.astro
│   ├── layouts/
│   │   ├── MainLayout.astro
│   │   ├── StandaloneLayout.astro
│   │   └── P5Layout.astro
│   ├── pages/
│   │   ├── index.astro (About)
│   │   ├── contact.astro
│   │   ├── 404.astro
│   │   ├── experience/
│   │   │   ├── index.astro
│   │   │   ├── career.astro
│   │   │   └── projects/
│   │   │       ├── index.astro
│   │   │       ├── amazon-bitcoins.astro
│   │   │       ├── burner-wallet.astro
│   │   │       ├── chess-chat-bot.astro
│   │   │       ├── connect4-bot-platform.astro
│   │   │       ├── eth-rip.astro
│   │   │       ├── rippld.astro
│   │   │       ├── saigon-tiger.astro
│   │   │       ├── solidcoin.astro
│   │   │       ├── touchpoints.astro
│   │   │       └── traveljoy.astro
│   │   ├── p5/
│   │   │   ├── index.astro
│   │   │   ├── 01-infinity-circles.astro
│   │   │   ├── 02-a-random-walk.astro
│   │   │   ├── 03-single-dropper.astro
│   │   │   ├── 04-mouse-dropper.astro
│   │   │   ├── 05.astro
│   │   │   ├── 06.astro
│   │   │   └── 07.astro
│   │   ├── idle.astro
│   │   └── emerge.astro
│   └── styles/
│       ├── global.scss
│       └── p5.scss
├── astro.config.mjs
├── package.json
├── tsconfig.json
└── PLAN.md
```

---

## Notes for Agents

### Accessing Original Content

Clone the original repo to reference content:
```bash
git clone https://github.com/dbe/personal.git /tmp/personal-rails
```

Key source files:
- Views: `/tmp/personal-rails/app/views/home/*.html.haml`
- Layouts: `/tmp/personal-rails/app/views/layouts/*.html.haml`
- Styles: `/tmp/personal-rails/app/assets/stylesheets/*.scss`
- Images: `/tmp/personal-rails/app/assets/images/`
- P5 demos: `/tmp/personal-rails/app-js/p5/`
- Public files: `/tmp/personal-rails/public/`

### HAML to HTML Conversion

HAML syntax quick reference:
- `%tag` → `<tag></tag>`
- `%tag.class` → `<tag class="class"></tag>`
- `%tag#id` → `<tag id="id"></tag>`
- `%tag{attr: 'value'}` → `<tag attr="value"></tag>`
- `= ruby_code` → evaluate and output (convert to static content)
- `- ruby_code` → evaluate only (loops/conditionals - expand inline)
- `link_to 'text', '/path'` → `<a href="/path">text</a>`
- `image_tag 'path'` → `<img src="/images/path" />`

### Bootstrap Classes Used

The site uses Bootstrap 3 classes. For Bootstrap 5 compatibility:
- `col-sm-3` → same
- `col-md-12` → same
- `container-fluid` → same
- `row` → same
- `hidden-xs` → `d-none d-sm-block`
- `text-center` → same
- `list-unstyled` → same

### Working Directory

All work should be done in:
```
~/code/personal/personal-astro/
```

### Testing Commands

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
```
