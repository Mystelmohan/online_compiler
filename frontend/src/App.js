import './App.css';
import { Route, Routes } from 'react-router-dom';
import { Home } from './Componants/Home';
import { Navbar } from './Componants/Navbar';
import { Program } from './Componants/Program';
import Login from './Componants/Login';
import Signup from './Componants/Signup';
import Admin from './Componants/Admin';
import Profile from './Componants/Profile';
import Auth from './Componants/Auth';

function App() {
  return (
    <div className="App">
      <Auth>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/Login' element={<Login/>}/>
        <Route path='/Register' element={<Signup/>}/>
        <Route path='/Program' element={<Program/>}/>
        <Route path='/Admin' element={<Admin/>}/>
        <Route path='/Profile' element={<Profile/>}/>
      </Routes>
      </Auth>
    </div>
  );
}

export default App;
