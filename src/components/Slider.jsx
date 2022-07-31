import React from 'react'
import {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {collection, getDocs, query, orderBy, limit} from 'firebase/firestore'
import {db} from '../firebase.config'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from "swiper";
import "swiper/css";
import "swiper/css/pagination";

import Spinner from './Spinner'



function Slider() {
    const [loading, setLoading] = useState(true)
    const [listings, setListings] = useState(null)

    const navigate = useNavigate()

    useEffect(() => {
      const fetchListings = async() => {
        const listingsRef = collection(db, 'listings', )
        const q = query(listingsRef, orderBy('timestamp', 'desc'), limit(5))
        const querySnap = await getDocs(q)

        let listings = []

        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data()
          })
        })
        console.log(listings)
        setListings(listings)
        setLoading(false)
      }
      
      fetchListings()
    }, [])


    if(loading){
      <Spinner />
    }

    if(listings.length === 0 ){
      return <></>
    }




  return (
    listings && (
      <>
        <p className='exploreHeading'>Recommended</p>


        <Swiper pagination={true} modules={[Pagination]} className="mySwiper">
        {listings.map((lis) => (
            <SwiperSlide key={lis.id}
            onClick={() => navigate(`/category/${lis.data.type}/${lis.id}`)}
            >
              <div  className='swiperSlideDiv'>
                <img src={lis.data.imageUrls[0]} style={{width:'100%', height:'20rem'}} alt=''/>
                
                
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </>
    )
  )
}

export default Slider