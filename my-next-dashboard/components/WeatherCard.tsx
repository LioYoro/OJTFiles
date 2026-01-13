import { CurrentWeather } from '@/types/weather';

interface Props {
  current: CurrentWeather;
}

export default function WeatherCard({ current }: Props) {
  return (
    <div className="border rounded p-4 w-full max-w-md">
      <h2 className="text-xl font-semibold mb-2">Current Weather</h2>

      <p><b>Summary:</b> {current.summary}</p>
      <p><b>Temperature:</b> {current.temperature}°C</p>
      <p>
        <b>Wind:</b> {current.wind.speed} m/s ({current.wind.dir})
      </p>
      <p><b>Cloud cover:</b> {current.cloud_cover}%</p>
    </div>
  );
}
