import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generalInputChangeHandler } from '../../helpers/general_input_change_handler';
import { useUserService } from '../../services/user_service';
import { NavBar } from '../nav_bar';
import { PasswordRequirements } from '../password_requirements';

export function CreateUserScreen() {
  const userService = useUserService();

  const navigate = useNavigate();
  const go = (url: string) => {
    navigate(url);
  };

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const createFunc = useCallback(() => {
    // TODO go to the page the user was previous on
    userService
      .createUser({ user: { username, password, email }, testUser: false })
      .then(() => go('/confirm_user'))
      .catch((e) => console.error(e));
  }, [username, password, email]);

  return (
    <div className='LoginWrapper'>
      <NavBar />
      <div>
        <p>Create User screen</p>
        <label>enter username here: </label>
        <input
          value={username}
          onChange={(e) => generalInputChangeHandler(e, setUsername)}
          type={'text'}
        ></input>
        <br />

        <label>enter Email here: </label>
        <input
          value={email}
          onChange={(e) => generalInputChangeHandler(e, setEmail)}
          type={'text'}
        ></input>
        <br />
        <label>
          enter password here <PasswordRequirements /> :{' '}
        </label>

        <input
          value={password}
          onChange={(e) => generalInputChangeHandler(e, setPassword)}
          type={'password'}
        ></input>
        <button onClick={() => createFunc()}>Create</button>
        <p>
          Existing User? Sign in here: <button onClick={() => go('/login')}>Sign In</button>
        </p>
      </div>
    </div>
  );
}
