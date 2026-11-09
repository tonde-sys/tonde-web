'use client';

import { useState, useEffect, useCallback } from 'react';
import { ArrowRightLeft, ChevronDown, AlertTriangle, UserCog, X, Zap, Lock, Unlock } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

type Priority = 'standard' | 'priority' | 'urgent' | 'vip';
type TicketState = 'waiting' | 'called' | 'serving' | 'done';
type GuichetState = 'online' | 'pause' | 'closed' | 'overflow';

interface Ticket { id: string; code: string; priority: Priority; service: string; client: string | null; createdAt: number; state: TicketState }
interface Guichet { id: string; number: string; agent: string; status: GuichetState; currentTicket: string | null; serviceStart: number | null; service: string }

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────

const now = Date.now();

const INITIAL_TICKETS: Ticket[] = [
  { id: '1', code: 'T-047', priority: 'vip', service: 'VIP Conseil', client: 'Marie Nkurunziza', createdAt: now - 720000, state: 'waiting' },
  { id: '2', code: 'T-048', priority: 'urgent', service: 'Urgence Méd.', client: null, createdAt: now - 512000, state: 'waiting' },
  { id: '3', code: 'T-049', priority: 'priority', service: 'Caisse', client: 'Aline Mukamana', createdAt: now - 310000, state: 'waiting' },
  { id: '4', code: 'T-050', priority: 'standard', service: 'Dépôt', client: null, createdAt: now - 225000, state: 'waiting' },
  { id: '5', code: 'T-051', priority: 'standard', service: 'Virement', client: 'Diane Uwera', createdAt: now - 140000, state: 'waiting' },
  { id: '6', code: 'T-052', priority: 'urgent', service: 'Retrait', client: null, createdAt: now - 95000, state: 'waiting' },
  { id: '7', code: 'T-053', priority: 'standard', service: 'Renseignements', client: 'Patrick Nsengimana', createdAt: now - 67000, state: 'waiting' },
  { id: '8', code: 'T-054', priority: 'priority', service: 'Crédit', client: null, createdAt: now - 42000, state: 'waiting' },
  { id: '9', code: 'T-055', priority: 'vip', service: 'VIP Conseil', client: 'Jean-Pierre Habimana', createdAt: now - 28000, state: 'waiting' },
];

const INITIAL_GUICHETS: Guichet[] = [
  { id: 'g1', number: 'G-01', agent: 'Isabelle M.', status: 'online', currentTicket: 'T-043', serviceStart: now - 480000, service: 'Ouverture Compte' },
  { id: 'g2', number: 'G-02', agent: 'Rodrigue K.', status: 'overflow', currentTicket: 'T-044', serviceStart: now - 960000, service: 'Retrait Caisse' },
  { id: 'g3', number: 'G-03', agent: 'Chantal N.', status: 'pause', currentTicket: null, serviceStart: null, service: 'Caisse' },
  { id: 'g4', number: 'G-04', agent: 'Eric B.', status: 'closed', currentTicket: null, serviceStart: null, service: 'Virements' },
  { id: 'g5', number: 'G-05', agent: 'Diane U.', status: 'online', currentTicket: 'T-045', serviceStart: now - 120000, service: 'Prêts' },
  { id: 'g6', number: 'G-06', agent: 'Patrick N.', status: 'online', currentTicket: 'T-046', serviceStart: now - 67000, service: 'Retrait Caisse' },
  { id: 'g7', number: 'G-07', agent: 'Marie K.', status: 'pause', currentTicket: null, serviceStart: null, service: 'Ouverture Compte' },
  { id: 'g8', number: 'G-08', agent: 'Jean-Claude M.', status: 'online', currentTicket: 'T-042', serviceStart: now - 300000, service: 'VIP' },
];

// ─────────────────────────────────────────────────────────────────────────────
// STYLE CONFIG
// ─────────────────────────────────────────────────────────────────────────────

const priorityCfg: Record<Priority, { label: string; color: string; bg: string }> = {
  standard: { label: 'Standard', color: '#f59e0b', bg: 'rgba(245,158,11,0.10)' },
  priority: { label: 'Prioritaire', color: '#10b981', bg: 'rgba(16,185,129,0.10)' },
  urgent: { label: 'Urgence', color: '#f43f5e', bg: 'rgba(244,63,94,0.10)' },
  vip: { label: 'VIP', color: '#0ea5e9', bg: 'rgba(14,165,233,0.10)' },
};

