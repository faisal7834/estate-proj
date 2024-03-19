import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";

const ListingItem = ({ listing }) => {
  return (
    <div
      className="bg-white shadow-md hover:shadow-lg transition-shadow rounded-lg w-full overflow-hidden
                      sm:w-[330px]"
    >
      <Link to={`/listing/${listing._id}`}>
        <img
          src={listing.imageUrls[0]}
          alt="listing cover"
          className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 translate-scale duration-300"
        />
        <div className="p-3 w-full flex flex-col gap-2">
          <p className="text-slate-700 font-semibold text-lg truncate">
            {listing.name}
          </p>
          <div className="flex items-center gap-1">
            <MdLocationOn className="text-green-700 h-4 w-4" />
            <p className="text-sm truncate text-gray-600 w-full">
              {listing.address}
            </p>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">
            {listing.description}
          </p>
          <p className="text-slate-500 mt-2 font-semibold">
            $
            {listing.offer 
              ? listing.discountPrice.toLocaleString('en-US')
              : listing.regularPrice.toLocaleString('en-US')
            }
            {listing.type === 'rent' && '/month'}
          </p>
          <div className="text-slate-700 flex gap-4">
            <div className="text-xs font-bold">
              {listing.bedrooms > 1 ? `${listing.bedrooms} beds` : `${listing.bedrooms} bed`}
            </div>
            <div className="text-xs font-bold">
              {listing.bathrooms > 1 ? `${listing.bathrooms} baths` : `${listing.bathrooms} bath`}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ListingItem;
