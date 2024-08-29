import { useNavigate } from 'react-router-dom';
import { NavBar } from '../nav_bar';

export function SpotScreen() {
  // TODO is there a good way to DRY this out?
  const navigate = useNavigate();
  const go = (url: string) => {
    navigate(url);
  };

  return (
    <div className='Home'>
      <NavBar />
      <p>Select spots here</p>
      <p>
        <button
          onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            event;
            go('/');
          }}
        >
          Home
        </button>
      </p>
    </div>
  );
}
