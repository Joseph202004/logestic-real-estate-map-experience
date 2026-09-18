# Prologis Property Search - Vibe Coding Prompt

Use this prompt in v0, Lovable, Bolt, Cursor, or a similar AI coding tool.

---

Build a polished, responsive web prototype for **Prologis Property Search**.

## Objective
Create a **logistics-first property search experience** that helps high-intent business users find, evaluate, compare, and inquire about industrial properties with less friction and more confidence.

This is not a generic real-estate listing site. It should feel like a **decision-support platform for supply-chain infrastructure**.

## Product goals
1. Reduce bounce and drop-off on property search.
2. Help users understand operational fit faster.
3. Surface the Prologis platform advantage before sales contact.
4. Support long B2B decision cycles with persistence, comparison, and saved searches.
5. Increase soft conversions such as shortlist saves and lightweight interest signals.

## Primary user types
### 1. E-commerce operator
- Needs last-mile coverage
- Cares about dock doors, clear height, automation readiness, lease-ready timeline
- Urgent and speed-focused

### 2. 3PL provider
- Searches multiple markets at once
- Needs multi-property comparison and export
- Wants portfolio-like workflows

### 3. Manufacturer / industrial operator
- Needs infrastructure-heavy specs like power capacity, rail access, cold storage, BTS options
- Long decision cycle, high detail, committee review

### 4. Retailer
- Needs flexible terms, expansion near existing site, sustainability signals
- Seasonal demand spikes

### 5. Broker / tenant rep
- Power user
- Needs fast filtering, bulk export, compare, direct contact flow, LOI-ready handoff

### Secondary / adjacent
Institutional investor. Include a research and market context layer, but do not let this dominate the property search core flow.

## Experience principles
- Logistics-first, not real-estate-first
- Map-first and location-intelligent
- Show full operational fit early
- Surface Essentials services during search, not after deal close
- Support long procurement cycles with saved searches and shareable shortlists
- Use low-friction intent capture instead of forcing long forms too early
- Make the experience feel enterprise-grade, calm, precise, and trustworthy

## Brand and visual direction
Use a **public-site-inspired Prologis style**, but do not pretend you have the internal brand kit.

### Visual language
- Clean enterprise layout
- Lots of white space
- Industrial/logistics photography placeholders
- Strong typographic hierarchy
- Minimal decoration
- Map and data are prominent
- Operational, not lifestyle, tone

### Provisional design tokens
Use these as placeholders and make them easy to swap later:

```ts
const tokens = {
  brandPrimary: '#0B4EA2',
  brandPrimaryDark: '#083B7A',
  ink: '#10202F',
  textSecondary: '#4C5A67',
  surface: '#F5F7FA',
  card: '#FFFFFF',
  border: '#D9E1E8',
  success: '#1D6B57',
  warning: '#B26A00',
  danger: '#B42318',
  accentSky: '#E9F2FB'
}
```

### Typography
- Use a neutral sans-serif like Inter, IBM Plex Sans, or system sans
- Headings should feel corporate and confident
- Avoid playful or startup-style rounded UI

### Logo handling
- Create a clean placeholder slot for the Prologis wordmark
- Do not hardcode unofficial brand assets if they are not provided

## Required screens
### 1. Search landing / segment-aware entry
Include:
- Hero with concise positioning
- Search by location or postal code
- Segment chips or cards:
  - E-commerce
  - 3PL
  - Manufacturing
  - Retail
  - Broker
- Quick presets that change filters and map overlays
- CTA to start guided search
- CTA to browse available properties

### 2. Guided search modal / assistant
Prompt users with practical business questions:
- What are you moving?
- Which markets are you targeting?
- Timeline to occupancy?
- Size range?
- Need automation-ready?
- Need build-to-suit?
- Need EV / solar / racking / workforce support?

Translate answers into search filters.

### 3. Map-first search results page
This is the core screen.

Layout:
- Left panel: filters + results cards
- Right panel: large interactive map
- Sticky top bar with search, compare count, save search, and user menu

Filters must include:
- Market / submarket
- Property type
- Building size
- Land size
- Clear height
- Dock doors
- Column spacing
- Power capacity
- Rail access
- Cold storage
- Lease term flexibility
- Available now / available in X days
- Build-to-suit
- Sustainability / solar / EV readiness
- Essentials services available

Map overlays:
- Highway access
- Airport proximity
- Seaport proximity
- Intermodal rail
- Labor pool density
- Delivery radius rings (1h, 2h, same-day)
- Market vacancy overlay

Results cards must show:
- Property name
- Market
- Availability status
- Size
- Clear height
- Dock count
- Power capacity
- Lease-ready timeline
- Essentials badges
- Sustainability score
- CTA: View details
- CTA: Add to compare
- CTA: I'm interested

