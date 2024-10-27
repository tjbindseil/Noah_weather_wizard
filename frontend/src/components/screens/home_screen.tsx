import { NavBar } from '../nav_bar';
import { UserStatus } from '../user_status';

export function HomeScreen() {
  return (
    <div className='Home'>
      <NavBar />
      <UserStatus />
      <p>The Weather Wizard awaits your request!</p>
    </div>
  );
}
