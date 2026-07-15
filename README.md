# Spot Booking — Spa Partner (Angular)

A polished, fully responsive **salon & spa management dashboard** built in **Angular 21**
(standalone components, zoneless, lazy-loaded routes). Plum & Cream design system.
Recreated from a C# reference app — same flow, same page names, refined UI.

All data is **dummy in-memory data** (see `src/app/core/data.ts`). Every page and action
works locally. When you're ready, swap the `DataStore` signals for real API calls.

## Run it

```bash
npm install
npm start          # dev server at http://localhost:4200
```

## Build for production

```bash
npm run build      # output in dist/spa-partner/browser
```

## Pages / flow

Main: Dashboard · Daily Bookings · Slot Management · Services & Packages · Offers
People: Customers · Staff & Roster · Chat & Calls
Insights: Notifications · Reports · Reviews · Settings

## Structure

```
src/
  index.html            Google Fonts (Manrope / DM Serif Display / JetBrains Mono)
  styles.scss           Plum & Cream design system (tokens, cards, buttons, badges…)
  app/
    app.ts app.config.ts app.routes.ts
    core/data.ts         Models + DataStore (signals) + dummy seed data + helpers
    shared/icon.ts       Inline-SVG icon set
    layout/              Sidebar + topbar shell (responsive drawer)
    pages/<feature>/     One folder per page: <name>.ts + <name>.html
```

## Connecting your API later

`src/app/core/data.ts` holds all state in Angular signals. Replace the `seed*()`
initial values (or the whole `DataStore`) with HttpClient calls — the components read
from the signals, so the UI updates automatically.

## Notes
- Font inlining is disabled in `angular.json` (fonts load at runtime via `<link>`),
  so the build works offline. Re-enable if you self-host fonts.