### 4. Property detail page
Must feel decision-ready.

Sections:
- Hero image and summary
- Key specs grid
- Availability and timeline
- Map context
- Operational fit summary: “Best for” tags
- Essentials services available at this property
- Sustainability scorecard
- Move-in readiness estimator
- Compare with similar properties
- Named leasing rep card with response SLA
- Lightweight “I’m interested” action
- Full inquiry form only as secondary path

### 5. Compare page
Allow side-by-side comparison of up to 4 properties.

Compare dimensions:
- Market
- Size
- Clear height
- Dock doors
- Power capacity
- Lease flexibility
- Sustainability
- Essentials services
- Occupancy timeline
- Delivery radius
- Notes

Add:
- Print / export PDF button
- Share link
- Save shortlist

### 6. Saved search / shortlist dashboard
Authenticated user area.

Include:
- Saved searches
- Saved properties
- Shared shortlists
- Inquiry status
- Rep messages
- Alerts for matching properties
- Segment-specific shortcuts

### 7. Broker workspace
Dedicated mode for brokers.

Include:
- Multi-market search
- Bulk select
- Export to PDF / CSV
- Client shortlists
- Direct rep routing
- LOI-ready handoff stub

## Microinteractions
- Real-time filter chips
- Loading skeletons
- Empty states that still guide action
- Smart inline recommendations
- “Why this property matches” explanations
- Clear availability states: available, under negotiation, leased soon
- Gentle save and compare confirmations

## UX copy tone
Write concise, B2B, non-hype copy.
Examples:
- “Built for high-throughput fulfillment”
- “Lease-ready in 45 days”
- “Solar and EV infrastructure available”
- “Best fit for regional distribution”
- “Add to shortlist”
- “Signal interest”

Avoid consumer-style copy like “Find your dream warehouse.”

## Data model
Create mock JSON data with at least 12 properties across different markets.
Each property should include:

```ts
{
  id: string,
  name: string,
  market: string,
  submarket: string,
  country: string,
  sizeSqft: number,
  landSizeAcres?: number,
  availableFrom: string,
  availabilityStatus: 'available' | 'under_negotiation' | 'coming_soon',
  leaseTermOptions: string[],
  clearHeightFt: number,
  dockDoors: number,
  driveInDoors?: number,
  columnSpacing?: string,
  powerCapacityAmps?: number,
  railAccess: boolean,
  coldStorageReady: boolean,
  btsAvailable: boolean,
  map: {
    lat: number,
    lng: number
  },
  locationSignals: {
    airportDistanceMiles?: number,
    seaportDistanceMiles?: number,
    highwayAccess: string,
    intermodalDistanceMiles?: number,
    laborPoolScore: number,
    sameDayReach: string
  },
  essentials: {
    racking: boolean,
    automation: boolean,
    moveInMoveOut: boolean,
    software: boolean,
    energy: boolean,
    evCharging: boolean,
    workforce: boolean
  },
  sustainability: {
    solarReady: boolean,
    evReady: boolean,
    certification?: string,
    carbonScore: number,
    energyScore: number
  },
  bestFor: string[],
  images: string[]
}
```

## Technical stack
- Next.js
- React
- TypeScript
- Tailwind CSS
- Use mock JSON only
- No backend required
- Organize code into reusable components

## Component list
- TopNav
- SearchHero
- SegmentPresetBar
- GuidedSearchModal
- SearchFiltersPanel
- ActiveFilterChips
- PropertyResultsList
- PropertyCard
- MapPanel
- MapOverlayControls
- PropertyDetailHeader
- SpecsGrid
- EssentialsBadges
- SustainabilityScorecard
- LeasingRepCard
- CompareDrawer
- CompareTable
- SavedSearchDashboard
- BrokerWorkspace

## Accessibility and responsiveness
- WCAG-aware contrast
- Keyboard accessible filter controls
- Clear focus states
- Desktop-first but responsive to tablet and mobile
- On mobile, collapse map into a toggleable drawer

## What success looks like in the prototype
Someone reviewing this prototype should immediately understand that:
1. Prologis offers more than buildings
2. Property search is tuned for logistics decisions
3. Different user segments have different workflows
4. Comparison, persistence, and low-friction inquiry are central
5. The experience feels like an enterprise platform, not a marketing microsite

## Important constraint
Do not create a generic marketplace or residential real-estate UI. This must look and behave like a **global logistics infrastructure platform**.

## Nice-to-have interactions
- “Why this match?” AI explainer badge
- Saved search alerts panel
- Move-in cost estimator with Essentials bundle
- Rep SLA pill on property page
- Market context cards such as vacancy trend and rent index

Generate all screens, mock data, reusable components, and polished styling in one project.
