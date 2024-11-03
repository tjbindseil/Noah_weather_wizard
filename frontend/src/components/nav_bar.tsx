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
            <div
              className='NavBarButton'
              key={route.path.replace('/', '_')}
              style={{ float: 'left' }}
            >
              <li className={'NavBarButton'} key={route.path.replace('/', '_')}>
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
        <div className='NavBarUser' style={{ float: 'right' }}>
          <li>
            <UserStatus />
          </li>
        </div>
      </ul>
    </div>
  );
}
