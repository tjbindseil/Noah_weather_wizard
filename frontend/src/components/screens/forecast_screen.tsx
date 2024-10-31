import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Forecast, Spot } from 'ww-3-models-tjb';
import { useForecastService } from '../../services/forecast_service';
import { NavBar } from '../nav_bar';

// take in ids of selected spots
// request the forecast from forecast service
// display that shit

export function ForecastScreen() {
  const forecastService = useForecastService();
  const location = useLocation();

  const selectedSpots = location.state.selectedSpots;

  const [forecasts, setForecasts] = useState<{ spot: Spot; forecast: Forecast }[]>([]);

  useEffect(() => {
    if (!selectedSpots || !selectedSpots.length || selectedSpots.length === 0) {
      console.error('selectedSpots is undefined');
      return;
    }

    forecastService.getForecasts({ spotIDs: selectedSpots }).then((result) => {
      console.log(`got forecasts, length is: ${forecasts.length}`);
      setForecasts(result.forecasts);
    });
  }, [forecastService, setForecasts]);
  // it would appear that the dwf app sets the thing (current picture) via the service
  // it is very reasonable that the user would want to control the caching and reloading of forecasts
  // this action would have implications outside of the forecast screen
  //
  // for this reason, i think it is best that the forecast service controls the fetching and storing of forecast data
  //
  // in addition, I would pretty simply be showing things when doing the code for forecast screen, so to the forecast service i will go
  //
  // so, now i have forecast service (and spot service) started.
  //
  // How should the forecast service handle the fetching, caching, etc of forecasts?
  //
  // Also, would a similar strategy solve the ordering of the map thing?

  return (
    <div className='Home'>
      <NavBar />
      <p>See the forecast here!</p>
      {forecasts.map(({ forecast, spot }) => {
        return (
          <>
            <p key={spot.id}>forecast for spot: {spot.name}</p>
            <img src={forecast.periods[0].icon} />
          </>
        );
      })}
    </div>
  );
}
