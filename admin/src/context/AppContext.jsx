import React, { createContext } from 'react';

export const AppContext = createContext();


const AppContextProvider = (props) =>{

     const currency = "₹"
    
const calculateAge = (dob) =>{

    const today = new Date();
    const birthDate = new Date(dob);

    let age = today.getFullYear() - birthDate.getFullYear()
    return age
}

const months = ["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Oct","Nov","Dec"]

const slotsDateFormat = (slotDate) => {
  const dateArray = slotDate.split('_');
  return dateArray[0]+ " " + months[Number(dateArray[1])]+ " " + dateArray[2]
}

    const value = {
        calculateAge,slotsDateFormat,currency
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider