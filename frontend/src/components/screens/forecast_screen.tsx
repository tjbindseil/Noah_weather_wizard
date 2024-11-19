import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Forecast, ForecastHourly, Spot } from 'ww-3-models-tjb';
import { useForecastService } from '../../services/forecast_service';
import { ImageForecast } from '../forecast_stuff/image_forecast';
import { ShortForecast } from '../forecast_stuff/short_forecast';
import { LongForecast } from '../forecast_stuff/long_forecast';
import { NavBar } from '../nav_bar';
import { HourlyForecast } from '../forecast_stuff/hourly_forecast';

export function ForecastScreen() {
  const forecastService = useForecastService();
  const location = useLocation();

  const selectedSpots = location.state?.selectedSpots;

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
    <div className='MapWrapper'>
      <NavBar />
      <p>See the forecast here!</p>
      {forecasts.length > 0 ? (
        <>
          {
            //           <ImageForecast forecasts={forecasts} />
            //           <ShortForecast forecasts={forecasts} />
            //           <LongForecast forecasts={forecasts} />
          }
          <HourlyForecast forecastsHourly={forecastsHourly} />
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
