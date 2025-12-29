import { useContext, useEffect, useState } from "react"
import { WebContext } from "../context/WebContext"

import axios from "axios"
import "./Dashboard.css"

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api"

function Dashboard() {
	const { token, company } = useContext(WebContext)
	console.log(token)
    console.log(company.email)

    const [balance, setBalance] = useState(null)
    const [requests, setRequests] = useState([])
    const [companies, setCompanies] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [editingRequest, setEditingRequest] = useState(null)
    const [formData, setFormData] = useState({
        targetCompanyId: "",
        requestType: "Buy",
        carbonUnitPrice: "",
        carbonQuantity: "",
        requestReason: ""
    })

    const axiosConfig = {
        headers: { Authorization: `Bearer ${token}` }
    }

    useEffect(() => {
        fetchBalance()
        fetchRequests()
        fetchCompanies()
    }, [])

    const fetchBalance = async () => {
        try {
            const response = await axios.get(`${API_URL}/balance`, axiosConfig)
            setBalance(response.data)
        } catch (error) {
            console.error('Error fetching balance:', error)
        }
    }

    const fetchRequests = async () => {
        try {
        const response = await axios.get(`${API_URL}/requests/my`, axiosConfig)
        setRequests(response.data)
        } catch (error) {
        console.error('Error fetching requests:', error)
        }
    }

    const fetchCompanies = async () => {
        try {
        const response = await axios.get(`${API_URL}/companies`, axiosConfig)
        setCompanies(response.data)
        } catch (error) {
        console.error('Error fetching companies:', error)
        }
    }

    const handleCreateRequest = async (e) => {
        e.preventDefault()
        try {
            await axios.post(`${API_URL}/requests`, formData, axiosConfig)
            setShowModal(false)
            resetForm()
            fetchRequests()
            alert('Request created successfully!')
        } catch (error) {
            alert('Error creating request: ' + (error.response?.data?.error || 'Unknown error'))
        }
    }

    const handleEditRequest = async (e) => {
        e.preventDefault()
        try {
            await axios.put(`${API_URL}/requests/${editingRequest.request_id}`, {
                carbonUnitPrice: formData.carbonUnitPrice,
                carbonQuantity: formData.carbonQuantity,
                requestReason: formData.requestReason
            }, axiosConfig)
            setShowModal(false)
            setEditingRequest(null)
            resetForm()
            fetchRequests()
            alert('Request updated successfully!')
        } catch (error) {
            alert('Error updating request: ' + (error.response?.data?.error || 'Unknown error'))
        }
    }

    const handleDeleteRequest = async (requestId) => {
        if (!window.confirm('Are you sure you want to delete this request?')) return
        
        try {
            await axios.delete(`${API_URL}/requests/${requestId}`, axiosConfig)
            fetchRequests()
            alert('Request deleted successfully!')
        } catch (error) {
            alert('Error deleting request: ' + (error.response?.data?.error || 'Unknown error'))
        }
    }

    const openEditModal = (request) => {
        setEditingRequest(request)
        setFormData({
            targetCompanyId: '',
            requestType: request.request_type,
            carbonUnitPrice: request.carbon_unit_price,
            carbonQuantity: request.carbon_quantity,
            requestReason: request.request_reason
        })
        setShowModal(true)
    }

    const resetForm = () => {
        setFormData({
            targetCompanyId: '',
            requestType: 'Buy',
            carbonUnitPrice: '',
            carbonQuantity: '',
            requestReason: ''
        })
    }

    const closeModal = () => {
        setShowModal(false)
        setEditingRequest(null)
        resetForm()
    }
	console.log(requests)

  return (
    <div className="dashboard">
        <div className="dashboard-content">
            <div className="balance-section">
                <h3>Account Balance</h3>
                {balance ? (
                    <div className="balance-cards">
                    <div className="balance-card carbon">
                        <h4>Carbon Credits</h4>
                        <p className="balance-value">{parseFloat(balance.carbon_balance).toFixed(2)} tonnes</p>
                    </div>
                    <div className="balance-card cash">
                        <h4>Cash Balance</h4>
                        <p className="balance-value">SGD ${parseFloat(balance.cash_balance).toFixed(2)}</p>
                    </div>
                    </div>
                ) : (
                    <p>Loading balance...</p>
                )}
            </div>

            <div className="requests-section">
            <div className="section-header">
                <h3>My Outstanding Requests</h3>
                <button onClick={() => setShowModal(true)} className="create-button">
                + Create New Request
                </button>
            </div>

            {requests.length === 0 ? (
                <p className="no-data">No outstanding requests</p>
            ) : (
                <div className="requests-table">
                <table>
                    <thead>
                    <tr>
                        <th>Date</th>
                        <th>Target Company</th>
                        <th>Type</th>
                        <th>Price (SGD/tonne)</th>
                        <th>Quantity (tonnes)</th>
                        <th>Reason</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {requests.map((req) => (
                        <tr key={req.request_id}>
                        <td>{new Date(req.request_date).toLocaleDateString()}</td>
                        <td>{req.target_company_name}</td>
                        <td>
                            <span className={`badge ${req.request_type.toLowerCase()}`}>
                            {req.request_type}
                            </span>
                        </td>
                        <td>{parseFloat(req.carbon_unit_price).toFixed(2)}</td>
                        <td>{parseFloat(req.carbon_quantity).toFixed(2)}</td>
                        <td>{req.request_reason}</td>
                        <td>
                            <button onClick={() => openEditModal(req)} className="action-btn edit">
                            Edit
                            </button>
                            <button onClick={() => handleDeleteRequest(req.request_id)} className="action-btn delete">
                            Delete
                            </button>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            )}
            </div>
        </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{editingRequest ? 'Edit Request' : 'Create New Request'}</h3>
            <form onSubmit={editingRequest ? handleEditRequest : handleCreateRequest}>
              {!editingRequest && (
                <div className="form-group">
                  <label>Target Company</label>
                  <select
                    value={formData.targetCompanyId}
                    onChange={(e) => setFormData({...formData, targetCompanyId: e.target.value})}
                    required
                  >
                    <option value="">Select a company</option>
                    {companies.map((c) => (
                      <option key={c.company_id} value={c.company_id}>
                        {c.company_name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="form-group">
                <label>Request Type</label>
                <select
                  value={formData.requestType}
                  onChange={(e) => setFormData({...formData, requestType: e.target.value})}
                  disabled={!!editingRequest}
                >
                  <option value="Buy">Buy</option>
                  <option value="Sell">Sell</option>
                </select>
              </div>

              <div className="form-group">
                <label>Carbon Unit Price (SGD/tonne)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.carbonUnitPrice}
                  onChange={(e) => setFormData({...formData, carbonUnitPrice: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Carbon Quantity (tonnes)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.carbonQuantity}
                  onChange={(e) => setFormData({...formData, carbonQuantity: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Request Reason</label>
                <textarea
                  value={formData.requestReason}
                  onChange={(e) => setFormData({...formData, requestReason: e.target.value})}
                  rows="3"
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="button" onClick={closeModal} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  {editingRequest ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
