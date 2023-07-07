import React from 'react'
import {FcGoogle} from 'react-icons/fc'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'
import { useNavigate } from 'react-router-dom'
import jwt_decode from "jwt-decode";

import videoshare from '../assets/share.mp4'
import logo from '../assets/logowhite.png'
import { client } from '../client';

const Login = () => {
  const navigate = useNavigate()

  function responseGoogle(response) {
    // console.log(response)
    const userObject = jwt_decode(response.credential)
    // console.log(userObject)

    // store info of new user in localstorage
    localStorage.setItem('user',JSON.stringify(userObject))

    const {name, sub, picture} = userObject
  // create a new sanity document for this user and that user save in the sanity database
    const doc = {
      _id: sub,
      _type: 'user',
      userName: name,
      imageUrl: picture
    }

    client.createIfNotExists(doc).then(()=> {
      navigate('/', {replace: true})  // redirect the user from login page to home page and create user account on sanity if it is new user 
    })
    
  }
  return (
<>
  <div className='flex flex-start item-center flex-col h-screen border-0'>
    <div className='relative h-full w-full'>
        <video 
          src={videoshare} 
          typeof='video/mp4'
          autoPlay
          controls={false}
          muted
          loop
          className='w-full h-full object-cover'
        />

        <div className="absolute flex flex-col justify-center items-center bg-blackOverlay top-0 left-0 right-0 bottom-0">
          <div className="p-5">
            <img src={logo} alt="logo" width="130px"/>
          </div>
          <div className="shadow-2xl">
            <GoogleOAuthProvider
              // clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}
              clientId= {process.env.REACT_APP_GOOGLE_API_TOKEN}
            >
              <GoogleLogin
                render={(renderProps) => (
                  <button
                    type='button'
                    className='bg-white rounded-10 flex justify-start items-center p-4'
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}
                  >
                    <FcGoogle /> signIn with google
                  </button>
                )}
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                cookiePolicy="single_host_origin"
              />
            </GoogleOAuthProvider>
          </div>
        </div>
    </div>
  </div>
</>
  )
}

export default Login
