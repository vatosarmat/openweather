import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { CartesianGrid, Legend, Line, LineChart, XAxis, YAxis } from 'recharts';

import {
  forecastItemDate,
  type ForecastItem,
  type ForecastReply,
  forecast,
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

    return date.getUTCDate() !== firstDt.getUTCDate();
  });

  if (!firstSecondDayItem) {
    return [];
  }

  const firstSecondDayDt = forecastItemDate(firstSecondDayItem);

  const firstTickDt =
    firstDt.getUTCHours() === firstSecondDayDt.getUTCHours()
      ? firstDt
      : firstSecondDayDt;

  return chartData
    .filter(
      (item) =>
        forecastItemDate(item).getUTCHours() === firstTickDt.getUTCHours(),
    )
    .map(dataKey);
};

const useForecastQuery = ({ lat, lon }: Pick<ChartProps, 'lat' | 'lon'>) => {
  const query = useQuery({
    queryKey: ['forecast', lat, lon],
    queryFn: (ctx) => {
      const { signal } = ctx;
      return forecast({ lat, lon }, signal);
    },
    //Don't waste requests quota in wain!
    staleTime: 3600 * 1000,
  });

  const reply = query.data;
  const xAxisTicks = useMemo(() => getXAxisTicks(reply), [reply]);

  return {
    query,
    xAxisTicks,
  };
};

export type ChartProps = {
  locationName: string;
  lat: number;
  lon: number;
};

export const Chart = ({ locationName, lat, lon }: ChartProps) => {
  const { query, xAxisTicks } = useForecastQuery({ lat, lon });

  if (query.status === 'pending') {
    return <Spinner color="black" className="size-20" />;
  }

  if (query.status === 'error') {
    return <div className="text-red-700">Error</div>;
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="text-2xl">
        Weather forecast in <span className="font-bold">{locationName}</span>
      </div>
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
          formatter={(_v, _obj) => {
            // console.log(v);
            // console.log(obj);
            return 'temperature, °C';
          }}
        />
        <Line type="monotone" dataKey="main.temp" stroke="#8884d8" />
      </LineChart>
    </div>
  );
};
