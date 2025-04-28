import React,{useState, useEffect, useRef} from 'react'
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
  const inputRef = useRef(null)

  useEffect(() => {

    const handleSpeechRecognition = (e) => {
      let transcript = Array.from(e.results)
      .map(result => result[0])
      .map(result => result.transcript)
      .join("").trim()
      
      transcript = transcript.substring(0, transcript.length - 1)

      const len = Array.from(e.results).length

      //once speech recognition determines it has a final result, append the value to previous searchText
      //this way every time you append current spoken-text with the already present-text
      if (e.results[len-1].isFinal) {
          if(transcript.toLowerCase().endsWith('clear')){  // to clear the search text
            setSearchTerm('');
          } else
            setSearchTerm( transcript );
      }
    }

    recognition.addEventListener("result", handleSpeechRecognition)

  return (() => {
    recognition.removeEventListener('result', handleSpeechRecognition)
  })
}, [])

  const toggleMic = (e) => {
      
    if(isMicActive){  // mic gets OFF
      e.stopPropagation()
      stopRecording();
    }else{     // mic gets ON
      startRecording();
      toast.info('say CLEAR to clear the search text')
    }

    setIsMicActive(prev => !prev)
  }
  
  if(!user)   // if user is not present
    return null; 

  return (
  <div className='flex gap-2 md:gap-5 w-full mt-5 p-4'>

      <Link 
        to='/create-pin'
        className='bg-black text-white rounded-lg w-12 h-10 md:w-12 md:h-10 flex justify-center items-center'
        title='Create a new pin' 
       >
        <IoMdAdd fontSize={18}/>
      </Link>
    <div 
      className="flex justify-start items-center w-full px-2 rounded-md bg-white border-none outline-none shadow-sm cursor-pointer"
      onClick={() => {
        if(pathname !== '/search'){
          navigate('/search')
          inputRef.current.focus()
        }
      }} 
    >
      <IoMdSearch 
        fontSize={30} 
        className=' font-semibold text-blue-500' 
      />
      <input 
        type='search'
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder='Search..'
        value={searchTerm}
        className='p-2 w-full bg-white outline-none ' 
        onFocus={() => navigate('/search')}
        onBlur={() => {
          setSearchTerm('');
          navigate('/')
        }} 
        ref={inputRef}
      />
      <span onClick={toggleMic} className='ml-1'>
        {isMicActive ? <BsMic fontSize={20} title='mute mic'/> : <BsMicMute fontSize={20} title='unmute mic' />}
      </span>
    </div>

    <Link 
      to={`/user-profile/${user?._id}`}
      className='hidden md:flex items-center justify-center' 
      >
      <img src={user.image} alt="userProfileImage" className='w-12 h-10 rounded-lg'/>
    </Link>
  </div>
  )
}

export default Navbar