import { NavBar } from '../nav_bar';

export function DeleteUserScreen() {
  return (
    <div className='wrapper'>
      <NavBar />
      <p>Are you SURE you want to delete you account?</p>
      <p>YES - I AM WILLING TO LOSE ALL MY DATA</p>
      <p>No - take me home (country roads)</p>
    </div>
  );
}
