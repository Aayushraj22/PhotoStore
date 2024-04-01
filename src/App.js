import React,{useEffect} from 'react';
import { Route,Routes,useNavigate } from 'react-router-dom';

import Login from './components/Login'
import Home from './container/Home';
import './App.css';
import { fetchUser } from './utils/fetchUser';
import { PinDetail } from './components';

function App() {

  const navigate = useNavigate()

  useEffect(() => {
    const user = fetchUser()

    if(user === null)
      navigate('/login')
      
  }, [])
    

  return (
<>
  <Routes>
    <Route path='/*' element={<Home/>} />  {/* for non-defined path the application is directed to home */}
    <Route path='/login' element={<Login/>} />
  </Routes>
   
</> 
  )
}

export default App;
