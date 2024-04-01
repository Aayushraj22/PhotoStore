import React,{useEffect, useState} from 'react'
import {MdDownloadForOffline} from 'react-icons/md'
import { Link ,Navigate,useParams} from 'react-router-dom'
import {v4 as uuidv4} from 'uuid'  // popular library to create unique id

import {client, urlFor} from '../client'
import MasonryLayout from './MasonryLayout'
import {pinDetailMorePinQuery,pinDetailQuery} from '../utils/data'
import Spinner from './Spinner'

const PinDetail = ({user}) => {
  // console.log('user : ',user)
  const [pins, setPins] = useState(null)
  const [pinDetail, setPinDetail] = useState(null)
  const [comment, setComment] = useState('')
  const [addingComment, setAddingComment] = useState(false)

  const {pinId} = useParams()
  
  
  // console.log('currentPin: ',pinDetail);

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
            _ref: user._id     
          }
        }])
        .commit()
        .then(() => {
          fetchPinDetails()   // again doing it so that we can now get a new comment for this post, new comment which is done by me
          setAddingComment(false)
          setComment('')
        })
    }
  }

  useEffect(() => {
    fetchPinDetails()

  }, [pinId])

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
        }
      })
    }
  }

    
  
  if(pinDetail === null) 
    return <Spinner message="Loading pin..." /> 

  return (
<>
  <div className='flex lg:flex-row flex-col m-auto bg-white' style={{maxWidth:'1500px',borderRadius: '32px'}}> 
    <div className="flex justify-center items-center md:items-start flex-initial">
      <img 
        src={pinDetail.image && urlFor(pinDetail.image).url()}
        alt={pinDetail.title} 
        className='rounded-t-3xl rounded-b-lg'
      />
    </div> 
    <div className="w-full p-5 flex-1 xl:min-w-620">
      <div className="flex items-center justify-between">
        <div className="flex gap-2 items-center px-2 hover:text-base-800">
          <a 
            href={`${pinDetail.image.asset.url}?dl`}
            // onClick={(e) => e.stopPropagation()}
            className='flex items-center justify-center bg-white rounded-full opacity-70 hover:opacity-100 p-2 gap-2 hover:shadow-md'
           >
            <MdDownloadForOffline fontSize={24}/>
            <p className='text-base capitalize'>download</p>
          </a>
        </div>
        <a href={pinDetail.destination} target='_blank' rel='noreferrer'>
          {pinDetail.title}
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
          src={pinDetail.postedBy.imageUrl}   // this contains the image of user posted this post
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
      <div className="flex items-center flex-wrap mt-6 gap-3 px-2">
        <Link
          to={`/user-profile/${user?._id}`}
          className=' flex items-center cursor-pointer'
         >
          <img 
            src={user.imageUrl}   // this contains the image of user posted this post
            alt="PostedBy-user" 
            className='w-10 h-10 rounded-full object-cover'
          />
        </Link>
        <input type="text"
          className='flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300'
          placeholder='add comments..'
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button
          type='button'
          className='bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none'
          onClick={addComment}
        >
          {addingComment ? 'Posting..' : 'Post'}
        </button>
      </div>
    </div> 
  </div>

  {pins?.length > 0 ? (
    <>
      <h2 className="text-center font-bold text-2xl mt-8 mb-4">
        More like this
      </h2>
      <MasonryLayout pins={pins} />
    </>
    ) : 
    (
      <Spinner message="Loading more Post..." />
    )
  }
</>  
  )
}

export default PinDetail