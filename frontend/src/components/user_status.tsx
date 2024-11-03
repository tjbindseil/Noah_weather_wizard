import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSpotService } from '../services/spot_service';
import { UserSignInStatus, useUserService } from '../services/user_service';

// TODO UserStatus is a part of NavBar
export function UserStatus() {
  const userService = useUserService();

  const [droppedDown, setDroppedDown] = useState(false);

  // So, its hard to tell when the user context finishes initializing
  // In order to make sure things work, we will track the user status here and
  // refresh while its trying
  const [localUserSignInStatus, setLocalUserSignInStatus] = useState(UserSignInStatus.LOADING);
  useEffect(() => {
    setTimeout(() => {
      const newUserSignInStatus = userService.getUserSignInStatus();
      if (newUserSignInStatus !== localUserSignInStatus) {
        setLocalUserSignInStatus(newUserSignInStatus);
      }
    }, 200);
  }, []);

  return (
    <div style={{ height: '100%' }}>
      {droppedDown ? (
        <UserStatusDroppedDown setDroppedDown={setDroppedDown} />
      ) : localUserSignInStatus === UserSignInStatus.LOGGED_IN ? (
        <button style={{ height: '100%' }} onClick={() => setDroppedDown(true)}>
          Welcome: {userService.getUsername()}{' '}
        </button>
      ) : localUserSignInStatus === UserSignInStatus.LOADING ? (
        <p>LOADING USER</p>
      ) : (
        <button style={{ height: '100%' }}>
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
  const spotService = useSpotService();

  const navigate = useNavigate();

  return (
    <ul>
      <li>
        <button
          onClick={async () => {
            const favoriteSpotIds = await spotService.getFavorites({});
            navigate('/forecast', {
              state: { selectedSpots: [favoriteSpotIds.favoriteSpots.map((spot) => spot.id)] },
            });
          }}
        >
          Favorites page
        </button>
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
