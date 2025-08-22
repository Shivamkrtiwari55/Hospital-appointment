import React, { useContext } from 'react';
import Login from './pages/Login';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AdminContext } from './context/AdminContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Admin/Dashboard';
import AllAppointment from './pages/Admin/AllAppointment';
import AddDoctor from './pages/Admin/AddDoctor';
import DoctorList from './pages/Admin/DoctorList';
import { DoctorContext } from './context/DoctorContext';
import DoctorProfile from './pages/Doctor/DoctorProfile';
import DoctorAppointment from './pages/Doctor/DoctorAppointment';


const App = () => {

  const {aToken} = useContext(AdminContext)
  const {dToken} = useContext(DoctorContext)
  return aToken || dToken ? (

    <div className='bg-[#F8F9FD]'>
    <ToastContainer/>
    <Navbar/>
    <div className='flex items-start'>
      <Sidebar />
      <Routes>
        <Route path='/' element={<></>}/>
        {/* Admin Routes */}
        {aToken && (
          <>
            <Route path='/admin-dashboard' element={<Dashboard/>}/>
            <Route path='/all-appointment' element={<AllAppointment/>}/>
            <Route path='/add-doctor' element={<AddDoctor/>}/>
            <Route path='/doctor-list' element={<DoctorList/>}/>
          </>
        )}
        {/* Doctor Routes */}
        {dToken && (
          <>
            <Route path='/doctor-dashboard' element={<DoctorProfile/>}/>
            <Route path='/doctor-profile' element={<DoctorProfile/>}/>
            <Route path='/doctor-appointments' element={<DoctorAppointment/>}/>
          </>
        )}
      </Routes>
    </div>
    </div>
  ):(
    <>
     <Login/>
    <ToastContainer/>
    </>
  )
}

export default App
