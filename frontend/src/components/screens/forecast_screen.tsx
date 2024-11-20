import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Forecast, ForecastHourly, Spot } from 'ww-3-models-tjb';
import { useForecastService } from '../../services/forecast_service';
import { ImageForecast } from '../forecast_stuff/image_forecast';
import { ShortForecast } from '../forecast_stuff/short_forecast';
import { LongForecast } from '../forecast_stuff/long_forecast';
import { NavBar } from '../nav_bar';
import { AllHourlyForecastCharts } from '../forecast_stuff/all_hourly_forecasts';
import { ForecastTypeSelector, ForecastType } from '../forecast_stuff/forecast_type_selector';

export function ForecastScreen() {
  const forecastService = useForecastService();
  const location = useLocation();

  const selectedSpots = location.state?.selectedSpots;

  const [forecastType, setForecastType] = useState(ForecastType.Image);

  const [forecasts, setForecasts] = useState<{ spot: Spot; forecast: Forecast }[]>([]);
  const [forecastsHourly, setForecastsHourly] = useState<
    { spot: Spot; forecastHourly: ForecastHourly }[]
  >([]);

  useEffect(() => {
    if (!selectedSpots || !selectedSpots.length || selectedSpots.length === 0) {
      console.error('selectedSpots is undefined');
      return;
    }

    forecastService.getForecasts({ spotIDs: selectedSpots }).then((result) => {
      setForecasts(result.forecasts);
    });
    forecastService
      .getForecastsHourly({ spotIDs: selectedSpots })
      .then((result) => {
        setForecastsHourly(result.forecastsHourly);
      })
      .catch((e) => console.error(`@@ @@ get hourly and e is: ${e}`));
  }, [forecastService, setForecasts, setForecastsHourly]);

  return (
    <div className='ForecastWrapper'>
      <NavBar />
      <h2>
        Compare Forecasts!{' '}
        <ForecastTypeSelector forecastType={forecastType} setForecastType={setForecastType} />
      </h2>
      {forecasts.length > 0 ? (
        <>
          {forecastType === ForecastType.Image ? (
            <ImageForecast forecasts={forecasts} />
          ) : undefined}
          {forecastType === ForecastType.Short ? (
            <ShortForecast forecasts={forecasts} />
          ) : undefined}
          {forecastType === ForecastType.Long ? <LongForecast forecasts={forecasts} /> : undefined}
          {forecastType === ForecastType.Hourly ? (
            <AllHourlyForecastCharts forecastsHourly={forecastsHourly} />
          ) : undefined}
        </>
      ) : (
        <p>
          Visit the <Link to={'/spot-selection'}>Spot Selection Page</Link> to choose some spots and
          compare their forecasts!
        </p>
      )}
    </div>
  );
}
