import { useState } from 'react';
import { Check, Sparkles } from 'lucide-react';
import { personas } from '../../personas/personas';
import type { Persona } from '../../personas/personas';

const FONT = 'Montserrat, sans-serif';

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
    <div className="relative px-4 py-2.5 bg-[#E6F1FB] border-b border-[#00C2B2]/10" style={{ fontFamily: FONT }}>
      <div className="flex items-center gap-2">
        <Sparkles size={13} className="text-[#00C2B2] shrink-0" />
        <div className="min-w-0">
          <div className="text-[#0C447C] truncate" style={{ fontSize: 11, fontWeight: 700 }}>
            Optimized for {persona.label}
          </div>
          <div className="text-[#303234]/50 truncate" style={{ fontSize: 10, fontWeight: 500 }}>
            {persona.tagline}
          </div>
        </div>

        <button
          onClick={() => setOpen(o => !o)}
          aria-expanded={open}
          className="ml-auto shrink-0 px-2.5 py-1 rounded-full bg-white text-[#0C447C] hover:bg-white/70 transition-colors"
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
                  ${active ? 'bg-white border-[#00C2B2]' : 'bg-white/60 border-transparent hover:bg-white'}
                `}
              >
                <p.icon size={13} className={active ? 'text-[#00C2B2]' : 'text-[#303234]/40'} />
                <span className="min-w-0 flex-1">
                  <span className="block text-[#0C447C] truncate" style={{ fontSize: 11, fontWeight: 700 }}>{p.label}</span>
                  <span className="block text-[#303234]/45 truncate" style={{ fontSize: 9.5, fontWeight: 500 }}>{p.tagline}</span>
                </span>
                {active && <Check size={12} className="text-[#00C2B2] shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
