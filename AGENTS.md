> **Note:** `../00_Config_and_AI_Rules` is always tagged and must be loaded before any work begins.

# 02 EJS Components

Server-rendered multi-page website themes built with Node.js, Express, EJS, and Tailwind CSS 4.

---

## Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 20+ |
| Server | Express 4 |
| Templates | EJS 3 + express-ejs-layouts |
| Styles | Tailwind CSS 4 (PostCSS pipeline) |
| Language | TypeScript 5 |
| Icons | Font Awesome 6 Free (CDN) |

---

## Project Structure

```
02_EJS_Components/
├── src/
│   ├── server.ts              ← Entry point
│   ├── app.ts                 ← Express setup, middleware, routes
│   ├── routes/
│   │   ├── index.ts           ← Showcase homepage (/)
│   │   ├── themes.ts          ← Theme route aggregator (/theme/*)
│   │   └── themes/            ← One router file per theme
│   │       └── <vertical>.ts
│   ├── data/
│   │   ├── showcase.ts        ← Theme registry (ThemeMeta list)
│   │   └── <vertical>.data.ts ← Static sample data per theme
│   └── types/
│       └── index.ts           ← Shared TypeScript types
├── views/
│   ├── layouts/
│   │   ├── main.ejs           ← Default layout (navbar + footer)
│   │   └── blank.ejs          ← Bare layout (no nav/footer)
│   ├── partials/
│   │   ├── head.ejs           ← <head> element
│   │   ├── navbar.ejs         ← Top navigation bar
│   │   └── footer.ejs         ← Site footer
│   ├── showcase/
│   │   └── index.ejs          ← Theme listing page
│   ├── themes/
│   │   └── <vertical>/        ← EJS views per theme
│   │       ├── index.ejs      ← Theme homepage
│   │       └── *.ejs          ← Additional pages
│   └── 404.ejs
├── public/
│   ├── css/
│   │   ├── input.css          ← Tailwind source + design tokens
│   │   └── main.css           ← Compiled output (git-ignored)
│   └── js/
│       └── main.js            ← Dark mode toggle, shared JS
├── package.json
├── tsconfig.json
├── postcss.config.mjs
└── AGENTS.md
```

---

## Theme Architecture

Each theme is a self-contained multi-page website demo for a specific vertical (e.g. landing page, blog, portfolio, corporate site).

### Theme Types

| Type | Description | Typical pages |
|------|-------------|--------------|
| `landing` | Single-page marketing site | `/` |
| `blog` | Content publishing site | `/`, `/posts`, `/posts/:slug` |
| `portfolio` | Creative/professional showcase | `/`, `/projects`, `/projects/:slug`, `/about` |
| `corporate` | Business / company site | `/`, `/about`, `/services`, `/contact` |
| `docs` | Documentation / knowledge base | `/`, `/docs/:section/:slug` |
| `dashboard` | Admin-style data overview | `/`, `/dashboard/*` |

### Adding a New Theme

1. **Create views**: `views/themes/<vertical>/index.ejs` (and any sub-pages).

2. **Create data file**: `src/data/<vertical>.data.ts` with all static sample data.

3. **Create route file**: `src/routes/themes/<vertical>.ts`
   ```typescript
   import { Router } from 'express';
   import { myData } from '../../data/<vertical>.data';

   const router = Router();

   router.get('/', (req, res) => {
     res.render('themes/<vertical>/index', {
       layout: 'layouts/blank', // or 'layouts/main'
       title: 'Theme Title',
       data: myData,
     });
   });

   export default router;
   ```

4. **Register the router** in `src/routes/themes.ts`:
   ```typescript
   import verticalRouter from './themes/<vertical>';
   router.use('/<vertical>', verticalRouter);
   ```

5. **Register metadata** in `src/data/showcase.ts` by adding a `ThemeMeta` entry.

### Theme Rules

