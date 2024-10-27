import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generalInputChangeHandler } from '../../helpers/general_input_change_handler';
import { useUserService } from '../../services/user_service';
import { NavBar } from '../nav_bar';

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
    userService.createUser({ username, password, email }).then(() => go('/confirm_user'));
  }, []);

  return (
    <div className='Screen'>
      <NavBar />
      <p>Create User screen</p>
      <label>enter username here:</label>
      <input
        value={username}
        onChange={(e) => generalInputChangeHandler(e, setUsername)}
        type={'text'}
      ></input>
      <label>enter Email here:</label>
      <input
        value={email}
        onChange={(e) => generalInputChangeHandler(e, setEmail)}
        type={'text'}
      ></input>
      <label>enter password here:</label>
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
  );
}

// import { NavBar } from '../nav_bar';
//
// export function CreateUserScreen() {
//   return (
//     <div className='Screen'>
//       <NavBar />
//       <p>Enter username here:</p>
//       <p>Enter password here:</p>
//       <p>Existing User? Sign in here:</p>
//     </div>
//   );
// }
