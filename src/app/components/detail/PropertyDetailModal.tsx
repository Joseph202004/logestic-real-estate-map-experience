import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Bookmark, ChevronRight, GitCompareArrows, Mail, Phone, X } from 'lucide-react';
import type { Property } from '../../data/properties';
import { useApp } from '../../context/AppContext';
import { InteractiveMap } from '../InteractiveMap';
import {
  DETAIL_FONT, EssentialsPanel, Gallery, InsightsPanel, KeyMetrics,
  Panel, RentBand, SummaryHeader,
} from './sections';

/**
 * Full property detail, shown over the search results when "View Details" is
 * clicked. Composed from the panels in ./sections so the same blocks can be
 * reused on the standalone /property/:id page.
 */
export function PropertyDetailModal({ property, onClose }: { property: Property; onClose: () => void }) {
  const navigate = useNavigate();
  const { toggleCompare, toggleSaved, isInCompare, isSaved } = useApp();
  const [contactOpen, setContactOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 flex items-start justify-center p-4 md:p-8 bg-[#0C447C]/35 backdrop-blur-sm overflow-y-auto"
      // Leaflet's panes sit at z-index 400–700, so the dialog has to clear them.
      style={{ fontFamily: DETAIL_FONT, zIndex: 9999 }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-[1020px] bg-[#F4F3F3] rounded-2xl shadow-2xl overflow-hidden my-auto"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`${property.name} details`}
      >
        {/* Breadcrumb bar */}
        <div className="flex items-center justify-between gap-3 px-6 py-3 bg-white border-b border-[#E6F1FB]">
          <div className="flex items-center gap-1.5 text-[#303234]/45" style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.04em' }}>
            <span className="text-[#0C447C]">SEARCH</span>
            <ChevronRight size={11} />
            <span>PROPERTY</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => toggleCompare(property.id)}
              className={`
                inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-colors
                ${isInCompare(property.id) ? 'bg-[#00C2B2]/10 border-[#00C2B2] text-[#1B4D4A]' : 'border-[#E6F1FB] text-[#303234]/55 hover:border-[#00C2B2]/40'}
              `}
              style={{ fontSize: 10.5, fontWeight: 700 }}
            >
              <GitCompareArrows size={12} />
              {isInCompare(property.id) ? 'In compare' : 'Compare'}
            </button>
            <button
              onClick={() => toggleSaved(property.id)}
              className="w-[30px] h-[30px] rounded-lg border border-[#E6F1FB] flex items-center justify-center hover:border-[#00C2B2]/40 transition-colors"
              aria-label={isSaved(property.id) ? 'Remove from saved' : 'Save property'}
            >
              <Bookmark size={13} className={isSaved(property.id) ? 'text-[#00C2B2] fill-[#00C2B2]' : 'text-[#303234]/50'} />
            </button>
            <button onClick={onClose} className="w-[30px] h-[30px] rounded-lg flex items-center justify-center text-[#303234]/45 hover:text-[#0C447C] transition-colors" aria-label="Close details">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="max-h-[80vh] overflow-y-auto p-5 md:p-6 space-y-4">
          {/* Summary + gallery + metrics */}
          <Panel className="p-5">
            <SummaryHeader
              property={property}
              onOpenFullPage={() => navigate(`/property/${property.id}`)}
              onContact={() => setContactOpen(true)}
            />

            <div className="grid md:grid-cols-[minmax(0,320px)_1fr] gap-5 mt-5">
              <Gallery property={property} />
              <KeyMetrics property={property} />
            </div>

            <RentBand property={property} />

            {contactOpen && (
              <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-[#E6F1FB]">
                <div className="min-w-0 mr-auto">
                  <div className="text-[#0C447C]" style={{ fontSize: 12.5, fontWeight: 700 }}>
                    {property.market} leasing team
                  </div>
                  <div className="text-[#303234]/50" style={{ fontSize: 11, fontWeight: 500 }}>
                    Prologis {property.submarket} · typically replies within one business day
                  </div>
                </div>
                <button
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#1B4D4A] text-white rounded-xl hover:bg-[#187770] transition-colors"
                  style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.02em' }}
                >
                  <Phone size={13} /> REQUEST A CALL
                </button>
                <button
                  className="inline-flex items-center gap-2 px-4 py-2 border border-[#E6F1FB] text-[#0C447C] rounded-xl hover:border-[#00C2B2] transition-colors"
                  style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.02em' }}
                >
                  <Mail size={13} /> REQUEST A TOUR
                </button>
              </div>
            )}
          </Panel>

          {/* Contact + location */}
          <div className="grid md:grid-cols-[minmax(0,320px)_1fr] gap-4 items-start">
            <div className="space-y-4">
              <EssentialsPanel property={property} />
              <InsightsPanel property={property} />
            </div>

            <Panel className="p-2 h-[380px] md:sticky md:top-0 overflow-hidden">
              <div className="w-full h-full rounded-xl overflow-hidden">
                <InteractiveMap properties={[property]} selectedId={property.id} onSelectProperty={() => {}} showControls={false} />
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </div>
  );
}
