import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Forecast, Spot } from 'ww-3-models-tjb';
import { useForecastService } from '../../services/forecast_service';
import { NavBar } from '../nav_bar';

export function ForecastScreen() {
  const forecastService = useForecastService();
  const location = useLocation();

  const selectedSpots = location.state?.selectedSpots;

  const [forecasts, setForecasts] = useState<{ spot: Spot; forecast: Forecast }[]>([]);

  useEffect(() => {
    if (!selectedSpots || !selectedSpots.length || selectedSpots.length === 0) {
      console.error('selectedSpots is undefined');
      return;
    }

    forecastService.getForecasts({ spotIDs: selectedSpots }).then((result) => {
      setForecasts(result.forecasts);
    });
  }, [forecastService, setForecasts]);

  return (
    <div className='MapWrapper'>
      <NavBar />
      <p>See the forecast here!</p>
      {forecasts.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Spot Name</th>
              {forecasts[0].forecast.periods.map((period) => (
                <th key={period.name}>{period.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {forecasts.map(({ forecast, spot }) => (
              <tr key={spot.name}>
                <td>{spot.name}</td>
                {forecast.periods.map((period) => (
                  <td key={`${spot.id} - ${period.name}`}>
                    <img src={period.icon} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>
          Visit the <Link to={'/spot-selection-page'}>Spot Selection Page</Link> to choose some
          spots and compare their forecasts!
        </p>
      )}
    </div>
  );
}
