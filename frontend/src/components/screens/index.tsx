import { ForecastScreen } from './forecast_screen';
import { HomeScreen } from './home_screen';
import { SpotCreationScreen } from './spot_creation_screen';
import { SpotSelectionScreen } from './spot_selection_page';

export const screens = [
  { title: 'Home Page', path: '/', element: <HomeScreen /> },
  { title: 'Spot Creation Page', path: '/spot-creation', element: <SpotCreationScreen /> },
  { title: 'Spot Selection Page', path: '/spot-selection', element: <SpotSelectionScreen /> },
  { title: 'Forecast Page', path: '/forecast', element: <ForecastScreen /> },
];

// TODO the routes above are repeated, should be constants
// maybe the `screens` above could be a map?
// enums? as keys?
