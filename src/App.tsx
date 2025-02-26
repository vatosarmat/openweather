import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { Chart } from '@/Chart';
import { CitySelector, useCitySelector } from '@/CitySelector';
import { envValidationResult } from '@/env';
import { ZodErrorView } from '@/ui/ZodErrorView';

const queryClient = new QueryClient();

export const InnerApp = () => {
  const { value, ...citySelectorProps } = useCitySelector();

  return (
    <div className="flex flex-col gap-12 p-5">
      <CitySelector {...citySelectorProps} value={value} />
      {value && (
        <Chart
          locationName={`${value.name}, ${value.state}, ${value.country}`}
          lat={value.lat}
          lon={value.lon}
        />
      )}
    </div>
  );
};

export const App = () => {
  if (!envValidationResult.success) {
    return <ZodErrorView errorResult={envValidationResult} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <InnerApp />
    </QueryClientProvider>
  );
};
