import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';
import { useMemo } from 'react';
import { CartesianGrid, Legend, Line, LineChart, XAxis, YAxis } from 'recharts';

import { envValidationResult } from '@/env';
import { CitySelector, useCitySelector } from '@/CitySelector';
import {
  forecast,
  forecastItemDate,
  type ForecastItem,
  type ForecastReply,
} from '@/lib/openweather';
import { Spinner } from '@/ui/Spinner';

const intlTickFormat = Intl.DateTimeFormat('en', {
  month: 'short',
  day: 'numeric',
});

const tickFormatter = (dt: ForecastItem['dt']) => {
  return intlTickFormat.format(forecastItemDate({ dt }));
};

const dataKey = (item: ForecastItem) => {
  return item.dt;
};

const getXAxisTicks = (reply?: ForecastReply) => {
  if (!reply) {
    return [];
  }

  const chartData = reply.list;

  const firstDt = forecastItemDate(chartData[0]);

  const firstSecondDayItem = chartData.find((item) => {
    const date = new Date(item.dt * 1000);

    return date.getDate() !== firstDt.getDate();
  });

  if (!firstSecondDayItem) {
    return [];
  }

  const firstSecondDayDt = forecastItemDate(firstSecondDayItem);

  const firstTickDt =
    firstDt.getHours() === firstSecondDayDt.getHours()
      ? firstDt
      : firstSecondDayDt;

  return chartData
    .filter(
      (item) => forecastItemDate(item).getHours() === firstTickDt.getHours(),
    )
    .map(dataKey);
};

const queryClient = new QueryClient();

type InnerProps = {
  lat: number;
  lon: number;
};

const Inner = ({ lat, lon }: InnerProps) => {
  const query = useQuery({
    queryKey: ['forecast', lat, lon],
    queryFn: (ctx) => {
      const { signal } = ctx;
      return forecast({ lat, lon }, signal);
    },
  });

  const reply = query.data;
  const xAxisTicks = useMemo(() => getXAxisTicks(reply), [reply]);

  if (query.status === 'pending') {
    return <Spinner />;
  }

  if (query.status === 'error') {
    return <div className="text-red-700">Error</div>;
  }

  return (
    <LineChart
      width={800}
      height={300}
      data={query.data.list}
      margin={{ bottom: 12 }}
    >
      <CartesianGrid stroke="#ccc" strokeDasharray="5 5" syncWithTicks />
      <XAxis
        name="date"
        ticks={xAxisTicks}
        dataKey={dataKey}
        tickFormatter={tickFormatter}
      >
        {/* <Label
    fill="#000"
    position="insideBottom"
    offset={-12}
    // style={{ textAnchor: 'middle' }}
  >
    Date
  </Label> */}
      </XAxis>
      <YAxis />
      <Legend
        align="center"
        verticalAlign="top"
        formatter={(v, obj) => {
          console.log(v);
          console.log(obj);

          return 'temperature, °C';
        }}
      />
      <Line type="monotone" dataKey="main.temp" stroke="#8884d8" />
    </LineChart>
  );
};

export const InnerApp = () => {
  const { value, ...citySelectorProps } = useCitySelector();

  return (
    <div className="flex flex-col gap-5 p-5">
      <CitySelector {...citySelectorProps} value={value} />
      {value && <Inner lat={value.lat} lon={value.lon} />}
    </div>
  );
};

export const App = () => {
  if (!envValidationResult.success) {
    return (
      <div>
        <div className="p-8 text-red-600">
          {envValidationResult.error.issues[0].message}
        </div>
        <pre className="p-8 text-red-800 text-xs">
          {JSON.stringify(envValidationResult, undefined, 2)}
        </pre>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <InnerApp />
    </QueryClientProvider>
  );
};
