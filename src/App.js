import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Expore from './pages/Expore';
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'; 
import PrivateRoute from './components/PrivateRoute';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import Offers from './pages/Offers';
import CreateListings from './pages/CreateListings';
import Category from './pages/Category';
import Navbar from './components/Navbar';
import Profile from './pages/Profile';
import Listing from './pages/Listing';
import Contact from './pages/Contact';
import EditListing from './pages/EditListing';



function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Expore />}/>
          <Route path='/sign-in' element={<SignIn/>}/>
          <Route path='/profile' element={<PrivateRoute/>}>
            <Route path='/profile' element={<Profile/>}/>
          </Route>
          <Route path='/sign-up' element={<SignUp />}/>
          <Route path='/forgot-password' element={<ForgotPassword/>}/>
          <Route path='/offers' element={<Offers />}/> 
          <Route path='/create-listings' element={<CreateListings />}/> 
          <Route path='/edit-listing/:listingId' element={<EditListing />}/> 
          <Route path='/category/:categoryName' element={<Category />}/> 
          <Route path='/category/:categoryName/:listingId' element={<Listing />} />
          <Route path='/contact/:lanlordId' element={<Contact />}/>
          
        </Routes>
        <Navbar />
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
