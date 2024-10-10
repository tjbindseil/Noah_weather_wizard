import { NavBar } from '../nav_bar';

// take in ids of selected spots
// request the forecast from forecast service
// display that shit

export function ForecastScreen() {
  // it would appear that the dwf app sets the thing (current picture) via the service
  // it is very reasonable that the user would want to control the caching and reloading of forecasts
  // this action would have implications outside of the forecast screen
  //
  // for this reason, i think it is best that the forecast service controls the fetching and storing of forecast data
  //
  // in addition, I would pretty simply be showing things when doing the code for forecast screen, so to the forecast service i will go

  return (
    <div className='Home'>
      <NavBar />
      <p>See the forecast here!</p>
    </div>
  );
}
