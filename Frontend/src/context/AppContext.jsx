import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { createContext } from "react"
import {toast} from 'react-toastify'
import axios from 'axios'

export const AppContext = createContext();

const AppContextProvider = (props) => {

    const currencSymbol = '₹'
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    
    const [doctors,setDoctors] = useState([])
    const [token,setToken] = useState(localStorage.getItem('token')?localStorage.getItem('token'):"")

   

    const getDoctorsData = async () => {
        try {
            const {data} = await axios.get(backendUrl+'/api/doctor/list')

            if(data.success){
                console.log(data.doctors)
                setDoctors(data.doctors)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    useEffect(()=>{
        getDoctorsData()
    },[])

    const value = {
        doctors,currencSymbol,token,setToken
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider
