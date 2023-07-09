import React,{useState} from 'react'
import { Link, useNavigate } from 'react-router-dom' 
import {v4 as uuidv4} from 'uuid'
import {MdDownloadForOffline} from 'react-icons/md'
import {AiTwotoneDelete} from 'react-icons/ai'
import {BsFillArrowUpRightCircleFill} from 'react-icons/bs'

import {client, urlFor } from '../client'
import { fetchUser } from '../utils/fetchUser'


const Pin = ({pin: {postedBy,image,_id,destination,save}}) => {
  const navigate = useNavigate()
  const [postHovered, setPostHovered] = useState(false)
  const user = fetchUser()

  let alreadySaved = save?.filter((item) => item?.postedBy?._id === user?.sub)
  // filter function short revise
  //  1, [2,1,3] -> on filter it gives -> [1].length  -> 1
  //  5, [2,1,3] -> on filter it gives ->  [].length  -> 0
  // but i need alreadySaved to be boolean,  so !1 -> false, !false -> true
  // so, !!1 -> true and same for false boolean value

  // save the current post in user save array and increase the count of saved of post in postedBy user 
  const savePin = (id) => {
    if(alreadySaved === undefined) {

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
            window.location.reload()  // reload the current window
          })
    } 
  }

  // function to remove the post from the view, after post get delets reloads the current window
  const deletePin = (id) => {
    client.delete(id).then(() => {
      window.location.reload();
    })
  }

  return (
  <div className='m-2 p-2 rounded-md bg-white hover:shadow-md'>
    <div
      onMouseEnter={() => setPostHovered(true)}
      onMouseLeave={() => setPostHovered(false)}
      className='relative cursor-zoom-in w-auto transition-all duration-500 ease-in-out hover:shadow-lg rounded-lg overflow-hidden opacity-100 hover:opacity-90'
      onClick={() => navigate(`/pin-detail/${_id}`)}
     >
      <img src={urlFor(image).width(250).url()} alt="user-Post" className='rounded-lg w-full '/>  
      {postHovered && (
        <div className="absolute top-0 h-full w-full flex flex-col justify-between p-2 pl-1 z-50 ">
          <div className="flex items-center justify-between">
            <div className='flex gap-2 '>
              <a 
                href={`${image.asset.url}?dl`}
                onClick={(e) => e.stopPropagation()}
                className='flex items-center justify-center bg-white rounded-full w-8 h-8 opacity-70 hover:opacity-100 p-1'
              >
                <MdDownloadForOffline fontSize={24}/>
              </a>
            </div>

            {alreadySaved !== undefined ? (
              <button
                onClick={(e) => e.stopPropagation()} 
                className='bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 rounded-3xl text-base hover:shadow-md oulined-none'>
                {save.length}  Saved
              </button>
             ):(
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      savePin(_id)
                    }}
                    className='bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 rounded-3xl text-base hover:shadow-md oulined-none'>
                    Save
                  </button>
                )
            }
          </div>

          <div className="flex justify-between items-center w-full gap-2">
            {destination && (
              <a
                href={destination}
                target='_black'
                rel='noreferrer'
                className='bg-white text-black flex items-center gap-2 font-bold py-2 px-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md'
               >
                <BsFillArrowUpRightCircleFill />
                {destination.length > 20 ? destination.slice(8,15) : destination(8)}   {/* i don't want to show https:// which has 8 character*/}
              </a>
            )}
            
            {postedBy._id === user.sub && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  deletePin(_id)
                }}
                className='bg-white opacity-70 hover:opacity-100 text-dark font-bold  rounded-3xl text-base hover:shadow-md oulined-none p-1'    
               >
                <AiTwotoneDelete />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
    
    {/* show the detail of user who posted this post */}
    <Link
     to={`user-profile/${postedBy._id}`}
     className=' flex gap-2 mt-2 items-center'
     >
      {/* <img 
        src={postedBy.imageUrl}   // this contains the image of user posted this post
        alt="PostedBy-user" 
        className='w-8 h-8 rounded-full object-cover'
      /> */}
      <p className='font-bold capitalise'>{postedBy.userName}</p>
    </Link>
    
  </div>
  )
}

export default Pin