export interface WeatherResponse {
  lat: string;
  lon: string;
  elevation: number;
  timezone: string;
  units: string;
  current: CurrentWeather;
  hourly: HourlyWeather[] | null;
  daily: DailyWeather[] | null;
}

export interface CurrentWeather {
  icon: string;
  icon_num: number;
  summary: string;
  temperature: number;
  wind: {
    speed: number;
    angle: number;
    dir: string;
  };
  precipitation: {
    total: number;
    type: string;
  };
  cloud_cover: number;
}

export interface HourlyWeather {
  time: string;
  temperature: number;
}

export interface DailyWeather {
  day: string;
  temperature_max: number;
  temperature_min: number;
}
