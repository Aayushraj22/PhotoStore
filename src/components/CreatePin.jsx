import React,{useState} from 'react'
import {AiOutlineCloudUpload} from 'react-icons/ai'
import {MdDelete} from 'react-icons/md'
import { useNavigate } from 'react-router-dom'


import {client} from '../client'
import Spinner from './Spinner'
import {categories} from '../utils/data'

const CreatePin = ({user}) => {

  // console.log(user)
  const [title, setTitle] = useState('')
  const [about, setAbout] = useState('')
  const [destination, setDestination] = useState('')
  const [loading, setLoading] = useState(false)
  const [fields, setFields] = useState(false)
  const [category, setCategory] = useState(null)
  const [imageAsset, setImageAsset] = useState(null)
  const [wrongImageType, setWrongImageType] = useState(false)

  const navigate = useNavigate()
  const uploadImage = (e) => {
    const selectedFile = e.target.files[0]
    // console.log(e.target.files)
    const {type,name,size} = selectedFile  // done destructuring to get the type of image

    if((type==='image/jpg' || type==='image/gif' || type==='image/svg' || type==='image/png' || type==='image/jpeg') && size<=20971520){
      setWrongImageType(false)
      setLoading(true)
      
      //upload into Sanity(backend)
      client.assets
        .upload('image',selectedFile, {contentType: type, filename: name})
        .then((document) => {
          setImageAsset(document)
          setLoading(false)
        })
        .catch((error) => {
          console.log('Image upload error',error)
        })

    } else{
      setWrongImageType(true)
    }
  }

  const savePin = () => {
    if(title && about && destination && imageAsset._id && category) {  // all the fields provided is filled then only the post will be posted
      const doc = {   // create a document to store the new post in sanity
        _type:'pin',
        title,      // in js when key and value are same then only writting key is sufficient, i.e; title: title
        about,
        destination,
        image: {
          _type: 'image',
          asset: {
            _type: 'reference',     
            _ref: imageAsset?._id    //  because this image will be stored somewhere in sanity as assets
          }
        },
        userId: user._id,
        postedBy: {
          _type: 'postedBy',
          _ref: user._id,
        },
        category,
      }
      
      client.create(doc)
      .then(() => {
        navigate('/')
      })
    } else {
      setFields(true)

      setTimeout(()=> setFields(false), 2000)
    }
  }

  return (
    <div className='flex flex-col justify-center items-center mt-5 lg:h-4/5'>
      {fields && (
        <p className='text-red-500 mb-5 text-xl transition-all duration-150 ease-in'>Please fill in all the fields</p>
      )}
      <div className="flex lg:flex-row flex-col justify-center items-center lg:p-5 p-3 lg:w-4/5 w-full bg-white">
        <div className="bg-secondaryColor p-3 flex flex-0.7 w-full">
          <div className="flex justify-center items-center flex-col border-dotted border-2 border-gray-300 p-3 w-full h-420">
            {loading && <Spinner />}
            {wrongImageType && <p>Wrong Image type</p>}
            {!imageAsset ? (
              <label>
                <div className='flex flex-col justify-center items-center cursor-pointer hover:shadow-lg'>
                  <div className='flex justify-center items-center flex-col'>
                    <p className="font-bold text-2xl">
                      <AiOutlineCloudUpload />
                    </p>
                    <p className='text-lg'>Click to Upload</p>
                  </div>
                  <p className='mt-32 text-gray-400 p-2'>Use high-quality SVG,JPEG,JPG,GIF,PNG less than 20MB</p>
                </div>
                <input type="file"
                  name="upload-image"
                  onChange={uploadImage} 
                  className='w-0 h-0'
                />

              </label>
            ) : ( //below div aur img se h-full class hum hata diye hai
               <div className='relative '> 
                <img src={imageAsset.url} 
                  alt="uploadImage"
                  className='w-full '
                />
                <button
                 className='absolute bottom-3 right-3 p-3 rounded-full bg-white text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out'
                 onClick={() => setImageAsset(null)}
                 >
                  <MdDelete />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full">
          <input type="text" name="title" value={title} 
            placeholder='Add your title here'
            onChange={(e) => setTitle(e.target.value)}
            className='outline-none text-2xl sm:text-3xl font-bold border-b-2 border-gray-200 p-2 focus:border-gray-400 transition-all duration-500 ease-in-out focus:shadow-lg'
          />
          {user && (
            <div className="flex gap-2 items-center bg-white rounded-lg px-2 my-2">
              <img src={user.imageUrl} alt="user-profile" 
                className='h-10 w-10 rounded-full' 
              />
              <p className='font-bold'>{user.userName}</p>
            </div>
          )}
          <input type="text" name="about" value={about} 
            placeholder='what is your pin about'
            onChange={(e) => setAbout(e.target.value)}
            className='outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2 focus:border-gray-400 transition-all duration-500 ease-in-out focus:shadow-lg'
          />
          <input type="text" name="destination" value={destination} 
            placeholder='Add a destination link'
            onChange={(e) => setDestination(e.target.value)}
            className='outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2 focus:border-gray-400 transition-all duration-500 ease-in-out focus:shadow-lg'
          />
          {/* <div className="flex flex-wrap border-2 sm:p-0 p-2 justify-center gap-2">
            {categories.map((category) => (
              <div key={category.name} 
                className='flex items-center max-sm:w-full max-sm:gap-6 gap-4 w-40 border-2 border-white hover:border-gray-200 hover:rounded-lg transition-all duration-250 ease-in cursor-pointer px-2 hover:shadow-lg'
               >
                <div className='w-12 h-12 flex justify-center items-center '>
                  <img 
                    src={category.image} 
                    alt={`${category.name}-image`} 
                    className='w-full h-full rounded-full max-sm:rounded-lg '
                  />
                </div>
                <p>{category.name}</p>
              </div>
            ))}
          </div> */}

          <div className="flex flex-col">
            <div>
              <p className='mb-2 font-semibold text-lg sm:text-xl'>Choose Pin Category</p>
              <select 
                onChange={(e) => setCategory(e.target.value)}
                className='outline-none w-4/5 text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer hover:shadow-md'
               >
                <option value="other" className='bg-white'>Select Catergory </option>
                {categories.map((category) => (
                  <option key={category.name} value={category.name} className='bg-white text-base border-0 outline-none capitalize text-black'>{category.name} </option>
                ))}
               </select>
            </div>
            <div className="flex justify-end items end mt-5">
              <button type='button' onClick={savePin} className='bg-red-500 text-white font-bold p-2 rounded-full outline-none w-28 capitalize'>
                save pin
              </button>
            </div>
          </div>
        </div>  
      </div>
    </div>
  )
}

export default CreatePin