import './App.css';
import { Route, Routes } from 'react-router-dom';
import { Home } from './Componants/Home';
import { Navbar } from './Componants/Navbar';
import { About } from './Componants/About';
import Register from './Componants/Register';

function App() {
  return (
    <div className="App">
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/register' element={<Register/>}/>
      </Routes>
    </div>
  );
}

export default App;