const guichetCfg: Record<GuichetState, { label: string; color: string; bg: string }> = {
  online: { label: 'En ligne', color: '#10b981', bg: 'rgba(16,185,129,0.10)' },
  pause: { label: 'En pause', color: '#f59e0b', bg: 'rgba(245,158,11,0.10)' },
  closed: { label: 'Fermé', color: '#64708a', bg: 'rgba(138,138,128,0.12)' },
  overflow: { label: 'Débordé', color: '#f43f5e', bg: 'rgba(244,63,94,0.10)' },
};

const priorityOrder: Record<Priority, number> = { urgent: 0, vip: 1, priority: 2, standard: 3 };

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function useTimer() {
  const [, setTick] = useState(0);
  useEffect(() => { const id = setInterval(() => setTick((t) => t + 1), 1000); return () => clearInterval(id); }, []);
}

function formatElapsed(ms: number): string {
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60).toString().padStart(2, '0');
  const s = (total % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// TICKET CARD
// ─────────────────────────────────────────────────────────────────────────────

function TicketCard({ ticket, onChangePriority, onTransfer }: {
  ticket: Ticket;
  onChangePriority: (id: string, p: Priority) => void;
  onTransfer: (id: string) => void;
}) {
  useTimer();
  const cfg = priorityCfg[ticket.priority];
  const elapsed = Date.now() - ticket.createdAt;
  const isOverdue = elapsed > 15 * 60 * 1000;

  return (
    <div
      className={`rounded-xl border bg-white px-3.5 py-3 transition-colors ${
        isOverdue ? 'border-[#f43f5e]/45' : 'border-brand-forest/12 hover:border-brand-forest/25'
      }`}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className={`app-num text-[13px] font-bold ${isOverdue ? 'text-[#f43f5e]' : 'text-brand-forest'}`}>
          {ticket.code}
        </span>
        <span className="app-badge" style={{ backgroundColor: cfg.bg, color: cfg.color }}>
          <span className="h-1 w-1 rounded-full" style={{ backgroundColor: cfg.color }} aria-hidden="true" />
          {cfg.label}
        </span>
      </div>

      <div className="mb-2.5 flex items-center justify-between gap-2">
        <span className="truncate text-[12px] font-medium text-brand-soil/70">{ticket.service}</span>
        {ticket.client && <span className="truncate text-[11px] text-brand-soil/65">{ticket.client}</span>}
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span
            className={`app-num text-[12px] font-semibold ${isOverdue ? 'text-[#f43f5e]' : 'text-brand-soil/45'}`}
            style={{ animation: isOverdue ? 'blink-soft 1.6s ease-in-out infinite' : 'none' }}
          >
            {formatElapsed(elapsed)}
          </span>
          {isOverdue && (
            <span className="rounded bg-[#f43f5e]/10 px-1.5 py-0.5 text-[9px] font-bold tracking-[0.04em] text-[#f43f5e]">
              DÉPASSÉ
            </span>
          )}
        </div>

        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={() => onTransfer(ticket.id)}
            title="Transférer le ticket"
            aria-label={`Transférer le ticket ${ticket.code}`}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-brand-soil/55 transition-colors hover:bg-brand-forest/8 hover:text-brand-forest"
          >
            <ArrowRightLeft size={13} />
          </button>

          <div className="group relative">
            <button
              type="button"
              title="Changer la priorité"
              aria-label={`Changer la priorité du ticket ${ticket.code}`}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-brand-soil/55 transition-colors hover:bg-[#f59e0b]/10 hover:text-[#f59e0b]"
            >
              <Zap size={13} />
            </button>
            <div className="absolute bottom-full right-0 z-20 mb-1 hidden min-w-[132px] overflow-hidden rounded-xl border border-brand-forest/12 bg-white shadow-[0_20px_50px_-28px_rgba(10,14,26,0.5)] group-hover:block group-focus-within:block">
              {(Object.keys(priorityCfg) as Priority[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => onChangePriority(ticket.id, p)}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-[12px] transition-colors hover:bg-brand-forest/5"
                  style={{ color: priorityCfg[p].color, backgroundColor: ticket.priority === p ? priorityCfg[p].bg : 'transparent' }}
                >
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: priorityCfg[p].color }} aria-hidden="true" />
                  {priorityCfg[p].label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GUICHET CARD
// ─────────────────────────────────────────────────────────────────────────────

function GuichetCard({ guichet, onAction }: {
  guichet: Guichet;
  onAction: (g: Guichet, action: 'transfer' | 'toggle' | 'call') => void;
}) {
  useTimer();
  const cfg = guichetCfg[guichet.status];
  const serviceElapsed = guichet.serviceStart ? Date.now() - guichet.serviceStart : 0;
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative rounded-2xl border border-brand-forest/12 bg-white p-4">
      <span
        className="absolute inset-y-3 left-0 w-[3px] rounded-full"
        style={{ backgroundColor: cfg.color, opacity: guichet.status === 'closed' ? 0.3 : 0.9 }}
        aria-hidden="true"
      />

      <div className="mb-3 flex items-start justify-between gap-2 pl-2">
        <div>
          <span className="app-num text-[13px] font-bold text-brand-deep">{guichet.number}</span>
          <p className="mt-0.5 text-[11px] text-brand-soil/45">{guichet.service}</p>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="app-badge" style={{ color: cfg.color, backgroundColor: cfg.bg }}>
            <span
              className="h-1 w-1 rounded-full"
              style={{
                backgroundColor: cfg.color,
                animation: guichet.status === 'online' || guichet.status === 'overflow' ? 'pulse-soft 2s ease-in-out infinite' : 'none',
              }}
              aria-hidden="true"
            />
            {cfg.label}
          </span>

          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={`Actions du guichet ${guichet.number}`}
              aria-expanded={menuOpen}
              className="flex h-6 w-6 items-center justify-center rounded-md text-brand-soil/35 transition-colors hover:bg-brand-forest/8 hover:text-brand-forest"
            >
              <ChevronDown size={13} />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} aria-hidden="true" />
                <div className="absolute right-0 top-full z-20 mt-1 min-w-[172px] overflow-hidden rounded-xl border border-brand-forest/12 bg-white shadow-[0_20px_50px_-28px_rgba(10,14,26,0.5)]">
                  {[
                    { icon: ArrowRightLeft, label: 'Transférer ticket', action: 'transfer' as const, color: '#0ea5e9' },
                    { icon: UserCog, label: 'Réaffecter agent', action: 'call' as const, color: '#10b981' },
                    {
                      icon: guichet.status === 'closed' ? Unlock : Lock,
                      label: guichet.status === 'closed' ? 'Ouvrir le guichet' : 'Fermer le guichet',
                      action: 'toggle' as const,
                      color: guichet.status === 'closed' ? '#10b981' : '#f43f5e',
                    },
                  ].map(({ icon: Icon, label, action, color }) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => { onAction(guichet, action); setMenuOpen(false); }}
                      className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-[12px] font-medium transition-colors hover:bg-brand-forest/5"
                      style={{ color }}
                    >
                      <Icon size={13} />
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mb-3 flex items-center gap-2 pl-2">
        <span
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-brand-sprout"
          style={{ backgroundColor: '#6c47ff' }}
          aria-hidden="true"
        >
          {guichet.agent[0]}
        </span>
        <span className="text-[12px] font-medium text-brand-soil/70">{guichet.agent}</span>
      </div>

      {guichet.currentTicket ? (
        <div className="rounded-xl bg-brand-canvas px-3 py-2.5">
          <div className="flex items-center justify-between">
            <span className="app-num text-[13px] font-bold text-brand-forest">{guichet.currentTicket}</span>
            <span className={`app-num text-[12px] font-semibold ${guichet.status === 'overflow' ? 'text-[#f43f5e]' : 'text-[#10b981]'}`}>
              {formatElapsed(serviceElapsed)}
            </span>
          </div>
          <p className="mt-0.5 text-[11px] text-brand-soil/40">En cours de traitement</p>
          {guichet.status === 'overflow' && (
            <div className="mt-2 flex items-center gap-1.5">
              <AlertTriangle size={11} className="text-[#f43f5e]" aria-hidden="true" />
              <span className="text-[10px] font-semibold text-[#f43f5e]">Durée dépassée — intervention requise</span>
            </div>
          )}
        </div>
      ) : (
        <div className="flex min-h-[58px] items-center justify-center rounded-xl border border-dashed border-brand-forest/15 bg-brand-canvas/60 px-3">
          <span className="text-[12px] text-brand-soil/35">
            {guichet.status === 'closed' ? 'Guichet fermé' : 'En attente d’un ticket'}
          </span>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TRANSFER MODAL
// ─────────────────────────────────────────────────────────────────────────────

function TransferModal({ ticketCode, guichets, onConfirm, onClose }: {
  ticketCode: string; guichets: Guichet[];
  onConfirm: (guichetId: string) => void; onClose: () => void;
}) {
  const [selected, setSelected] = useState('');
  const available = guichets.filter((g) => g.status === 'online' && !g.currentTicket);

  return (
    <>
      <div className="fixed inset-0 z-40 bg-brand-deep/40 backdrop-blur-[2px]" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="transfer-title"
        className="fixed left-1/2 top-1/2 z-50 w-[420px] max-w-[92vw] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-brand-forest/12 bg-white shadow-[0_40px_90px_-40px_rgba(10,14,26,0.6)]"
      >
        <div className="flex items-start justify-between gap-4 border-b border-brand-forest/10 px-5 py-4">
          <div>
            <h2 id="transfer-title" className="font-serif text-[17px] font-semibold text-brand-deep">
              Transférer le ticket
            </h2>
            <p className="mt-1 text-[12px] text-brand-soil/55">
              Ticket <span className="app-num font-semibold text-brand-forest">{ticketCode}</span> vers un guichet disponible
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="text-brand-soil/35 transition-colors hover:text-brand-forest"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-2 p-4">
          {available.length === 0 ? (
            <p className="px-2 py-6 text-center text-[13px] text-brand-soil/45">Aucun guichet disponible</p>
          ) : (
            available.map((g) => {
              const isSelected = selected === g.id;
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setSelected(g.id)}
                  aria-pressed={isSelected}
                  className={`flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
                    isSelected ? 'border-brand-forest bg-brand-forest/6' : 'border-brand-forest/12 hover:border-brand-forest/30'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" aria-hidden="true" />
                    <span className="app-num text-[13px] font-semibold text-brand-deep">{g.number}</span>
                    <span className="text-[12px] text-brand-soil/50">{g.agent}</span>
                  </span>
                  <span className="text-[11px] text-brand-soil/40">{g.service}</span>
                </button>
              );
            })
          )}
        </div>

        <div className="flex gap-3 border-t border-brand-forest/10 px-5 py-4">
          <button type="button" onClick={onClose} className="app-btn app-btn-outline flex-1">
            Annuler
          </button>
          <button
            type="button"
            onClick={() => selected && onConfirm(selected)}
            disabled={!selected}
            className={`app-btn flex-1 ${selected ? 'app-btn-primary' : 'cursor-not-allowed bg-brand-forest/10 text-brand-soil/35'}`}
          >
            Confirmer le transfert
          </button>
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function QueuePage() {
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
  const [guichets, setGuichets] = useState<Guichet[]>(INITIAL_GUICHETS);
  const [degraded, setDegraded] = useState(false);
  const [degradedSecs, setDegradedSecs] = useState(0);
  const [transferTarget, setTransferTarget] = useState<string | null>(null);

  useEffect(() => {
    let counter = 60;
    const priorities: Priority[] = ['standard', 'standard', 'standard', 'priority', 'urgent', 'vip'];
    const services = ['Caisse', 'Dépôt', 'Virement', 'Crédit', 'Retrait', 'Renseignements'];
    const id = setInterval(() => {
      counter++;
      setTickets((prev) => [...prev, {
        id: String(counter), code: `T-0${counter}`,
        priority: priorities[Math.floor(Math.random() * priorities.length)],
        service: services[Math.floor(Math.random() * services.length)],
        client: null, createdAt: Date.now(), state: 'waiting',
      }]);
    }, 18000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => { const id = setInterval(() => setDegraded((d) => !d), 45000); return () => clearInterval(id); }, []);
  useEffect(() => {
    if (!degraded) { setDegradedSecs(0); return; }
    const id = setInterval(() => setDegradedSecs((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [degraded]);

  const sortedTickets = [...tickets].sort((a, b) => {
    const pd = priorityOrder[a.priority] - priorityOrder[b.priority];
    return pd !== 0 ? pd : a.createdAt - b.createdAt;
  });

  const handleChangePriority = useCallback((ticketId: string, priority: Priority) => {
    setTickets((prev) => prev.map((t) => (t.id === ticketId ? { ...t, priority } : t)));
  }, []);

  const handleTransferConfirm = useCallback((guichetId: string) => {
    if (!transferTarget) return;
    const ticket = tickets.find((t) => t.id === transferTarget);
    if (!ticket) return;
    setGuichets((prev) => prev.map((g) =>
      g.id === guichetId ? { ...g, currentTicket: ticket.code, serviceStart: Date.now(), status: 'online' } : g
    ));
    setTickets((prev) => prev.filter((t) => t.id !== transferTarget));
    setTransferTarget(null);
  }, [transferTarget, tickets]);

  const handleGuichetAction = useCallback((guichet: Guichet, action: 'transfer' | 'toggle' | 'call') => {
    if (action === 'toggle') {
      setGuichets((prev) => prev.map((g) =>
        g.id === guichet.id ? { ...g, status: g.status === 'closed' ? 'online' : 'closed', currentTicket: null, serviceStart: null } : g
      ));
    }
  }, []);

  const transferTicket = transferTarget ? tickets.find((t) => t.id === transferTarget) : null;
  const totalWaiting = tickets.length;
  const onlineCount = guichets.filter((g) => g.status === 'online' || g.status === 'overflow').length;
  const overflowCount = guichets.filter((g) => g.status === 'overflow').length;
  const urgentCount = tickets.filter((t) => t.priority === 'urgent' || t.priority === 'vip').length;

  return (
    <div className="mx-auto flex h-full w-full max-w-[1600px] flex-col gap-4 px-5 py-7 sm:px-7">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="kicker">
            <span className="kicker-number">Temps réel</span>
            Supervision
          </span>
          <h1 className="display-md mt-3 text-brand-deep">File d’attente &amp; guichets</h1>
          <p className="mt-1 text-[13px] text-brand-soil/50">Gestion temps réel des tickets et des postes ouverts</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {[
            { label: 'En attente', value: totalWaiting, tone: '#6c47ff' },
            { label: 'Guichets actifs', value: `${onlineCount}/8`, tone: '#10b981' },
            { label: 'Urgences', value: urgentCount, tone: '#f43f5e' },
            { label: 'Débordés', value: overflowCount, tone: '#f59e0b' },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-brand-forest/12 bg-white px-4 py-2 text-center">
              <p className="app-num text-[17px] font-semibold leading-none" style={{ color: s.tone }}>
                {s.value}
              </p>
              <p className="mt-1 text-[10px] text-brand-soil/45">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {degraded && (
        <div
          role="status"
          className="flex items-center gap-3 rounded-xl border border-[#f59e0b]/30 bg-[#f59e0b]/8 px-4 py-2.5"
        >
          <AlertTriangle size={14} className="text-[#f59e0b]" aria-hidden="true" />
          <span className="text-[12.5px] font-medium text-[#f59e0b]">
            Mode dégradé — dernière mise à jour il y a {degradedSecs} seconde{degradedSecs > 1 ? 's' : ''}
          </span>
        </div>
      )}

      <div className="flex min-h-0 flex-1 flex-col gap-4 lg:flex-row">
        {/* LEFT — flux en attente */}
        <div className="flex w-full flex-col lg:w-[32%] lg:min-w-[280px]">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 className="font-sans flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-brand-soil/60">
              Flux en attente
              <span className="app-num rounded-full bg-brand-forest/8 px-1.5 py-0.5 text-[10px] font-bold text-brand-forest">
                {totalWaiting}
              </span>
            </h2>
            <span className="flex items-center gap-1.5">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{
                  backgroundColor: degraded ? '#f59e0b' : '#10b981',
                  animation: 'pulse-soft 2s ease-in-out infinite',
                }}
                aria-hidden="true"
              />
              <span className={`text-[10px] font-bold ${degraded ? 'text-[#f59e0b]' : 'text-[#10b981]'}`}>
                {degraded ? 'Dégradé' : 'Temps réel'}
              </span>
            </span>
          </div>

          <div className="app-scroll flex max-h-[calc(100vh-260px)] flex-col gap-2 overflow-y-auto pr-1">
            {sortedTickets.map((t) => (
              <TicketCard key={t.id} ticket={t} onChangePriority={handleChangePriority} onTransfer={setTransferTarget} />
            ))}
          </div>
        </div>

        {/* RIGHT — guichets */}
        <div className="app-scroll min-w-0 flex-1 overflow-y-auto">
          <h2 className="font-sans mb-3 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-brand-soil/60">
            Guichets
            <span className="app-num rounded-full bg-[#10b981]/10 px-1.5 py-0.5 text-[10px] font-bold text-[#10b981]">
              {onlineCount} actifs
            </span>
          </h2>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {guichets.map((g) => (
              <GuichetCard key={g.id} guichet={g} onAction={handleGuichetAction} />
            ))}
          </div>
        </div>
      </div>

      {transferTicket && (
        <TransferModal
          ticketCode={transferTicket.code}
          guichets={guichets}
          onConfirm={handleTransferConfirm}
          onClose={() => setTransferTarget(null)}
        />
      )}

      <style>{`
        @keyframes pulse-soft { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
        @keyframes blink-soft { 0%, 100% { opacity: 1; } 50% { opacity: 0.45; } }
      `}</style>
    </div>
  );
}
