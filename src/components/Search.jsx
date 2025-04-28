import React,{useState,useEffect, useRef} from 'react'

import MasonryLayout from './MasonryLayout'
import {client} from '../client'
import {searchQuery} from '../utils/data'
import Spinner from './Spinner'

const Search = ({searchTerm}) => {

  const [loading, setLoading] = useState(false)
  const [pins, setPins] = useState(null)
  const timerRef = useRef(null)


  useEffect(() => {

    async function fetchPins(searchTerm){
      const query = searchQuery(searchTerm.toLowerCase())

      try {
        const data = await client.fetch(query)
        setPins(data)
      } catch (error) {
        console.log('error when searching for pins: ', error.message)
      } finally { 
        setLoading(false)
      }
    }

    let timerId = timerRef?.current;

    // debounce the network call for each key-press by 500ms
    // debounce means delay the execution of function by some time(in ms)   
    if(timerId){
      clearTimeout(timerId)
    }

    if( searchTerm !== '') {
      timerRef.current = setTimeout(() => {
        setPins(null)
        setLoading(true)
        fetchPins(searchTerm)
      }, 500);
    }
  }, [searchTerm])
  
  if( loading ) {
    return (
      <Spinner message='Searching for posts ..' />
    )
  }

  return (
    <>
      {pins ? <>{pins?.length ? <MasonryLayout pins={pins} /> : (
        <>
          <p className="mt-10 text-center md:text-xl text-red-400 p-2">
            No post available. Please upload one by clicking the plus button above.
          </p>
          <p className="mt-2 text-center md:text-xl text-red-400 p-2">
            Thank you!
          </p>
        </>
        )}</> : (
        <p className="mt-10 text-center md:text-xl text-blue-400 p-2">
          Type in the search box to get the desired posts.
        </p>
        )
      }
    </>
  )
}

export default Search