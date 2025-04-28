import React,{ useState, useMemo} from 'react'
import { Link, useNavigate } from 'react-router-dom' 
import {v4 as uuidv4} from 'uuid'
import {AiTwotoneDelete} from 'react-icons/ai'
import { FiDownload } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";
import { FaRegHeart,FaHeart } from "react-icons/fa";
import { BiLinkExternal } from "react-icons/bi";
import {TailSpin} from 'react-loader-spinner'

import {client, urlFor } from '../client'
import { fetchUser } from '../utils/fetchUser'


const Pin = ({pin: {postedBy,image,_id,destination,save,title}}) => {
  const navigate = useNavigate()
  const user = fetchUser()
  const [postHovered, setPostHovered] = useState(false)
  const [performAction, setPerformAction] = useState({
    ishappening: false,
    actionType: '',
  })

  const [saveInfo, setSaveInfo] = useState({
    savedStatusInDB : isUserSavedPin(save,user),
    totalNoOfSave: save !== undefined ? save?.length : 0,
    realtimeStatus : isUserSavedPin(save,user),
  })

  function isUserSavedPin(savedList, user){
    if(savedList === undefined)
      return false;

    return savedList.filter(savedUser => savedUser?.postedBy?._id === user?.sub)?.length > 0;
  }
  // save is an array having the people's id liked the post, at beginning it should be undefined, but as any user liked a post it will become defined and after that save always have an array, 
  // [] -> is a defined array , it is said empty array as [].length = 0

  const {getTimer, setTimer} = useMemo(() => {
    let timerId = null;
 
    function getTimer (){
      return timerId;
    };

    function setTimer ( timer ){
      timerId = timer;
    }

    return {getTimer, setTimer};
  }, [])

    // below function will add the user's id in save array of db and also change the save-status to true, increament the total saved count by 1, if user have liked the photo first-time but already liked then nothing happens (ideally it should remove the saved status but i've not implemented that features)
    const savePin = (id) => {
      setSaveInfo({
        ...saveInfo,
        realtimeStatus: saveInfo.realtimeStatus === true ? false : true,
        totalNoOfSave: !saveInfo.realtimeStatus ? saveInfo.totalNoOfSave + 1 : saveInfo.totalNoOfSave - 1,
      })

      const runningTimer = getTimer();
      if(runningTimer){
        clearTimeout(runningTimer)
      }

      const timerId = setTimeout(() => {
        
      // for now user can only save the post, not unsave it
        if(!saveInfo.savedStatusInDB && !saveInfo.realtimeStatus) {

          setPerformAction({
            ishappening: true,
            actionType: 'saving',
          })
          client.patch(id)
            .setIfMissing({save: []})
            .insert('after', 'save[-1]', [{
              _key: uuidv4(),
              userId: user.sub,
              postedBy: {
                _type: 'postedBy',
                _ref: user.sub
              }
            }])
              .commit()
              .then(() => {
                setSaveInfo({
                  ...saveInfo, 
                  savedStatusInDB: true,
                  totalNoOfSave: saveInfo.totalNoOfSave + 1,
                  realtimeStatus: true,
                })  
    
                setPerformAction({
                  ishappening: false,
                  actionType: '',
                })
              })
              .catch((error) => {
                setPerformAction({
                  ishappening: false,
                  actionType: '',
                })
              })
        }else{
          // this block have code for, when user want to undo their save-status, i.e; unsave the pin
          // console.log('already saved')
        } 

        clearTimeout(getTimer());
      }, 2000);
      
      setTimer(timerId);
  
    }

    // function to remove the post from the view, after post get deleted reloads the current window
    const deletePin = (id) => {
      setPerformAction({
        ishappening: true,
        actionType: 'deleting',
      })

      client.delete(id).then(() => {
        window.location.reload();
      })
    }
  
  return (
  <div className='p-3 sm:my-3 rounded-md bg-white hover:shadow-md relative '>
    <div
      onMouseEnter={() => setPostHovered(true)}
      onMouseLeave={() => setPostHovered(false)}
      className='relative cursor-zoom-in w-auto transition-all duration-500 ease-in-out hover:shadow-lg rounded-lg overflow-hidden opacity-100 hover:opacity-90 '
      onClick={() => navigate(`/pin-detail/${_id}`)}
    >
      <img loading='lazy' src={urlFor(image).width(250).url()} alt="user-Post" className='w-full'/>  
      {postHovered && (
        <div className="absolute top-0 h-full w-full flex flex-col justify-between p-2 pl-1 z-10 max-sm:hidden">
          <div className="flex items-center justify-between text-lg">
            <div className='flex gap-2 '>
              <a 
                href={`${image.asset.url}?dl`}
                onClick={(e) => e.stopPropagation()}
                className='flex items-center justify-center bg-white rounded-full opacity-70 hover:opacity-100 p-2 '
              >
                <FiDownload />
              </a>
            </div>

            {
              <button className='opacity-70 hover:opacity-100 bg-white rounded-sm h-8 flex gap-1 items-center p-2 outline-none '
                onClick={(e) => {
                  e.stopPropagation()
                  savePin(_id);
                }}
              >
                {saveInfo.totalNoOfSave > 0 && <span className='text-sm font-semibold'>{saveInfo.totalNoOfSave}</span>}
                {saveInfo.realtimeStatus ? <FaHeart style={{color: 'red'}} /> : <FaRegHeart />}
              </button>
            }
          </div>

          <div className="flex justify-between items-center w-full gap-2">
            {destination && (
              <button
                onClick={(e) => e.stopPropagation()}
              >
                <a
                  href={destination}
                  target='_blank'
                  rel='noreferrer'
                  className='bg-white text-black p-2 text-lg block rounded-full opacity-70 hover:opacity-100 hover:shadow-md'
                  >
                  <BiLinkExternal />
                  </a>
              </button>
            )}
            
            {postedBy._id === user.sub && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  deletePin(_id)
                }}
                className='bg-white opacity-70 text-lg hover:opacity-100 rounded-full p-2 hover:shadow-md oulined-none '    
               >
                <AiTwotoneDelete />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
    
    {/* show the title of photo */}
    <p className='text-sm mt-2 capitalize text-slate-800 pl-2'>{title}</p>
    {/* show the detail of user who posted this post */}
    <Link
     to={`user-profile/${postedBy._id}`}
     className=' flex gap-2 items-center mt-1 text-slate-600'
     >
      {/* <img 
        src={postedBy.image}   // this contains the image of user posted this post
        alt="PostedBy-user" 
        className='w-5 h-5 rounded-full object-cover'
      /> */}
      <p className='capitalise text-sm'>By: {postedBy.userName}</p>
    </Link>
    <div className='bg-white flex text-lg sm:hidden'>
      <div className='flex-1 flex gap-2'>
        <button 
          className='opacity-70 hover:opacity-100 p-2  flex gap-2 outline-none'
          onClick={(e) => {
            e.stopPropagation()
            savePin(_id)
          }}
        >
          {saveInfo.totalNoOfSave > 0 && <span className='text-sm font-semibold'>{saveInfo.totalNoOfSave}</span>}
          {saveInfo.realtimeStatus ? <FaHeart style={{color: 'red'}} /> : <FaRegHeart />}
        </button>
      </div>
      <div className='flex-1 flex gap-2 justify-end'>
        <button className='flex gap-2 '
          onClick={(e) => e.stopPropagation()}
        >
          <a 
            href={`${image.asset.url}?dl`}
            className='opacity-70 hover:opacity-100 p-2 '
          >
            <FiDownload />
          </a>
        </button>
        {postedBy._id === user.sub && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              deletePin(_id)
            }}
            className=' opacity-70 hover:opacity-100 p-2 oulined-none '    
          >
            <MdDeleteOutline />
          </button>)
        }
      </div>
    </div>

    {performAction.ishappening &&  (
      <div className={`absolute z-20 top-0 left-0 right-0 bottom-0 flex justify-center items-center text-white ${performAction.actionType === 'saving' ? 'bg-green-200' : 'bg-red-200'}`}>
        <TailSpin
          visible={true}
          height="60"
          width="60"
          color="red"
          ariaLabel="tail-spin-loading"
          radius="0"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </div>)
    }



    
  </div>
  )
}

export default Pin