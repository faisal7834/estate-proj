import { useEffect, useState } from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const CreateListing = () => {
  const {currentUser} = useSelector(state => state.user)
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: "",
    type: "rent",
    furnished: false,
    parking: false,
    offer: false,
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0
  })
  const [imageUploadError, setImageUploadError] = useState(false)
  const [uploading, setUpLoading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
        const fetchListing = async() => {
            const listingId = params.listingId;
            const response = await fetch(`/api/listing/get/${listingId}`)
            const data = await response.json();
            if (data.success === false) {
                console.log(data.message)
                return
            }
            
            setFormData(data)
        };
        fetchListing()
  }, [])
 
  const handleSubmitImage = (e) => {
    if(files.length > 0 && files.length < 7) {
      setUpLoading(true)
      setImageUploadError(false)
      const promises = []
      for(let i=0; i < files.length; i++){
        promises.push(storeImages(files[i]))
      }
      Promise.all(promises)
      .then((urls) => {
        setFormData({
          ...formData,
          imageUrls: formData.imageUrls.concat(urls)
        })
        setImageUploadError(false)
        setUpLoading(false)
      })
      .catch((err) => {
        setImageUploadError('Image upload error (less than 2mb)')
        setUpLoading(false)
      })
    } else {
      setImageUploadError('You can upload only 6 images as per listing')
      setUpLoading(false)
    }
  }

  const storeImages = async(file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app)
      const fileName = new Date().getTime() + file.name
      const storageRef = ref(storage, fileName)
      const uploadTask = uploadBytesResumable(storageRef, file)
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`upload is ${progress}% done`)
        },
        (error)=>{
          reject(error)
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then
          ((downloadURL) => {
            resolve(downloadURL)
          })
        }
      )
    })
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    })
  }

  const handleChange = (e) => {
    if(e.target.id === 'sale' || e.target.id === 'rent'){
      setFormData({
        ...formData,
        type: e.target.id
      })
    };
    if(e.target.id === 'furnished' || e.target.id === 'parking' || e.target.id === 'offer'){
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked
      })
    };
    if(e.target.type === 'number' || e.target.type === 'text' || e.target.type ==='textarea'){
      setFormData({
        ...formData,
        [e.target.id] : e.target.value
      })
    }
  }

  const handleSubmitForm = async(e) => {
    e.preventDefault();
    try {
      if(+formData.regularPrice < +formData.discountPrice) return setError("Discount price must be lower than regular price")
      if(formData.imageUrls.length < 1) return setError("You must upload at least one image");
      setLoading(true)
      setError(false)
      const response = await fetch(`/api/listing/update/${params.listingId}`, {
        method: 'POST',
        headers: {
          'Content-type'  : 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id
        })
      })
      const data = await response.json();
      if(data.success === false){
        setError(data.message)
      }
      setLoading(false)
      navigate(`/listing/${data._id}`)
    } catch (error) {
      setError(error.message)
      setLoading(false)
    }
  }
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Update a Listing
      </h1>
      <form onSubmit={handleSubmitForm} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col flex-1 gap-4">
          <input
            type="text"
            id="name"
            placeholder="Name"
            className="border p-3 rounded-lg"
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            type="text"
            id="description"
            placeholder="Description"
            className="border p-3 rounded-lg"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type="text"
            id="address"
            placeholder="address"
            className="border p-3 rounded-lg"
            required
            onChange={handleChange}
            value={formData.address}
          />

          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input type="checkbox" id="sale" className="w-5" onChange={handleChange} checked={formData.type === 'sale'} />
              <span>Sale</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="rent" className="w-5" onChange={handleChange} checked={formData.type === 'rent'}/>
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="furnished" className="w-5" onChange={handleChange} checked={formData.furnished} />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="parking" className="w-5" onChange={handleChange} checked={formData.parking} />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="offer" className="w-5" onChange={handleChange} checked={formData.offer} />
              <span>Offer</span>
            </div>
          </div>

          <div className="flex gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <input
                type="number"
                className="border rounded-lg p-3 border-gray-300"
                id="bedrooms"
                min='1'
                max='10'
                required
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                className="border rounded-lg p-3 border-gray-300"
                id="bathrooms"
                min='1'
                max='10'
                required
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                className="border rounded-lg p-3 border-gray-300"
                id="regularPrice"
                min='1'
                max='1000000'
                required
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <div className="flex flex-col items-center">
                <p>Regular price</p>
                <span className="text-xs">($ / month)</span>
              </div>
            </div>
            { formData.offer && (
              <div className="flex items-center gap-2">
              <input
                type="number"
                className="border rounded-lg p-3 border-gray-300"
                id="discountPrice"
                min='0'
                max='10000'
                required
                onChange={handleChange}
                value={formData.discountPrice}
              />
              <div className="flex flex-col items-center">
                <p>Discounted price</p>
                <span className="text-xs">($ / month)</span>
              </div>
            </div>
            )}

          </div>
        </div>

        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="text-gray-600 font-normal ml-2">
              The first images will be cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              onChange={(e) => setFiles(e.target.files)}
              className="p-3 rounded border border-gray-300 w-full"
              type="file"
              id="images"
              multiple
              accept="image/*"
            />
            <button 
                className="text-green-700 border border-green-700 p-3 rounded hover:shadow-lg disabled:opacity-80 uppercase"
                onClick={handleSubmitImage} disabled={uploading}
            >
              {uploading ? 'uploading...' : 'upload'}
            </button>
          </div>
          <p className="text-red-700 text-sm">{imageUploadError && imageUploadError}</p>
          {formData.imageUrls.length > 0 && 
            formData.imageUrls.map((url, index) => (
              <div key={url} className="flex border justify-between p-3 items-center rounded-lg">
                <img src={url} className="object-contain w-20 h-20" />
                <button 
                  className="text-red-700 uppercase hover:opacity-70"
                  type='button'
                  onClick={() => handleRemoveImage(index)}
                >delete</button>
              </div>
            ))
          }
          <button disabled={loading | uploading} className="bg-slate-700 uppercase p-3 rounded-lg hover:opacity-95 disabled:opacity-80 text-white">
            {loading? 'upating...' : 'update listing'}
          </button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
};

export default CreateListing;
