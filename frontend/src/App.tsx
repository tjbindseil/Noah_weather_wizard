import './App.css';
import './Grid.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { implicitScreens, navBarScreens } from './components/screens';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css'; // Re-uses images from ~leaflet package
import 'leaflet-defaulticon-compatibility';
import 'react-tooltip/dist/react-tooltip.css';
import { GlobalServices } from './services/global_services';
import { get_app_config as getAppConfig } from 'ww-3-app-config-tjb';

function App() {
  // grab this one to set it, this is kind of a hack because we
  // can't access the below env var in app_config module
  getAppConfig(process.env.REACT_APP_WW_ENV);

  return (
    <GlobalServices>
      <div className='App'>
        <BrowserRouter>
          <Routes>
            {navBarScreens.map((route) => (
              <Route key={route.path.replace('/', '_')} path={route.path} element={route.element} />
            ))}
            {implicitScreens.map((route) => (
              <Route key={route.path.replace('/', '_')} path={route.path} element={route.element} />
            ))}
          </Routes>
        </BrowserRouter>
      </div>
    </GlobalServices>
  );
}

export default App;
