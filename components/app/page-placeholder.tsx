import Link from 'next/link';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import type { ReactNode } from 'react';

type Props = {
  chapter: string;
  title: ReactNode;
  description: string;
  planned: { label: string; detail: string }[];
  action?: { label: string; href: string };
};

export function PagePlaceholder({ chapter, title, description, planned, action }: Props) {
  return (
    <div className="mx-auto w-full max-w-[1100px] px-5 py-8 sm:px-7">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-brand-soil/45 transition-colors hover:text-brand-forest"
      >
        <ArrowLeft size={12} />
        Retour au cockpit
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-6">
          <span className="kicker">
            <span className="kicker-number">{chapter}</span>
            Module en préparation
          </span>
          <h1 className="display-lg mt-5 text-brand-deep">{title}</h1>
          <p className="mt-5 max-w-md text-[15px] leading-8 text-brand-soil/70">{description}</p>

          <div className="mt-8 rounded-2xl border border-brand-forest/12 bg-brand-cream p-5">
            <p className="app-label">État réel du module</p>
            <p className="mt-2 text-[13px] leading-7 text-brand-soil/70">
              L’interface n’est pas encore développée. Aucune donnée n’est affichée ici pour éviter de simuler
              un fonctionnement qui n’existe pas.
            </p>
            {action && (
              <Link href={action.href} className="app-btn app-btn-primary mt-4">
                {action.label}
                <ArrowUpRight size={13} />
              </Link>
            )}
          </div>
        </div>

        <div className="lg:col-span-6">
          <p className="app-label">Ce que ce module contiendra</p>
          <ul className="mt-4 border-t border-brand-forest/12">
            {planned.map((item, index) => (
              <li key={item.label} className="flex gap-4 border-b border-brand-forest/12 py-4">
                <span className="kicker-number shrink-0 text-brand-leaf">0{index + 1}</span>
                <div>
                  <p className="text-[14px] font-semibold text-brand-deep">{item.label}</p>
                  <p className="mt-1 text-[12.5px] leading-6 text-brand-soil/60">{item.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
