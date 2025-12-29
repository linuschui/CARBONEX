import { useContext, useEffect, useState } from "react"
import { WebContext } from "../context/WebContext"

import axios from "axios"
import Swal from "sweetalert2"

import "./ReceivedRequests.css"

import ReceievedRequestsTable from "../components/ReceivedRequestsTable"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faRotate, faCircleCheck, faCircleXmark } from "@fortawesome/free-solid-svg-icons"


const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api"

function ReceivedRequests() {
    const { token, company, setLoading } = useContext(WebContext)
    console.log(token)
    console.log(company)

    // AXIOS CONFIGURATION
    const axiosConfig = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    useEffect(() => {
        setLoading(true)
        fetchRequests()
        setLoading(false)
    })

    // RECEIVED REQUEST
    const [requests, setRequests] = useState([])
    const fetchRequests = async () => {
        try { 
            const response = await axios.get(`${API_URL}/requests/received`, axiosConfig)
            console.log(response.data)
            setRequests(response.data)
        } catch (error) {
            console.error("❌ Error Fetching Received Requests: ", error)
        }
    }
    
    // OVERDUE ALERTS
    const checkOverdueRequests = async () => {
        try {
            const response = await axios.get(`${API_URL}/alerts/overdue`, axiosConfig)
            const overdueRequests = response.data
            console.log(overdueRequests)
            if (overdueRequests.length > 0) {
                Swal.fire({
                    icon: "warning",
                    title: "Overdue Requests",
                    html: `<p>You have ${overdueRequests.length} overdue request(s) pending for more than 7 days.</p>`,
                    background: "#0f0f0f",
                    color: "#ffffff",
                    confirmButtonText: "OK",
                    customClass: {
                        confirmButton: "custom-swal-button",
                        popup: "custom-popup",
                        title: "custom-title",
                        htmlContainer: "custom-text"
                    }
                })
            }
        } catch (error) {
            console.error("❌ Error fetching overdue requests: ", error)
        }
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
            checkOverdueRequests()
            fetchRequests()
            Swal.close()
        }, 4000)
    }
    
    // SINGLE RESPONSE
    const handleRespondOne = async (requestId, action) => {
        const result = await Swal.fire({
            icon: "warning",
            title: "Confirm Action",
            text: `${"Are you sure you want to " + action + " this request?"}`, 
            background: "#0f0f0f",
            color: "#ffffff",
            showCancelButton: true,
            confirmButtonText: "Yes",
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
                text: `${action === "accept" ? "Accepting request..." : "Rejecting request..."}`, 
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
                    const response = await axios.post(`${API_URL}/requests/${requestId}/respond/single`, {
                        action
                    }, axiosConfig)
                    console.log(response.data)
                    fetchRequests()
                    Swal.close()
                    Swal.fire({
                        icon: "success", 
                        title: `${action === "accept" ? "Request Accepted" : "Request Rejected"}`, 
                        text: `${"Request has been " + action + "ed successfully!"}`, 
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
                        title: `${"Error " + action + "ing Request"}`, 
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

    // MULTIPLE RESPONSES
    const [selectedRequests, setSelectedRequests] = useState(new Set())

    const toggleSelectOne = (requestId) => {
        const newSelection = new Set(selectedRequests)
        if (newSelection.has(requestId)) {
            newSelection.delete(requestId)
        } else {
            newSelection.add(requestId)
        }
        setSelectedRequests(newSelection)
    }

    const toggleSelectAll = () => {
        // Case 1 : all selected - unselect all
        if (requests.length === 0) {
            return
        } else if (selectedRequests.size === requests.length) {
            setSelectedRequests(new Set())
        // Case 2 : not all selected - select all
        } else {
            setSelectedRequests(new Set(requests.map((r) => r.request_id)))
        }
    }

    const handleRespondBulk = async (action) => {
        const result = await Swal.fire({
            icon: "warning",
            title: "Confirm Action",
            text: `${"Are you sure you want to " + action + " selected requests?"}`,
            background: "#0f0f0f",
            color: "#ffffff",
            showCancelButton: true,
            confirmButtonText: "Yes",
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
                text: `${action === "accept" ? "Accepting selected request..." : "Rejecting selected requests..."}`, 
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
            try {
                const response = await axios.post(`${API_URL}/requests/respond/bulk`, {
                        requestIds: Array.from(selectedRequests), 
                        action
                }, axiosConfig)
                console.log(response.data)
                fetchRequests()
                Swal.close()
                Swal.fire({
                    icon: "success", 
                    title: `${action === "accept" ? "Selected Requests Accepted" : "Selected Requests Rejected"}`, 
                    text: `${"Selected requests have been " +  action + "ed successfully!"}`, 
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
                    title: `${"Error " + action  + "ing Selected Requests"}`, 
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
        }
    }

    return (
        <div className="requests-container">
            <div className="requests-requests-header">
                <div className="requests-subheader-container">
                    <p>RECEIVED REQUESTS</p>
                </div>
                <div className="requests-requests-actions">
                    <button
                        className="refresh-request-btn"
                        onClick={() => handleRefresh()}
                    >
                        <FontAwesomeIcon icon={faRotate} size="lg" className="refresh-request-icon" />REFRESH
                    </button>
                    <button
                        className="accept-request-btn"
                        onClick={() => handleRespondBulk("accept")}
                    >
                        <FontAwesomeIcon icon={faCircleCheck} size="lg" className="accept-request-icon" />ACCEPT SELECTED
                    </button>
                    <button
                        className="reject-request-btn"
                        onClick={() => handleRespondBulk("reject")}
                    >
                        <FontAwesomeIcon icon={faCircleXmark} size="lg" className="reject-request-icon" />REJECT SELECTED
                    </button>
                </div>
            </div>
            <div className="requests-table-container">
                {requests && (<ReceievedRequestsTable requests={requests} selectedRequests={selectedRequests} handleRespondOne={handleRespondOne} toggleSelectOne={toggleSelectOne} toggleSelectAll={toggleSelectAll} />)}
            </div>
        </div>
    )
}

export default ReceivedRequests
