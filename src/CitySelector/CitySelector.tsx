import { Button } from '@/ui/Button';
import { Input } from '@/ui/Input';

import { getCityItemKey, useCitySelector } from './hook';

export type CitySelectorProps = ReturnType<typeof useCitySelector>;

export const CitySelector = (props: CitySelectorProps) => {
  const {
    cityItems,
    cityNameInputOnChange,
    cityNameInputValid,
    cityNameInputValue,
    fetchCityItems,
    onChange,
    query,
    value,
  } = props;

  const noDups = new Set<string>();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row items-center gap-2">
        <label className="flex flex-row items-center gap-2">
          <div>City</div>
          <Input
            value={cityNameInputValue}
            onChange={cityNameInputOnChange}
            onEnter={fetchCityItems}
          />
        </label>
        <Button
          disabled={!cityNameInputValid}
          loading={query.isLoading}
          onClick={fetchCityItems}
        >
          Search
        </Button>
      </div>
      <div className="flex flex-col gap-3">
        {cityItems &&
          (cityItems.length > 0
            ? cityItems.map((cityIem) => {
                const cityKey = getCityItemKey(cityIem);
                if (noDups.has(cityKey)) {
                  return null;
                }
                noDups.add(cityKey);

                return (
                  <label
                    key={cityKey}
                    className="cursor-pointer flex flex-row gap-2 items-center"
                  >
                    <input
                      type="radio"
                      name="city"
                      value={cityKey}
                      onChange={onChange}
                      checked={
                        value ? cityKey === getCityItemKey(value) : false
                      }
                    />
                    <div className="flex flex-row gap-1 items-center">
                      <div>{cityIem.name};</div>
                      {cityIem.state ? <div>{cityIem.state};</div> : null}
                      <div>{cityIem.country};</div>
                      <div>{cityIem.lat};</div>
                      <div>{cityIem.lon}</div>
                    </div>
                  </label>
                );
              })
            : query.isSuccess && (
                <div>
                  <span className="text-orange-400">{cityNameInputValue}</span>{' '}
                  - no such city
                </div>
              ))}
      </div>
    </div>
  );
};
