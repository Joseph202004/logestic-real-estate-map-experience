import { getEssentialsList, getStatusLabel } from '../../data/properties';
import type { Property } from '../../data/properties';

/**
 * A comparison row. `best` optionally scores a property so the winning cell can
 * be flagged — higher is better, and rows without it are informational only.
 */
export interface CompareRow {
  label: string;
  hint?: string;
  render: (p: Property) => React.ReactNode;
  best?: (p: Property) => number | null;
}

export interface CompareGroup {
  id: string;
  title: string;
  blurb: string;
  rows: CompareRow[];
}

const muted = (text: string) => <span className="text-[#1D1B20]/30">{text}</span>;
const strong = (text: string) => <span style={{ fontWeight: 800 }}>{text}</span>;

const yesNo = (on: boolean) =>
  on ? <span className="text-[#2E7D32]" style={{ fontWeight: 700 }}>Yes</span> : muted('No');

export const compareGroups: CompareGroup[] = [
  {
    id: 'building',
    title: 'Building specification',
    blurb: 'The physical envelope — what the operation has to fit inside.',
    rows: [
      {
        label: 'Building size',
        render: p => strong(`${p.sizeSqft.toLocaleString()} SF`),
        best: p => p.sizeSqft,
      },
      {
        label: 'Clear height',
        render: p => strong(`${p.clearHeightFt} ft`),
        best: p => p.clearHeightFt,
      },
      {
        label: 'Dock doors',
        render: p => strong(String(p.dockDoors)),
        best: p => p.dockDoors,
      },
      {
        label: 'Power capacity',
        render: p => (p.powerCapacityAmps ? strong(`${p.powerCapacityAmps.toLocaleString()}A`) : muted('Not stated')),
        best: p => p.powerCapacityAmps ?? null,
      },
      { label: 'Column spacing', render: p => p.columnSpacing || muted('Not stated') },
      { label: 'Land area', render: p => (p.landSizeAcres ? `${p.landSizeAcres} acres` : muted('Not stated')) },
    ],
  },
  {
    id: 'location',
    title: 'Location intelligence',
    blurb: 'How well the site reaches customers, freight networks and labour.',
    rows: [
      { label: 'Market', render: p => `${p.market}, ${p.submarket}` },
      { label: 'Same-day reach', render: p => p.locationSignals.sameDayReach },
      {
        label: 'Labor pool score',
        render: p => strong(`${p.locationSignals.laborPoolScore}/100`),
        best: p => p.locationSignals.laborPoolScore,
      },
      { label: 'Highway access', render: p => p.locationSignals.highwayAccess },
      {
        label: 'Intermodal distance',
        render: p => (p.locationSignals.intermodalDistanceMiles != null ? `${p.locationSignals.intermodalDistanceMiles} mi` : muted('—')),
        // Closer is better, so invert the miles.
        best: p => (p.locationSignals.intermodalDistanceMiles != null ? -p.locationSignals.intermodalDistanceMiles : null),
      },
      { label: 'Rail access', render: p => yesNo(p.railAccess) },
    ],
  },
  {
    id: 'commercial',
    title: 'Availability & cost',
    blurb: 'When it can be occupied and what it is likely to cost.',
    rows: [
      {
        label: 'Status',
        render: p => (
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${
              p.availabilityStatus === 'available' ? 'bg-[#2E7D32] text-white'
                : p.availabilityStatus === 'under_negotiation' ? 'bg-[#8C5000] text-white'
                : 'bg-[#21005D] text-white'
            }`}
            style={{ fontSize: 9, fontWeight: 700 }}
          >
            <span className="w-1 h-1 rounded-full bg-white/70" />
            {getStatusLabel(p.availabilityStatus)}
          </span>
        ),
      },
      {
        label: 'Available from',
        render: p => new Date(p.availableFrom).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        // Sooner is better.
        best: p => -new Date(p.availableFrom).getTime(),
      },
      {
        label: 'Indicative rent',
        hint: 'Lower is better',
        render: p => (p.rentPsf
          ? <span className="text-[#2E7D32]" style={{ fontWeight: 800, fontSize: 14 }}>${p.rentPsf}/SF</span>
          : muted('On request')),
        best: p => (p.rentPsf ? -p.rentPsf : null),
      },
      {
        label: 'Annual base rent',
        render: p => (p.rentPsf ? strong(`$${Math.round(p.rentPsf * p.sizeSqft).toLocaleString()}`) : muted('On request')),
      },
      { label: 'Lease terms', render: p => p.leaseTermOptions.join(' · ') },
      { label: 'Build-to-suit', render: p => yesNo(p.btsAvailable) },
    ],
  },
  {
    id: 'capability',
    title: 'Capability & sustainability',
    blurb: 'What the building already does without a fit-out programme.',
    rows: [
      { label: 'Cold storage', render: p => yesNo(p.coldStorageReady) },
      {
        label: 'Essentials',
        render: p => (
          <div className="flex flex-wrap gap-1">
            {getEssentialsList(p.essentials).map(e => (
              <span key={e} className="px-1.5 py-0.5 bg-[#E7E0EC] text-[#21005D] rounded" style={{ fontSize: 9, fontWeight: 700 }}>
                {e}
              </span>
            ))}
          </div>
        ),
        best: p => getEssentialsList(p.essentials).length,
      },
      {
        label: 'Certification',
        render: p => (p.sustainability.certification
          ? <span className="text-[#2E7D32]" style={{ fontWeight: 700 }}>{p.sustainability.certification}</span>
          : muted('None')),
      },
      {
        label: 'Carbon score',
        render: p => <ScoreBar value={p.sustainability.carbonScore} color="#2E7D32" />,
        best: p => p.sustainability.carbonScore,
      },
      {
        label: 'Energy score',
        render: p => <ScoreBar value={p.sustainability.energyScore} color="#6750A4" />,
        best: p => p.sustainability.energyScore,
      },
    ],
  },
];

function ScoreBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="flex items-center gap-2 max-w-[160px]">
      <div className="flex-1 h-1.5 bg-[#FEF7FF] rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
      <span className="text-[#21005D]" style={{ fontSize: 10.5, fontWeight: 800 }}>{value}</span>
    </div>
  );
}
