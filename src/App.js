import React from 'react';
import { Route,Routes,useNavigate } from 'react-router-dom';

import Login from './components/Login'
import Home from './container/Home';
import './App.css';

function App() {
  return (
<>
  <Routes>
    <Route path='/*' element={<Home/>} />  {/* for non-defined path the application is directed to home */}
    <Route path='login' element={<Login/>} />
  </Routes>
   
</> 
  )
}

export default App;
