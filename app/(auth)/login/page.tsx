'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react';

type Language = 'FR' | 'EN' | 'RN' | 'SW';

const translations: Record<Language, {
  title: string; subtitle: string; emailLabel: string; emailPlaceholder: string;
  passwordLabel: string; passwordPlaceholder: string; remember: string;
  forgotPassword: string; submit: string; loading: string; noAccount: string;
  signUp: string; errorInvalid: string; errorRequired: string;
  panelTitle: string; panelSubtitle: string; panelSlogan: string;
  back: string; demoNote: string;
}> = {
  FR: {
    title: 'Connexion', subtitle: 'Accédez au cockpit de pilotage de votre institution.',
    emailLabel: 'Adresse e-mail', emailPlaceholder: 'vous@institution.bi',
    passwordLabel: 'Mot de passe', passwordPlaceholder: '••••••••',
    remember: 'Se souvenir 30 jours', forgotPassword: 'Mot de passe oublié ?',
    submit: 'Se connecter', loading: 'Connexion…', noAccount: 'Pas encore de compte ?', signUp: "S'inscrire",
    errorInvalid: 'Identifiants incorrects. Veuillez réessayer.', errorRequired: 'Veuillez remplir tous les champs.',
    panelTitle: "Transformer l'attente en dignité.",
    panelSubtitle: "Apportez de l'ordre et de la clarté à vos usagers grâce à l'infrastructure de gestion de flux la plus performante de la sous-région.",
    panelSlogan: '« Votre temps a de la valeur. Tonde le respecte. »',
    back: 'Retour au site',
    demoNote: 'Démonstration : aucun compte réel n’est vérifié, la connexion ouvre directement le dashboard.',
  },
  EN: {
    title: 'Sign in', subtitle: 'Access your institution’s control room.',
    emailLabel: 'Email address', emailPlaceholder: 'you@institution.com',
    passwordLabel: 'Password', passwordPlaceholder: '••••••••',
    remember: 'Remember for 30 days', forgotPassword: 'Forgot password?',
    submit: 'Sign in', loading: 'Signing in…', noAccount: "Don't have an account?", signUp: 'Sign up',
    errorInvalid: 'Invalid credentials. Please try again.', errorRequired: 'Please fill in all fields.',
    panelTitle: 'Turning waiting into dignity.',
    panelSubtitle: 'Bring order and clarity to your users with the most powerful queue management infrastructure in the sub-region.',
    panelSlogan: '"Your time has value. Tonde respects it."',
    back: 'Back to site',
    demoNote: 'Demo: no real account is checked, signing in opens the dashboard directly.',
  },
  RN: {
    title: 'Injira', subtitle: 'Shika urubuga rw’ubugenzuzi bw’ikigo cawe.',
    emailLabel: 'Aderesi ya imeri', emailPlaceholder: 'wewe@ikigo.bi',
    passwordLabel: 'Ijambo ryibanga', passwordPlaceholder: '••••••••',
    remember: 'Ibuka iminsi 30', forgotPassword: 'Wibagiwe ijambo ryibanga?',
    submit: 'Injira', loading: 'Injira…', noAccount: 'Nta konti ufite?', signUp: 'Iyandikishe',
    errorInvalid: 'Amakuru atari yo. Gerageza nanone.', errorRequired: 'Uzuza imirima yose.',
    panelTitle: 'Guhindura iterero ubwiza.',
    panelSubtitle: 'Zana umutunganyirizo no gucungura inzira z’abakiriya bawe.',
    panelSlogan: '« Igihe cyawe gifite agaciro. Tonde igishima. »',
    back: 'Subira ku rubuga',
    demoNote: 'Igerageza: nta konti y’ukuri igenzurwa.',
  },
  SW: {
    title: 'Ingia', subtitle: 'Fikia chumba cha udhibiti cha taasisi yako.',
    emailLabel: 'Anwani ya barua pepe', emailPlaceholder: 'wewe@taasisi.or.tz',
    passwordLabel: 'Nywila', passwordPlaceholder: '••••••••',
    remember: 'Kumbuka siku 30', forgotPassword: 'Umesahau nywila?',
    submit: 'Ingia', loading: 'Ingia…', noAccount: 'Huna akaunti?', signUp: 'Jisajili',
    errorInvalid: 'Vitambulisho vibaya. Jaribu tena.', errorRequired: 'Tafadhali jaza sehemu zote.',
    panelTitle: 'Kubadilisha kusubiri kuwa heshima.',
    panelSubtitle: 'Leta utaratibu na uwazi kwa watumiaji wako kupitia miundombinu bora ya usimamizi wa foleni.',
    panelSlogan: '"Wakati wako una thamani. Tonde unauenzi."',
    back: 'Rudi kwenye tovuti',
    demoNote: 'Onyesho: hakuna akaunti halisi inayothibitishwa.',
  },
};

const LANGUAGES: Language[] = ['FR', 'EN', 'RN', 'SW'];
const languageFlags: Record<Language, string> = { FR: '🇫🇷', EN: '🇬🇧', RN: '🇧🇮', SW: '🇹🇿' };

const panelFacts = [
  { value: '< 100 ms', label: 'Propagation des appels' },
  { value: '4', label: 'Interfaces synchronisées' },
  { value: 'RLS', label: 'Cloisonnement par institution' },
];

