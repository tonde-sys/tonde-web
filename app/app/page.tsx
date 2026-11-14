"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  Copy,
  Download,
  FileCheck2,
  QrCode,
  Share2,
  ShieldCheck,
  Smartphone,
  Sparkles,
  WifiOff,
} from "lucide-react";

import { QrCodeSvg } from "@/components/ui/qr-code-svg";
import { EASE, Reveal } from "@/lib/motion";
import { APK_CONFIG } from "@/lib/tonde-client";

type Language = "FR" | "EN" | "RN" | "SW";

const LANGUAGES: Language[] = ["FR", "EN", "RN", "SW"];

const translations: Record<
  Language,
  {
    back: string;
    badge: string;
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
    primaryCta: string;
    primaryCtaSub: string;
    githubCta: string;
    shareCta: string;
    copiedCta: string;
    verifiedNote: string;
    stepsKicker: string;
    stepsTitle: string;
    steps: { num: string; title: string; desc: string }[];
    perks: { title: string; desc: string }[];
    stickyCta: string;
    footerRights: string;
  }
> = {
  FR: {
    back: "Retour à l’accueil",
    badge: "Application officielle Android",
    titleLine1: "Installez TONDE",
    titleLine2: "sur votre téléphone.",
    subtitle:
      "Prenez votre ticket à distance, suivez votre position en temps réel et présentez-vous au guichet juste à temps.",
    primaryCta: "Télécharger l’APK Android",
    primaryCtaSub: "Téléchargement direct via GitHub",
    githubCta: "Voir la release sur GitHub",
    shareCta: "Partager le lien",
    copiedCta: "Lien copié",
    verifiedNote: "APK officiel signé · Sans publicité · Gratuit",
    stepsKicker: "Installation en 3 gestes",
    stepsTitle: "Comment installer l’application",
    steps: [
      {
        num: "01",
        title: "Téléchargez le fichier APK",
        desc: "Appuyez sur le grand bouton ci-dessus pour lancer le téléchargement direct de tonde.apk depuis GitHub.",
      },
      {
        num: "02",
        title: "Ouvrez et autorisez",
        desc: "Ouvrez le fichier téléchargé. Si Android le demande, autorisez l’installation depuis votre navigateur.",
      },
      {
        num: "03",
        title: "Prenez votre ticket",
        desc: "Ouvrez TONDE, choisissez votre banque, hôpital ou agence et suivez votre tour en direct.",
      },
    ],
    perks: [
      {
        title: "Temps réel",
        desc: "Position et temps d’attente estimé mis à jour en direct.",
      },
      {
        title: "Mode hors-ligne",
        desc: "Votre ticket reste accessible même si la connexion coupe.",
      },
      {
        title: "Léger & rapide",
        desc: "Conçu pour tous les smartphones Android dès la version 8.0.",
      },
    ],
    stickyCta: "Installer TONDE (.APK)",
    footerRights: "Tous droits réservés.",
  },
  EN: {
    back: "Back to home",
    badge: "Official Android App",
    titleLine1: "Install TONDE",
    titleLine2: "on your phone.",
    subtitle:
      "Take your ticket remotely, track your queue position in real time, and arrive at the counter right on time.",
    primaryCta: "Download Android APK",
    primaryCtaSub: "Direct download via GitHub",
    githubCta: "View release on GitHub",
    shareCta: "Share link",
    copiedCta: "Link copied",
    verifiedNote: "Signed official APK · Ad-free · Free",
    stepsKicker: "3-step setup",
    stepsTitle: "How to install the app",
    steps: [
      {
        num: "01",
        title: "Download the APK file",
        desc: "Tap the large button above to start the direct download of tonde.apk from GitHub.",
      },
      {
        num: "02",
        title: "Open and allow",
        desc: "Open the downloaded file. If prompted by Android, allow installation from your browser.",
      },
      {
        num: "03",
        title: "Get your ticket",
        desc: "Open TONDE, select your bank, hospital, or branch, and track your turn live.",
      },
    ],
    perks: [
      {
        title: "Real-time",
        desc: "Live queue position and estimated wait time updates.",
      },
      {
        title: "Offline resilient",
        desc: "Your ticket stays available even if your connection drops.",
      },
      {
        title: "Lightweight & fast",
        desc: "Built for all Android smartphones running Android 8.0+.",
      },
    ],
    stickyCta: "Install TONDE (.APK)",
    footerRights: "All rights reserved.",
  },
  RN: {
    back: "Subira ku rubuga",
    badge: "Porogaramu yemewe ya Android",
    titleLine1: "Shira TONDE",
    titleLine2: "kuri telefone yawe.",
    subtitle:
      "Fata itike yawe uri kure, kurikirana ikibanza cawe mu murongo kandi ushike ku biro igihe cawe kigeze.",
    primaryCta: "Manura APK ya Android",
    primaryCtaSub: "Kumanura biciye kuri GitHub",
    githubCta: "Raba kuri GitHub",
    shareCta: "Sangiza umuhora",
    copiedCta: "Umuhora wakoporowe",
    verifiedNote: "APK yemewe · Nta matangazo · Ku buntu",
    stepsKicker: "Intambwe 3 gusa",
    stepsTitle: "Ingene ushiraho porogaramu",
    steps: [
      {
        num: "01",
        title: "Manura dosiye ya APK",
        desc: "Fyonda ku buto bunini hejuru kugira utangure kumanura tonde.apk kuri GitHub.",
      },
      {
        num: "02",
        title: "Ugurura kandi wemere",
        desc: "Ugurura dosiye wamanuye. Nimba Android ibisavye, emera gushiraho biciye kuri navigateur.",
      },
      {
        num: "03",
        title: "Fata itike yawe",
        desc: "Ugurura TONDE, hitamo ibanki canke ibitaro vyawe ukurikirane umwanya wawe.",
      },
    ],
    perks: [
      {
        title: "Ubwo nyene",
        desc: "Ikibanza cawe mu murongo kigaragara mu mwanya nyakuri.",
      },
      {
        title: "Naho ata internet",
        desc: "Itike yawe iguma iboneka naho umuhora wocika.",
      },
      {
        title: "Yoroshe kandi inyaruka",
        desc: "Ikora kuri telefone zose za Android kuva kuri 8.0+.",
      },
    ],
    stickyCta: "Shira TONDE (.APK)",
    footerRights: "Uburenganzira bwose burabitswe.",
  },
  SW: {
    back: "Rudi nyumbani",
    badge: "Programu Rasmi ya Android",
    titleLine1: "Sakinisha TONDE",
    titleLine2: "kwenye simu yako.",
    subtitle:
      "Chukua tiketi yako ukiwa mbali, fuatilia nafasi yako kwenye foleni moja kwa moja na ufike dirishani kwa wakati.",
    primaryCta: "Pakua APK ya Android",
    primaryCtaSub: "Upakuaji wa moja kwa moja kupitia GitHub",
    githubCta: "Tazama kwenye GitHub",
    shareCta: "Shiriki kiungo",
    copiedCta: "Kiungo kimenakiliwa",
    verifiedNote: "APK rasmi iliyoidhinishwa · Bila matangazo · Bure",
    stepsKicker: "Hatua 3 rahisi",
    stepsTitle: "Jinsi ya kusakinisha programu",
    steps: [
      {
        num: "01",
        title: "Pakua faili la APK",
        desc: "Bonyeza kitufe kikubwa hapo juu ili kuanza kupakua tonde.apk moja kwa moja kutoka GitHub.",
      },
      {
        num: "02",
        title: "Fungua na uruhusu",
        desc: "Fungua faili uliyopakua. Ikiwa Android itaomba ruhusa, ruhusu usakinishaji kutoka kwa kivinjari chako.",
      },
      {
        num: "03",
        title: "Chukua tiketi yako",
        desc: "Fungua TONDE, chagua benki au hospitali yako na ufuatilie zamu yako moja kwa moja.",
      },
    ],
    perks: [
      {
        title: "Wakati halisi",
        desc: "Nafasi kwenye foleni na muda wa kusubiri husasishwa moja kwa moja.",
      },
      {
        title: "Inafanya kazi bila mtandao",
        desc: "Tiketi yako inabaki salama hata mtandao ukikatika.",
      },
      {
        title: "Nyepesi na haraka",
        desc: "Imeundwa kwa simu zote za Android kuanzia toleo la 8.0+.",
      },
    ],
    stickyCta: "Sakinisha TONDE (.APK)",
    footerRights: "Haki zote zimehifadhiwa.",
  },
};

