import { useNavigate } from 'react-router-dom';
import { NavBar } from '../nav_bar';

export function HomeScreen() {
  const navigate = useNavigate();
  const go = (url: string) => {
    navigate(url);
  };

  return (
    <div className='Home'>
      <NavBar />
      <p>The Weather Wizard awaits your request!</p>
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
