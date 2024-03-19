import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {Swiper, SwiperSlide} from 'swiper/react';
import SwiperCore from 'swiper'
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import {FaBath, FaBed, FaChair, FaMapMarkerAlt, FaParking, FaShare} from 'react-icons/fa';
import { useSelector } from 'react-redux';
import Contact from '../components/Contact';

const Listing = () => {
    SwiperCore.use([Navigation]);
    const params = useParams();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [copied, setCopied] = useState(false);
    const [contact, setContact] = useState(false)
    const {currentUser} = useSelector((state) => state.user)

    useEffect(()=> {
        const fetchListing = async() => {
            try {
                setLoading(true)
                const response = await fetch(`/api/listing/get/${params.listingId}`)
                const data = await response.json();
                if(data.success === false){
                    setError(true)
                    setLoading(false)
                    return
                }
                setListing(data)
                setLoading(false)
                setError(false)
            } catch (error) {
                setError(true)
                setLoading(false)
            }
        }
        fetchListing()
    }, [params.listingId])
  return (
    <main>
      {loading && <p className='text-2xl text-center my-7'>Loading...</p>}
      {error && (<p className='text-2xl text-center my-7'>Something went wrong!</p>)}
      {listing && !loading && !error && (
        <div>
            <Swiper navigation>
                {listing.imageUrls.map((url) => (
                    <SwiperSlide key={url}>
                        <div className='h-[550px]'
                         style={{background: `url(${url}) center no-repeat`,  backgroundSize:'cover'}}></div>
                    </SwiperSlide>
                ))}
            </Swiper>

            <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
                <FaShare
                    className='text-slate-500'
                    onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        setCopied(true)
                        setTimeout(()=> {
                            setCopied(false)
                        }, 3000)
                    }}
                />
            </div>
            {copied && ( <p className='fixed bg-slate-200 p-2
                     rounded-mg top-[23%] right-[5%] rounded z-10'>Link Copied Successfully!
                         </p>)
            }

            <div className='flex flex-col p-3 max-w-4xl mx-auto my-7 gap-4'>
                <p className='text-2xl font-semibold'>
                    {listing.name} - ${''}
                    {listing.offer ?  listing.discountPrice.toLocaleString('en-US') :listing.regularPrice.toLocaleString('en-US')}
                    {listing.type === 'rent' && '/month'}
                </p>
                <p className='text-slate-600 items-center flex mt-6 gap-2 text-sm'>
                    <FaMapMarkerAlt className='text-green-700'/>
                    {listing.address}
                </p>
                <div className='flex gap-4'>
                    <p className='bg-red-900 w-full text-white rounded-md max-w-[200px] p-1 text-center'>
                        {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
                    </p>
                    {listing.offer && (
                        <p className='bg-green-900 w-full text-white rounded-md max-w-[200px] p-1 text-center'>
                        ${+listing.regularPrice - +listing.discountPrice} OFF
                    </p>
                    )}
                </div>
                <p className='text-slate-800'>
                    <span className='font-semibold text-black'>Description - </span>
                    {listing.description}
                </p>
                <ul className='text-green-900 font-semibold text-sm flex items-center flex-wrap gap-4 sm:gap-6'>
                    <li className='flex items-center gap-1 whitespace-nowrap'>
                        <FaBed className='text-lg'/>
                        {listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : `${listing.bedrooms} Bed`}
                    </li>
                    <li className='flex items-center gap-1 whitespace-nowrap'>
                        <FaBath className='text-lg'/>
                        {listing.bathrooms > 1 ? `${listing.bathrooms} Baths` : `${listing.bathrooms} Bath`}
                    </li>
                    <li className='flex items-center gap-1 whitespace-nowrap'>
                        <FaChair className='text-lg'/>
                        {listing.furnished ? 'Furnished' : 'Unfurnished'}
                    </li>
                    <li className='flex items-center gap-1 whitespace-nowrap'>
                        <FaParking className='text-lg'/>
                        {listing.parking ? 'Parking' : 'No Parking'}
                    </li>
                </ul>
                { currentUser && listing.userRef !== currentUser._id && !contact && (
                <button onClick={() => setContact(true)} className='bg-slate-700 p-3 rounded-lg text-white uppercase hover:opacity-95'>
                    contact landlord
                </button>)}
                {contact && <Contact listing={listing}/>}
            </div>
        </div>
      )}
    </main>
  )
}

export default Listing
