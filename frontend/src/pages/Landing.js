import { useContext, useEffect, useState } from "react"
import { WebContext } from "../context/WebContext"
import axios from "axios"
import Swal from "sweetalert2"

import "./Landing.css"

import Balance from "../components/Balance"
import Profile from "../components/Profile"
import SentRequestsTable from "../components/SentRequestsTable"
import { 
    CreateRequestModal, 
    EditRequestModal
} from "../components/RequestModal"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faRotate, faSquarePlus } from "@fortawesome/free-solid-svg-icons"

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api"

function Landing() {
	const { token, company, setLoading } = useContext(WebContext)
    console.log(token)
    console.log(company)

    // CLOCK
    const handleProfileLoaded = () => {
        setLoading(false)
    }

    // AXIOS CONFIGURATION
    const axiosConfig = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    useEffect(() => {
        fetchBalance()
        fetchRequests()
        fetchCompanies()
    }, [])

    // BALANCE
    const [balance, setBalance] = useState(null)
    const fetchBalance = async () => {
        try {
            const response = await axios.get(`${API_URL}/balance`, axiosConfig)
            console.log(response.data)
            setBalance(response.data)
        } catch (error) {
            console.error("❌ Error Fetching Balance: ", error)
        }
    }

    // REQUEST : DATA
    const [requests, setRequests] = useState([])
    const [companies, setCompanies] = useState([])
    const fetchRequests = async () => {
        try { 
            const response = await axios.get(`${API_URL}/requests/my`, axiosConfig)
            console.log(response.data)
            setRequests(response.data)
        } catch (error) {
            console.error("❌ Error Fetching Your Requests: ", error)
        }
    }
    const fetchCompanies = async () => {
        try { 
            const response = await axios.get(`${API_URL}/companies`, axiosConfig)
            console.log(response.data)
            const filteredCompanies = response.data.filter(c => c.company_name !== company.name)
            setCompanies(filteredCompanies)
        } catch (error) {
            console.error("❌ Error Fetching Your Requests: ", error)
        }
    }

    // REQUEST : CREATE/EDIT/DELETE
    const [showModal, setShowModal] = useState(false)
    const [editingRequest, setEditingRequest] = useState(null)
    const [formData, setFormData] = useState({
        targetCompanyId: "",
        requestType: "Buy",
        carbonUnitPrice: "",
        carbonQuantity: "",
        requestReason: ""
    })

    const handleCreateRequest = async (e) => {
        e.preventDefault()
        Swal.fire({
			title: "Processing", 
			text: "Creating request...", 
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
                if (formData.carbonQuantity > 99999999 || formData.carbonUnitPrice > 99999999 ) {
                    Swal.close()
                    Swal.fire({
                        icon: "error", 
                        title: "Error Creating Request", 
                        text: "The maximum value allowed is 99,999,999.00", 
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
                    return
                }
                const response = await axios.post(`${API_URL}/requests`, formData, axiosConfig)
                console.log(response.data)
                setShowModal(false)
                resetForm()
                fetchRequests()
                Swal.close()
                Swal.fire({
                    icon: "success", 
                    title: "Request Created", 
                    text: "Your carbon request has been submitted successfully!", 
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
                        handleRefresh()
                    }
                })
            } catch (error) {
                Swal.close()
                Swal.fire({
                    icon: "error", 
                    title: "Error Creating Request", 
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
    
    const handleEditRequest = async (e) => {
        e.preventDefault()
        Swal.fire({
			title: "Processing", 
			text: "Editing request...", 
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
                if (formData.carbonQuantity > 99999999 || formData.carbonUnitPrice > 99999999 ) {
                    Swal.close()
                    Swal.fire({
                        icon: "error", 
                        title: "Error Creating Request", 
                        text: "The maximum value allowed is 99,999,999.00", 
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
                    return
                }
                const response = await axios.put(`${API_URL}/requests/${editingRequest.request_id}`, {
                    carbonUnitPrice: formData.carbonUnitPrice, 
                    carbonQuantity: formData.carbonQuantity, 
                    requestReason: formData.requestReason
                }, axiosConfig)
                console.log(response.data)
                setShowModal(false)
                resetForm()
                fetchRequests()
                setEditingRequest(null)
                Swal.close()
                Swal.fire({
                    icon: "success", 
                    title: "Request Edited", 
                    text: "Your carbon request has been edited successfully!", 
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
                        handleRefresh()
                    }
                })
            } catch (error) {
                Swal.close()
                Swal.fire({
                    icon: "error", 
                    title: "Error Editing Request", 
                    text: error, 
                    background: "#0f0f0f", 
                    color: "#ffffff", 
                    showConfirmButton: true, 
                    customClass: {
                        confirmButton: "custom-swal-button", 
                        popup: "custom-popup", 
                        title: "custom-title", 
                        htmlContainer: "custom-text"
                    }, 
                    didClose: () => {
                        handleRefresh()
                    }
                })
            }
        }, 4000)
    }
    
    const handleDeleteRequest = async (requestId) => {
        const result = await Swal.fire({
            icon: "warning",
            title: "Confirm Delete",
            text: "Are you sure you want to delete this request?",
            background: "#0f0f0f",
            color: "#ffffff",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it",
            cancelButtonText: "Cancel",
            customClass: {
                confirmButton: "custom-swal-button neon",
                cancelButton: "custom-swal-button",
                popup: "custom-popup",
                title: "custom-title",
                htmlContainer: "custom-text"
            },
            reverseButtons: true
        })

        if (result.isConfirmed) {
            Swal.fire({
                title: "Processing", 
                text: "Editing request...", 
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
                    const response = await axios.delete(`${API_URL}/requests/${requestId}`, axiosConfig)
                    console.log(response.data)
                    fetchRequests()
                    Swal.close()
                    Swal.fire({
                        icon: "success", 
                        title: "Request Deleted", 
                        text: "Your carbon request has been deleted successfully!", 
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
                            handleRefresh()
                        }
                    })
                } catch (error) {
                    Swal.close()
                    Swal.fire({
                        icon: "error", 
                        title: "Error Deleting Request", 
                        text: error, 
                        background: "#0f0f0f", 
                        color: "#ffffff", 
                        showConfirmButton: true, 
                        customClass: {
                            confirmButton: "custom-swal-button", 
                            popup: "custom-popup", 
                            title: "custom-title", 
                            htmlContainer: "custom-text"
                        }, 
                        didClose: () => {
                           handleRefresh()
                        }
                    })
                }
            }, 4000)
        }
    }

    const openModal = (req) => {
        setEditingRequest(req)
        setFormData({
            targetCompanyId: "", 
            requestType: req.request_type, 
            carbonUnitPrice: req.carbon_unit_price, 
            carbonQuantity: req.carbon_quantity, 
            requestReason: req.request_reason
        })
        setShowModal(true)
    }

    const closeModal = () => {
        setShowModal(false)
        setEditingRequest(null)
        resetForm()
    }

    const resetForm = () => {
        setFormData({
            targetCompanyId: "", 
            requestType: "Buy", 
            carbonUnitPrice: "", 
            carbonQuantity: "", 
            requestReason: ""
        })
    }

    const handleRefresh = async () => {
        Swal.fire({
			title: "Refreshing", 
			text: "Loading data", 
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
            fetchBalance()
            fetchRequests()
            fetchCompanies()
            Swal.close()
        }, 4000)
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-header-container" />
            <div className="dashboard-overview-container">
                <div className="dashboard-overview-container-left">
                    <div className="dashboard-subheader-container">
                        <p>ACCOUNT BALANCE</p>
                    </div>
                   {balance && <Balance data={balance} />}
                </div>
                <div className="dashboard-overview-container-right">
                    <Profile companyName={company.name} onLoaded={handleProfileLoaded} />
                </div>
            </div>
            <div className="dashboard-requests-header">
                <div className="dashboard-subheader-container">
                    <p>MY REQUESTS</p>
                </div>
                <div className="dashboard-requests-actions">
                    <button
                        className="refresh-request-btn"
                        onClick={() => handleRefresh()}
                    >
                        <FontAwesomeIcon icon={faRotate} size="lg" className="refresh-request-icon" />REFRESH
                    </button>

                    <button
                        className="create-request-btn"
                        onClick={() => {
                            setEditingRequest(false)
                            setShowModal(true)
                        }}
                    >
                        <FontAwesomeIcon icon={faSquarePlus} size="lg" className="create-request-icon" />CREATE REQUEST
                    </button>
                </div>
            </div>
            <div className="dashboard-requests-container">
                {requests.length === 0 ? (
                    <p className="no-data">No outstanding requests</p>
                ) : (
                    <SentRequestsTable 
                        requests={requests} 
                        API_URL={API_URL} 
                        axiosConfig={axiosConfig} 
                        openModal={openModal} 
                        handleEditRequest={handleEditRequest} 
                        handleDeleteRequest={handleDeleteRequest} />
                )}
                {showModal && editingRequest && (
                    <EditRequestModal 
                        formData={formData} 
                        setFormData={setFormData}  
                        closeModal={closeModal} 
                        handleEditRequest={handleEditRequest}
                    />
                )}
                {companies && showModal && !editingRequest && (
                    <CreateRequestModal 
                        formData={formData} 
                        setFormData={setFormData}  
                        companies={companies}
                        closeModal={closeModal} 
                        handleCreateRequest={handleCreateRequest}
                    />
                )}
            </div>
        </div>
    )
}

export default Landing
