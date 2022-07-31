import React from 'react';
import {useLocation,useNavigate} from 'react-router-dom';
import {getAuth, signInWithPopup, GoogleAuthProvider} from 'firebase/auth'
import {setDoc, doc, getDoc, serverTimestamp} from 'firebase/firestore'
import {db} from '../firebase.config'
import googleIcon from '../assets/svg/googleIcon.svg'
import { toast } from 'react-toastify';


function Oauth() {
  const navigate = useNavigate()
  const location = useLocation()


  const onGoogleClick = async(e) => {
    try {
      const auth = getAuth()
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider)
      const user = result.user;

      //checking database
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      //if user dosent exit, create new user
      if(!docSnap.exists()){
        await setDoc(doc(db, 'users', user.uid), {
          name: user.displayName,
          email: user.email,
          timeStamp: serverTimestamp()
        })
      }

      navigate('/')
    } catch (error) {
      toast.error('Could not authories with google')
    }
  }



  return (
    <div className='socialLogin'>
      <p>Sign {location.pathname === '/sign-up' ? 'up' : 'in'} with</p>
      <button className='socialIconDiv' onClick={onGoogleClick}>
        <img className='socialIconImg' src={googleIcon}  alt='googleIcon'/>
      </button>
    </div>
  )
}

export default Oauth