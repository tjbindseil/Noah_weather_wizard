import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../app/hooks';
import { toggleSpotSelection } from '../app/visible_spots_reducer';
import { useSpotService } from '../services/spot_service';
import { UserSignInStatus, useUserService } from '../services/user_service';

export function UserStatus() {
  const userService = useUserService();

  const [droppedDown, setDroppedDown] = useState(false);

  // So, its hard to tell when the user context finishes initializing
  // In order to make sure things work, we will track the user status here and
  // refresh while its trying
  const [localUserSignInStatus, setLocalUserSignInStatus] = useState(
    userService.getUserSignInStatus(),
  );
  useEffect(() => {
    const to = setTimeout(() => {
      const newUserSignInStatus = userService.getUserSignInStatus();
      if (newUserSignInStatus !== localUserSignInStatus) {
        setLocalUserSignInStatus(newUserSignInStatus);
      }
    }, 200);
    return () => {
      clearTimeout(to);
    };
  }, []);

  return (
    <div>
      {droppedDown ? (
        <UserStatusDroppedDown setDroppedDown={setDroppedDown} />
      ) : localUserSignInStatus === UserSignInStatus.LOGGED_IN ? (
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

interface UserStatusDroppedDownProps {
  setDroppedDown: (arg: boolean) => void;
}

function UserStatusDroppedDown({ setDroppedDown }: UserStatusDroppedDownProps) {
  const dispatch = useAppDispatch();
  const userService = useUserService();
  const spotService = useSpotService();

  const navigate = useNavigate();

  const noBulletStyle = { listStyleType: 'none' };

  return (
    <ul>
      <li style={noBulletStyle}>
        <button
          className={'UserStatusDropDown'}
          onClick={async () => {
            (await spotService.getFavorites({})).favoriteSpots.forEach((spot) =>
              dispatch(toggleSpotSelection(spot.id)),
            );

            navigate('/forecast');
          }}
        >
          Compare favorites
        </button>
      </li>
      <li style={noBulletStyle}>
        <button className={'UserStatusDropDown'} onClick={() => userService.logout()}>
          <Link reloadDocument to={'/'}>
            logout
          </Link>
        </button>
      </li>
      <li style={noBulletStyle}>
        <button className={'UserStatusDropDown'}>
          <Link reloadDocument to={'/delete_user'}>
            Delete Account
          </Link>
        </button>
      </li>
      <li style={noBulletStyle}>
        <button className={'UserStatusDropDown'} onClick={() => setDroppedDown(false)}>
          close
        </button>
      </li>
    </ul>
  );
}
