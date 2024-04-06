import React, { useState } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import {toast} from 'react-toastify'

import { client } from "../client";
import Spinner from "./Spinner";
import { categories } from "../utils/data";

const CreatePin = ({ user }) => {
  const [title, setTitle] = useState("");
  const [about, setAbout] = useState("");
  const [destination, setDestination] = useState("");
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState(null);
  const [imageAsset, setImageAsset] = useState(null);
  const [acknowledge, setAcknowledge] = useState("Save");

  const navigate = useNavigate();

  // display the selected image to user, if image is valid and using imgUrl which got by using Sanity features to convert image into url
  function displayImage(selectedImageFile){
    const { type, name, size } = selectedImageFile; // done destructuring to get the type of image

    if (
      (type === "image/jpg" ||
        type === "image/gif" ||
        type === "image/svg" ||
        type === "image/png" ||
        type === "image/jpeg") &&
      size <= 20971520
    ) {
      setLoading(true);

      //using a features provided by Sanity to convert image into url
      client.assets
        .upload("image", selectedImageFile, { contentType: type, filename: name })
        .then((document) => {
          setImageAsset(document);
          setDestination(document.url);
          setLoading(false);
        })
        .catch((error) => {
          toast.error('Upload Again');
          setLoading(false);
        });

    } else {
      toast.error('Invalid File');
    }
  }

  const dropFile = (e) => {
    e.preventDefault();   // prevent browser from opening the file

    const selectedImageFile = e.dataTransfer.files[0];
    selectedImageFile !== undefined ? displayImage(selectedImageFile) : toast('Drop Image Properly')
  }

  const uploadImage = (e) => {
    const selectedFile = e.target?.files[0];
    if (selectedFile === undefined) 
      return;

    
    displayImage(selectedFile);
  };

  const savePin = () => {
    if (title && about && destination && imageAsset?._id && category) {
      // all the fields provided is filled then only the post will be posted
      setAcknowledge("Saving");

      const doc = {
        // create a document to store the new post in sanity
        _type: "pin",
        title, // in js when key and value are same then only writting key is sufficient, i.e; title: title
        about,
        destination,
        image: {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: imageAsset?._id, //  because this image will be stored somewhere in sanity as assets
          },
        },
        userId: user._id,
        postedBy: {
          _type: "postedBy",
          _ref: user._id,
        },
        category,
      };

      client.create(doc).then(() => {
        navigate("/");
      });
    } else {
      toast.error('All fields are required');
    }
  };

  return (
    <div className="flex flex-col justify-center items-center mt-5 lg:h-4/5">
      <div className="flex lg:flex-row flex-col justify-center items-center lg:p-5 p-3 lg:w-4/5 w-full bg-white ">
        <div className="bg-gray-100 p-3 flex flex-0.7 w-full">
          <div className="flex justify-start items-center flex-col border-dotted border-2 border-gray-400 p-2 w-full h-auto rounded-md"
            onDragOver={(e) => {
              e.preventDefault(); // prevent browser default behaviour {not to open file}
            }}
            onDrop={dropFile}
          >
            <div className="w-full h-auto">
              {loading && <Spinner message="uploading image" />}
            </div>
            <label className="w-full min-h-[350px] max-h-[400px] relative hover:shadow-lg">
              {!loading && (
                <>
                  {imageAsset ? (
                    <img
                    src={imageAsset.url}
                    alt="uploadImage"
                    className="w-full h-full object-contain"
                  />
                  ) : (
                    <div className="flex flex-col justify-between items-center gap-10 cursor-pointer h-full">
                      <div className="flex justify-center items-center flex-col gap-1 ">
                        <p className="font-bold text-3xl">
                          <AiOutlineCloudUpload />
                        </p>
                        <p className="text-xl">Click to Upload</p>
                        <p className="text-sm">
                          <span className="text-violet-800">Drag</span> &{" "}
                          <span className="text-violet-800">Drop</span> image
                          over here.
                        </p>
                      </div>
                      <div className=" p-2 text-gray-500 ">
                        <p>
                          recommended image-type:
                          <span className="text-gray-700">svg</span>,&ensp;
                          <span className="text-gray-700">jpeg</span>,&ensp;
                          <span className="text-gray-700">jpg</span>,&ensp;
                          <span className="text-gray-700">gif</span>,&ensp;
                          <span className="text-gray-700">png</span>
                        </p>
                        <p>
                          image size less than{" "}
                          <span className="text-gray-700">20MB</span>
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}

              <input
                type="file"
                name="upload-image"
                className="w-full h-full top-0 left-0 absolute -z-10"
                onChange={uploadImage}
              />
            </label>
            {imageAsset && (
              <button
                className="flex items-center gap-2 p-2 rounded-sm text-sm cursor-pointer outline-none opacity-70 hover:opacity-100 hover:text-white hover:bg-black transition-all duration-500 ease-in-out mt-2 "
                onClick={(e) => {
                  setImageAsset(null);
                  setDestination("")
                }}
              >
                do not like ?<span className="text-lg"><MdDelete /></span> 
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full">
          <input
            type="text"
            name="title"
            value={title}
            placeholder="Add your title here"
            onChange={(e) => setTitle(e.target.value)}
            className="outline-none text-2xl sm:text-3xl font-semibold border-b-2 border-gray-200 p-2 focus:border-gray-400 transition-all duration-500 ease-in-out focus:shadow-md"
          />
          {user && (
            <div className="flex gap-2 items-center bg-white rounded-lg px-2 my-2">
              <img
                src={user.imageUrl}
                alt="user-profile"
                className="h-10 w-10 rounded-full"
              />
              <p className="font-semibold text-stone-500">{user.userName}</p>
            </div>
          )}
          <input
            type="text"
            name="about"
            value={about}
            placeholder="what is your pin about"
            onChange={(e) => setAbout(e.target.value)}
            className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2 focus:border-gray-400 transition-all duration-500 ease-in-out focus:shadow-lg"
          />
          <input
            type="text"
            name="destination"
            value={destination}
            placeholder="Add a destination link"
            disabled
            onChange={(e) => setDestination(e.target.value)}
            className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2 focus:border-gray-400 transition-all duration-500 ease-in-out focus:shadow-lg"
          />

          <div className="flex flex-col">
            <div>
              <p className="mb-2 font-semibold text-lg sm:text-xl">
                Choose Pin Category
              </p>
              <select
                onChange={(e) => setCategory(e.target.value)}
                className="outline-none w-4/5 text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer hover:shadow-md"
              >
                <option value="other" className="bg-white">
                  Select Catergory{" "}
                </option>
                {categories.map((category) => (
                  <option
                    key={category.name}
                    value={category.name}
                    className="bg-white text-base border-0 outline-none capitalize text-black"
                  >
                    {category.name}{" "}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex justify-end mt-5 gap-3">
              <button
                className="font-semibold w-24 hover:bg-red-500 hover:text-white rounded-md"
                onClick={() => {
                  navigate("/");
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={savePin}
                className="bg-stone-600 text-white font-bold p-2 rounded-md outline-none w-24 capitalize"
              >
                {acknowledge}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePin;