export default function LoginPage() {
  const router = useRouter();
  const [lang, setLang] = useState<Language>('FR');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const t = translations[lang];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password.trim()) { setError(t.errorRequired); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    router.push('/dashboard');
  };

  return (
    <div className="flex min-h-screen bg-brand-canvas">
      {/* ── FORM ── */}
      <div className="flex w-full flex-col lg:w-[52%]">
        <div className="flex items-center justify-between px-6 pt-6 sm:px-10">
          <Link href="/" className="flex items-center gap-2.5" aria-label="TONDE — retour à l’accueil">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-forest text-brand-sprout">
              <svg width="16" height="16" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                <path d="M11 2L20 7V15L11 20L2 15V7L11 2Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                <path d="M11 2V20M2 7L20 15M20 7L2 15" stroke="currentColor" strokeWidth="1.1" strokeOpacity="0.45" />
              </svg>
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-serif text-[17px] font-semibold text-brand-deep">TONDE</span>
              <span className="mt-0.5 whitespace-nowrap text-[8px] font-bold uppercase tracking-[0.26em] text-brand-leaf">
                Queue intelligence
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-0.5 rounded-full border border-brand-forest/15 p-0.5">
            {LANGUAGES.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLang(l)}
                aria-label={`Langue ${l}`}
                aria-pressed={lang === l}
                className={`flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold transition-colors ${
                  lang === l ? 'bg-brand-forest text-white' : 'text-brand-soil/50 hover:text-brand-forest'
                }`}
              >
                <span aria-hidden="true" className="hidden sm:inline">{languageFlags[l]}</span>
                {l}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10">
          <div className="w-full max-w-[380px]">
            <span className="kicker">
              <span className="kicker-number">Espace admin</span>
              Connexion
            </span>
            <h1 className="display-md mt-4 text-brand-deep">{t.title}</h1>
            <p className="mt-3 text-[14px] leading-7 text-brand-soil/60">{t.subtitle}</p>

            {error && (
              <div role="alert" className="mt-6 flex items-start gap-2 rounded-xl border border-[#f43f5e]/30 bg-[#f43f5e]/8 px-3.5 py-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#f43f5e]" aria-hidden="true" />
                <span className="text-[13px] leading-6 text-[#f43f5e]">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="mt-7">
              <div className="mb-4">
                <label htmlFor="email" className="mb-2 block text-[12px] font-semibold text-brand-soil/70">
                  {t.emailLabel}
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.emailPlaceholder}
                  disabled={loading}
                  className="field"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="mb-2 block text-[12px] font-semibold text-brand-soil/70">
                  {t.passwordLabel}
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t.passwordPlaceholder}
                    disabled={loading}
                    className="field pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-soil/35 transition-colors hover:text-brand-forest"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="mb-6 flex items-center justify-between gap-3">
                <label htmlFor="remember" className="flex cursor-pointer items-center gap-2">
                  <input
                    id="remember"
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="h-4 w-4 accent-brand-forest"
                  />
                  <span className="text-[12px] text-brand-soil/60">{t.remember}</span>
                </label>
                <button type="button" className="text-[12px] font-semibold text-brand-leaf hover:text-brand-forest">
                  {t.forgotPassword}
                </button>
              </div>

              <button type="submit" disabled={loading} className="btn btn-primary w-full" aria-busy={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    {t.loading}
                  </>
                ) : (
                  <>
                    {t.submit}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-[12.5px] text-brand-soil/55">
              {t.noAccount}{' '}
              <button type="button" className="font-semibold text-brand-leaf hover:text-brand-forest">
                {t.signUp}
              </button>
            </p>

            <p className="mt-6 rounded-xl border border-brand-forest/10 bg-brand-cream px-3.5 py-2.5 text-[11px] leading-6 text-brand-soil/50">
              {t.demoNote}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 px-6 pb-6 text-[11px] text-brand-soil/40 sm:flex-row sm:items-center sm:justify-between sm:px-10">
          <p>© {new Date().getFullYear()} TONDE. Tous droits réservés.</p>
          <Link href="/" className="hover:text-brand-forest">{t.back} →</Link>
        </div>
      </div>

      {/* ── PANEL ── */}
      <div className="relative hidden w-[48%] flex-col justify-between overflow-hidden bg-brand-deep p-10 text-white grain lg:flex xl:p-14">
        <div className="hero-grid absolute inset-0 opacity-15" aria-hidden="true" />

        <div className="relative z-10 flex items-center gap-3">
          <span className="h-px w-10 bg-brand-sprout/60" aria-hidden="true" />
          <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-brand-sprout">
            Infrastructure de gestion de flux
          </span>
        </div>

        <div className="relative z-10 max-w-lg">
          <h2 className="display-lg text-white">
            Transformer l’attente
            <span className="font-normal italic text-brand-light"> en dignité.</span>
          </h2>
          <p className="mt-6 text-[15px] leading-8 text-white/70">{t.panelSubtitle}</p>

          <p className="mt-8 border-l-2 border-brand-sprout/60 pl-5 font-serif text-lg italic leading-snug text-brand-light/90">
            {t.panelSlogan}
          </p>

          <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-white/12 pt-8">
            {panelFacts.map((fact) => (
              <div key={fact.label}>
                <dt className="font-serif text-[1.6rem] font-semibold leading-none text-brand-sprout">{fact.value}</dt>
                <dd className="mt-2 text-[10.5px] leading-5 text-white/50">{fact.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative z-10 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
          Burundi · RDC · Afrique de l’Est & Centrale
        </div>
      </div>
    </div>
  );
}
