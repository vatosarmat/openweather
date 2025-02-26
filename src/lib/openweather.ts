const BASE_URL = 'https://api.openweathermap.org';

export class OpenweatherHttpError extends Error {
  constructor(
    public readonly code: number,
    public readonly data: object,
  ) {
    super();
  }
}

const _get = async (url: URL, signal?: AbortSignal) => {
  const response = await fetch(url, { signal });

  const data = await response.json();

  if (response.ok) {
    return data;
  }

  throw new OpenweatherHttpError(response.status, data);
};

export type GeoDirectCityItem = {
  name: string;
  local_names: Record<string, string>;
  lat: number;
  lon: number;
  country: string;
  state: string;
};

export const geoDirect = async (
  {
    city,
    countryCode,
  }: {
    city: string;
    countryCode?: string;
  },
  abortSignal?: AbortSignal,
): Promise<GeoDirectCityItem[]> => {
  const path = '/geo/1.0/direct';

  const q = countryCode ? `${city},${countryCode}` : city;

  const url = new URL(path, BASE_URL);
  url.searchParams.append('appid', import.meta.env.VITE_OPENWEATHER_APPID);
  url.searchParams.append('limit', '5');
  url.searchParams.append('q', q);

  return _get(url, abortSignal);
};

type ForecastCity = {
  id: number;
  name: string;
  coord: {
    lat: number;
    lon: number;
  };
  country: string;
  population: number;
  timezone: number;
  sunrise: number;
  sunset: number;
};

export type ForecastItem = {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    sea_level: number;
    grnd_level: number;
    humidity: number;
    temp_kf: number;
  };
  weather: [
    {
      id: number;
      main: string;
      description: string;
      icon: string;
    },
  ];
  clouds: {
    all: number;
  };
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  visibility: number;
  pop: number;
  rain?: {
    ['3h']: number;
  };
  sys: {
    pod: 'n' | 'd';
  };
  dt_txt: string;
};

export const forecastItemDate = (item: Pick<ForecastItem, 'dt'>) => {
  return new Date(item.dt * 1000);
};

export type ForecastReply = {
  cod: string | number;
  message: string | number;
  cnt: number;
  list: ForecastItem[];
  city: ForecastCity;
};

export const forecast = async (
  { lat, lon }: Pick<GeoDirectCityItem, 'lat' | 'lon'>,
  abortSignal?: AbortSignal,
): Promise<ForecastReply> => {
  const path = `/data/2.5/forecast`;

  const url = new URL(path, BASE_URL);
  url.searchParams.append('appid', import.meta.env.VITE_OPENWEATHER_APPID);
  url.searchParams.append('units', 'metric');
  url.searchParams.append('lat', lat.toString());
  url.searchParams.append('lon', lon.toString());

  return _get(url, abortSignal);
};
