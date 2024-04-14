import React,{useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'
// use useParams, to find-out what is the currently passing parameter, with that we will get the category at which user is currently present

import {client} from '../client'
import MasonryLayout from './MasonryLayout'
import Spinner from './Spinner'
import { feedQuery, searchQuery } from '../utils/data'


const Feed = () => {

  const [pins, setPins] = useState(null)
  const [loading, setLoading] = useState(true)
  const {categoryId} = useParams()

  useEffect(() => {

    if(categoryId) {
      const query = searchQuery(categoryId)

      client.fetch(query).then((data) => {
        setPins(data)
        setLoading(false)
      })
    } else {
      client.fetch(feedQuery).then((data) => {
        setPins(data)
        setLoading(false)
      })
    }

    
  }, [categoryId])
  

  if(loading) 
    return <Spinner message={`we are adding new ideas to your feed!`} />


  return (
    <div>
      {pins?.length ? (
        <MasonryLayout pins={pins} />
        ) : (
          <div className='text-center'>
          <p className='text-3xl font-bold text-blue-400 text-center mt-6 capitalize'>
            we are pleased, you are initiating.
          </p>
          <button className='mt-3'>
            <a href="/create-pin"
              className='px-4 py-2 text-lg rounded-md bg-green-400 hover:bg-green-500 transition-all ease-out text-white capitalize'
            >
              create post
            </a>
          </button>
          </div>
        )}
    </div>
  )
}

export default Feed