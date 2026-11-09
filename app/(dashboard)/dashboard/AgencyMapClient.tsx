'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip as LeafletTooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

type AgencyStatus = 'ok' | 'warn' | 'critical';

const agencies: {
  id: string; name: string; lat: number; lng: number;
  wait: number; guichets: number; topService: string; status: AgencyStatus;
}[] = [
  { id: 'AG-BUJ-01', name: 'Agence Centrale — Bujumbura', lat: -3.3822, lng: 29.3622, wait: 7, guichets: 6, topService: 'Ouverture de compte', status: 'ok' },
  { id: 'AG-BUJ-02', name: 'Agence Rohero', lat: -3.3701, lng: 29.3594, wait: 18, guichets: 4, topService: 'Retrait caisse', status: 'warn' },
  { id: 'AG-BUJ-03', name: 'Agence Buyenzi', lat: -3.3950, lng: 29.3550, wait: 34, guichets: 3, topService: 'Virement bancaire', status: 'critical' },
  { id: 'AG-GOM-01', name: 'Agence Goma Nord', lat: -1.6590, lng: 29.2200, wait: 12, guichets: 5, topService: 'Renseignements', status: 'warn' },
  { id: 'AG-KGL-01', name: 'Agence Kigali Centre', lat: -1.9441, lng: 30.0619, wait: 5, guichets: 8, topService: 'Prêts', status: 'ok' },
];

const mapStatusColor: Record<AgencyStatus, string> = {
  ok: '#10b981',
  warn: '#f59e0b',
  critical: '#f43f5e',
};

/** Cadre la carte sur l'ensemble des agences, quelle que soit la taille du conteneur. */
function FitAgencies() {
  const map = useMap();
  useEffect(() => {
    const bounds = L.latLngBounds(agencies.map((a) => [a.lat, a.lng] as [number, number]));
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 9 });
  }, [map]);
  return null;
}

export default function AgencyMapClient() {
  return (
    <>
      <div className="h-[320px] overflow-hidden">
        <MapContainer
          center={[-2.9, 29.6]}
          zoom={7}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
          scrollWheelZoom={false}
        >
          <TileLayer
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <FitAgencies />
          {agencies.map((ag) => (
            <CircleMarker
              key={ag.id}
              center={[ag.lat, ag.lng]}
              radius={ag.wait > 30 ? 13 : ag.wait > 10 ? 10 : 8}
              pathOptions={{
                color: mapStatusColor[ag.status],
                fillColor: mapStatusColor[ag.status],
                fillOpacity: 0.55,
                weight: 1.5,
              }}
            >
              <LeafletTooltip direction="top">
                <div className="text-[12px] leading-relaxed">
                  <p className="font-semibold text-brand-deep">{ag.name}</p>
                  <p className="app-num text-[10px] text-brand-soil/45">{ag.id}</p>
                  <p className="mt-1 text-brand-soil/70">
                    Attente : <strong>{ag.wait} min</strong>
                  </p>
                  <p className="text-brand-soil/70">
                    Guichets ouverts : <strong>{ag.guichets}</strong>
                  </p>
                  <p className="text-brand-soil/70">
                    Service saturé : <strong>{ag.topService}</strong>
                  </p>
                </div>
              </LeafletTooltip>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-6 border-t border-brand-forest/10 py-3">
        {[
          { color: '#10b981', label: '< 10 min' },
          { color: '#f59e0b', label: '10 – 30 min' },
          { color: '#f43f5e', label: '> 30 min (alerte)' },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: l.color }} aria-hidden="true" />
            <span className="text-[11px] text-brand-soil/55">{l.label}</span>
          </div>
        ))}
      </div>

      <style>{`
        .leaflet-container { background: #f7f8fa !important; font-family: inherit; }
        .leaflet-tile-pane { filter: grayscale(1) contrast(1.04) brightness(1.03); }
        .leaflet-control-attribution {
          background: rgba(247,248,250,0.9) !important;
          color: rgba(11,15,23,0.5) !important;
          font-size: 9px !important;
          padding: 1px 6px !important;
        }
        .leaflet-control-attribution a { color: rgba(108,71,255,0.7) !important; }
        .leaflet-tooltip { border: 1px solid rgba(108,71,255,0.14); border-radius: 10px; box-shadow: 0 16px 40px -24px rgba(10,14,26,0.45); padding: 8px 10px; }
        .leaflet-tooltip-top:before { border-top-color: rgba(108,71,255,0.14); }
      `}</style>
    </>
  );
}
