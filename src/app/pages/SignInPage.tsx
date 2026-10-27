import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import {
  Mail, Lock, Eye, EyeOff, ArrowRight, Building2, ShieldCheck,
  Sparkles, TrendingUp, AlertCircle, UserRound,
} from 'lucide-react';

const FONT = '"Google Sans", Figtree, Roboto, sans-serif';

/* ─── Marketing highlights on the branded panel ─── */
const HIGHLIGHTS = [
  { icon: Building2, text: '6,700+ logistics properties across 20 countries' },
  { icon: Sparkles, text: 'Persona-aware match scoring on every site' },
  { icon: TrendingUp, text: 'Live market insight and delivery-reach analysis' },
];

/* ═══════════════════════════════════════════════════════════════
   SIGN IN PAGE — Material 3, matches the app design system
   ═══════════════════════════════════════════════════════════════ */
export function SignInPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const next: { email?: string; password?: string } = {};
    if (!email.trim()) next.email = 'Enter your work email to continue.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = 'That doesn’t look like a valid email.';
    if (!password) next.password = 'Enter your password to continue.';
    else if (password.length < 6) next.password = 'Password must be at least 6 characters.';
    return next;
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    // Prototype only — no real authentication is performed.
    navigate('/search');
  };

  return (
    <div className="min-h-screen flex bg-[#FEF7FF]" style={{ fontFamily: FONT }}>

      {/* ─── Branded panel (desktop only) ─── */}
      <div className="hidden lg:flex flex-col justify-between w-[46%] max-w-[620px] p-12 relative overflow-hidden bg-gradient-to-br from-[#6750A4] via-[#584191] to-[#21005D] text-white">
        {/* soft decorative blooms */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute bottom-0 -left-20 w-80 h-80 rounded-full bg-[#E8DEF8]/15 blur-2xl" />

        {/* Brand mark */}
        <div className="relative flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center" style={{ fontSize: 18, fontWeight: 800 }}>
            P
          </div>
          <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.01em' }}>Prologis</span>
        </div>

        {/* Headline + highlights */}
        <div className="relative">
          <h1 style={{ fontSize: 34, fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.02em' }}>
            The end-to-end logistics<br />real estate platform.
          </h1>
          <p className="mt-4 text-white/70 max-w-sm" style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.6 }}>
            Sign in to search, compare and shortlist warehouse space matched to how your operation actually runs.
          </p>

          <ul className="mt-8 space-y-3.5">
            {HIGHLIGHTS.map(h => (
              <li key={h.text} className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                  <h.icon size={15} />
                </span>
                <span className="text-white/85" style={{ fontSize: 13, fontWeight: 500 }}>{h.text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Trust footer */}
        <div className="relative flex items-center gap-2 text-white/60" style={{ fontSize: 11.5, fontWeight: 500 }}>
          <ShieldCheck size={14} />
          Enterprise SSO &amp; SOC 2 Type II secured
        </div>
      </div>

      {/* ─── Form panel ─── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-[380px]">

          {/* Compact brand mark for mobile */}
          <div className="flex lg:hidden items-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-xl bg-[#6750A4] text-white flex items-center justify-center" style={{ fontSize: 16, fontWeight: 800 }}>
              P
            </div>
            <span className="text-[#21005D]" style={{ fontSize: 15, fontWeight: 700 }}>Prologis</span>
          </div>

          <h2 className="text-[#21005D]" style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.01em' }}>
            Welcome back
          </h2>
          <p className="text-[#1D1B20]/50 mt-1.5" style={{ fontSize: 13, fontWeight: 500 }}>
            Sign in to your workspace to continue.
          </p>

          {/* Social sign-in */}
          <div className="mt-7 grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex items-center justify-center gap-2 h-11 rounded-full border border-[#CAC4D0] bg-white text-[#1D1B20]/75 hover:bg-[#F7F2FA] transition-colors"
              style={{ fontSize: 12.5, fontWeight: 600 }}
            >
              <GoogleGlyph /> Google
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 h-11 rounded-full border border-[#CAC4D0] bg-white text-[#1D1B20]/75 hover:bg-[#F7F2FA] transition-colors"
              style={{ fontSize: 12.5, fontWeight: 600 }}
            >
              <ShieldCheck size={15} className="text-[#6750A4]" /> SSO
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <span className="flex-1 h-px bg-[#E7E0EC]" />
            <span className="text-[#1D1B20]/35" style={{ fontSize: 11, fontWeight: 600 }}>or continue with email</span>
            <span className="flex-1 h-px bg-[#E7E0EC]" />
          </div>

          {/* Email + password form */}
          <form onSubmit={submit} noValidate className="space-y-4">
            <Field label="Work email" error={errors.email}>
              <Mail size={15} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${errors.email ? 'text-[#B3261E]/50' : 'text-[#1D1B20]/30'}`} />
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); if (errors.email) setErrors(x => ({ ...x, email: undefined })); }}
                placeholder="you@company.com"
                aria-invalid={!!errors.email}
                className={`w-full pl-10 pr-4 h-12 rounded-2xl border focus:bg-white focus:outline-none transition-all ${
                  errors.email
                    ? 'bg-[#FCEEEE] border-[#B3261E] focus:border-[#B3261E]'
                    : 'bg-[#F7F2FA] border-transparent focus:border-[#6750A4]'
                }`}
                style={{ fontSize: 13, fontWeight: 500 }}
              />
            </Field>

            <Field label="Password" error={errors.password}>
              <Lock size={15} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${errors.password ? 'text-[#B3261E]/50' : 'text-[#1D1B20]/30'}`} />
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => { setPassword(e.target.value); if (errors.password) setErrors(x => ({ ...x, password: undefined })); }}
                placeholder="••••••••"
                aria-invalid={!!errors.password}
                className={`w-full pl-10 pr-11 h-12 rounded-2xl border focus:bg-white focus:outline-none transition-all ${
                  errors.password
                    ? 'bg-[#FCEEEE] border-[#B3261E] focus:border-[#B3261E]'
                    : 'bg-[#F7F2FA] border-transparent focus:border-[#6750A4]'
                }`}
                style={{ fontSize: 13, fontWeight: 500 }}
              />
              <button
                type="button"
                onClick={() => setShowPw(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1D1B20]/40 hover:text-[#6750A4] transition-colors"
                aria-label={showPw ? 'Hide password' : 'Show password'}
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </Field>

            {/* Remember + forgot */}
            <div className="flex items-center justify-between pt-0.5">
              <button
                type="button"
                onClick={() => setRemember(r => !r)}
                className="flex items-center gap-2 text-[#1D1B20]/60"
                style={{ fontSize: 12, fontWeight: 500 }}
              >
                <span className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                  remember ? 'bg-[#6750A4] border-[#6750A4]' : 'border-[#CAC4D0]'
                }`}>
                  {remember && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                  )}
                </span>
                Remember me
              </button>
              <a href="#" className="text-[#6750A4] hover:underline" style={{ fontSize: 12, fontWeight: 600 }}>
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full h-12 flex items-center justify-center gap-2 bg-[#6750A4] text-white rounded-full hover:bg-[#4F378B] transition-colors shadow-[0_6px_20px_rgba(103,80,164,0.28)]"
              style={{ fontSize: 13.5, fontWeight: 700 }}
            >
              Sign in <ArrowRight size={16} />
            </button>

            {/* Guest entry — tonal secondary action */}
            <button
              type="button"
              onClick={() => navigate('/search')}
              className="w-full h-12 flex items-center justify-center gap-2 bg-[#E8DEF8] text-[#21005D] rounded-full hover:bg-[#DED2F2] transition-colors"
              style={{ fontSize: 13.5, fontWeight: 700 }}
            >
              <UserRound size={16} /> Enter as guest
            </button>
          </form>

          {/* Create account */}
          <p className="text-center mt-6 text-[#1D1B20]/55" style={{ fontSize: 12.5, fontWeight: 500 }}>
            New to Prologis?{' '}
            <Link to="/" className="text-[#6750A4] hover:underline" style={{ fontWeight: 700 }}>
              Create an account
            </Link>
          </p>
        </div>

        <p className="mt-10 text-[#1D1B20]/30 text-center" style={{ fontSize: 10.5, fontWeight: 500 }}>
          Prototype experience — no real authentication is performed.
        </p>
      </div>
    </div>
  );
}

/* ─── Labelled field wrapper, with inline M3 error text ─── */
function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block mb-1.5 text-[#21005D]" style={{ fontSize: 11.5, fontWeight: 700 }}>{label}</span>
      <span className="relative block">{children}</span>
      {error && (
        <span className="flex items-center gap-1.5 mt-1.5 text-[#B3261E]" style={{ fontSize: 11, fontWeight: 500 }}>
          <AlertCircle size={12} className="shrink-0" />
          {error}
        </span>
      )}
    </label>
  );
}

/* ─── Google "G" glyph ─── */
function GoogleGlyph() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
    </svg>
  );
}
