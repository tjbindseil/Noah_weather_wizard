import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { screens } from './components/screens';
import './App.css';

function App() {
  return (
    <div className='App'>
      <BrowserRouter>
        <Routes>
          {screens.map((route) => (
            <Route key={route.path.replace('/', '_')} path={route.path} element={route.element} />
          ))}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
