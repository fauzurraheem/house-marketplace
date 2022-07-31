import React from 'react'
import {useState, useEffect} from 'react';
// import {useParams} from 'react-router-dom'
import {collection, query, where, orderBy, limit, startAfter, getDocs} from 'firebase/firestore'
import {db} from '../firebase.config'
import {toast} from 'react-toastify'
import Spinner from '../components/Spinner';
import ListingItem from '../components/ListingItem';
// import { async } from '@firebase/util';

function Offers() {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true)
  const [lastFetchedListings, setLastFetchedListings] = useState(null);


  // const params = useParams();

  useEffect(() => {
    const fetchListings = async() => {
      try {
        //get reference
        const listingsRef = collection(db, 'listings')

        //create a query
        const q = query(listingsRef, where('offer', '==', true), orderBy('timestamp', 'desc'), limit(10))

        //Execute query
        const querySnap = await getDocs(q)

        const lastVisible = querySnap.docs[querySnap.docs.length - 1]
        setLastFetchedListings(lastVisible)

        const listings = []

        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data()
          })
        })

        
        setListings(listings)
        setLoading(false)
      } catch (error) {
        toast.error('could not fetch listings')
      }
    }

    fetchListings()
  },[])


  //pagination //load more
  const onFetchMoreListings = async () => {
    try {
      //get reference
      const listingsRef = collection(db, "listings");

      //create a query
      const q = query(
        listingsRef,
        where('offer', '==', true),
        orderBy("timestamp", "desc"),
        startAfter(lastFetchedListings),
        limit(10)
      );

      //Execute query
      const querySnap = await getDocs(q);

      const lastVisible = querySnap.docs[querySnap.docs.length - 1];

      setLastFetchedListings(lastVisible);

      const listings = [];

      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setListings((prevState) => [...prevState, ...listings]);
      setLoading(false);
    } catch (error) {
      toast.error("could not fetch listings");
      console.log(error);
    }
  };







  return (
    <div className='category'>
      <header>
        <p className="pageHeader">
          Offers
        </p>
      </header>

      {loading ? (<Spinner/>) : listings && listings.length > 0 ? (<>
        <main>
          <ul className="categoryListings">
            {listings.map((listing) => (
              <ListingItem listing={listing.data} id={listing.id} key={listing.id}/>
            ))}
          </ul>
        </main>
      </>) : (<p>Their are no current offers</p>)}
      <br />
      <br />
          {lastFetchedListings && (<p className="loadMore"  onClick={onFetchMoreListings}>Load More</p>
           )}
    </div>
  )
}

export default Offers