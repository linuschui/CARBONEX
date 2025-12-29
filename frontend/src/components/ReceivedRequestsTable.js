import "./ReceivedRequestsTable.css"

function ReceievedRequestsTable({ requests, handleRespondOne, selectedRequests, toggleSelectOne, toggleSelectAll }) {
    
    const isOverdue = (date) => {
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
        return new Date(date) < sevenDaysAgo
    }

    return (
        <div className="received-requests-inner-container">
            <div className="received-requests-table-container">
                <table>
                    <thead>
                        <tr>
                            <th>
                                <input 
                                    type="checkbox" 
                                    checked={selectedRequests.size === requests.length && requests.length > 0}
                                    onChange={toggleSelectAll}
                                />
                            </th>
                            <th>Created Date</th>
                            <th>Requestor Company</th>
                            <th>Type</th>
                            <th>Price (SGD/Tonne)</th>
                            <th>Quantity (Tonnes)</th>
                            <th>Total (SGD)</th>
                            <th>Reason</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map((req) => {
                            const total = parseFloat(req.carbon_unit_price) * parseFloat(req.carbon_quantity)
                            const overdue = isOverdue(req.request_date)
                            return (
                                <tr key={req.request_id}>
                                    <td>
                                        <input 
                                            type="checkbox" 
                                            checked={selectedRequests.has(req.request_id)}
                                            onChange={() => toggleSelectOne(req.request_id)}
                                        />
                                    </td>
                                    <td>
                                        {new Date(req.request_date).toLocaleDateString()}
                                        {overdue && <span className="badge overdue">OVERDUE</span>}
                                    </td>
                                    <td>{req.requestor_company_name}</td>
                                    <td>
                                        <span className={`badge ${req.request_type.toLowerCase()}`}>
                                            {req.request_type}
                                        </span>
                                    </td>
                                    <td>{parseFloat(req.carbon_unit_price).toFixed(2)}</td>
                                    <td>{parseFloat(req.carbon_quantity).toFixed(2)}</td>
                                    <td>{total.toFixed(2)}</td>
                                    <td>{req.request_reason}</td>
                                    <td>
                                        <button onClick={() => handleRespondOne(req.request_id, "accept")} className="action-btn accept">
                                            Accept
                                        </button>
                                        <button onClick={() => handleRespondOne(req.request_id, "reject")} className="action-btn reject">
                                            Reject
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ReceievedRequestsTable
