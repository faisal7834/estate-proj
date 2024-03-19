import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

const Contact = ({listing}) => {
    const [landlord, setLandlord] = useState(null);
    const [message, setMessage] = useState('');
    
    const onChangeMsg = (e) => {
         setMessage(e.target.value);
    }

    useEffect(() => {
        const fetchLandlord = async() => {
           try {
             const response = await fetch(`/api/user/${listing.userRef}`)
             const data = await response.json()
             setLandlord(data)
           } catch (error) {
            console.log(error)
           }
        }
        fetchLandlord();
    }, [listing.userRef])
  return (
    <>
      {landlord && (
        <div className='flex flex-col gap-2'>
            <p>Contact <span className='font-semibold'>{landlord.username}</span> for  
                <span className='font-semibold'> {listing.name.toLowerCase()}</span></p>
            <textarea name='message' id='message' value={message} onChange={onChangeMsg} rows={2}
             placeholder='Enter message here...' className='border w-full p-3 rounded-lg' />
             <Link to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
              className='bg-slate-700 rounded-lg p-3 uppercase hover:opacity-95 text-center text-white'>send message</Link>
        </div>
      )}
    </>
  )
}

export default Contact
