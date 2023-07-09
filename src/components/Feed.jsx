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
          <div className='text-3xl font-bold text-red-600 text-center mt-5'>
            No post to show!
          </div>
        )}
    </div>
  )
}

export default Feed