import { useNavigate } from 'react-router-dom';
import { screens } from './screens';

export function NavBar() {
  const navigate = useNavigate();
  const go = (url: string) => {
    navigate(url);
  };

  const currentLocation = window.location.href;

  return (
    <div className='Home'>
      <ul>
        {screens.map((route) =>
          currentLocation.endsWith(route.path) ? (
            <></>
          ) : (
            <li>
              <button
                onClick={(_event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                  go(route.path);
                }}
              >
                {route.title}
              </button>
            </li>
          ),
        )}
      </ul>
    </div>
  );
}
