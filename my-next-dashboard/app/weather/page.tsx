'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import WeatherCard from '@/components/WeatherCard';
import Suggestions from '@/components/Suggestions';
import { WeatherResponse } from '@/types/weather';

const MapPicker = dynamic(() => import('@/components/MapPicker'), { ssr: false });

export default function WeatherPage() {
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showMap, setShowMap] = useState(false);

  const fetchWeather = async (latitude?: string, longitude?: string) => {
    const finalLat = latitude ?? lat;
    const finalLon = longitude ?? lon;

    if (!finalLat || !finalLon) {
      setError('Latitude and longitude are required');
      return;
    }

    setLoading(true);
    setError('');
    setWeather(null);

    try {
      const res = await fetch(`/api/weather?lat=${finalLat}&lon=${finalLon}`);

      if (!res.ok) throw new Error('Failed to fetch weather');

      const data: WeatherResponse = await res.json();
      setWeather(data);
    } catch (err) {
      setError('Could not load weather data');
    } finally {
      setLoading(false);
    }
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      return;
    }
    setLoading(true);
    setError('');

    const onPosition = (position: GeolocationPosition) => {
      const latitude = position.coords.latitude.toString();
      const longitude = position.coords.longitude.toString();

      setLat(latitude);
      setLon(longitude);

      fetchWeather(latitude, longitude);
    };

    const onError = async (err: GeolocationPositionError) => {
      // If permission denied or position unavailable, try IP-based fallback
      if (err?.code === 1 /* PERMISSION_DENIED */) {
        setError('Location access denied — attempting IP-based lookup');
        try {
          const ipRes = await fetch('https://ipapi.co/json/');
          if (!ipRes.ok) throw new Error('IP lookup failed');
          const ipData = await ipRes.json();
          const latitude = String(ipData.latitude ?? ipData.lat ?? '');
          const longitude = String(ipData.longitude ?? ipData.lon ?? '');

          if (latitude && longitude) {
            setLat(latitude);
            setLon(longitude);
            fetchWeather(latitude, longitude);
            return;
          }
        } catch {
          setError('Location access denied and IP lookup failed');
        }
      } else {
        setError('Could not determine location');
      }

      setLoading(false);
    };

    try {
      navigator.geolocation.getCurrentPosition(onPosition, onError, { maximumAge: 60000, timeout: 8000 });
    } catch (e) {
      onError({ code: 2, message: 'Geolocation error' } as GeolocationPositionError);
    }
  };

  return (
    <main className="min-h-screen p-6 flex flex-col items-center gap-6">
      <h1 className="text-2xl font-bold">🌦️ Weather Dashboard</h1>

      <div className="flex flex-wrap gap-2 justify-center">
        <input
          type="text"
          placeholder="Latitude"
          value={lat}
          onChange={(e) => setLat(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <input
          type="text"
          placeholder="Longitude"
          value={lon}
          onChange={(e) => setLon(e.target.value)}
          className="border px-3 py-2 rounded"
        />

        <button
          onClick={() => fetchWeather()}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Get Weather
        </button>

        <button
          onClick={useMyLocation}
          disabled={loading}
          className="border px-4 py-2 rounded disabled:opacity-50"
        >
          📍 Use My Location
        </button>

        <button
          onClick={() => setShowMap((s) => !s)}
          className="border px-4 py-2 rounded"
        >
          🗺️ Pick from Map
        </button>
      </div>

      {showMap && (
        <div className="w-full max-w-3xl">
          <MapPicker
            onSelect={(latitude, longitude) => {
              setLat(latitude);
              setLon(longitude);
              fetchWeather(latitude, longitude);
              setShowMap(false);
            }}
          />
        </div>
      )}

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {weather && (
        <>
          <WeatherCard current={weather.current} />
          <Suggestions current={weather.current} />
        </>
      )}
    </main>
  );
}
