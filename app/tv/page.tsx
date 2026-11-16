"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  BellRing,
  Maximize2,
  Play,
  Volume2,
  VolumeX,
  Wifi,
} from "lucide-react";

import { QrCodeSvg } from "@/components/ui/qr-code-svg";
import { APK_CONFIG, tondeWs } from "@/lib/tonde-client";

interface CalledTicket {
  code: string;
  counter: string;
  service: string;
  priority: "standard" | "priority" | "urgent" | "vip";
  calledAt: string;
}

const INITIAL_CALLS: CalledTicket[] = [
  {
    code: "A-042",
    counter: "G-03",
    service: "Retrait caisse",
    priority: "standard",
    calledAt: "À l’instant",
  },
  {
    code: "V-014",
    counter: "G-08",
    service: "VIP Conseil",
    priority: "vip",
    calledAt: "il y a 1 min",
  },
  {
    code: "U-009",
    counter: "G-01",
    service: "Prioritaire / Santé",
    priority: "urgent",
    calledAt: "il y a 3 min",
  },
  {
    code: "C-118",
    counter: "G-05",
    service: "Ouverture de compte",
    priority: "priority",
    calledAt: "il y a 4 min",
  },
];

const UPCOMING_QUEUE = [
  { code: "A-043", service: "Retrait caisse", wait: "~ 2 min" },
  { code: "A-044", service: "Dépôt espèces", wait: "~ 4 min" },
  { code: "C-119", service: "Ouverture de compte", wait: "~ 6 min" },
  { code: "M-027", service: "Mobile Money", wait: "~ 8 min" },
  { code: "A-045", service: "Virements", wait: "~ 11 min" },
];

function playChime() {
  if (typeof window === "undefined") return;
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    const notes = [587.33, 880]; // D5 -> A5 carillon d'accueil
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.22);
      gain.gain.exponentialRampToValueAtTime(0.22, ctx.currentTime + idx * 0.22 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.22 + 0.55);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.22);
      osc.stop(ctx.currentTime + idx * 0.22 + 0.6);
    });
  } catch {
    // Ignore audio context restrictions if not interacted
  }
}

