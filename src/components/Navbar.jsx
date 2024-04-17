import React,{useState, useEffect} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {IoMdAdd, IoMdSearch} from 'react-icons/io'
import { BsMicMute, BsMic } from "react-icons/bs";
import { useLocation } from 'react-router-dom';

import { startRecording, stopRecording, recognition } from '../utils/speechRecognition'
import { toast } from 'react-toastify';


const Navbar = ({searchTerm, setSearchTerm, user}) => {

  const navigate = useNavigate();
  const {pathname} = useLocation();
  const [isMicActive, setIsMicActive] = useState(false);

  useEffect(() => {

    recognition.addEventListener("result", e => {
        const transcript = Array.from(e.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join("")

    //once speech recognition determines it has a final result, append the value to previous searchText
    //this way every time you append current spoken-text with the already present-text
    if (e.results[0].isFinal) {
        if(transcript.includes('clear'))  // to clear the search text
          setSearchTerm('');
        else
          setSearchTerm(searchTerm + transcript);
    }

})
}, [])

  function toggleMic() {
    if(pathname !== '/search')
      navigate('/search');
    
    if(isMicActive){  // mic gets OFF
      stopRecording();
    }else{     // mic gets ON
      startRecording();
      toast.info('say CLEAR to delete searches')
    }

    setIsMicActive(prev => !prev)
  }
  
  if(!user)   // if user is not present
    return null; 

  return (
  <div className='flex gap-2 md:gap-5 w-full mt-5 py-2 px-2'>
    <div className="flex justify-start items-center w-full px-2 rounded-md bg-white border-none outline-none focus-within:shadow-md cursor-pointer">
      <IoMdSearch fontSize={21} className='ml-1' />
      <input 
        type='search'
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder='Search..'
        value={searchTerm}
        className='p-2 w-full bg-white outline-none'
        onFocus={() => navigate('/search')}
        onBlur={() => {
          setSearchTerm('');
          navigate('/')
        }} 
      />
      <span onClick={() => toggleMic()}>
        {isMicActive ? <BsMicMute className='ml-1'/> : <BsMic className='ml-1'/>}
      </span>
    </div>
    <div className="flex gap-3">
      <Link 
        to={`/user-profile/${user?._id}`}
        className='hidden md:flex items-center justify-center' 
       >
        <img src={user.image} alt="userProfileImage" className='w-12 h-10 rounded-lg'/>
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