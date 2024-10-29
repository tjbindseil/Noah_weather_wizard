import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUserService } from '../services/user_service';

export function UserStatus() {
  // two states
  //
  // 1. undropped down
  // just a button with either 'sign in' or <username>
  //
  // 2. dropped down
  // this can only be accessed with a signed in user
  // it shows
  // 1. favorites
  // 2. logout
  // 3. delete account

  const userService = useUserService();

  const [droppedDown, setDroppedDown] = useState(false);

  return (
    <div className='UserStatus'>
      {droppedDown ? (
        // TODO - should this be its own page? profile page or something
        <ul>
          <li>
            <button>Favorites page</button>
          </li>
          <li>
            <button onClick={() => userService.logout()}>
              <Link reloadDocument to={'/'}>
                logout
              </Link>
            </button>
          </li>
          <li>
            <button>
              <Link reloadDocument to={'/delete_user'}>
                Delete Account
              </Link>
            </button>
          </li>
          <li>
            <button onClick={() => setDroppedDown(false)}>close</button>
          </li>
        </ul>
      ) : userService.signedIn() ? (
        <button onClick={() => setDroppedDown(true)}>Welcome: {userService.getUsername()} </button>
      ) : (
        <button>
          <Link reloadDocument to={'/login'}>
            Sign In/Up
          </Link>
        </button>
      )}
    </div>
  );
}
