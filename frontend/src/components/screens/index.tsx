import { ConfirmUserScreen } from './confirm_user_screen';
import { CreateUserScreen } from './create_user_screen';
import { DeleteUserScreen } from './delete_user_screen';
import { ForecastScreen } from './forecast_screen';
import { HomeScreen } from './home_screen';
import { LoginScreen } from './login_screen';
import { SpotCreationScreen } from './spot_creation_screen';
import { SpotSelectionScreen } from './spot_selection_page';

export const navBarScreens = [
  // TODO maybe screens could have their path and title as a static member?
  { title: 'Home Page', path: '/', element: <HomeScreen /> },
  { title: 'Spot Creation Page', path: '/spot-creation', element: <SpotCreationScreen /> },
  { title: 'Spot Selection Page', path: '/spot-selection', element: <SpotSelectionScreen /> },
  { title: 'Forecast Page', path: '/forecast', element: <ForecastScreen /> },
];

export const implicitScreens = [
  { path: '/login', element: <LoginScreen /> },
  { path: '/confirm_user', element: <ConfirmUserScreen /> },
  { path: '/create_user', element: <CreateUserScreen /> },
  { path: '/delete_user', element: <DeleteUserScreen /> },
];

// TODO the routes above are repeated, should be constants
// maybe the `screens` above could be a map?
// enums? as keys?
