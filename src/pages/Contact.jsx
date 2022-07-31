import React from 'react'
import {useState, useEffect} from 'react'
import {useParams, useSearchParams} from 'react-router-dom'
import {db} from '../firebase.config'
import {doc, getDoc} from 'firebase/firestore'
import {toast} from 'react-toastify'

function Contact() {
  const [message, setMessage] = useState('')
  const [landlord, setLandlord] = useState(null)
  // eslint-disable-next-line
  const [searchParams, setSearchParams] = useSearchParams()


  const params = useParams()

  useEffect(() => {
    const getLandlord = async() => {
      const docRef = doc(db, 'users', params.lanlordId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()){
        // console.log(docSnap.data())
        setLandlord(docSnap.data())
      } else{
        toast.error('Could not get landlord data')
      }
    }

    getLandlord()
  }, [params.landlordId])


  const onChange = (e) => {
  setMessage(e.target.value)
  }
   


  return (
    <div className='pageContainer'>
      <header>
        <p className="pageHeader">Contact Landlord</p>
      </header>

      {landlord !== null && (
        <main>
          <div className="contactLandlord">
            <p className="landlordName">Contact  {landlord?.name}</p>
          </div>

          <form className="messageForm">
            <div className="messageDiv">
              <label htmlFor="message" className="messageLabel">Message</label>
              <textarea name="message" id="message" className='textarea' value={message} onChange={onChange}></textarea>
            </div>

            <a href={`mailto:${landlord.email}?Subject=${searchParams.get('listingName')}&body=${message}`}>
              <button className="primaryButton" type='buttton'>Send Message</button>
            </a>
          </form>
        </main>
      )}
    </div>
  )
}

export default Contact