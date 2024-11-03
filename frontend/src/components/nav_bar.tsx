import { navBarScreens } from './screens';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import { UserStatus } from './user_status';

export function NavBar() {
  const currentLocation = window.location.href;

  const navigate = useNavigate();
  const go = (url: string) => {
    navigate(url);
  };

  return (
    <div>
      <ul className='NavBar'>
        {navBarScreens.map((route) =>
          currentLocation.endsWith(route.path) ? (
            <></>
          ) : (
            <div className={'float-left'} key={route.path.replace('/', '_')}>
              <li key={route.path.replace('/', '_')}>
                <button
                  key={route.path.replace('/', '_')}
                  onClick={() => {
                    go(route.path);
                  }}
                >
                  {route.title}
                </button>
              </li>
            </div>
          ),
        )}
        <div className={'float-right'}>
          <li>
            <UserStatus />
          </li>
        </div>
      </ul>
    </div>
  );
}
