import {GoogleAuthProvider, getAuth, signInWithPopup} from 'firebase/auth'
import { app } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';

const OAuth = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

  const handleSignGoogle = async() => {
    try {
        const provider = new GoogleAuthProvider()
        const auth = getAuth(app);
        const result = await signInWithPopup(auth, provider)
        //console.log(result)
        const response = await fetch("/api/auth/google", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body:JSON.stringify({
                name: result.user.displayName,
                email: result.user.email,
                photo: result.user.photoURL
            })
        })
        const data = await response.json()
        dispatch(signInSuccess(data))
        navigate('/')
    } catch (error) {
        console.log('could not sign in with google', error)
    }
  }
  return (
    <button
          onClick={handleSignGoogle}
          type="button"
          className="p-3 rounded-lg text-white bg-red-700 uppercase
        hover:opacity-95 "
    >continue with google</button>
  )
}

export default OAuth;
