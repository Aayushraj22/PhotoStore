import React,{useEffect, useState, useMemo} from 'react'
import {MdDownloadForOffline} from 'react-icons/md'
import { Link ,useParams} from 'react-router-dom'
import {v4 as uuidv4} from 'uuid'  // popular library to create unique id
import { GoLinkExternal } from "react-icons/go";
import { FiSend } from "react-icons/fi";


import {client, urlFor} from '../client'
import MasonryLayout from './MasonryLayout'
import {pinDetailMorePinQuery,pinDetailQuery} from '../utils/data'
import Spinner from './Spinner'

const PinDetail = ({user}) => {
  const [pins, setPins] = useState(null)
  const [pinDetail, setPinDetail] = useState(null)
  const [comment, setComment] = useState('')
  const [addingComment, setAddingComment] = useState(false)

  const {pinId} = useParams()

  useEffect(() => {
      fetchPinDetails()
  }, [])

  const currentUser= useMemo(() => {
    return user;
  }, [user])

  const addComment = () => {
    if(comment) {
      setAddingComment(true)

      // upload comment in the backend
      client.patch(pinId)
        .setIfMissing({comments: []})    //  if current comment is the first comment then create a comments array to store all the comments
        .insert('after','comments[-1]',[{    // insert this comment at last of comments array  
          comment,     // comment : comment;  js accept this patter of writting when key and value are same
          _key: uuidv4(),   // uuidv4 sets a unique key to each comment
          postedBy: {
            _type: 'postedBy',
            _ref: currentUser._id     
          }
        }])
        .commit()
        .then(() => {
          setAddingComment(false)
          setComment('')
          fetchPinDetails()   // again doing it so that we can now get a new comment for this post, new comment which is done by me
        })
    }
  }


  const fetchPinDetails = () => {
    let query = pinDetailQuery(pinId)
    
    if(query) {
      client.fetch(query)
      .then((data) => {   // it returns an array of post of length 1
        setPinDetail(data[0])   //  on 0th index is our post placed
        
        if(data[0]) {
          // now get all the post which have same category as the current post has, and it will used to recommedation
          query = pinDetailMorePinQuery(data[0])
          client.fetch(query)
          .then((res) => {
            setPins(res)  
          })
          .catch(()=>{})
        }
      })
      .catch(()=>{})
    }
  }

    
  
  if(pinDetail === null) 
    return <Spinner message="Loading pin..." /> 

  return (
<>
  <div className='flex lg:flex-row flex-col m-auto bg-white mt-3 shadow-lg p-2' style={{maxWidth:'1500px'}}> 
    <div className="flex lg:flex-1 justify-center items-center md:items-start flex-initial h-[400px]">
      <img 
        src={pinDetail.image && urlFor(pinDetail.image).url()}
        alt={pinDetail.title} 
        loading='lazy'
        className='rounded-lg h-full object-contain'
      />
    </div> 
    <div className="w-full p-5 flex-1 xl:min-w-620">
      <div className="flex items-center justify-between">
        <div className="flex gap-2 items-center px-2 hover:text-base-800">
          <a 
            href={`${pinDetail.image.asset.url}?dl`}
            className='flex items-center justify-center bg-white rounded-lg hover:bg-green-400 opacity-50 hover:opacity-100 p-2 gap-2 hover:shadow-md'
           >
            <MdDownloadForOffline fontSize={24}/>
            <p className='text-base capitalize'>download</p>
          </a>
        </div>
        <a href={pinDetail.destination} target='_blank' rel='noreferrer' className='text-blue-800 flex items-center gap-1 text-xs'>
          <span >Image </span>
          <span><GoLinkExternal /></span>
        </a>
      </div>
      <div>
        <h1 className='text-4xl font-bold break-words mt-3'>
          {pinDetail.title}
        </h1>
        <p className="mt-3">{pinDetail.about}</p>
      </div>

      {/* a link to go to user-profile who posted this post */}
      <Link
        to={`/user-profile/${pinDetail.postedBy._id}`}
        className=' flex gap-2 mt-5 items-center bg-white rounded-lg'
       >
        <img 
          src={pinDetail?.postedBy?.image }   // this contains the image of user posted this post
          alt="PostedBy-user" 
          className='w-8 h-8 rounded-full object-cover'
        />
        <p className='font-bold capitalize'>{pinDetail.postedBy.userName}</p>
      </Link>

      {/* show all the comments for this post */}
       <h2 className="mt-5 text-2xl">Comments</h2>
       <div className='max-h-370 overflow-y-auto'>
          {pinDetail?.comments?.map((comment,i) => (   // ? is used because sometimes you don't have comment for the post their it works to say map() to not generate the error, if map is empty, map() does not runs for empty array 
            <div className="flex gap-2 mt-5 items-center bg-white rounded-lg" key={i}>
              <img src={comment.postedBy.image} 
                alt="postedBy-user-profile" 
                className='w-10 h-10 rounded-full cursor-pointer '
              />
              <div className="flex flex-col">
                <p className="font-bold">{comment.postedBy.userName}</p>
                <p className="text-base/6">{comment.comment}</p>
              </div>
            </div>
          ))}
       </div>

      {/* for user to post the comment */}
      <div className="flex flex-wrap mt-6 gap-2 px-2">
          <Link
            to={`/user-profile/${currentUser?._id}`}
            className=' flex items-center cursor-pointer'
          >
            <img 
              src={currentUser?.image}   // this contains the image of user posted this post
              alt="PostedBy-user" 
              className='w-10 h-10 rounded-full object-cover'
            />
          </Link>
          <div className='border-2 border-gray-300 rounded-lg flex-1 flex hover:border-gray-500 transition-all ease-in-out'>
            <input type="text"
              className='flex-1 outline-none p-2 rounded-lg  w-full'
              placeholder='add comments..'
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyDown={(e) => {
                if(e.code === 'Enter'){
                  addComment();
                }

              }}
            />

            <button
              type='button'
              className={`bg-green-500 hover:bg-green-600 text-white rounded-md text-lg p-2  outline-none px-2 h-full  ${addingComment ? 'animatingCommentButton' : ''}`}
              onClick={addComment}
            >
              <FiSend />
            </button>
          </div>
        
      </div>
    </div> 
  </div>

  <h2 className="text-center font-bold text-2xl mt-8 mb-4">
    More like this
  </h2>
  {pins?.length > 0 ? (
      <MasonryLayout pins={pins} />
    ) : 
    (
      <>
        {pins?.length === 0 ? 
          (<h5 className='text-center font-semibold text-xl mt-4 mb-2'>Post your <span className='text-sky-600'>Creative Images</span>, so it can be recommened</h5>) : 
          ( <Spinner message="Loading more Post..." />)}
      </>
    )
  }
</>  
  )
}

export default PinDetail