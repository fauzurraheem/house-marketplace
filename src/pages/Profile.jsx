import React from 'react'
import {getAuth, updateProfile} from 'firebase/auth'
import { updateDoc, doc , getDocs, query, collection, orderBy, where, deleteDoc,} from 'firebase/firestore'
import {db} from '../firebase.config'
import {useState, useEffect} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg'
import homeIcon from '../assets/svg/homeIcon.svg'
import ListingItem from '../components/ListingItem'




function Profile() {
  const auth = getAuth()

  const [listings, setListings] = useState(null)
  const [loading, setLoading] = useState(true)

  const [changeDetails, setChangeDetails] = useState(false)

  const [formData, setFormData] = useState({
    name : auth.currentUser.displayName,
    email : auth.currentUser.email
  })

  const {name, email} = formData

  const navigate = useNavigate()

  useEffect(() => {
    const fetchUserListings = async() => {
      const listingsRef = collection(db, 'listings')
      const q = query(listingsRef, where('userRef', '==', auth.currentUser.uid), orderBy('timestamp', 'desc'))

      const querySnap = await getDocs(q)

      let listings = []

      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        })
      })

      setListings(listings)
      setLoading(false)


    }

    fetchUserListings()
  }, [auth.currentUser.uid])

  const onLogout = (e) => {
    auth.signOut()

    navigate('/')
  }

  const onSubmit = async() => {
    try {
      if(auth.currentUser.displayName !== name) {
        // Update display name
        await updateProfile(auth.currentUser, {
          displayName:name
        })
        //update in firestore
        const userRef = doc(db, 'users', auth.currentUser.uid)
        await updateDoc(userRef, {
          name: name
        })
      }
    } catch (error) {
      toast.error('could not Update')
    }
  }

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value
    }))
  }

  const onDelete = async(listingId) => {
    if(window.confirm('are you sure you want to delete')){
      await deleteDoc(doc(db, 'listings', listingId))
      const updatedListing = listings.filter((listing) => 
        listing.id !== listingId
      )
      setListings(updatedListing)
      toast.error('listing successfully deleted')
    }
  }

const onEdit = (listingId) => {
  navigate(`/edit-listing/${listingId}`)

}

  


  return <div className="profile">
    <header className='profileHeader'>
      <p className="pageHeader">My Profile</p>
      <button type='button' className="logOut" onClick={onLogout}>
        Logout
      </button>
    </header>

    <main>
      <div className="profileDetailsHeader">
        <p className="profileDetailsText">Personal Details</p>
        <p className="changePersonalDetails" onClick={(e) => {changeDetails && onSubmit()
        setChangeDetails((prevState) => !prevState)}}>
        {changeDetails ? 'done' : 'changeDetails'}
        </p>
      </div>

      <div className="profileCard">
        <form>
          <input type='text'
          id= 'name'
          className={!changeDetails ? 'profileName' : 'profileNameActive'}
          disabled={!changeDetails} 
          value= {name}
          onChange={onChange}/>

          <input type='text'
          id= 'email'
          className={!changeDetails ? 'profileEmail' : 'profileEmailActive'}
          disabled={!changeDetails} 
          value= {email}
          onChange={onChange}/>
        </form>
      </div>

      <Link to='/create-listings' className='createListing'>
          <img src={homeIcon} alt='home' />
          <p>Sell or rent your home</p>
          <img src={arrowRight} alt='arrow right' />
        </Link>

        {!loading && listings?.length > 0 &&  (
          <>
            <p className="listingText">Your Listings</p>
            <ul className="listingList">
              {listings.map((listing) => (
                <ListingItem 
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                  onDelete={() => onDelete(listing.id)}
                  onEdit={() => onEdit(listing.id)}
                />
              ))}
            </ul>
          </>
        )} 
    </main>
  </div>
}

export default Profile