import { PagePlaceholder } from '@/components/app/page-placeholder';

export default function LocationsPage() {
  return (
    <PagePlaceholder
      chapter="01"
      title={
        <>
          Agences &amp; lieux,
          <span className="font-normal italic text-brand-leaf"> encore à cartographier.</span>
        </>
      }
      description="Le référentiel des sites physiques — sièges, agences, guichets et horaires — n’est pas encore branché. C’est pourtant la base de tout cloisonnement multi-agences."
      planned={[
        { label: 'Référentiel des sites', detail: 'Création, édition et archivage des agences rattachées à une organisation.' },
        { label: 'Guichets et services', detail: 'Nombre de guichets par site, services associés et capacité de traitement.' },
        { label: 'Horaires d’ouverture', detail: 'Plages horaires par jour, exceptions et jours fériés locaux.' },
        { label: 'Rattachement des agents', detail: 'Affectation d’un agent à une agence et à un guichet précis.' },
      ]}
      action={{ label: 'Voir les agents', href: '/agents' }}
    />
  );
}
