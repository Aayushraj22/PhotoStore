import React,{useState,useEffect,useMemo} from 'react'

import MasonryLayout from './MasonryLayout'
import {client} from '../client'
import {feedQuery,searchQuery} from '../utils/data'
import Spinner from './Spinner'

const Search = ({searchTerm}) => {

  const [loading, setLoading] = useState(true)
  const [pins, setPins] = useState(null)

  let {getPins, getTimerId, setTimerId} = useMemo(() => {
    let timerId = null;

    function setTimerId(timer){
      timerId = timer;
    }

    function getTimerId(){
      return timerId;
    }

    function getPins(searchTerm){
      if(searchTerm === '') {
        client.fetch(feedQuery)
          .then((data) => {
            setPins(data)
            if(loading)
              setLoading(false)
          })
      } else {
        const query = searchQuery(searchTerm.toLowerCase())
  
        client.fetch(query)
          .then((data) => {
            setPins(data)
            if(loading)
              setLoading(false)
          })
      }
    }

    return {getPins, getTimerId, setTimerId}
  }, [])

  useEffect(() => {
    let timerId = getTimerId();

    if(searchTerm === '' && !timerId){
      getPins(searchTerm)
      return
    }

    // debounce the network call for each key-press by 500ms
    // debounce means delay the execution of function by some time(in ms)   
    if(timerId){
      clearTimeout(timerId)
    }

    timerId = setTimeout(() => {
      getPins(searchTerm)
    }, 500);
    setTimerId(timerId)
    
  }, [searchTerm])
  

  return (
    <div>
      {loading && <Spinner message='Searching for posts ..' /> } 
      {pins?.length > 0 && <MasonryLayout pins={pins} /> }
      {pins?.length === 0 && searchTerm !== '' && loading===false && (
        <div className="mt-10 text-center text-xl text-red-400">
          No searched Post, appreciatable if you Upload some.
        </div>
      )}
    </div>
  )
}

export default Search