import { useState, useCallback } from 'react';
import { useQuery, skipToken } from '@tanstack/react-query';

import { geoDirect, type GeoDirectCityItem } from '@/lib/openweather';

export const getCityItemKey = ({ lat, lon }: GeoDirectCityItem) =>
  `${lat};${lon}`;

const useCityNameInput = () => {
  const [valueRaw, setValue] = useState('');
  const value = valueRaw.trim();

  const onChange = useCallback((evt: { currentTarget: { value: string } }) => {
    setValue(evt.currentTarget.value);
  }, []);

  const valueRefined = value.trim();
  return {
    valid: Boolean(valueRefined),
    value,
    onChange,
    valueRefined,
  };
};

const useGeoDirectQuery = (cityInput?: string) => {
  const query = useQuery({
    queryKey: ['openweather/geoDirect', cityInput],
    queryFn: cityInput
      ? (ctx) => {
          const { signal } = ctx;
          return geoDirect({ city: cityInput }, signal);
        }
      : skipToken,
    enabled: false,
    //cities usually don't change their coordinates
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const fetchCityItems = () => {
    if (!query.isSuccess) {
      //refetch only if not cached
      return query.refetch();
    }
  };

  return {
    query,
    fetchCityItems,
    cityItems: query.data,
  };
};

const useCityItemsRadioGroup = (cityItems: GeoDirectCityItem[]) => {
  const [cityItemSelected, setCityItemSelected] =
    useState<GeoDirectCityItem | null>(null);

  const onSelectCityItem: React.ChangeEventHandler<HTMLInputElement> =
    useCallback(
      (evt) => {
        if (evt.target.checked) {
          const item = cityItems.find(
            (item) => getCityItemKey(item) === evt.target.value,
          );
          if (item) {
            setCityItemSelected(item);
          }
        }
      },
      [cityItems],
    );

  return {
    value: cityItemSelected,
    onChange: onSelectCityItem,
  };
};

export const useCitySelector = () => {
  const cityNameInput = useCityNameInput();
  const { query, cityItems, fetchCityItems } = useGeoDirectQuery(
    cityNameInput.valid ? cityNameInput.valueRefined : undefined,
  );
  const cityItemsRadioGroup = useCityItemsRadioGroup(cityItems ?? []);

  return {
    value: cityItemsRadioGroup.value,
    //ctx
    onChange: cityItemsRadioGroup.onChange,
    cityNameInputValid: cityNameInput.valid,
    cityNameInputValue: cityNameInput.value,
    cityNameInputOnChange: cityNameInput.onChange,
    query,
    cityItems,
    fetchCityItems,
  };
};
