import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import { IoHome } from "react-icons/io5";
import { LuPanelLeftClose, LuPanelLeftOpen } from "react-icons/lu";
// import {IoIosArrowForward} from 'react-icons/io'

import {categories} from '../utils/data'
import whiteLogo from '../assets/whiteLogo.png'
import { useState } from 'react';

const Sidebar = ({user, closeToggle, device}) => {

  const isNotActiveStyle = 'flex items-center p-3 gap-3 text-gray-500 hover:text-black hover:bg-slate-100 transition-all duration-200 ease-in-out capitalize rounded-lg'
  const isActiveStyle = 'flex items-center p-3 gap-3 font-semibold text-green-800 bg-green-400 transition-all duration-200 ease-in-out capitalize rounded-lg'
  
  const [showFullSidebar, setShowFullSidebar] = useState(true)

  const handleCloseSidebar = () => {
    if(closeToggle) closeToggle(false)
  }


  return (
  <>
     <div className={`flex flex-col justify-between bg-white overflow-y-scroll h-full hide-scrollbar px-3 ${showFullSidebar ? 'min-w-210': 'w-fit'} border-2`}>
      <div className="flex flex-col ">
        {showFullSidebar ? (
          <Link to='/' 
            className='flex px-5 gap-2 my-3 pt-1 w-190 items-center'
            onClick={handleCloseSidebar}
          >
            <img src={whiteLogo} alt="whilteLogo" className='w-full' />
          </Link>
          ) : ''
        }
        
        <div className={`flex flex-col ${device === 'large' ? 'mt-3' : ''}`}>
          {showFullSidebar ? <h3 className='p-3 text-base 2xl:text-xl ' >Discover Categories</h3> : ''}
          <NavLink
            to='/'
            className={({isActive}) => isActive? isActiveStyle : isNotActiveStyle }
            onClick={handleCloseSidebar}
            title='Home'
           >
            <IoHome fontSize={30} />
            {showFullSidebar ? 'home' : ''}
          </NavLink>
          {categories?.map((category) => (
            <NavLink
              key={category.name}
              to={`/category/${category.name}`}
              className={({isActive}) => isActive? isActiveStyle : isNotActiveStyle }
              onClick={handleCloseSidebar}
              title={category.name.slice(0,1).toUpperCase() + category.name.slice(1)}
            >
              <img 
                src={category.image} 
                alt={category.name}
                className='w-8 h-8 rounded-full'
              />
              {showFullSidebar ? category.name : ''}
            </NavLink>
          ))}
        </div>
      </div>
      
      {user && (
        <div className='flex items-center justify-between gap-2 w-full mt-2 p-2  rounded-t-lg'>
          {showFullSidebar ? <Link
            to={`user-profile/${user._id}`}
            className='flex items-center p-2 gap-2 bg-transparent rounded-lg w-fit '
            onClick={handleCloseSidebar}
          >
            <img 
              src={user.image} 
              alt="userProfile" 
              className='w-9 h-9 rounded-full border-blue-500'  
            />
            <p className='text-sm'>{user.userName} </p>
          </Link> : ''}
          {device === 'large' && (
            <button 
              className='grid place-items-center p-2 rounded-lg cursor-pointer' 
              onClick={() => setShowFullSidebar(!showFullSidebar)}
              title={showFullSidebar ? 'Collapse' : 'Expand' }
            >
              {showFullSidebar ? <LuPanelLeftClose fontSize={30}/> : <LuPanelLeftOpen fontSize={30}/>}
            </button> )
          }
        </div>)
      }
    </div>
  </>  
  )
}

export default Sidebar