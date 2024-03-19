import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import ListingItem from "../components/ListingItem";

const Home = () => {
  const [offerListing, setOfferListing] = useState([]);
  const [rentListing, setRentListing] = useState([]);
  const [saleListing, setSaleListing] = useState([]);
  // console.log(offerListing);
  SwiperCore.use([Navigation]);
  useEffect(() => {
    const fetchOfferListing = async () => {
      try {
        const response = await fetch("/api/listing/get?offer=true&limit=4");
        const data = await response.json();
        setOfferListing(data);
        fetchRentListing();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchRentListing = async () => {
      try {
        const response = await fetch("/api/listing/get?type=rent&limit=4");
        const data = await response.json();
        setRentListing(data);
        fetchSaleListing()
      } catch (error) {
        console.log(error);
      }
    };
    const fetchSaleListing = async () => {
      try {
        const response = await fetch("/api/listing/get?type=sale&limit=4");
        const data = await response.json();
        setSaleListing(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOfferListing();
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
          Find You Next <span className="text-slate-500">Perfect</span> <br />
          Place With Ease.
        </h1>
        <div className="text-gray-500 text-xs sm:text-sm">
          <h1>
            Mian Estate is the best place to find your next perfect place for
            live. <br />
            We have a wide range of properties for you to choose from.{" "}
          </h1>
        </div>
        <Link
          to={"/search"}
          className="text-blue-800 font-bold hover:underline text-xs sm:text-sm"
        >
          Let's get started...
        </Link>
      </div>

      <Swiper navigation>
        {offerListing &&
          offerListing.length > 0 &&
          offerListing.map((listing) => (
            <SwiperSlide key={listing._id}>
              <div
                style={{
                  background: `url(${listing.imageUrls[0]}) center no-repeat`,
                  backgroundSize: "cover",
                }}
                className="h-[500px]"
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>

      <div className="flex flex-col gap-8 mx-auto max-w-6xl my-10 p-3">
        {offerListing && offerListing.length > 0 && (
          <div>
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-700">
                Recent offers
              </h2>
              <Link
                className="text-blue-800 hover:underline text-sm"
                to={"/search?offer=true"}
              >
                Show more offers
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {offerListing.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}

        {rentListing && rentListing.length > 0 && (
          <div>
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-700">
                Recent places for rent
              </h2>
              <Link
                className="text-blue-800 hover:underline text-sm"
                to={"/search?type=rent"}
              >
                Show more places for rent
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {rentListing.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}

        {saleListing && saleListing.length > 0 && (
          <div>
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-700">
                Recent places for sale
              </h2>
              <Link
                className="text-blue-800 hover:underline text-sm"
                to={"/search?type=sale"}
              >
                Show more places for sale
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {saleListing.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
export default Home;
