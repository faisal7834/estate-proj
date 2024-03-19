import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import { app } from "../firebase";
import { deleteUserStart, deleteUserSuccess, deleteUserFailure, updateFailure, updateStart, updateSuccess, signOutFailure, signOutStart, signOutSuccess } from "../redux/user/userSlice";
import { Link } from "react-router-dom";

const Profile = () => {
  const fileRef = useRef(null);
  const { currentUser, error, loading } = useSelector((state) => state.user);
  //using picture uploading
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const [successUpdating, setSuccessUpdting] = useState(false);
  const [showListingError, setShowListingError] = useState(false);
  const [userListing, setUserListing] = useState([ ]);

  useEffect(()=> {
    if(file){
      handleFileUpload(file)
    }
  },[file])
  const handleFileUpload = (file) => {
    const storage = getStorage(app)
    const fileName = new Date().getTime() + file.name
    const storageRef = ref(storage, fileName)
    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on('state_changed',
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setFilePerc(Math.round(progress))
    },
    (error) => {
      setFileUploadError(true)
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then
      ((downloadURL) => {
        setFormData({...formData, avatar:downloadURL})
      })
    })
  }
  const handleChangeValue = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value})
  }
  const handleUpdateSubmit = async(e) => {
    e.preventDefault();
    try {
      dispatch(updateStart);
      const response = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
          },
          body: JSON.stringify(formData)
      })
      const data = await response.json();
      if(data.success === false){
        dispatch(updateFailure(data.message));
        return;
      }
      dispatch(updateSuccess(data))
      setSuccessUpdting(true)
    } catch (error) {
      dispatch(updateFailure(error.message))
    }
  }

  const deleteHandle = async() => {
    try {
      dispatch(deleteUserStart())
      const response = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE'
      })
      const data = await response.json()
      if(data.success === false){
        dispatch(deleteUserFailure(data.message))
        return
      }
      dispatch(deleteUserSuccess(data))
    } catch (error) {
      dispatch(deleteUserFailure(error.message))
    }
  }

  const signOutHandle = async() => {
    try {
      dispatch(signOutStart())
      const response = await fetch('/api/auth/signout')
      const data = await response.json()
      if(data.success === false){
        dispatch(signOutFailure(data.message))
        return
      }
      dispatch(signOutSuccess(data))
    } catch (error) {
      dispatch(signOutFailure(error.message))
    }
  }

  const handleShowListing = async() => {
    try {
      setShowListingError(false)
      const response = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await response.json();
      if(data.success === data){
        setShowListingError(true);
        return
      }
      setUserListing(data)
    } catch (error) {
      setShowListingError(true)
    }
  }

  const handleListingDelete = async(listingID) => {
    try {
      const response = await fetch(`/api/listing/delete/${listingID}`, {
        method: 'DELETE'
      })
      const data = response.json()
      if(data.success === false){
        console.log(data.message)
        return
      }
      setUserListing((prev) => prev.filter((listing) => listing._id !==listingID))
    } catch (error) {
      console.log(error.message)
    }
  }
  // THIS RULES ADDING THE FIREBASE
  //allow write: if
  //request.resource.size < 2 * 1024 * 1024 &&
  //request.resource.contentType.matches('image/.*')
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center mt-7">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleUpdateSubmit}>
        {/*using the picture uploadind */}
        <input 
          type="file" ref={fileRef} hidden accept="image/*"
          onChange={(e)=>setFile(e.target.files[0])}
          />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          className="rounded-full w-24 h-24 object-cover cursor-pointer self-center mt-4"
          alt="profile"
        />
        <p className="text-sm self-center">
          {fileUploadError?
            (<span className="text-slate-700">Error Image Uplaod (image must be less than 2mb)</span>)
             : filePerc > 0 && filePerc < 100 ? (<span className="text-slate-700">{`uploading ${filePerc} %`}</span>) : filePerc === 100 ? (<span className="text-green-700">Image Upload Successfully</span>)
            : ' '
          }
        </p>
        <input
          className="border rounded-lg p-3"
          placeholder="username"
          type="text"
          id="username"
          defaultValue={currentUser.username}
          onChange={handleChangeValue}
        />
        <input
          className="border rounded-lg p-3"
          placeholder="email"
          type="text"
          id="email"
          defaultValue={currentUser.email}
          onChange={handleChangeValue}
        />
        <input
          className="border rounded-lg p-3"
          placeholder="password"
          type="password"
          id="password"
          onChange={handleChangeValue}
        />
        <button disabled={loading} className="rounded-lg p-3 text-white bg-slate-700 uppercase hover:opacity-95 disabled:opacity-80">
            {loading ? 'loading...' :'update'}
        </button>
        <Link to={'/create-listing'} className="bg-green-700 text-white rounded-lg p-3 text-center hover:opacity-95 uppercase" >create listing</Link>
      </form>
      <div className="flex justify-between mt-5">
        <span onClick={deleteHandle} className="text-red-700 cursor-pointer">Delete account</span>
        <span onClick={signOutHandle} className="text-red-700 cursor-pointer">Sign out</span>
      </div>
      <p className="text-red-700 mt-5">{error? error: ''}</p>
      <p className="text-green-700 mt-5">{successUpdating ? "user is upadate successfully" : ''}</p>

      <button onClick={handleShowListing} className="text-green-700 w-full">Show Listings</button>

      <p className="text-red-700 mt-5">{showListingError ? 'Error showing in list' : '' }</p>

      {userListing && userListing.length > 0 && 
        <div className="flex flex-col gap-4">
          <h1 className="text-center text-2xl font-semibold mt-7">Your Listings</h1>
          {userListing.map((listing) => (
          <div className="flex justify-between items-center rounded-lg p-3 border gap-4" key={listing._id}>
            <Link to={`/listing/${listing._id}`}>
              <img src={listing.imageUrls[0]} alt="listing cover" className="w-16 h-16 object-contain"/>
            </Link>
            <Link to={`/listing/${listing._id}`} className="text-slate-700 hover:underline truncate flex-1 font-semibold">
              <p >{listing.name}</p>
            </Link>
            <div className="flex flex-col items-center">
              <button onClick={() => handleListingDelete(listing._id)} className="text-red-700 uppercase">delete</button>
              <Link to={`/update-listing/${listing._id}`}>
                <button className="text-green-700 uppercase">edit</button>
              </Link>
            </div>
          </div>
          ))}
        </div>}
    </div>
  );
};

export default Profile;
