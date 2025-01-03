import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generalInputChangeHandler } from '../../helpers/general_input_change_handler';
import { useUserService } from '../../services/user_service';
import { NavBar } from '../nav_bar';
import { PasswordRequirements } from '../password_requirements';

export function LoginScreen() {
  const userService = useUserService();

  const navigate = useNavigate();
  const go = (url: string) => {
    navigate(url);
  };

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const loginFunc = useCallback(() => {
    userService.authorizeUser({ username, password }).then(() => go('/'));
    // TODO show loading
  }, [username, password]);

  return (
    <div className='LoginWrapper'>
      <NavBar />
      <div>
        <p>Login screen</p>
        <label>enter username here: </label>
        <input
          value={username}
          onChange={(e) => generalInputChangeHandler(e, setUsername)}
          type={'text'}
        ></input>
        <br />

        <label>
          enter password here <PasswordRequirements />:{' '}
        </label>
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
    </div>
  );
}
