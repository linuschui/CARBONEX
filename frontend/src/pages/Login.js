import { useContext, useRef, useState } from "react"
import { WebContext } from "../context/WebContext"
import { useNavigate } from "react-router"
import { CSSTransition, SwitchTransition } from "react-transition-group"

import axios from "axios"
import Swal from "sweetalert2"

import "./Login.css"

import fulllogo from "../images/carbonex.png"

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api"

function Login() {
    const navigate = useNavigate()

    const { handleLogin } = useContext(WebContext)

    // Login form
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    // Registration
    const [companyName, setCompanyName] = useState("")
    const [isRegister, setIsRegister] = useState(false)

    // Transition ref (single ref for SwitchTransition)
    const cardRef = useRef(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        Swal.fire({
            title: `${isRegister ? "Registering" : "Logging in"}`, 
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
        setTimeout(async () => {
            try {
                if (isRegister) {
                    const response = await axios.post(`${API_URL}/auth/register`, { companyName, email, password })
                    setEmail("")
                    setPassword("")
                    setCompanyName("")
                    console.log(response.data)
                    Swal.close()
                    Swal.fire({
                        icon: "success", 
                        title: "Registration successful", 
                        text: "Your account has been created successfully!", 
                        background: "#0f0f0f", 
                        color: "#ffffff", 
                        confirmButtonText: "OK", 
                        showConfirmButton: true, 
                        customClass: {
                            confirmButton: "custom-swal-button", 
                            popup: "custom-popup", 
                            title: "custom-title", 
                            htmlContainer: "custom-text"
                        }, 
                        didClose: () => {
                            setIsRegister(false)
                        }
                    })
                } else {
                    const response = await axios.post(`${API_URL}/auth/login`, { email, password })
                    handleLogin(response.data.token, response.data.company)
                    navigate("/landing")
                }
            } catch (err) {
                Swal.close()
                Swal.fire({
                    icon: "error", 
                    title: `${isRegister ? "Registration failed" : "Login failed"}`, 
                    text: error, 
                    background: "#0f0f0f", 
                    color: "#ffffff", 
                    showConfirmButton: true, 
                    customClass: {
                        confirmButton: "custom-swal-button", 
                        popup: "custom-popup", 
                        title: "custom-title", 
                        htmlContainer: "custom-text"
                    }
                })
            }
        }, 4000)
    }

    return (
        <div className="login-container">
            <SwitchTransition mode="out-in">
                <CSSTransition
                    key={isRegister ? "register" : "login"}
                    timeout={1000}
                    classNames="form"
                    unmountOnExit
                    nodeRef={cardRef}
                >
                    <div ref={cardRef} className="login-card">
                        <img className="login-logo" src={fulllogo} alt="CARBONEX" />

                        {isRegister ? (
                            <form onSubmit={handleSubmit} className="login-form">
                                <div className="form-group">
                                    <label htmlFor="companyName">COMPANY NAME</label>
                                    <input
                                        type="text"
                                        id="companyName"
                                        value={companyName}
                                        onChange={(e) => setCompanyName(e.target.value)}
                                        placeholder="Enter Your Company Name"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email">EMAIL</label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter Your Email"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="password">PASSWORD</label>
                                    <input
                                        type="password"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter Your Password"
                                        required
                                    />
                                </div>

                                <button type="submit" className="register-button">
                                    REGISTER
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleSubmit} className="login-form">
                                <div className="form-group">
                                    <label htmlFor="email">EMAIL</label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="password">PASSWORD</label>
                                    <input
                                        type="password"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        required
                                    />
                                </div>

                                <button type="submit" className="login-button">
                                    LOGIN
                                </button>
                            </form>
                        )}

                        <div className="login-bottom-container">
                            {isRegister ? (
                                <button className="register-button2" onClick={() => setIsRegister(false)}>
                                    BACK TO LOGIN
                                </button>
                            ) : (
                                <>
                                    <button className="login-button2">FORGOT PASSWORD</button>
                                    <button className="login-button2" onClick={() => setIsRegister(true)}>
                                        REGISTER
                                    </button>
                                </>
                            )}
                        </div>

                        {!isRegister && (
                            <div className="demo-credentials">
                                <p><strong>Demo Credentials</strong></p>
                                <p>contact@greentech.com</p>
                                <p>password123</p>
                            </div>
                        )}
                    </div>
                </CSSTransition>
            </SwitchTransition>
        </div>
    );
}

export default Login;
