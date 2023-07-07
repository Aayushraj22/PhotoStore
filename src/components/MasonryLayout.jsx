import React from 'react'
import Masonry from 'react-masonry-css'

import Pin from './Pin'


const MasonryLayout = ({pins}) => {
  
  const breakpointObj = {
    default: 4,   // default declare 4 columns
    3000: 6,     // on width=3000px declaring  6-columns
    2000: 5,      // on width=2000px declaring  5-columns
    1200: 3,
    1000: 2,
    500: 1
  }
  return (
    <Masonry
      className='flex animate-slide-fwd'
      breakpointCols={breakpointObj}
    >
      {pins?.map((pin) => (
        <Pin 
          key={pin._id}
          pin={pin}
          className='w-max'
         />
      ))}
    </Masonry>
  )
}

export default MasonryLayout