1. **Layouts**: Use `layout: 'layouts/blank'` for themes with a self-contained header/footer. Use `layout: 'layouts/main'` for showcase-framed demos.
2. **Data**: All sample data goes in `src/data/<vertical>.data.ts`, not inside route files or views.
3. **Static data only**: No real API calls or database queries — themes use static TypeScript data.
4. **Pass data as locals**: Routes import data and pass it to `res.render()`. Views only receive locals.

---

## EJS Conventions

### Locals pattern

Every `res.render()` call should pass:
```typescript
res.render('view/path', {
  title: 'Page Title',      // used in <head>
  layout: 'layouts/main',   // optional override
  // ...page-specific data
});
```

### Including partials

```ejs
<%- include('../../partials/head') %>
```

Paths are relative to the current view file.

### Escaping

- `<%= value %>` — HTML-escaped output (always prefer this for user-facing data)
- `<%- html %>` — raw unescaped output (only for trusted EJS includes / pre-built HTML)
- `<% code %>` — logic, no output

### Layout override per view

A view can override the default layout by setting `layout` in locals (done in the route), or by using the `express-ejs-layouts` local at the top of the view:
```ejs
<% layout = 'layouts/blank' %>
```

---

## Design Tokens

CSS variables defined in `public/css/input.css`. Map 1:1 with `01_NextJS_Components` tokens.

| Token | Value (light) | Purpose |
|-------|--------------|---------|
| `--primary` | `#3b82f6` | Primary actions |
| `--primary-hover` | `#2563eb` | Hover state |
| `--primary-subtle` | `#eff6ff` | Tinted backgrounds |
| `--primary-fg` | `#ffffff` | Text on primary |
| `--secondary` | `#8b5cf6` | Secondary actions |
| `--surface-base` | `#ffffff` | Page background |
| `--surface-raised` | `#f9fafb` | Cards |
| `--surface-overlay` | `#f3f4f6` | Hover overlays |
| `--surface-sunken` | `#e5e7eb` | Inset areas |
| `--text-primary` | `#111827` | Body text |
| `--text-secondary` | `#6b7280` | Muted text |
| `--border` | `#e5e7eb` | Default borders |
| `--border-focus` | `#3b82f6` | Focus rings |
| `--success` | `#22c55e` | Success state |
| `--warning` | `#f59e0b` | Warning state |
| `--error` | `#ef4444` | Error/danger state |
| `--info` | `#06b6d4` | Informational state |

Dark mode overrides are in the `.dark { }` block in the same file.

Use tokens as Tailwind utilities: `bg-primary`, `text-text-secondary`, `border-border-focus`, etc.

---

## Icons

Font Awesome Free loaded via CDN in `views/partials/head.ejs`.

```html
<i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
<i class="fa-brands fa-github" aria-hidden="true"></i>
```

Rules:
1. Always `aria-hidden="true"` on decorative icons.
2. Provide `aria-label` on icon-only interactive elements.
3. Do not use inline SVGs or other icon libraries.

---

## Development

```bash
npm install
npm run dev        # starts server + CSS watcher in parallel
```

- Server: `http://localhost:3000`
- CSS auto-recompiles on `public/css/input.css` changes
- Server auto-restarts on `src/**/*.ts` and `views/**/*.ejs` changes

### Build for production

```bash
npm run build      # compiles CSS then TypeScript → dist/
npm start          # runs dist/server.js
```

---

## File Naming Conventions

| What | Convention | Example |
|------|------------|---------|
| Route file | camelCase `.ts` | `themes/landing.ts` |
| Data file | camelCase `.data.ts` | `landing.data.ts` |
| View file | camelCase `.ejs` | `index.ejs`, `postDetail.ejs` |
| Partial | camelCase `.ejs` | `navbar.ejs`, `postCard.ejs` |
| Layout | camelCase `.ejs` | `main.ejs`, `blank.ejs` |
| Theme directory | lowercase | `landing/`, `blog/` |

---

## Adding Theme-Specific Partials

Reusable pieces within a theme live in `views/themes/<vertical>/partials/`:

```ejs
<%- include('../partials/hero') %>
<%- include('../partials/featureGrid') %>
```

These are theme-scoped and not shared across themes.
