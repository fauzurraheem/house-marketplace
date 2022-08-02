import React, { useEffect } from 'react'
import {useState} from 'react'
import {Link, useParams, useNavigate} from 'react-router-dom'
import { MapContainer,Marker, Popup, TileLayer} from 'react-leaflet'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import {getAuth} from 'firebase/auth'
import { doc, getDoc} from 'firebase/firestore'
import {db} from '../firebase.config'
import Spinner from '../components/Spinner'
import shareIcon from '../assets/svg/shareIcon.svg'



function Listing() {
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [shareLinkCopied, setShareLinkCopied] = useState(false)
  const  navigate  = useNavigate()
  const params = useParams()
  const auth = getAuth()

  useEffect(() => {
    const fetchListing = async() => {
      const docRef  = doc(db, 'listings', params.listingId)
      const docSnap = await getDoc(docRef)

      

      if(docSnap.exists()) {
        
        setListing(docSnap.data())
        setLoading(false)
       
      }
    }

    fetchListing()
  }, [navigate, params.listingId])


  if(loading){
    return <Spinner />
  }



  return (
    <main>
    <div>
        <title>{listing.name}</title>
    </div>
    <Swiper pagination={true} modules={[Pagination]} className="mySwiper">
    {listing.imageUrls.map((lis, i) => (
        <SwiperSlide key={i}>
          <div
              style={{
                background: `url(${lis}) center no-repeat`,
                backgroundSize: 'cover',
                width: '100%',
                height: '50vh'
              }}
              className='swiperSlideDiv'
            >
              
            </div>
        </SwiperSlide>
      ))}
    </Swiper>
    <div className="shareIconDiv" onClick={() => {
      navigator.className.writeText(window.location.href) 
      setShareLinkCopied(true) 
      setTimeout(() => {setShareLinkCopied(false)}, 2000)}}>
      <img src={shareIcon} alt='' />
    </div>

    {shareLinkCopied && <p className='linkCopied'>Link Copied!</p>}

    <div className="listingDetails">
      <p className="listingName">
        {listing.name} - ${listing.offer ? listing.discountedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g,',') : listing.regularPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g,',')}
      </p>
      <p className="listingLocation">{listing.location}</p>
      <p className="listingType">
        For {listing.type === 'rent' ? 'Rent' : 'Sale'}
      </p>
      {listing.offer && 
      <p className="discountPrice">
        ${listing.regularPrice-listing.discountedPrice} discount
      </p>}

      <ul className="listingDetailsList">
        <li>
          {listing.bedrooms > 1 ? `${listing.bedrooms} Bedrooms` : `1 Bedroom`}
        </li>
        <li>
          {listing.bathrooms > 1 ? `${listing.bathrooms} Bathrooms` : `1 Bathroom`}
        </li>
        <li>{listing.parking && 'Parking spot'}</li>
        <li>{listing.furnished && 'Furnished'}</li>

        <p className="listingLocationTitle">Location</p>

        <div className="leafletContainer">
          <MapContainer style={{height:'100%', with:'100%'}} center={[listing.geolocation.lat, listing.geolocation.lng]} zoom={13} scrollWheelZoom={false}>
          <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url='https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png'
            />

            <Marker
              position={[listing.geolocation.lat, listing.geolocation.lng]}
            >
              <Popup>{listing.location}</Popup>
            </Marker>
          </MapContainer>
        </div>


        {auth.currentUser?.uid !== listing.userRef &&(
          <Link to={`/contact/${listing.userRef}?listingName=${listing.name}` } className='primaryButton'>
            Contact LandLord
          </Link>
        )}
      </ul>
    </div>
  </main>
  )
}

export default Listing