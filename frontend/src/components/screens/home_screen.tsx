import { Link } from 'react-router-dom';
import { NavBar } from '../nav_bar';

export function HomeScreen() {
  return (
    <div className='MapWrapper'>
      <NavBar />
      <div>
        <p>The Weather Wizard awaits your request!</p>
        <br />
        <p>
          Browse existing spots at the <Link to={'/spot-selection'}>Spot Selection Page</Link>.
          Select potential locations for various activites and then compare their forecasts to see
          where maximum sendage can occur.
        </p>
        <p>
          To add your own spots, you must be signed in.{' '}
          <Link to={'/create_user'}>Create an account.</Link>
        </p>
        <p>
          Once you are signed in, you will be able to create and delete spots, as well as save your
          favorite spots for quickly checking the weather.
        </p>
      </div>
    </div>
  );
}
