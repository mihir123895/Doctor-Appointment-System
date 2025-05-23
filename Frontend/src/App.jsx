import React from 'react';
import { Routes ,Route } from 'react-router-dom';
import {ToastContainer , toast} from 'react-toastify'
import Login from './pages/Login';
import Doctors from './pages/Doctors';
import Home from './pages/Home';
import Contact from './pages/Contact';
import About from './pages/About';
import MyAppointments from './pages/MyAppointments';
import MyProfile from './pages/MyProfile';
import Appoinment from './pages/Appoinment';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Resetpassword from './pages/Resetpassword';
import 'react-toastify/dist/ReactToastify.css'


const App = () => {
  return (
   
    <div className="mx-4 sm:mx-[10%]">
      <ToastContainer />
<Navbar />
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/doctors' element={<Doctors />}/>
        <Route path='/doctors/:speciality' element={<Doctors />}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/contact' element={<Contact/>}/>
        <Route path='/my-profile' element={<MyProfile />}/>
        <Route path='/my-appointments' element={<MyAppointments/>}/>
        <Route path='/appointment/:docId'  element={<Appoinment />}/>
        <Route path='/resetpassword' element={<Resetpassword />} />
       </Routes>
<Footer /> 


    </div>
    
   
   
  );
}

export default App;

