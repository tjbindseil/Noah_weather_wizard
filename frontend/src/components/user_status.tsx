import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserSignInStatus, useUserService } from '../services/user_service';

export function UserStatus() {
  const userService = useUserService();

  const [droppedDown, setDroppedDown] = useState(false);

  // So, its hard to tell when the user context finishes initializing
  // In order to make sure things work, we will track the user status here and
  // refresh while its trying
  const [localUserSignInStatus, setLocalUserSignInStatus] = useState(UserSignInStatus.LOADING);

  //   const userStatusPollFunc = useCallback(() => {
  //     while (localUserSignInStatus === UserSignInStatus.LOADING) {
  //
  //       setLocalUserSignInStatus(userService.getUserSignInStatus);
  //     }
  //   }, [userService, localUserSignInStatus, setLocalUserSignInStatus]);
  //
  //   useEffect(userStatusPollFunc, [userStatusPollFunc]);

  useEffect(() => {
    console.log('setting timeout');
    setTimeout(() => {
      const newUserSignInStatus = userService.getUserSignInStatus();
      console.log(`@@ @@ in timeout, and newUserSignInStatus is: ${newUserSignInStatus}`);
      if (newUserSignInStatus !== localUserSignInStatus) {
        setLocalUserSignInStatus(newUserSignInStatus);
      }
    }, 200);
  }, []);

  return (
    <div className='UserStatus'>
      {droppedDown ? (
        <UserStatusDroppedDown setDroppedDown={setDroppedDown} />
      ) : localUserSignInStatus === UserSignInStatus.LOGGED_IN ? (
        <button onClick={() => setDroppedDown(true)}>Welcome: {userService.getUsername()} </button>
      ) : localUserSignInStatus === UserSignInStatus.LOADING ? (
        <p>LOADING USER</p>
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

interface UserStatusDroppedDownProps {
  setDroppedDown: (arg: boolean) => void;
}

function UserStatusDroppedDown({ setDroppedDown }: UserStatusDroppedDownProps) {
  const userService = useUserService();

  return (
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
  );
}
