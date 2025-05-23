import React,{useState} from 'react'
import { Route, Routes } from 'react-router-dom'

import {CreatePin,Navbar,Search,Feed,PinDetail} from '../components'
const Pins = ({user}) => {

  const [searchTerm, setSearchTerm] = useState('')

  return (
  <div className='px-2 md:px-5 relative'>
    <div className="sticky top-0 z-10 shadow-sm backdrop-blur-lg rounded-sm" >
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} user={user && user}/>
    </div>
    <div className="h-full">
      <Routes>
        <Route path='/' element={<Feed />}/>
        <Route path='/category/:categoryId' element={<Feed />}/>
        <Route path='/pin-detail/:pinId' element={<PinDetail user={user}/>}/>
        <Route path='/create-pin' element={<CreatePin user={user} />}/>
        <Route path='/search' element={<Search searchTerm={searchTerm} />} />
      </Routes>
    </div>
  </div>
  )
}

export default Pins