export default function TvDisplayPage() {
  const [calls, setCalls] = useState<CalledTicket[]>(INITIAL_CALLS);
  const [seq, setSeq] = useState(43);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [clock, setClock] = useState<string>("--:--");
  const [banner, setBanner] = useState(
    "Bienvenue à la Banque de la République — Munissez-vous de votre pièce d’identité avant de vous présenter au guichet appelé."
  );

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setClock(
        now.toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    updateClock();
    const timer = window.setInterval(updateClock, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const triggerCall = useCallback(
    (incoming?: Partial<CalledTicket>) => {
      const counters = ["G-01", "G-02", "G-03", "G-05", "G-06", "G-08"];
      const services = [
        "Retrait caisse",
        "Ouverture de compte",
        "Dépôt espèces",
        "Mobile Money",
        "VIP Conseil",
      ];
      const nextCode = incoming?.code ?? `A-0${seq}`;
      const nextCounter =
        incoming?.counter ?? counters[seq % counters.length];
      const nextService =
        incoming?.service ?? services[seq % services.length];

      const newCall: CalledTicket = {
        code: nextCode,
        counter: nextCounter,
        service: nextService,
        priority: incoming?.priority ?? "standard",
        calledAt: "À l’instant",
      };

      setSeq((n) => n + 1);
      setCalls((prev) => [
        newCall,
        ...prev.slice(0, 3).map((item, idx) => ({
          ...item,
          calledAt: `il y a ${idx + 1} min`,
        })),
      ]);

      if (soundEnabled) {
        playChime();
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
          try {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(
              `Ticket ${nextCode.replace("-", " ")}, guichet ${nextCounter.replace("G-0", "")}`
            );
            utterance.lang = "fr-FR";
            utterance.rate = 0.95;
            window.speechSynthesis.speak(utterance);
          } catch {
            // Ignore speech synthesis errors
          }
        }
      }
    },
    [seq, soundEnabled]
  );

  useEffect(() => {
    const unsubscribe = tondeWs.subscribe((msg) => {
      if (msg.event === "TICKET_CALLED" && msg.payload) {
        const p = msg.payload as Partial<CalledTicket>;
        triggerCall(p);
      }
      if (msg.event === "BROADCAST_MESSAGE" && msg.payload) {
        const p = msg.payload as { message?: string };
        if (p.message) setBanner(p.message);
      }
    });
    return unsubscribe;
  }, [triggerCall]);

  const toggleFullscreen = () => {
    if (typeof document === "undefined") return;
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const currentCall = calls[0];

  return (
    <div className="grain flex min-h-screen flex-col justify-between overflow-hidden bg-brand-deep text-white select-none">
      {/* ── BARRE SUPÉRIEURE SALLE D'ATTENTE ── */}
      <header className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-white/12 bg-brand-deep/90 px-6 py-4 backdrop-blur-md lg:px-10">
        <div className="flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/logo/Glossy%20Blue%20Circuit%20Network%20Icon.png"
            alt=""
            width={44}
            height={44}
            className="h-11 w-11 rounded-xl object-cover"
          />
          <div>
            <div className="flex items-center gap-2.5">
              <span className="font-serif text-xl font-bold tracking-tight text-white">
                TONDE DISPLAY
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-green/30 bg-brand-green/12 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-widest text-brand-green">
                <Wifi className="h-3 w-3" />
                SYNCHRONISÉ
              </span>
            </div>
            <p className="text-xs text-white/60">
              Banque de la République — Siège Bujumbura (BUJ-001)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => triggerCall()}
            className="inline-flex items-center gap-2 rounded-full bg-brand-forest px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-white transition-transform hover:scale-105 active:scale-95"
          >
            <Play className="h-3.5 w-3.5" />
            Simuler un appel
          </button>

          <button
            type="button"
            onClick={() => setSoundEnabled((s) => !s)}
            aria-label={soundEnabled ? "Couper le son" : "Activer le son"}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-bold text-white/80 hover:border-white/40 hover:text-white"
          >
            {soundEnabled ? (
              <>
                <Volume2 className="h-4 w-4 text-brand-sprout" />
                <span className="hidden sm:inline">Audio actif</span>
              </>
            ) : (
              <>
                <VolumeX className="h-4 w-4 text-white/45" />
                <span className="hidden sm:inline">Muet</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label="Plein écran"
            className="hidden h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 hover:border-white/40 hover:text-white sm:inline-flex"
          >
            <Maximize2 className="h-4 w-4" />
          </button>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3.5 py-2 text-xs font-bold text-white/70 hover:border-white/40 hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Cockpit
          </Link>

          <div className="app-num ml-2 rounded-xl border border-white/15 bg-white/[0.04] px-4 py-2 font-mono text-xl font-extrabold tracking-wider text-brand-sprout">
            {clock}
          </div>
        </div>
      </header>

      {/* ── CORPS PRINCIPAL : TICKET APPELÉ (XL 10M) + HISTORIQUE & FILE ── */}
      <div className="relative z-10 mx-auto grid w-full max-w-[1600px] flex-1 gap-6 p-6 lg:grid-cols-12 lg:gap-8 lg:p-10">
        {/* Zone Gauche (7 cols) : Appel en cours grand format */}
        <div className="flex flex-col justify-between gap-6 lg:col-span-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentCall.code}
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.45 }}
              className="relative flex flex-1 flex-col justify-between overflow-hidden rounded-[32px] border-2 border-brand-sprout/60 bg-[linear-gradient(145deg,rgba(108,71,255,0.22)_0%,rgba(10,14,26,0.92)_65%)] p-7 shadow-[0_30px_90px_-25px_rgba(0,212,255,0.35)] sm:p-10"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2.5 rounded-full bg-brand-sprout px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.22em] text-brand-deep">
                  <BellRing className="h-4 w-4 animate-bounce" />
                  Appel immédiat au guichet
                </span>
                <span className="text-sm font-semibold uppercase tracking-widest text-white/65">
                  {currentCall.service}
                </span>
              </div>

              <div className="my-8 grid items-center gap-6 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/55">
                    Numéro de ticket
                  </p>
                  <p className="app-num mt-2 font-mono text-6xl font-extrabold tracking-tight text-white sm:text-[84px] sm:leading-none">
                    {currentCall.code}
                  </p>
                </div>

                <div className="rounded-3xl border border-brand-sprout/40 bg-brand-deep/80 p-6 text-center">
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-sprout">
                    Présentez-vous au
                  </p>
                  <p className="app-num mt-2 font-mono text-5xl font-extrabold text-brand-sprout sm:text-7xl">
                    {currentCall.counter}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-white/12 pt-4 text-xs text-white/60">
                <span>Signal sonore &amp; affichage synchronisés</span>
                <span className="app-num font-bold text-brand-green">
                  Appelé : {currentCall.calledAt}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* 3 derniers tickets appelés */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {calls.slice(1, 4).map((item) => (
              <div
                key={item.code}
                className="rounded-2xl border border-white/14 bg-white/[0.04] p-5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-white/45">
                    Rappel
                  </span>
                  <span className="app-num rounded-lg bg-brand-forest/25 px-2.5 py-0.5 font-mono text-sm font-extrabold text-brand-light">
                    {item.counter}
                  </span>
                </div>
                <p className="app-num mt-2 font-mono text-3xl font-extrabold text-white">
                  {item.code}
                </p>
                <p className="mt-1 truncate text-xs text-white/55">{item.service}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Zone Droite (5 cols) : Prochains en attente + QR Code Mobile */}
        <div className="flex flex-col justify-between gap-6 lg:col-span-5">
          <div className="flex-1 rounded-[28px] border border-white/14 bg-white/[0.03] p-6 sm:p-7">
            <div className="flex items-center justify-between border-b border-white/12 pb-4">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-brand-sprout">
                  File d’attente en direct
                </p>
                <h2 className="mt-1 font-serif text-xl font-bold text-white">
                  Prochains tickets appelés
                </h2>
              </div>
              <span className="app-num rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/80">
                {UPCOMING_QUEUE.length} en tête
              </span>
            </div>

            <ul className="mt-4 divide-y divide-white/10">
              {UPCOMING_QUEUE.map((t, index) => (
                <li
                  key={t.code}
                  className="flex items-center justify-between py-3.5"
                >
                  <div className="flex items-center gap-3.5">
                    <span className="app-num flex h-7 w-7 items-center justify-center rounded-full bg-white/8 text-xs font-bold text-white/60">
                      {index + 1}
                    </span>
                    <div>
                      <p className="app-num font-mono text-2xl font-extrabold text-white">
                        {t.code}
                      </p>
                      <p className="text-xs text-white/55">{t.service}</p>
                    </div>
                  </div>
                  <span className="app-num rounded-full border border-brand-sprout/25 bg-brand-sprout/10 px-3 py-1 text-xs font-bold text-brand-sprout">
                    {t.wait}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Carte QR Code pour suivre son ticket sur téléphone */}
          <div className="flex items-center gap-5 rounded-[28px] border border-brand-forest/40 bg-brand-forest/15 p-5">
            <div className="shrink-0 rounded-2xl bg-white p-2">
              <QrCodeSvg value={APK_CONFIG.downloadUrl} size={96} />
            </div>
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-brand-sprout">
                Application mobile TONDE
              </p>
              <h3 className="mt-1 font-serif text-lg font-bold text-white">
                Suivez votre tour sur votre téléphone
              </h3>
              <p className="mt-1 text-xs leading-5 text-white/75">
                Scannez ce code ou rendez-vous sur{" "}
                <Link href="/app" className="font-bold text-brand-sprout underline">
                  /app
                </Link>{" "}
                pour installer l’application Android officielle.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── BANDEAU D'INFORMATION CONTINU EN BAS D'ÉCRAN ── */}
      <footer className="relative z-10 border-t border-white/12 bg-brand-deep px-6 py-3.5 lg:px-10">
        <div className="flex items-center gap-4">
          <span className="shrink-0 rounded-md bg-brand-sprout px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-widest text-brand-deep">
            INFO SALLE
          </span>
          <p className="truncate text-sm font-medium text-white/85">{banner}</p>
        </div>
      </footer>
    </div>
  );
}
