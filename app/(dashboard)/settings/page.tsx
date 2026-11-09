import { PagePlaceholder } from '@/components/app/page-placeholder';

export default function SettingsPage() {
  return (
    <PagePlaceholder
      chapter="03"
      title={
        <>
          Paramètres,
          <span className="font-normal italic text-brand-leaf"> à configurer plus tard.</span>
        </>
      }
      description="La configuration institutionnelle — organisation, rôles, seuils d’alerte — n’est pas encore exposée. Les valeurs affichées dans le cockpit restent des valeurs de démonstration."
      planned={[
        { label: 'Organisation', detail: 'Identité de l’institution, logo, fuseau horaire et langue par défaut.' },
        { label: 'Rôles et permissions', detail: 'SUPER_ADMIN, ADMIN_ORG, SUPERVISEUR et ADMIN_AGENCE avec périmètre explicite.' },
        { label: 'Seuils d’alerte', detail: 'Durée d’attente critique, inactivité d’un guichet, taux d’abandon toléré.' },
        { label: 'Intégrations', detail: 'Rattachement au backend, clés d’API et webhooks sortants.' },
      ]}
      action={{ label: 'Retour au cockpit', href: '/dashboard' }}
    />
  );
}
