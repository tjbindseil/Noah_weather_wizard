import { useNavigate } from 'react-router-dom';
import { NavBar } from '../nav_bar';

export function ForecastScreen() {
  const navigate = useNavigate();
  const go = (url: string) => {
    navigate(url);
  };

  return (
    <div className='Home'>
      <NavBar />
      <p>See the forecast here!</p>
      <p>
        <button
          onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            event;
            go('/spot');
          }}
        >
          Spots
        </button>
      </p>
    </div>
  );
}
