# Logistics Real Estate Map Experience

End-to-end property search prototype (home → search → PDP → compare), reconstructed
from a Figma Make export and scaffolded as a Vite + React + TypeScript app.

## Stack

- React 18 + react-router 7
- Tailwind CSS v4 (`@tailwindcss/vite`)
- react-leaflet + OpenStreetMap tiles
- lucide-react icons

## Run

```bash
npm install
npm run dev
```

Then open http://localhost:5173

## Routes

| Path | Page |
| --- | --- |
| `/` | Home — guided "Find Your Operational Fit" search |
| `/search` | Results list + interactive map with data layers |
| `/property/:id` | Property detail page |
| `/compare` | Side-by-side comparison |

## Layout

- `src/app/pages/` — the four route pages
- `src/app/components/` — `TopNav`, `InteractiveMap`
- `src/app/context/AppContext.tsx` — saved / compare state
- `src/app/data/properties.ts` — seeded property dataset
- `src/styles/theme.css` — design tokens and Tailwind entry
