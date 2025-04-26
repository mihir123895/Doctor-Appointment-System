import axios from 'axios';
import React, { createContext, useState } from 'react';
import { toast } from 'react-toastify';

export const DoctorContext = createContext();

const DoctorContextProvider = (props) =>{
    
    const backendUrl = import.meta.env.VITE_BACKEND_URL


    const [dToken,setDToken]=useState(localStorage.getItem('dToken') ? localStorage.getItem('dToken') : "")
    const [appointments,setAppointments] = useState([])
    const [dashData,setDashData] = useState(false)
    const [profileData,setProfileData] = useState(false)

    const getAppointments = async ()=>{
        try {

            const {data} = await axios.get(`${backendUrl}/api/doctor/appointments`,{headers:{dToken}})
            
            if(data.success){
                setAppointments(data.appointments)
               
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
            
        }
    }

    const completeAppointment = async (appointmentId) => {
        try {
          // Ensure the appointmentId is wrapped inside an object
          const { data } = await axios.post(
            `${backendUrl}/api/doctor/complete-appointment`, 
            { appointmentId }, // passing appointmentId as part of the request body
            { headers: { dToken } }
          );
      
          if (data.success) {
           
            toast.success(data.message);
            getAppointments();
          } else {
            console.log(data.message);
            toast.error(data.message);
          }
          
        } catch (error) {
          console.log(error);
          toast.error(error.message || 'An error occurred');
        }
      };
      

      const cancelAppointment = async (appointmentId) => {
        try {
          // Ensure the appointmentId is wrapped inside an object
          const { data } = await axios.post(
            `${backendUrl}/api/doctor/cancel-appointment`, 
            { appointmentId }, // passing appointmentId as part of the request body
            { headers: { dToken } }
          );
      
          if (data.success) {
           
            toast.success(data.message);
            getAppointments();
          } else {
            console.log(data.message);
            toast.error(data.message);
          }
          
        } catch (error) {
          console.log(error);
          toast.error(error.message || 'An error occurred');
        }
      };
      
      const getDashData = async () => {
        try {
          const { data } = await axios.get(`${backendUrl}/api/doctor/dashboard`, { headers: { dToken } });
      
          if (data.success) {
            setDashData(data.data); // Make sure you're accessing data.dashData or data.data as appropriate
           
          } else {
            toast.error(data.message);
          }
        } catch (error) {
          console.log(error);
          toast.error(error.message || 'An error occurred');
        }
      };
      
      const getProfileData = async () =>{
        try {
            const {data} = await axios.get(`${backendUrl}/api/doctor/profile`,{headers:{dToken}})

            if(data.success){
                setProfileData(data.profileData)
             
            }
            
        } catch (error) {
            console.log(error);
          toast.error(error.message || 'An error occurred');
            
        }
      }
    
    const value = {

        backendUrl,dToken,setDToken,appointments,setAppointments,getAppointments,completeAppointment,cancelAppointment,dashData,setDashData,getDashData,profileData,setProfileData,getProfileData
    }

    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    )
}

export default DoctorContextProvider
