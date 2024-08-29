import { useNavigate } from 'react-router-dom';
import { screens } from './screens';
import '../App.css';

export function NavBar() {
  const navigate = useNavigate();
  const go = (url: string) => {
    navigate(url);
  };

  const currentLocation = window.location.href;

  return (
    <div>
      <ul className='NavBar'>
        {screens.map((route) =>
          currentLocation.endsWith(route.path) ? (
            <></>
          ) : (
            <li key={route.path.replace('/', '_')}>
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
