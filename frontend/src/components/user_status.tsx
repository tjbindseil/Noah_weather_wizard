import { useState } from 'react';
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
      {userService.signedIn() ? (
        <p>Welcome: ${userService.getUsername()} </p>
      ) : (
        <button>Sign In</button>
      )}
      <p>The Weather Wizard awaits your request!</p>
    </div>
  );
}
