import { ForecastScreen } from './forecast_screen';
import { HomeScreen } from './home_screen';
import MapChart from './map_screen';
import { SpotScreen } from './spot_screen';

export const screens = [
  { title: 'Home Page', path: '/', element: <HomeScreen /> },
  { title: 'Spot Page', path: '/spot', element: <SpotScreen /> },
  { title: 'Forecast Page', path: '/forecast', element: <ForecastScreen /> },
  { title: 'Map Page', path: '/map', element: <MapChart /> },
];

// TODO the routes above are repeated, should be constants
// maybe the `screens` above could be a map?
// enums? as keys?
