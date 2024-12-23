import React,{useState,useEffect} from 'react'
import {AiOutlineLogout} from 'react-icons/ai'
import {useParams,useNavigate} from 'react-router-dom'
// import { GoogleLogin } from '@react-oauth/google'

import {userCreatedPinsQuery,userSavedPinsQuery,userQuery} from '../utils/data'
import {client} from '../client'
import MasonryLayout from './MasonryLayout'
import Spinner from './Spinner'

// get new image every time window reloaded 
const randomImage = 'https://source.unsplash.com/1600x900/?nature,photography,technology'
const activeBtnStyles = 'bg-red-500 text-white font-bold p-2 rounded-full w-28 outline-button transition-all'
const notActiveBtnStyles = 'bg-primary text-black mr-4 font-bold p-2 rounded-full w-28 outline-button transition-all'

const UserProfile = () => {

  const [user, setUser] = useState(null)
  const [pins, setPins] = useState(null)
  const [text, setText] = useState('created')  // its value will be either 'created' or 'saved'
  const [activeBtn,setActiveBtn] = useState('created')
  const navigate = useNavigate()
  const {userId} = useParams()

  useEffect(() => {
    if(text==='created') {
      const createdPinsQuery = userCreatedPinsQuery(userId)

      client
        .fetch(createdPinsQuery)
        .then((data) => {
          setPins(data)
        })
    } else {
      const savedPinsQuery = userSavedPinsQuery(userId)

      client
        .fetch(savedPinsQuery)
        .then((data) => {
          setPins(data)
        })

    }
  }, [text,userId])
  

  useEffect(() => {
    const query = userQuery(userId)

    client.fetch(query)
      .then((data) => {
        setUser(data[0])
      })

  }, [userId])
  
  const logout =  () => {
    // console.log('before clear local stroage -> ',localStorage)
    localStorage.clear()
    // console.log('after clear local stroage -> ',localStorage)
    navigate('/login')
  }


  if(user === null)
    return <Spinner message='Loading profile...' />

  return (
    <div className='relative pb-2 min-h-full justify-center items-center '>
      <div className="flex flex-col pb-5 ">
        <div className="relative flex flex-col pb-7">
          <div className="flex flex-col justify-center items-center mb-5">
            <img src={randomImage}
              className='w-full h-370 2xl:h-510 shadow-lg object-cover'
            alt="banner-Pic" />
            <img 
              src={user?.image} 
              className='rounded-full w-20 h-20 -mt-10 shadow-xl object-cover'
              alt="user-profile" 
            />
            <h1 className="font-bold text-3xl text-center mt-3">
              {user.userName}
            </h1>
            <div className="absolute top-0 z-1 right-0 padding-2">
              {/* {console.log('user-detail -> ',user)} */}
              {userId === user?._id && (              
                  <button
                    type='button'
                    className='bg-white p-2 rounded-full cursor-pointer outline-none shadow-md'
                    onClick={logout}
                  >
                    <AiOutlineLogout color="red" fontSize={24}/>
                  </button>
              )}
            </div>
          </div>
          <div className='text-center mb-7 '>
            <button
              type='button'
              onClick={() => {
                // console.log('createdButton -> ',e.target.textcontent)
                setText('created')
                setActiveBtn('created')
              }}
              className={`${activeBtn === 'created' ? activeBtnStyles : notActiveBtnStyles} `}
             >
              Created
            </button>
            <button
              type='button'
              onClick={() => {
                // console.log('savedButton -> ',e.target.textcontent)
                setText('saved')
                setActiveBtn('saved')
              }}
              className={`${activeBtn === 'saved' ? activeBtnStyles : notActiveBtnStyles} `}
             >
              Saved
            </button>
          </div>  
        </div>
        {pins?.length ? (
            <div className="px-2">
              <MasonryLayout pins={pins}/>
            </div>
          ) : (
            <div className="text-center font-extrabold text-red-900 w-full text-xl py-2">
              No pins posted
            </div>
          )}
      </div>
      {/* <h2>UserProfile</h2> */}
    </div>
  )
}

export default UserProfile