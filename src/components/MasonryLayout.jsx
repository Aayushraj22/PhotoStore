import React from 'react'
import Masonry from 'react-masonry-css'

import Pin from './Pin'


const MasonryLayout = ({pins}) => {
  
  const breakpointObj = {
    default: 5,   // default declare 4 columns
    2000: 4,     // on width=3000px declaring  6-columns
    1200: 3,
    1000: 2,
    500: 1
  }
  return (
    <Masonry
      className='flex animate-slide-fwd mt-2 sm:gap-3'
      breakpointCols={breakpointObj}
    >
      {pins?.map((pin) => (
        <Pin 
          key={pin._id}
          pin={pin}
         />
      ))}
    </Masonry>
  )
}

export default MasonryLayout