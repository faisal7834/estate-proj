import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ListingItem from '../components/ListingItem';

const Search = () => {
    const navigate = useNavigate();
    const[sideBarData, setSideBarData] = useState({
        searchTerm:'',
        type:"all",
        furnished:false,
        parking:false,
        offer:false,
        sort:'created_at',
        order:'desc'
    })
    const [loading, setLoading] = useState(false)
    const [listing, setListing] = useState([]);
    const [showMore, setShowMore] = useState(false)

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search)
        const searchTermFromUrl = urlParams.get('searchTerm')
        const typeFromUrl = urlParams.get('type')
        const furnishedFromUrl = urlParams.get('furnished')
        const parkingFromUrl = urlParams.get('parking')
        const offerFromUrl = urlParams.get('offer')
        const sortFromUrl = urlParams.get('sort')
        const orderFromUrl = urlParams.get('order')
        if(searchTermFromUrl || typeFromUrl|| furnishedFromUrl || parkingFromUrl || offerFromUrl || 
            sortFromUrl || orderFromUrl ){
                setSideBarData({
                    searchTerm: searchTermFromUrl || '',
                    type: typeFromUrl || 'all',
                    furnished: furnishedFromUrl === 'true' ? true : false,
                    parking: parkingFromUrl === 'true' ? true : false,
                    offer: offerFromUrl === 'true' ? true : false,
                    sort: sortFromUrl || 'created_at',
                    order: orderFromUrl || 'desc'
                })
            }
        
            const fetchListing = async() => {
                setLoading(true)
                setShowMore(false)
                const searchQuery = urlParams.toString()
                const response = await fetch(`/api/listing/get?${searchQuery}`)
                const data = await response.json();
                if(data.length > 8){
                    setShowMore(true)
                }else{
                    setShowMore(false)
                }
                setListing(data)
                setLoading(false)
            }
            fetchListing()
    }, [location.search])

    const handleChange = (e) => {
        if(e.target.id === 'all' || e.target.id === 'sale' || e.target.id ==='rent'){
            setSideBarData({...sideBarData, searchTerm: e.target.id})
        }
        if(e.target.id === 'searchTerm'){
            setSideBarData({...sideBarData, searchTerm: e.target.value})
        }
        if(e.target.id === 'furnished' || e.target.id === 'parking' || e.target.id === 'offer'){
            setSideBarData({...sideBarData, [e.target.id]: 
            e.target.checked || e.target.checked === 'true' ? true : false})
        }
        if(e.target.id === 'sort_order'){
            const sort = e.target.value.split('_')[0] || 'created_at';
            const order = e.target.value.split('_')[1] || 'desc'
            setSideBarData({...sideBarData, sort, order})
        }
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        const urlParams = new URLSearchParams();
        urlParams.set('searchTerm', sideBarData.searchTerm)
        urlParams.set('type', sideBarData.type)
        urlParams.set('offer', sideBarData.offer)
        urlParams.set('furnished', sideBarData.furnished)
        urlParams.set('parking', sideBarData.parking)
        urlParams.set('sort', sideBarData.sort)
        urlParams.set('order', sideBarData.order)
        const searchQuery = urlParams.toString()
        navigate(`/search?${searchQuery}`)
    }

    const onClickShowMore = async() => {
        const numberOfListing = listing.length
        const startIndex = numberOfListing
        const urlParams = new URLSearchParams(location.search)
        urlParams.set('startIndex', startIndex)
        const searchQuery = urlParams.toString()
        const response = await fetch(`/api/listing/get?${searchQuery}`)
        const data = await response.json();
        if(data.length < 9){
            setShowMore(false) }
        setListing([...listing, ...data])
    }
  return (
    <div className='flex flex-col md:flex-row'>

      <div className='p-7 border-b-2 md:border-r-2 md:min-h-screen' >
        <form onSubmit={handleSubmit}  className='flex flex-col gap-8'>
            <div className='flex items-center gap-2'>
                <label className='whitespace-nowrap font-semibold'>Search Term:</label>
                <input type='text' 
                       id='searchTerm' 
                       placeholder='Search...' 
                       className='w-full border p-3 rounded-lg'
                       value={sideBarData.searchTerm}
                       onChange={handleChange} />
            </div>
            <div className='flex gap-2 flex-wrap items-center'>
                <label className='font-semibold'>Type:</label>
                <div className='flex gap-2'>
                    <input type='checkbox' id='all' className='w-5'
                     checked={sideBarData.type === 'all'} onChange={handleChange} />
                    <span>Sale & Rent</span>
                </div>
                <div className='flex gap-2'>
                    <input type='checkbox' id='sale' className='w-5'
                     checked={sideBarData.type === 'sale'} onChange={handleChange} />
                    <span>Sale</span>
                </div>
                <div className='flex gap-2'>
                    <input type='checkbox' id='rent' className='w-5'
                     checked={sideBarData.type === 'rent'} onChange={handleChange} />
                    <span>Rent</span>
                </div>
                <div className='flex gap-2'>
                    <input type='checkbox' id='offer' className='w-5'
                     checked={sideBarData.offer} onChange={handleChange} />
                    <span>Offer</span>
                </div>
            </div>
            <div className='flex gap-2 flex-wrap items-center'>
                <label className='font-semibold'>Amenities:</label>
                <div className='flex gap-2'>
                    <input type='checkbox' id='furnished' className='w-5'
                     checked={sideBarData.furnished} onChange={handleChange} />
                    <span>Furnished</span>
                </div>
                <div className='flex gap-2'>
                    <input type='checkbox' id='parking' className='w-5'
                     checked={sideBarData.parking} onChange={handleChange} />
                    <span>Parking</span>
                </div>
            </div>
            <div  className='flex items-center gap-2'>
                <label className='font-semibold'>Sort:</label>
                <select id='sort_order' className='border rounded-lg p-3'
                    onChange={handleChange} defaultValue={'created_at_desc'}>
                    <option>Price high to low</option>
                    <option>Price low to high</option>
                    <option>Latest</option>
                    <option>Oldest</option>
                </select>
            </div>
            <button className='bg-slate-700 rounded-lg p-3 uppercase text-white hover:opacity-95'>search</button>
        </form>
      </div>

      <div className='flex-1'>
        <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>Listing results:</h1>
        <div className='p-7 flex flex-wrap gap-4'>
            {!loading && listing.length === 0 && ( 
                <p className='text-xl text-slate-700'>No Listing Found!</p>
            )}
            {loading && (
                <p className='text-slate-700 text-center text-xl w-full'>Loading...</p>
            )}
            {!loading && listing &&
                 listing.map((listing) => (<ListingItem key={listing._id}  listing={listing} />
             ))}
            {showMore && (
                <button onClick={onClickShowMore} className='text-green-700 p-7 hover:underline text-center w-full'>
                    Show more
                </button>
            )}
        </div>
      </div>

    </div>
  )
}

export default Search
