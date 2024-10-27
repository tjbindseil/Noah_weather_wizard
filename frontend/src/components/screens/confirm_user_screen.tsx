import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generalInputChangeHandler } from '../../helpers/general_input_change_handler';
import { useUserService } from '../../services/user_service';
import { NavBar } from '../nav_bar';

export function ConfirmUserScreen() {
  const userService = useUserService();

  const navigate = useNavigate();
  const go = (url: string) => {
    navigate(url);
  };

  const [username, setUsername] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');

  const confirmFunc = useCallback(() => {
    // TODO go to the page the user was previous on
    userService.confirmUser(username, confirmationCode).then(() => go('/'));
  }, []);

  return (
    <div className='Screen'>
      <NavBar />
      <p>Confirm User screen</p>
      <label>enter username here:</label>
      <input
        value={username}
        onChange={(e) => generalInputChangeHandler(e, setUsername)}
        type={'text'}
      ></input>
      <label>enter confirmationCode here:</label>
      <input
        value={confirmationCode}
        onChange={(e) => generalInputChangeHandler(e, setConfirmationCode)}
        type={'text'}
      ></input>
      <button onClick={() => confirmFunc()}>Confirm</button>
      <p>
        New User? Create account here: <button onClick={() => go('/create_user')}>Sign Up</button>
      </p>
      <p>(NOT DONE YET) Need a new code? click here:</p>
    </div>
  );
}
