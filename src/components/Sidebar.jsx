import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import {RiHomeFill} from 'react-icons/ri'
// import {IoIosArrowForward} from 'react-icons/io'

import {categories} from '../utils/data'
import logo from '../assets/logo.png'

const Sidebar = ({user,closeToggle}) => {

  const isNotActiveStyle = ' flex items-center px-5 p-1 gap-3 text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitalize'
  const isActiveStyle = ' flex items-center px-5 p-1 gap-3 font-extrabold border-r-2 border-black transition-all duration-200 ease-in-out capitalize'
  

  const handleCloseSidebar = () => {
    if(closeToggle) closeToggle(false)
  }


  return (
  <>
    <div className="flex flex-col justify-between bg-white overflow-y-scroll h-full min-w-210 hide-scrollbar">
      <div className="flex flex-col">
        <Link to='/' 
          className='flex px-5 gap-2 my-6 pt-1 w-190 items-center'
          onClick={handleCloseSidebar}
         >
          <img src={logo} alt="logo" className='w-full' />
        </Link>

        <div className='flex flex-col '>
          <NavLink
            to='/'
            className={({isActive}) => isActive? isActiveStyle : isNotActiveStyle }
            onClick={handleCloseSidebar}
           >
            <RiHomeFill />
            home
          </NavLink>
          <h3 className='mt-2 px-5 text-base 2xl:text-xl' >Discover Categories</h3>
          {categories.slice(0,categories.length-1).map((category) => (
            <NavLink
            key={category.name}
              to={`/category/${category.name}`}
              className={({isActive}) => isActive? isActiveStyle : isNotActiveStyle }
              onClick={handleCloseSidebar}
            >
              <img 
                src={category.image} 
                alt={category.name}
                className='w-8 h-8 rounded-full '
              />
              {category.name}
            </NavLink>
          ))}
        </div>
      </div>
      
      {user && (
        <Link
          to={`user-profile/${user._id}`}
          className='flex items-center my-5 mb-3 mx-3 p-2 gap-2 bg-white rounded-lg shadow-lg'
          onClick={handleCloseSidebar}
         >
          <img 
            src={user.imageUrl} 
            alt="userProfile" 
            className='w-9 h-9 rounded-full border-2 border-blue-500'  
          />
          <p>{user.userName} </p>
        </Link>
      )}
    </div>
  </>  
  )
}

export default Sidebar