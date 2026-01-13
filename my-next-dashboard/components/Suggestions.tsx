import { CurrentWeather } from '@/types/weather';

interface Props {
  current: CurrentWeather;
}

export default function Suggestions({ current }: Props) {
  const suggestions: string[] = [];

  // Temperature tips
  if (current.temperature >= 32) suggestions.push('🥵 Stay hydrated! It’s hot outside.');
  if (current.temperature <= 15) suggestions.push('🧣 Wear warm clothes! It’s cold.');

  // Precipitation tips
  if (current.precipitation.total > 0) {
    suggestions.push('☔ Bring an umbrella! It might rain.');
  }

  // Cloud cover tips
  if (current.cloud_cover > 80 && current.precipitation.total === 0) {
    suggestions.push('☁️ Cloudy weather, might be gloomy.');
  }

  // Wind tips
  if (current.wind.speed > 10) {
    suggestions.push('💨 Strong wind alert! Be careful outdoors.');
  }

  if (suggestions.length === 0) {
    suggestions.push('🌤️ Weather looks good. Enjoy your day!');
  }

  return (
    <div className="border rounded p-4 w-full max-w-md mt-4">
      <h2 className="text-lg font-semibold mb-2">Weather Suggestions</h2>
      <ul className="list-disc pl-5 space-y-1">
        {suggestions.map((s, index) => (
          <li key={index}>{s}</li>
        ))}
      </ul>
    </div>
  );
}
