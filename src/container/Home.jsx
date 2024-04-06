import React,{useState,useRef,useEffect} from 'react'
import {HiMenu} from 'react-icons/hi'
import {AiFillCloseCircle} from 'react-icons/ai'
import { Link, Route, Routes } from 'react-router-dom'


import { Sidebar, UserProfile } from '../components'
import {client} from '../client'
import whiteLogo from '../assets/whiteLogo.png'
import Pins from './Pins'
import { userQuery } from '../utils/data'
import { fetchUser } from '../utils/fetchUser'


const Home = () => {
  const [toogleSidebar, setToogleSidebar] = useState(false)
  const [user, setUser] = useState(null)
  const scrollRef = useRef(null)

  // getting signedIn user from localStorage
  const userInfo = fetchUser()

  // fetch user data from sanity backend
  useEffect(() => {
    // sub:- unique identification for user
    const query = userQuery(userInfo?.sub)

    client.fetch(query).then((data) => {
      setUser(data[0])
    })
  }, [])

  useEffect(() => {
   scrollRef.current.scrollTo(0,0)
  }, [])
  
  
  

  return (
    <div className='flex md:flex-row flex-col bg-gray-50 h-screen transition-height duration-75 ease-out'>

      <div className={`hidden md:flex h-screen flex-initial `}>
        {/* sidebar for larger devices */}
        <Sidebar user={user && user}/>   
      </div> 

        {/* UI for smaller and laptop devices */}
      <div className='flex md:hidden flex-row '>
        <div className="flex flex-row justify-between p-2 w-full items-center shadow-md">  
          <HiMenu fontSize={40} className='cursor-pointer' onClick={() => {setToogleSidebar(true)}}/>
          <Link to='/'>
            <img src={whiteLogo} alt="whiteLogo" className='w-28'/>
          </Link>
          <Link to={`user-profile/${user?._id}`}>
            <img src={user?.imageUrl} alt="userProfile" className='w-9 h-9 rounded-full border-2 border-blue-600'/>
          </Link>
        </div>

        {toogleSidebar && (
            <div className='fixed w-4/5 h-screen bg-white overflow-y-auto shadow-md z-10 animate-slide-in '>
              <div className='absolute w-full flex justify-end items-center p-2 '>
                <AiFillCloseCircle fontSize={30} className='cursor-pointer' onClick={() => setToogleSidebar(false)} />
              </div>
              <Sidebar user={user && user} closeToggle={setToogleSidebar} />
            </div>
        )}

      </div>
      

      <div className="pb-2 flex-1 h-screen w-full overflow-y-scroll " ref={scrollRef}>
        <Routes>
          <Route path='/user-profile/:userId' element={<UserProfile />} />
          <Route path='/*' element={<Pins user={user && user} />} />
        </Routes>
      </div>

    </div>
  )
}

export default Home