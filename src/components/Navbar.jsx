import React from 'react'

import {Link, useNavigate} from 'react-router-dom'
import {IoMdAdd, IoMdSearch} from 'react-icons/io'
const Navbar = ({searchTerm, setSearchTerm, user}) => {
  
  const navigate = useNavigate();
  
  if(!user)   return null;  // if user is not present


  return (
  <div className='flex gap-2 md:gap-5 w-full mt-5 py-2 px-2'>
    <div className="flex justify-start items-center w-full px-2 rounded-md bg-white border-none outline-none focus-within:shadow-md ">
      <IoMdSearch fontSize={21} className='ml-1' />
      <input 
        type='search'
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder='Search..'
        value={searchTerm}
        className='p-2 w-full bg-white outline-none'
        onFocus={() => navigate('/search')}
        onBlur={() => navigate(-1)}
      />
    </div>
    <div className="flex gap-3">
      <Link 
        to={`/user-profile/${user?._id}`}
        className='hidden md:flex items-center justify-center' 
       >
        <img src={user.imageUrl} alt="userProfileImage" className='w-12 h-10 rounded-lg'/>
      </Link>
      <Link 
        to='/create-pin'
        className='bg-black text-white rounded-lg w-12 h-10 md:w-12 md:h-10 flex justify-center items-center' 
       >
        <IoMdAdd fontSize={18}/>
      </Link>
    </div>
  </div>
  )
}

export default Navbar