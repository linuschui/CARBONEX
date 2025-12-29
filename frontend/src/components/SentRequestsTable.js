import "./SentRequestsTable.css"

function SentRequestsTable({ requests, openModal, handleDeleteRequest }) {
    return (
        <div className="dashboard-requests-inner-container">
            <div className="dashboard-requests-table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Target Company</th>
                            <th>Type</th>
                            <th>Price (SGD/Tonne)</th>
                            <th>Quantity (Tonnes)</th>
                            <th>Reason</th>
                            <th>Status</th>
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
                                 <span className={`badge ${req.status.toLowerCase()}`}>
                                    {req.status}
                                </span>
                            </td>
                            <td>
                                <button onClick={() => openModal(req)} className="action-btn edit">
                                    Edit
                                </button>
                                <button onClick={() => handleDeleteRequest(req.request_id)} className="action-btn delete" disabled={req.status.toLowerCase() === "deleted"}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default SentRequestsTable
