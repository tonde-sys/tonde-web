'use client';

import { useState, useEffect, useRef, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, ListOrdered, MapPin, Users, BarChart3,
  Settings, LogOut, ChevronDown, ChevronRight, Menu, X,
  Bell, Search, BookOpen, UserCog, Wifi, WifiOff,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

type Language = 'FR' | 'EN' | 'RN' | 'SW';
type WsState = 'live' | 'reconnecting' | 'offline';
type UserRole = 'ADMIN_ORG' | 'SUPERVISOR' | 'AGENT';

interface Agency { id: string; label: string; agencyId: string }

// ─────────────────────────────────────────────────────────────────────────────
// STATIC DATA
// ─────────────────────────────────────────────────────────────────────────────

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, labels: { FR: 'Aperçu', EN: 'Overview', RN: 'Incamake', SW: 'Muhtasari' } },
  { to: '/queue', icon: ListOrdered, labels: { FR: "Files d'attente", EN: 'Queues', RN: 'Imirongo', SW: 'Foleni' } },
  { to: '/locations', icon: MapPin, labels: { FR: 'Agences', EN: 'Locations', RN: 'Amashami', SW: 'Matawi' } },
  { to: '/agents', icon: Users, labels: { FR: 'Agents', EN: 'Agents', RN: 'Abakozi', SW: 'Mawakala' } },
  { to: '/analytics', icon: BarChart3, labels: { FR: 'Statistiques', EN: 'Analytics', RN: 'Imibare', SW: 'Takwimu' } },
  { to: '/settings', icon: Settings, labels: { FR: 'Paramètres', EN: 'Settings', RN: 'Igenamiterere', SW: 'Mipangilio' } },
];

const LANGS: Language[] = ['FR', 'EN', 'RN', 'SW'];
const langFlags: Record<Language, string> = { FR: '🇫🇷', EN: '🇬🇧', RN: '🇧🇮', SW: '🇹🇿' };

const agencies: Agency[] = [
  { id: '1', label: 'Banque de la République — Siège', agencyId: 'BUJ-001' },
  { id: '2', label: 'Banque de la République — Rohero', agencyId: 'BUJ-002' },
  { id: '3', label: 'Agence Gitega — Centre', agencyId: 'GIT-001' },
  { id: '4', label: 'Agence Goma Nord', agencyId: 'GOM-001' },
  { id: '5', label: 'Agence Kigali Centre', agencyId: 'KGL-001' },
];

