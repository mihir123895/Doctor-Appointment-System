import React from 'react';
import { createContext } from "react"
import { doctors } from "../assets/assets_frontend/assets"

export const AppContext = createContext();

const AppContextProvider = (props) => {

    const currencSymbol = '₹'

    const value = {
        doctors,currencSymbol
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider
