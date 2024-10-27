import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generalInputChangeHandler } from '../../helpers/general_input_change_handler';
import { useUserService } from '../../services/user_service';
import { NavBar } from '../nav_bar';

export function LoginScreen() {
  const userService = useUserService();

  const navigate = useNavigate();
  const go = (url: string) => {
    navigate(url);
  };

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const loginFunc = useCallback(() => {
    userService.authorizeUser(username, password).then(() => go('/login'));
    // TODO show loading
  }, []);

  // TODO UserStatus on these pages???
  return (
    <div className='Screen'>
      <NavBar />
      <p>Login screen</p>
      <label>enter username here:</label>
      <input
        value={username}
        onChange={(e) => generalInputChangeHandler(e, setUsername)}
        type={'text'}
      ></input>
      <p>password requirement:</p>
      <ul>
        <li>At least 8 characters</li>
        <li>Contains at least 1 number</li>
        <li>Contains at least 1 special character</li>
        <li>Contains at least 1 uppercase letter </li>
        <li>Contains at least 1 lowercase letter</li>
      </ul>
      <label>enter password here:</label>
      <input
        value={password}
        onChange={(e) => generalInputChangeHandler(e, setPassword)}
        type={'password'}
      ></input>
      <button onClick={() => loginFunc()}>Login</button>
      <p>
        New User? Create account here: <button onClick={() => go('/create_user')}>Sign Up</button>
      </p>
    </div>
  );
}
