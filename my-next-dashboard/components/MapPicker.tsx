'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMapEvents, CircleMarker } from 'react-leaflet';
import type { LeafletMouseEvent } from 'leaflet';

type Props = {
  onSelect: (lat: string, lon: string) => void;
  initialLat?: number;
  initialLon?: number;
};

function ClickHandler({ onSelect }: { onSelect: (lat: number, lon: number) => void }) {
  const [pos, setPos] = useState<[number, number] | null>(null);
  useMapEvents({
    click(e: LeafletMouseEvent) {
      const { lat, lng } = e.latlng;
      setPos([lat, lng]);
      onSelect(lat, lng);
    },
  });

  return pos ? <CircleMarker center={pos} radius={8} pathOptions={{ color: 'red' }} /> : null;
}

export default function MapPicker({ onSelect, initialLat = 0, initialLon = 0 }: Props) {
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    if (!document.querySelector(`link[href="${href}"]`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      document.head.appendChild(link);
    }
  }, []);

  return (
    <div className="w-full h-80">
      <MapContainer center={[initialLat, initialLon]} zoom={2} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickHandler onSelect={(lat, lon) => onSelect(String(lat), String(lon))} />
      </MapContainer>
    </div>
  );
}
