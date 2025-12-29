import { useContext } from "react"
import { WebContext } from "../context/WebContext"
import { useNavigate } from "react-router-dom"

import Swal from "sweetalert2"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons"
import "./Navbar.css"

import logo from "../images/carbonex_mini.png"
import dbs from "../images/dbs.png"

function Navbar() {
    const navigate = useNavigate()
    const { handleLogout } = useContext(WebContext)
    const logout = () => {
        Swal.fire({
            title: "Logging out", 
            background: "#0f0f0f", 
            color: "#ffffff", 
            allowOutsideClick: false, 
            showConfirmButton: false, 
            customClass: {
                popup: "custom-popup", 
                title: "custom-title", 
                htmlContainer: "custom-text", 
                loader: "custom-loader"
            }, 
            willOpen: () => {
                Swal.showLoading()
            }
        })
        setTimeout(() => {
            handleLogout()
            navigate("/login")
            Swal.close()
        }, 4000)
    }
    
    return (
        <div className="navbar-container">
            <img className="logo-carbonex" src={logo} alt="CARBOCREDIT" />
            <img className="logo-dbs" src={dbs} alt="DBS" />

            <button className="nav-links">
                <a className="nav-text" href="/landing">HOME</a>
            </button>
            {/* <button className="nav-links">
                <a className="nav-text" href="/dashboard">DASHBOARD1</a>
            </button> */}
            <button className="nav-links">
                <a className="nav-text" href="/requests">REQUESTS</a>
            </button>
            <button className="sign-out-button" onClick={logout}>
                SIGN OUT<FontAwesomeIcon className="sign-out-icon" icon={faSignOutAlt} />
            </button>
        </div>
    )
}

export default Navbar
