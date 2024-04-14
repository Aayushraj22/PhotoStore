import React,{useState,useEffect} from 'react'

import MasonryLayout from './MasonryLayout'
import {client} from '../client'
import {feedQuery,searchQuery} from '../utils/data'
import Spinner from './Spinner'

const Search = ({searchTerm}) => {

  const [loading, setLoading] = useState(true)
  const [pins, setPins] = useState(null)

  useEffect(() => {

    if(searchTerm === '') {
      client.fetch(feedQuery)
        .then((data) => {
          setPins(data)
          setLoading(false)
        })
    } else {
      const query = searchQuery(searchTerm.toLowerCase())

      client.fetch(query)
        .then((data) => {
          setPins(data)
          setLoading(false)
        })
    }
  }, [searchTerm])
  

  return (
    <div>
      {loading && <Spinner message='Searching for posts ..' /> } 
      {pins?.length > 0 && <MasonryLayout pins={pins} /> }
      {pins?.length === 0 && searchTerm !== '' && loading===false && (
        <div className="mt-10 text-center text-xl text-red-400">
          It seems we do not have searched Item, appreciatable if you upload some.
        </div>
      )}
    </div>
  )
}

export default Search