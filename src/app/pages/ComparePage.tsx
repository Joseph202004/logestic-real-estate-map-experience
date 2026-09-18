import { Link } from 'react-router';
import { X, Download, Share2, Bookmark, ArrowLeft, Search } from 'lucide-react';
import { properties, formatSqft, getStatusLabel, getEssentialsList } from '../data/properties';
import { useApp } from '../context/AppContext';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

const FONT = 'Montserrat, sans-serif';

export function ComparePage() {
  const { compareList, toggleCompare } = useApp();
  const compared = properties.filter(p => compareList.includes(p.id));

  const rows: { label: string; getValue: (p: typeof properties[0]) => React.ReactNode }[] = [
    { label: 'Market', getValue: p => `${p.market}, ${p.submarket}` },
    { label: 'Building Size', getValue: p => <span style={{ fontWeight: 800 }}>{formatSqft(p.sizeSqft)}</span> },
    { label: 'Clear Height', getValue: p => <span style={{ fontWeight: 800 }}>{p.clearHeightFt} ft</span> },
    { label: 'Dock Doors', getValue: p => <span style={{ fontWeight: 800 }}>{p.dockDoors}</span> },
    { label: 'Power Capacity', getValue: p => p.powerCapacityAmps ? <span style={{ fontWeight: 800 }}>{p.powerCapacityAmps.toLocaleString()}A</span> : <span className="text-[#303234]/30">N/A</span> },
    { label: 'Column Spacing', getValue: p => p.columnSpacing || <span className="text-[#303234]/30">N/A</span> },
    { label: 'Rail Access', getValue: p => p.railAccess ? <span className="text-[#00CC66]" style={{ fontWeight: 700 }}>Yes</span> : 'No' },
    { label: 'Cold Storage', getValue: p => p.coldStorageReady ? <span className="text-[#00CC66]" style={{ fontWeight: 700 }}>Ready</span> : 'No' },
    { label: 'Lease Terms', getValue: p => p.leaseTermOptions.join(', ') },
    { label: 'Availability', getValue: p => (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${
        p.availabilityStatus === 'available' ? 'bg-[#00CC66] text-white' :
        p.availabilityStatus === 'under_negotiation' ? 'bg-[#B26A00] text-white' :
        'bg-[#0C447C] text-white'
      }`} style={{ fontSize: 9, fontWeight: 700 }}>
        <span className="w-1 h-1 rounded-full bg-white/70" />
        {getStatusLabel(p.availabilityStatus)}
      </span>
    )},
    { label: 'Available From', getValue: p => new Date(p.availableFrom).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) },
    { label: 'Indicative Rent', getValue: p => p.rentPsf ? <span className="text-[#00CC66]" style={{ fontWeight: 800, fontSize: 14 }}>${p.rentPsf}/SF</span> : <span className="text-[#303234]/30">Contact</span> },
    { label: 'Sustainability', getValue: p => (
      <div className="space-y-0.5">
        <div className="flex items-center gap-2">
          <span className="text-[#303234]/40" style={{ fontSize: 10 }}>Carbon:</span>
          <div className="flex-1 h-1.5 bg-[#F4F3F3] rounded-full overflow-hidden"><div className="h-full bg-[#00CC66] rounded-full" style={{ width: `${p.sustainability.carbonScore}%` }} /></div>
          <span className="text-[#0C447C]" style={{ fontSize: 10, fontWeight: 800 }}>{p.sustainability.carbonScore}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#303234]/40" style={{ fontSize: 10 }}>Energy:</span>
          <div className="flex-1 h-1.5 bg-[#F4F3F3] rounded-full overflow-hidden"><div className="h-full bg-[#00C2B2] rounded-full" style={{ width: `${p.sustainability.energyScore}%` }} /></div>
          <span className="text-[#0C447C]" style={{ fontSize: 10, fontWeight: 800 }}>{p.sustainability.energyScore}</span>
        </div>
        {p.sustainability.certification && <span className="text-[#00CC66]" style={{ fontSize: 10, fontWeight: 700 }}>{p.sustainability.certification}</span>}
      </div>
    )},
    { label: 'Essentials', getValue: p => (
      <div className="flex flex-wrap gap-1">
        {getEssentialsList(p.essentials).map(e => (
          <span key={e} className="px-1.5 py-0.5 bg-[#E6F1FB] text-[#0C447C] rounded" style={{ fontSize: 9, fontWeight: 700 }}>{e}</span>
        ))}
      </div>
    )},
    { label: 'Same-Day Reach', getValue: p => p.locationSignals.sameDayReach },
    { label: 'Highway Access', getValue: p => p.locationSignals.highwayAccess },
    { label: 'Labor Pool', getValue: p => <span style={{ fontWeight: 800 }}>{p.locationSignals.laborPoolScore}/100</span> },
  ];

  return (
    <div className="min-h-screen bg-[#F4F3F3]" style={{ fontFamily: FONT }}>
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <Link to="/search" className="flex items-center gap-1.5 text-[#1B4D4A] hover:text-[#187770] transition-colors" style={{ fontSize: 13, fontWeight: 600 }}>
              <ArrowLeft size={15} /> Back to Search
            </Link>
            <div className="w-px h-5 bg-[#E6F1FB]" />
            <h1 className="text-[#0C447C]" style={{ fontSize: 22, fontWeight: 800 }}>
              Compare Properties
              {compared.length > 0 && <span className="text-[#303234]/30 ml-2" style={{ fontSize: 14, fontWeight: 500 }}>({compared.length} of 4)</span>}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-4 py-2 bg-white rounded-xl border border-[#E6F1FB] text-[#303234]/50 hover:border-[#00C2B2]/30 hover:text-[#1B4D4A] transition-all" style={{ fontSize: 11, fontWeight: 700 }}>
              <Download size={13} /> Export PDF
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 bg-white rounded-xl border border-[#E6F1FB] text-[#303234]/50 hover:border-[#00C2B2]/30 hover:text-[#1B4D4A] transition-all" style={{ fontSize: 11, fontWeight: 700 }}>
              <Share2 size={13} /> Share Link
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 bg-[#1B4D4A] text-white rounded-xl hover:bg-[#187770] transition-colors shadow-sm" style={{ fontSize: 11, fontWeight: 700 }}>
              <Bookmark size={13} /> Save Shortlist
            </button>
          </div>
        </div>

        {compared.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center border border-[#E6F1FB] shadow-sm">
            <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-[#E6F1FB] flex items-center justify-center">
              <Search size={32} className="text-[#0C447C]/20" />
            </div>
            <p className="text-[#303234]/60 mb-2" style={{ fontSize: 16, fontWeight: 700 }}>No properties to compare</p>
            <p className="text-[#303234]/35 mb-6 max-w-sm mx-auto" style={{ fontSize: 13, lineHeight: 1.6 }}>
              Add up to 4 properties from the search results to compare them side-by-side across all logistics dimensions.
            </p>
            <Link to="/search" className="px-6 py-2.5 bg-[#1B4D4A] text-white rounded-xl hover:bg-[#187770] transition-colors inline-block shadow-lg shadow-[#1B4D4A]/15" style={{ fontSize: 13, fontWeight: 700 }}>
              Browse Properties
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#E6F1FB] shadow-sm overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr>
                  <th className="sticky left-0 bg-white z-10 p-4 text-left w-40 border-b border-[#E6F1FB]" />
                  {compared.map(p => (
                    <th key={p.id} className="p-5 border-b border-[#E6F1FB] min-w-[240px] align-top">
                      <div className="relative">
                        <button
                          onClick={() => toggleCompare(p.id)}
                          className="absolute -top-1 -right-1 w-7 h-7 bg-[#F4F3F3] rounded-full flex items-center justify-center hover:bg-[#B42318] hover:text-white transition-all text-[#303234]/30"
                        >
                          <X size={13} />
                        </button>
                        <div className="rounded-2xl overflow-hidden h-32 mb-3 border border-[#E6F1FB]">
                          <ImageWithFallback src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                        <Link to={`/property/${p.id}`} className="text-[#0C447C] hover:text-[#00C2B2] transition-colors block" style={{ fontSize: 14, fontWeight: 700 }}>
                          {p.name}
                        </Link>
                        <p className="text-[#303234]/40 mt-0.5" style={{ fontSize: 11 }}>{p.market}</p>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={row.label} className={i % 2 === 0 ? 'bg-[#F4F3F3]/30' : 'bg-white'}>
                    <td className="sticky left-0 bg-inherit z-10 px-5 py-3 border-r border-[#E6F1FB]">
                      <span className="text-[#303234]/50" style={{ fontSize: 11, fontWeight: 700 }}>{row.label}</span>
                    </td>
                    {compared.map(p => (
                      <td key={p.id} className="px-5 py-3">
                        <span className="text-[#303234]" style={{ fontSize: 12 }}>{row.getValue(p)}</span>
                      </td>
                    ))}
                  </tr>
                ))}
                <tr className="border-t border-[#E6F1FB]">
                  <td className="sticky left-0 bg-white z-10 px-5 py-4 border-r border-[#E6F1FB]" />
                  {compared.map(p => (
                    <td key={p.id} className="px-5 py-4">
                      <div className="flex gap-2">
                        <Link to={`/property/${p.id}`} className="px-4 py-2 bg-[#1B4D4A] text-white rounded-xl hover:bg-[#187770] transition-colors" style={{ fontSize: 11, fontWeight: 700 }}>
                          View Details
                        </Link>
                        <button className="px-4 py-2 border-2 border-[#1B4D4A] text-[#1B4D4A] rounded-xl hover:bg-[#1B4D4A] hover:text-white transition-all" style={{ fontSize: 11, fontWeight: 700 }}>
                          I'm Interested
                        </button>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
