import { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
    const {currentUser} = useSelector((state) => state.user)
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault()
        const urlParams = new URLSearchParams(window.location.search)
        urlParams.set('searchTerm', searchTerm)
        const serachQuery = urlParams.toString()
        navigate(`/search?${serachQuery}`)
    }
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm')
        if(searchTermFromUrl){
            setSearchTerm(searchTermFromUrl)
        }
    }, [location.search])
  return (
    <header className="bg-slate-200  shadow-md">
        <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
            <Link to={"/"}>
            <h1 className="font-bold text-sm sm:text-2xl flex flex-wrap">
                <span className="text-slate-500">Mian</span>
                <span className="text-slate-700">Estate</span>
            </h1>
            </Link>
            <form onSubmit={handleSearch} className="bg-slate-100 p-3 rounded-lg flex items-center">
                <input type="text" 
                    placeholder="search.."
                    className="bg-transparent focus:outline-none w-24 sm:w-64"
                    value={searchTerm}
                    onChange={(e)=>setSearchTerm(e.target.value)} />
                <button>
                    <IoSearch className="text-slate-600" />
                </button>
            </form>

            <ul className="flex gap-4"> 

                <Link to={"/"}> <li className="hidden sm:inline text-slate-700 hover:underline">Home</li> </Link>
                <Link to={"/about"}> <li className="hidden sm:inline text-slate-700 hover:underline">About</li> </Link>
                <Link to={"/profile"}>
                    {currentUser ? (<img className="rounded-full w-7 h-7 object-cover" src={currentUser.avatar} alt="profile"/>) : ( <li className="text-slate-700 hover:underline">Sign in</li>)} 
                </Link>

            </ul>
        </div>
    </header>
  )
}

export default Header
