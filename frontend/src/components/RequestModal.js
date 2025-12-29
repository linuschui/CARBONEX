import "./RequestModal.css"

function CreateRequestModal({ formData, setFormData, companies, closeModal, handleCreateRequest }) {

    return (
        <div className="modal-overlay" onClick={() => closeModal()}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <form onSubmit={handleCreateRequest}>
                    <h3>Create Request</h3>
                    <div className="modal-form-group">
                        <label>Target Company</label>
                        <select 
                            value={formData.targetCompanyId} 
                            onChange={(e) => setFormData({...formData, targetCompanyId: e.target.value})}
                            required
                        >
                            <option value="">Select a company</option>
                            {companies.map((c) => (
                                <option 
                                    key={c.company_id} 
                                    value={c.company_id}>
                                        {c.company_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="modal-form-group">
                        <label>Request Type</label>
                        <select 
                            value={formData.requestType} 
                            onChange={(e) => setFormData({...formData, requestType: e.target.value})}
                            disabled={false}
                        >
                            <option value="Buy">Buy</option>
                            <option value="Sell">Sell</option>
                        </select>
                    </div>

                    <div className="modal-form-group">
                        <label>Carbon Unit Price (SGD/Tonne)</label>
                        <input 
                            type="number"
                            step="0.01" 
                            value={formData.carbonUnitPrice} 
                            onChange={(e) => setFormData({...formData, carbonUnitPrice: e.target.value})}
                            required
                        />
                    </div>

                    <div className="modal-form-group">
                        <label>Carbon Quantity (Tonne)</label>
                        <input 
                            type="number"
                            step="0.01" 
                            value={formData.carbonQuantity} 
                            onChange={(e) => setFormData({...formData, carbonQuantity: e.target.value})}
                            required
                        />
                    </div>

                    <div className="modal-form-group">
                        <label>Request Reason</label>
                        <textarea 
                            value={formData.requestReason}
                            onChange={(e) => setFormData({...formData, requestReason: e.target.value})}
                            rows="3" 
                            required
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="button" onClick={closeModal} className="modal-cancel-btn">
                            Cancel
                        </button>
                        <button type="submit" className="modal-submit-btn">
                            Create
                        </button>
                    </div>

                </form>
            </div>
        </div>
    )
}

function EditRequestModal({ formData, setFormData, closeModal, handleEditRequest }) {

    return (
        <div className="modal-overlay" onClick={() => closeModal()}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <form onSubmit={handleEditRequest}>
                    <h3>Edit Request</h3>
                    <div className="modal-form-group">
                        <label>Request Type</label>
                        <select 
                            value={formData.requestType} 
                            onChange={(e) => setFormData({...formData, requestType: e.target.value})}
                            disabled={true}
                        >
                            <option value="Buy">Buy</option>
                            <option value="Sell">Sell</option>
                        </select>
                    </div>

                    <div className="modal-form-group">
                        <label>Carbon Unit Price (SGD/Tonne)</label>
                        <input 
                            type="number"
                            step="0.01" 
                            value={formData.carbonUnitPrice} 
                            onChange={(e) => setFormData({...formData, carbonUnitPrice: e.target.value})}
                            required
                        />
                    </div>

                    <div className="modal-form-group">
                        <label>Carbon Quantity (Tonne)</label>
                        <input 
                            type="number"
                            step="0.01" 
                            value={formData.carbonQuantity} 
                            onChange={(e) => setFormData({...formData, carbonQuantity: e.target.value})}
                            required
                        />
                    </div>

                    <div className="modal-form-group">
                        <label>Request Reason</label>
                        <textarea 
                            value={formData.requestReason}
                            onChange={(e) => setFormData({...formData, requestReason: e.target.value})}
                            rows="3" 
                            required
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="button" onClick={closeModal} className="modal-cancel-btn">
                            Cancel
                        </button>
                        <button type="submit" className="modal-submit-btn">
                            Update
                        </button>
                    </div>

                </form>
            </div>
        </div>
    )
}

export { 
    CreateRequestModal, 
    EditRequestModal
}
