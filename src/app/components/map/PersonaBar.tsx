import { useState } from 'react';
import { Check, Sparkles } from 'lucide-react';
import { personas } from '../../personas/personas';
import type { Persona } from '../../personas/personas';

const FONT = '"Google Sans", Figtree, Roboto, sans-serif';

/**
 * Persona preset banner above the results list: states what the view is tuned
 * for and lets the user switch preset (spec §8 wireframe, §14 workflow).
 */
export function PersonaBar({
  persona,
  onChange,
}: {
  persona: Persona;
  onChange: (p: Persona) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative px-4 py-2.5 bg-[#E7E0EC] border-b border-[#6750A4]/10" style={{ fontFamily: FONT }}>
      <div className="flex items-center gap-2">
        <Sparkles size={13} className="text-[#6750A4] shrink-0" />
        <div className="min-w-0">
          <div className="text-[#21005D] truncate" style={{ fontSize: 11, fontWeight: 700 }}>
            Optimized for {persona.label}
          </div>
          <div className="text-[#1D1B20]/50 truncate" style={{ fontSize: 10, fontWeight: 500 }}>
            {persona.tagline}
          </div>
        </div>

        <button
          onClick={() => setOpen(o => !o)}
          aria-expanded={open}
          className="ml-auto shrink-0 px-2.5 py-1 rounded-full bg-white text-[#21005D] hover:bg-white/70 transition-colors"
          style={{ fontSize: 10, fontWeight: 700 }}
        >
          {open ? 'Close' : 'Change'}
        </button>
      </div>

      {open && (
        <div className="mt-2.5 grid gap-1.5">
          {personas.map(p => {
            const active = p.id === persona.id;
            return (
              <button
                key={p.id}
                onClick={() => { onChange(p); setOpen(false); }}
                className={`
                  flex items-center gap-2 px-2.5 py-2 rounded-xl border text-left transition-colors
                  ${active ? 'bg-white border-[#6750A4]' : 'bg-white/60 border-transparent hover:bg-white'}
                `}
              >
                <p.icon size={13} className={active ? 'text-[#6750A4]' : 'text-[#1D1B20]/40'} />
                <span className="min-w-0 flex-1">
                  <span className="block text-[#21005D] truncate" style={{ fontSize: 11, fontWeight: 700 }}>{p.label}</span>
                  <span className="block text-[#1D1B20]/45 truncate" style={{ fontSize: 9.5, fontWeight: 500 }}>{p.tagline}</span>
                </span>
                {active && <Check size={12} className="text-[#6750A4] shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
