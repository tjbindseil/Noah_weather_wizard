import '../../Home.css';
import { NavBar } from '../nav_bar';

export function HomeScreen() {
  return (
    <div className='wrapper'>
      <NavBar />
      <p>The Weather Wizard awaits your request!</p>
      <p>full screen ahead</p>
    </div>
  );
}

// questions:
// 1. rows with different number of columns?
// 2. assigning elements directly to grid spots?
