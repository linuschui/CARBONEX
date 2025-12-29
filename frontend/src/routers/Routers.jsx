import { useContext } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { WebContext } from "../context/WebContext"

import "./Routers.css"

import Landing from "../pages/Landing"
import ReceivedRequests from "../pages/ReceivedRequests"

function Routers() {

    const{ token, loading } = useContext(WebContext)

    return (
        <>
            {loading && (
                    <div className="spinner-overlay">
                        <div className="spinner"></div>
                    </div>
            )}
            <Routes>
                <Route 
                    path="/"
                    element={token ? <Navigate to="/landing" /> : <Navigate to="/login" />}
                />
                <Route 
                    path="/landing"
                    element={token ? <Landing/> : <Navigate to="/login" />}
                />
                <Route 
                    path="/requests"
                    element={token ? <ReceivedRequests/> : <Navigate to="/login" />}
                />
            </Routes>
        </>
    )
}

export default Routers
