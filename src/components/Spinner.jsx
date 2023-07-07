import React from 'react'
import {Circles} from 'react-loader-spinner'

const Spinner = ({message}) => {
  return (
    <div className='flex flex-col justify-center items-center bg-blue-100 p-3'>
      <Circles
        color='#00BFFF'
        height='50'
        width='200'
        wrapperClass='m-5 '
        visible={true}
      />

      <p className='text-lg text-center'>{message}</p>
    </div>
  )
}

export default Spinner