const roleConfig: Record<UserRole, { label: string; color: string; bg: string }> = {
  ADMIN_ORG: { label: 'ADMIN_ORG', color: '#6c47ff', bg: 'rgba(108,71,255,0.10)' },
  SUPERVISOR: { label: 'SUPERVISOR', color: '#0ea5e9', bg: 'rgba(14,165,233,0.12)' },
  AGENT: { label: 'AGENT', color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
};

const logoutLabel: Record<Language, string> = { FR: 'Déconnexion', EN: 'Sign out', RN: 'Gusohoka', SW: 'Toka' };
const settingsLabel: Record<Language, string> = { FR: 'Paramètres', EN: 'Settings', RN: 'Igenamiterere', SW: 'Mipangilio' };
const docsLabel: Record<Language, string> = { FR: 'Documentation API', EN: 'API Docs', RN: 'Inyandiko API', SW: 'Docs API' };
const accountLabel: Record<Language, string> = { FR: 'Mon compte', EN: 'My account', RN: 'Konti yanjye', SW: 'Akaunti' };
const searchLabel: Record<Language, string> = {
  FR: 'Rechercher un ticket ou un agent…', EN: 'Search ticket or agent…',
  RN: 'Shakisha…', SW: 'Tafuta…',
};

const notifTone: Record<string, { dot: string; bg: string }> = {
  critical: { dot: '#f43f5e', bg: 'rgba(244,63,94,0.08)' },
  warning: { dot: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
  info: { dot: '#0ea5e9', bg: 'rgba(14,165,233,0.08)' },
};

const mockNotifications = [
  { id: 1, level: 'critical', msg: 'Guichet G-04 inactif depuis 8 min', time: 'il y a 3 min' },
  { id: 2, level: 'critical', msg: "File 'Retrait' saturée — attente > 45 min", time: 'il y a 7 min' },
  { id: 3, level: 'warning', msg: 'TMT dépasse le seuil configuré (15 min)', time: 'il y a 11 min' },
  { id: 4, level: 'info', msg: '3 tickets VIP sans agent assigné', time: 'il y a 18 min' },
];

// ─────────────────────────────────────────────────────────────────────────────
// WS BADGE
// ─────────────────────────────────────────────────────────────────────────────

function WsBadge() {
  const [state, setState] = useState<WsState>('live');

  useEffect(() => {
    if (state !== 'live') {
      const t = setTimeout(() => setState(state === 'reconnecting' ? 'live' : 'reconnecting'), 3000);
      return () => clearTimeout(t);
    }
  }, [state]);

  const cfg = {
    live: { dot: '#10b981', text: 'text-[#10b981]', ring: 'border-[#10b981]/25 bg-[#10b981]/8', label: 'LIVE', icon: <Wifi size={11} /> },
    reconnecting: { dot: '#f59e0b', text: 'text-[#f59e0b]', ring: 'border-[#f59e0b]/25 bg-[#f59e0b]/8', label: 'RECONNEXION', icon: <Wifi size={11} /> },
    offline: { dot: '#f43f5e', text: 'text-[#f43f5e]', ring: 'border-[#f43f5e]/25 bg-[#f43f5e]/8', label: 'HORS LIGNE', icon: <WifiOff size={11} /> },
  }[state];

  return (
    <button
      type="button"
      onClick={() => setState(state === 'live' ? 'offline' : 'live')}
      title="Statut de la connexion temps réel"
      className={`hidden items-center gap-1.5 rounded-full border px-2.5 py-1 transition-colors sm:flex ${cfg.ring}`}
    >
      <span className={cfg.text}>{cfg.icon}</span>
      <span
        className="h-1.5 w-1.5 shrink-0 rounded-full"
        style={{ backgroundColor: cfg.dot, animation: state === 'live' ? 'pulse-soft 2s ease-in-out infinite' : 'none' }}
        aria-hidden="true"
      />
      <span className={`text-[9px] font-extrabold tracking-[0.1em] ${cfg.text}`}>{cfg.label}</span>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// NOTIFICATIONS
// ─────────────────────────────────────────────────────────────────────────────

function NotificationsBell() {
  const [open, setOpen] = useState(false);
  const [read, setRead] = useState<number[]>([]);
  const ref = useRef<HTMLDivElement>(null);
  const unread = mockNotifications.filter((n) => !read.includes(n.id));

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label={`${unread.length} alertes non lues`}
        aria-expanded={open}
        className="relative flex h-9 w-9 items-center justify-center rounded-full text-brand-soil/55 transition-colors hover:bg-brand-forest/6 hover:text-brand-forest"
      >
        <Bell size={16} />
        {unread.length > 0 && (
          <span
            className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#f43f5e] px-1 text-[9px] font-bold text-white ring-2 ring-brand-canvas"
            aria-hidden="true"
          >
            {unread.length}
          </span>
        )}
      </button>

      {open && (
        <div className="app-surface absolute right-0 top-full z-50 mt-2 w-[320px] overflow-hidden shadow-[0_24px_60px_-30px_rgba(10,14,26,0.45)]">
          <div className="flex items-center justify-between border-b border-brand-forest/10 px-4 py-3">
            <span className="text-[13px] font-semibold text-brand-deep">Notifications</span>
            {unread.length > 0 && (
              <button
                type="button"
                onClick={() => setRead(mockNotifications.map((n) => n.id))}
                className="text-[11px] font-semibold text-brand-leaf hover:text-brand-forest"
              >
                Tout marquer lu
              </button>
            )}
          </div>
          <div className="max-h-[280px] overflow-y-auto app-scroll">
            {mockNotifications.map((n) => {
              const tone = notifTone[n.level];
              const isRead = read.includes(n.id);
              return (
                <div
                  key={n.id}
                  className="flex items-start gap-3 border-b border-brand-forest/8 px-4 py-3 last:border-b-0"
                  style={{ backgroundColor: isRead ? 'transparent' : tone.bg, opacity: isRead ? 0.5 : 1 }}
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: tone.dot }} />
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] leading-relaxed text-brand-soil/85">{n.msg}</p>
                    <p className="mt-0.5 text-[10px] text-brand-soil/40">{n.time}</p>
                  </div>
                  {!isRead && (
                    <button
                      type="button"
                      onClick={() => setRead((r) => [...r, n.id])}
                      aria-label="Marquer comme lu"
                      className="shrink-0 text-[15px] leading-none text-brand-soil/35 hover:text-brand-forest"
                    >
                      ×
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          <div className="border-t border-brand-forest/10 px-4 py-2.5">
            <Link href="/dashboard" className="text-[12px] font-semibold text-brand-leaf hover:text-brand-forest">
              Voir toutes les alertes →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// AGENCY SELECTOR
// ─────────────────────────────────────────────────────────────────────────────

function AgencySelector() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<Agency>(agencies[0]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative hidden md:block">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label="Changer d’agence"
        className="flex max-w-[280px] items-center gap-2 rounded-full border border-brand-forest/15 px-3 py-1.5 transition-colors hover:border-brand-forest/40"
      >
        <span className="flex min-w-0 flex-col items-start">
          <span className="max-w-[190px] truncate text-[12px] font-semibold leading-tight text-brand-deep">
            {current.label}
          </span>
          <span className="app-num text-[10px] leading-tight text-brand-soil/45">{current.agencyId}</span>
        </span>
        <ChevronDown size={13} className="shrink-0 text-brand-soil/40" />
      </button>

      {open && (
        <div className="app-surface absolute left-0 top-full z-50 mt-2 min-w-[290px] overflow-hidden shadow-[0_24px_60px_-30px_rgba(10,14,26,0.45)]">
          <p className="app-label px-4 pb-1.5 pt-3">Changer d’agence</p>
          {agencies.map((ag) => {
            const isCurrent = ag.id === current.id;
            return (
              <button
                key={ag.id}
                type="button"
                onClick={() => { setCurrent(ag); setOpen(false); }}
                className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left transition-colors ${
                  isCurrent ? 'bg-brand-forest/6' : 'hover:bg-brand-forest/4'
                }`}
              >
                <span className={`text-[13px] ${isCurrent ? 'font-semibold text-brand-forest' : 'text-brand-soil/80'}`}>
                  {ag.label}
                </span>
                <span className="app-num text-[10px] text-brand-soil/40">{ag.agencyId}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LANGUAGE SELECTOR
// ─────────────────────────────────────────────────────────────────────────────

function LangSelector({ lang, setLang }: { lang: Language; setLang: (l: Language) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label={`Langue : ${lang}`}
        className="flex items-center gap-1.5 rounded-full border border-brand-forest/15 px-2.5 py-1.5 text-[11px] font-bold text-brand-soil/70 transition-colors hover:border-brand-forest/40"
      >
        <span aria-hidden="true">{langFlags[lang]}</span>
        <span>{lang}</span>
        <ChevronDown size={11} />
      </button>
      {open && (
        <div className="app-surface absolute right-0 top-full z-50 mt-2 min-w-[110px] overflow-hidden shadow-[0_24px_60px_-30px_rgba(10,14,26,0.45)]">
          {LANGS.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => { setLang(l); setOpen(false); }}
              className={`flex w-full items-center gap-2.5 px-3 py-2 text-[12px] font-medium transition-colors ${
                l === lang ? 'bg-brand-forest/6 text-brand-forest' : 'text-brand-soil/70 hover:bg-brand-forest/4'
              }`}
            >
              <span aria-hidden="true">{langFlags[l]}</span>
              <span>{l}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GLOBAL SEARCH
// ─────────────────────────────────────────────────────────────────────────────

function GlobalSearch({ lang }: { lang: Language }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 50); }, [open]);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); setOpen(true); }
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Recherche globale"
        className="hidden min-w-[200px] items-center gap-2 rounded-full border border-brand-forest/15 px-3 py-1.5 text-brand-soil/45 transition-colors hover:border-brand-forest/40 lg:flex"
      >
        <Search size={13} />
        <span className="flex-1 text-left text-[12px]">{searchLabel[lang]}</span>
        <kbd className="rounded border border-brand-forest/15 px-1 py-0.5 text-[9px] font-semibold text-brand-soil/40">⌘K</kbd>
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-brand-deep/35 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="app-surface fixed left-1/2 top-24 z-50 w-[520px] max-w-[92vw] -translate-x-1/2 overflow-hidden shadow-[0_40px_80px_-40px_rgba(10,14,26,0.6)]">
            <div className="flex items-center gap-3 border-b border-brand-forest/10 px-4 py-3">
              <Search size={15} className="text-brand-soil/40" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={searchLabel[lang]}
                aria-label={searchLabel[lang]}
                className="flex-1 border-0 bg-transparent text-[14px] text-brand-deep outline-none placeholder:text-brand-soil/35"
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded border border-brand-forest/15 px-1.5 py-0.5 text-[10px] font-semibold text-brand-soil/40"
              >
                ESC
              </button>
            </div>
            <div className="p-4">
              {q ? (
                <p className="py-4 text-center text-[13px] text-brand-soil/45">Aucun résultat pour « {q} »</p>
              ) : (
                <div>
                  <p className="app-label mb-2">Recherches récentes</p>
                  {['T-047', 'Rodrigue K.', 'Agence Rohero'].map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setQ(item)}
                      className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-brand-forest/5"
                    >
                      <Search size={13} className="text-brand-soil/30" />
                      <span className="text-[13px] text-brand-soil/75">{item}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PROFILE MENU
// ─────────────────────────────────────────────────────────────────────────────

function ProfileMenu({ lang, onLogout }: { lang: Language; onLogout: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const role: UserRole = 'ADMIN_ORG';
  const roleCfg = roleConfig[role];

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex items-center gap-2 rounded-full border border-transparent px-1.5 py-1 transition-colors hover:border-brand-forest/15 hover:bg-brand-forest/4"
      >
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12px] font-bold text-brand-sprout"
          style={{ backgroundColor: '#6c47ff' }}
          aria-hidden="true"
        >
          A
        </span>
        <span className="hidden flex-col items-start sm:flex">
          <span className="text-[12px] font-semibold leading-tight text-brand-deep">Administrateur</span>
          <span
            className="rounded px-1 text-[9px] font-bold tracking-[0.04em]"
            style={{ color: roleCfg.color, backgroundColor: roleCfg.bg }}
          >
            {roleCfg.label}
          </span>
        </span>
        <ChevronDown size={12} className="text-brand-soil/40" />
      </button>

      {open && (
        <div className="app-surface absolute right-0 top-full z-50 mt-2 min-w-[230px] overflow-hidden shadow-[0_24px_60px_-30px_rgba(10,14,26,0.45)]">
          <div className="border-b border-brand-forest/10 px-4 py-3">
            <div className="flex items-center gap-3">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-full text-[13px] font-bold text-brand-sprout"
                style={{ backgroundColor: '#6c47ff' }}
              >
                A
              </span>
              <div>
                <p className="text-[13px] font-semibold text-brand-deep">Administrateur</p>
                <p className="text-[11px] text-brand-soil/50">admin@tonde.app</p>
              </div>
            </div>
            <span
              className="mt-2 inline-block rounded px-2 py-0.5 text-[10px] font-bold tracking-[0.04em]"
              style={{ color: roleCfg.color, backgroundColor: roleCfg.bg }}
            >
              {roleCfg.label}
            </span>
          </div>

          <div className="py-1">
            {[
              { icon: UserCog, label: accountLabel[lang], to: '/settings' },
              { icon: Settings, label: settingsLabel[lang], to: '/settings' },
              { icon: BookOpen, label: docsLabel[lang], to: 'https://fastapi.tonde.app/docs', external: true },
            ].map(({ icon: Icon, label, to, external }) =>
              external ? (
                <a
                  key={label}
                  href={to}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 px-4 py-2.5 text-[13px] text-brand-soil/75 transition-colors hover:bg-brand-forest/5 hover:text-brand-forest"
                >
                  <Icon size={14} />
                  <span>{label}</span>
                  <ChevronRight size={11} className="ml-auto opacity-40" />
                </a>
              ) : (
                <Link
                  key={label}
                  href={to}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-[13px] text-brand-soil/75 transition-colors hover:bg-brand-forest/5 hover:text-brand-forest"
                >
                  <Icon size={14} />
                  <span>{label}</span>
                </Link>
              )
            )}
          </div>

          <div className="border-t border-brand-forest/10">
            <button
              type="button"
              onClick={() => { setOpen(false); onLogout(); }}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-[#f43f5e] transition-colors hover:bg-[#f43f5e]/8"
            >
              <LogOut size={14} />
              <span>{logoutLabel[lang]}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN SHELL
// ─────────────────────────────────────────────────────────────────────────────

function AdminShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [lang, setLang] = useState<Language>('FR');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  const handleLogout = () => router.push('/login');

  return (
    <div className="flex h-screen overflow-hidden bg-brand-canvas">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-brand-deep/40 backdrop-blur-[2px] lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ══ SIDEBAR — scène sombre ══ */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[248px] flex-col bg-brand-deep transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 shrink-0 items-center gap-3 border-b border-white/10 px-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-tonde.svg" alt="TONDE logo" width={36} height={36} className="shrink-0 rounded-xl" />
          <span className="flex flex-col leading-none">
            <span className="font-serif text-[17px] font-semibold tracking-tight text-white">TONDE</span>
            <span className="mt-1 text-[8px] font-bold uppercase tracking-[0.26em] text-brand-sprout/80">
              Queue intelligence
            </span>
          </span>
          <button
            type="button"
            className="ml-auto lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Fermer le menu"
          >
            <X size={17} className="text-white/60" />
          </button>
        </div>

        <nav aria-label="Navigation du dashboard" className="app-scroll flex-1 overflow-y-auto px-3 py-5">
          <p className="mb-2 px-3 text-[9px] font-bold uppercase tracking-[0.24em] text-white/30">Pilotage</p>
          <ul className="flex flex-col gap-0.5">
            {navItems.map(({ to, icon: Icon, labels }) => {
              const isActive = pathname === to || (to !== '/dashboard' && pathname.startsWith(to));
              return (
                <li key={to}>
                  <Link
                    href={to}
                    aria-current={isActive ? 'page' : undefined}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-colors ${
                      isActive
                        ? 'bg-brand-sprout text-brand-deep'
                        : 'text-white/60 hover:bg-white/6 hover:text-white'
                    }`}
                  >
                    <Icon size={16} strokeWidth={1.9} />
                    <span>{labels[lang]}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-white/10 px-3 py-4">
          <div className="mb-3 rounded-xl bg-white/4 px-3 py-2.5">
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-brand-sprout/70">Version pilote</p>
            <p className="mt-1 text-[11px] leading-relaxed text-white/45">
              Données de démonstration — aucun backend connecté.
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-white/45 transition-colors hover:bg-[#f43f5e]/15 hover:text-[#fecdd3]"
          >
            <LogOut size={16} strokeWidth={1.9} />
            <span>{logoutLabel[lang]}</span>
          </button>
        </div>
      </aside>

      {/* ══ MAIN ══ */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex h-16 shrink-0 items-center gap-3 border-b border-brand-forest/10 bg-brand-canvas px-4">
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-forest/15 text-brand-forest lg:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Ouvrir le menu"
          >
            <Menu size={18} />
          </button>

          <AgencySelector />
          <GlobalSearch lang={lang} />

          <div className="ml-auto flex items-center gap-1.5">
            <WsBadge />
            <NotificationsBell />
            <LangSelector lang={lang} setLang={setLang} />
            <span className="mx-1 hidden h-5 w-px bg-brand-forest/15 sm:block" aria-hidden="true" />
            <ProfileMenu lang={lang} onLogout={handleLogout} />
          </div>
        </header>

        <main className="app-scroll flex-1 overflow-y-auto bg-brand-canvas">{children}</main>
      </div>

      <style>{`
        @keyframes pulse-soft { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
      `}</style>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
