import { useUserService } from '../../services/user_service';
import { useNavigate } from 'react-router-dom';
import { NavBar } from '../nav_bar';

export function DeleteUserScreen() {
  const userService = useUserService();

  const navigate = useNavigate();
  const go = (url: string) => {
    navigate(url);
  };

  const deleteUser = async () => {
    await userService.deleteUser();
    go('/');
  };

  return (
    <div className='LoginWrapper'>
      <NavBar />
      <div>
        <p>Are you SURE you want to delete you account?</p>
        <div style={{ display: 'inline-blick' }}>
          <button onClick={deleteUser}>YES</button>
          <button onClick={() => go('/')}>No - take me home (country roads)</button>
        </div>
      </div>
    </div>
  );
}
