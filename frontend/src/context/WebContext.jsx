import { useState, createContext } from "react"

import Swal from "sweetalert2"

export const WebContext = createContext()

export function WebProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem("token") || null)
    const [company, setCompany] = useState(JSON.parse(localStorage.getItem("company") || "null"))
    const [loading, setLoading] = useState(false)

    const getCompany = () => {
        return localStorage.getItem("company")
    }

    const handleLogin = (newToken, companyData) => {
        setToken(newToken)
        setCompany(companyData)
        localStorage.setItem("token", newToken)
        localStorage.setItem("company", JSON.stringify(companyData))
        Swal.close()
    }

    const handleLogout = () => {
        setToken(null)
        setCompany(null)
        localStorage.clear()
    }

    return (
        <WebContext.Provider
            value={{
                token, 
                company, 
                loading, 
                setLoading, 
                handleLogin, 
                handleLogout, 
                getCompany
            }}
        >
            {children}
        </WebContext.Provider>
    )
}
