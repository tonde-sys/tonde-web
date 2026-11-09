import { PagePlaceholder } from '@/components/app/page-placeholder';

export default function AnalyticsPage() {
  return (
    <PagePlaceholder
      chapter="02"
      title={
        <>
          Statistiques,
          <span className="font-normal italic text-brand-leaf"> pas encore mesurées.</span>
        </>
      }
      description="Les indicateurs de pilotage (AWT, AHT, no-show, performance par agent) existent dans la spécification, mais aucune donnée réelle ne les alimente aujourd’hui."
      planned={[
        { label: 'Indicateurs de flux', detail: 'Temps d’attente moyen, temps de traitement, taux d’abandon par service.' },
        { label: 'Performance par agent', detail: 'Tickets traités, durée moyenne, satisfaction et comparaison à la moyenne agence.' },
        { label: 'Comparaison multi-sites', detail: 'Lecture consolidée du réseau, avec identification des sites en tension.' },
        { label: 'Exports direction', detail: 'Génération de rapports Excel et PDF pour les comités de direction.' },
      ]}
      action={{ label: 'Voir la file d’attente', href: '/queue' }}
    />
  );
}
