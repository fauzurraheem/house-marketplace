import React, { useState } from 'react'
import {ReactComponent as ArrowRightIcon }from '../assets/svg/keyboardArrowRightIcon.svg';
import {Link} from 'react-router-dom'
import {toast } from 'react-toastify';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";


function ForgotPassword() {
  const [email, setEmail] = useState('')

  const onChange = e => setEmail(e.target.value)

  const onSubmit = async(e) => {
    e.preventDefault()

    try {
      const auth = getAuth()

      await sendPasswordResetEmail(auth, email)

      toast.success('email was sent')
    } catch (error) {
      toast.error('Could not send email')
    }
  }









  return (
    <div className='pageContainer'>
      <header>
        <p className='pageHeader'>Forgot Password</p>
      </header>

      <main>
        <form onSubmit={onSubmit}>
          <input type="email" className="emailInput" placeholder='email' id='email' value={email} onChange={onChange} />

          <Link className="forgotPassword" to='/sign-in'>Sign In</Link>

          <div className="signInBar">
            <div className="signInText">Send Reset Link</div>
            <button className="signInButton">
              <ArrowRightIcon fill='#ffffff' width='34px' height='34px' />
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}

export default ForgotPassword