export default function AppInstallPage() {
  const [lang, setLang] = useState<Language>("FR");
  const [copied, setCopied] = useState(false);
  const t = translations[lang];

  const handleShareOrCopy = async () => {
    const shareUrl =
      typeof window !== "undefined" ? window.location.href : APK_CONFIG.downloadUrl;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "TONDE — Application Android",
          text: t.subtitle,
          url: shareUrl,
        });
        return;
      } catch {
        // Fallback vers la copie presse-papiers si l'utilisateur annule ou si le partage échoue
      }
    }

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    }
  };

  return (
    <main className="min-h-screen bg-brand-canvas pb-28 sm:pb-0">
      {/* ── HERO MOBILE-FIRST (SOMBRE) ── */}
      <section className="grain relative overflow-hidden bg-brand-deep text-white">
        <div className="hero-grid absolute inset-0 opacity-20" aria-hidden="true" />
        <div
          className="pointer-events-none absolute -top-28 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-brand-forest/30 blur-[110px]"
          aria-hidden="true"
        />

        <div className="section-shell relative z-10 pt-5 pb-12 sm:pt-8 sm:pb-20">
          {/* Barre supérieure compacte */}
          <header className="flex items-center justify-between gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5"
              aria-label="TONDE — retour à l’accueil"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/logo/Glossy%20Blue%20Circuit%20Network%20Icon.png"
                alt=""
                width={38}
                height={38}
                className="h-9 w-9 shrink-0 rounded-[10px] object-cover sm:h-10 sm:w-10"
                aria-hidden="true"
              />
              <span className="flex flex-col leading-none">
                <span className="font-serif text-lg font-semibold tracking-tight text-white">
                  TONDE
                </span>
                <span className="mt-0.5 whitespace-nowrap text-[9px] font-bold uppercase tracking-[0.26em] text-brand-sprout">
                  Android APK
                </span>
              </span>
            </Link>

            <div className="flex items-center gap-2">
              <div
                className="flex items-center gap-0.5 rounded-full border border-white/15 bg-white/[0.04] p-0.5"
                role="group"
                aria-label="Choisir la langue"
              >
                {LANGUAGES.map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setLang(code)}
                    aria-pressed={lang === code}
                    className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold tracking-wider transition-colors ${
                      lang === code
                        ? "bg-brand-sprout text-brand-deep"
                        : "text-white/60 hover:text-white"
                    }`}
                  >
                    {code}
                  </button>
                ))}
              </div>

              <Link
                href="/"
                className="hidden items-center gap-1.5 rounded-full border border-white/20 px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-white/80 transition-colors hover:border-white/45 hover:text-white sm:inline-flex"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                {t.back}
              </Link>
            </div>
          </header>

          {/* Contenu principal Hero */}
          <div className="mt-8 grid items-center gap-10 lg:mt-14 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: EASE }}
                className="inline-flex flex-wrap items-center gap-2.5 rounded-full border border-brand-sprout/30 bg-brand-sprout/10 px-3.5 py-1.5"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-green opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-green" />
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-brand-sprout">
                  {t.badge}
                </span>
                <span className="app-num rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold text-white">
                  {APK_CONFIG.version}
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.08, ease: EASE }}
                className="display-xl mt-5 text-white"
              >
                <span className="block">{t.titleLine1}</span>
                <span className="block font-normal italic text-brand-light">
                  {t.titleLine2}
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.16, ease: EASE }}
                className="mt-4 max-w-xl text-base leading-7 text-white/80 sm:text-lg sm:leading-8"
              >
                {t.subtitle}
              </motion.p>

              {/* ── GRANDS BOUTONS MOBILE-FIRST ── */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.24, ease: EASE }}
                className="mt-7 flex flex-col gap-3.5 sm:mt-9"
              >
                {/* Bouton Principal Géant : Télécharger l'APK */}
                <a
                  href={APK_CONFIG.downloadUrl}
                  download={APK_CONFIG.fileName}
                  className="group relative flex min-h-[68px] w-full items-center justify-between gap-4 rounded-2xl bg-brand-sprout px-5 py-4 text-brand-deep shadow-[0_20px_50px_-15px_rgba(0,212,255,0.45)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#33ddff] active:scale-[0.98] sm:max-w-xl sm:px-6"
                >
                  <span className="flex items-center gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-deep text-brand-sprout transition-transform duration-300 group-hover:scale-105">
                      <Download className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <span className="flex flex-col text-left">
                      <span className="text-base font-extrabold tracking-tight sm:text-lg">
                        {t.primaryCta}
                      </span>
                      <span className="app-num mt-0.5 text-xs font-semibold text-brand-deep/75">
                        {t.primaryCtaSub} · {APK_CONFIG.fileSize} · {APK_CONFIG.minAndroid}
                      </span>
                    </span>
                  </span>
                  <span className="app-num hidden shrink-0 rounded-full bg-brand-deep/12 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-brand-deep sm:inline-flex">
                    .APK
                  </span>
                </a>

                {/* Grands Boutons Secondaires : GitHub Release + Partager */}
                <div className="grid grid-cols-1 gap-3 sm:max-w-xl sm:grid-cols-2">
                  <a
                    href={APK_CONFIG.releasesUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-[56px] w-full items-center justify-center gap-2.5 rounded-2xl border border-white/20 bg-white/[0.06] px-5 py-3.5 text-sm font-bold text-white backdrop-blur-md transition-all hover:border-white/45 hover:bg-white/[0.12] active:scale-[0.98]"
                  >
                    <span>{t.githubCta}</span>
                    <ArrowUpRight className="h-4 w-4 text-brand-sprout" aria-hidden="true" />
                  </a>

                  <button
                    type="button"
                    onClick={handleShareOrCopy}
                    className="flex min-h-[56px] w-full items-center justify-center gap-2.5 rounded-2xl border border-white/20 bg-white/[0.06] px-5 py-3.5 text-sm font-bold text-white backdrop-blur-md transition-all hover:border-white/45 hover:bg-white/[0.12] active:scale-[0.98]"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 text-brand-green" aria-hidden="true" />
                        <span className="text-brand-green">{t.copiedCta}</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="h-4 w-4 text-brand-light" aria-hidden="true" />
                        <span>{t.shareCta}</span>
                        <Copy className="h-3.5 w-3.5 opacity-55" aria-hidden="true" />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>

              {/* Note de confiance */}
              <div className="mt-5 flex flex-wrap items-center gap-2 text-xs font-medium text-white/65">
                <ShieldCheck className="h-4 w-4 shrink-0 text-brand-green" aria-hidden="true" />
                <span>{t.verifiedNote}</span>
              </div>
            </div>

            {/* Aperçu visuel de l'application mobile */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.75, delay: 0.2, ease: EASE }}
              className="mx-auto w-full max-w-[360px] lg:col-span-5 lg:max-w-none"
            >
              <div className="relative overflow-hidden rounded-[28px] border border-white/14 bg-white/[0.04] p-4 backdrop-blur-sm sm:p-6">
                <div className="flex items-center justify-between pb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-white/55">
                  <span className="inline-flex items-center gap-1.5 text-brand-sprout">
                    <Smartphone className="h-3.5 w-3.5" />
                    TONDE Mobile
                  </span>
                  <span className="app-num">{APK_CONFIG.version}</span>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/mockups/mobile-app-concept.svg"
                  alt="Aperçu de l’application mobile TONDE sur Android"
                  className="mx-auto h-[240px] w-full rounded-2xl object-contain sm:h-[260px]"
                />

                {/* Bloc QR Code pour scan direct depuis un écran PC ou affiche */}
                <div className="mt-4 flex items-center gap-4 rounded-2xl border border-white/12 bg-brand-deep/75 p-3.5">
                  <div className="shrink-0 rounded-xl bg-white p-1.5">
                    <QrCodeSvg value={APK_CONFIG.downloadUrl} size={76} />
                  </div>
                  <div className="min-w-0">
                    <p className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-brand-sprout">
                      <QrCode className="h-3.5 w-3.5" aria-hidden="true" />
                      Scan direct Android
                    </p>
                    <p className="mt-1 text-xs leading-5 text-white/75">
                      Sur ordinateur ? Scannez ce QR Code avec l’appareil photo de votre téléphone pour lancer le téléchargement.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── GUIDE D'INSTALLATION EN 3 ÉTAPES ── */}
      <section className="section-shell py-12 sm:py-20">
        <div className="max-w-2xl">
          <span className="kicker">
            <span className="kicker-number">APK</span>
            {t.stepsKicker}
          </span>
          <h2 className="display-md mt-4 text-brand-deep">{t.stepsTitle}</h2>
        </div>

        <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-3 sm:gap-6">
          {t.steps.map((step, index) => (
            <Reveal key={step.num} delay={index * 0.08} className="h-full">
              <div className="editorial-card flex h-full flex-col p-6">
                <div className="flex items-center justify-between">
                  <span className="app-num inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-forest/10 text-sm font-extrabold text-brand-forest">
                    {step.num}
                  </span>
                  <FileCheck2 className="h-5 w-5 text-brand-leaf/50" aria-hidden="true" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-brand-deep">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-brand-soil/70">{step.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* ── 3 AVANTAGES CLÉS ── */}
        <div className="mt-8 grid gap-4 sm:mt-12 sm:grid-cols-3 sm:gap-6">
          {[Sparkles, WifiOff, Smartphone].map((Icon, idx) => {
            const perk = t.perks[idx];
            return (
              <div
                key={perk.title}
                className="flex items-start gap-4 rounded-2xl border border-brand-forest/10 bg-white p-5"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-deep text-brand-sprout">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-brand-deep">{perk.title}</h3>
                  <p className="mt-1 text-xs leading-5 text-brand-soil/65">{perk.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Rappel grand bouton en bas de page (desktop & tablette) */}
        <div className="mt-10 hidden rounded-[26px] bg-brand-deep p-8 text-white sm:flex sm:items-center sm:justify-between sm:gap-6">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-sprout">
              {t.badge} · {APK_CONFIG.version}
            </p>
            <p className="mt-2 font-serif text-2xl font-bold">
              {t.titleLine1} {t.titleLine2}
            </p>
          </div>
          <a
            href={APK_CONFIG.downloadUrl}
            download={APK_CONFIG.fileName}
            className="btn btn-accent !min-h-[56px] !px-7 !text-sm shrink-0"
          >
            <Download className="h-5 w-5" aria-hidden="true" />
            {t.primaryCta}
          </a>
        </div>
      </section>

      {/* ── FOOTER COMPACT ── */}
      <footer className="border-t border-brand-forest/12 bg-brand-canvas py-8">
        <div className="section-shell flex flex-col items-center justify-between gap-4 text-xs text-brand-soil/55 sm:flex-row">
          <p>
            © {new Date().getFullYear()} TONDE. {t.footerRights}
          </p>
          <Link href="/" className="font-semibold text-brand-forest hover:underline">
            ← {t.back}
          </Link>
        </div>
      </footer>

      {/* ── BARRE D'INSTALLATION FIXE EN BAS SUR MOBILE ── */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/15 bg-brand-deep/95 p-3 backdrop-blur-xl sm:hidden">
        <a
          href={APK_CONFIG.downloadUrl}
          download={APK_CONFIG.fileName}
          className="flex min-h-[56px] w-full items-center justify-center gap-3 rounded-xl bg-brand-sprout px-5 py-3.5 text-base font-extrabold text-brand-deep shadow-lg active:scale-[0.98]"
        >
          <Download className="h-5 w-5 shrink-0" aria-hidden="true" />
          <span>{t.stickyCta}</span>
          <span className="app-num rounded-full bg-brand-deep/15 px-2.5 py-0.5 text-xs font-bold">
            {APK_CONFIG.fileSize}
          </span>
        </a>
      </div>
    </main>
  );
}
