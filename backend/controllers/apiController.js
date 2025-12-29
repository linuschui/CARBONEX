const {
  Company,
  CompanyAccountBalance,
  OutstandingRequest,
  RequestReceived
} = require("../models")

// ---------- Companies ----------
exports.getAllCompanies = async (req, res) => {
    try {
        const companies = await Company.findAll({ 
            order: [["company_id", "ASC"]] 
        })
        res.status(200).json(companies)
    } catch (error) {
        console.error("Error fetching companies:", error)
        res.status(500).json({ error: "Server Error" })
    }
}

// ---------- Account Balances ----------
exports.getAllBalances = async (req, res) => {
    try {
        const balances = await CompanyAccountBalance.findAll({ 
            order: [["company_id", "ASC"]] 
        })
        res.status(200).json(balances)
    } catch (error) {
        console.error("Error fetching account balances:", error)
        res.status(500).json({ error: "Server Error" })
    }
}

// ---------- Outstanding Requests ----------
exports.getAllOutstandingRequests = async (req, res) => {
    try {
        const requests = await OutstandingRequest.findAll({ order: [["request_id", "ASC"]] })
        res.status(200).json(requests)
    } catch (error) {
        console.error("Error fetching outstanding requests:", error)
        res.status(500).json({ error: "Server Error" })
    }
}

// ---------- Received Requests ----------
exports.getAllReceivedRequests = async (req, res) => {
    try {
        const requests = await RequestReceived.findAll({ 
            order: [["received_id", "ASC"]] 
        })
        res.status(200).json(requests)
    } catch (error) {
        console.error("Error fetching received requests:", error)
        res.status(500).json({ error: "Server Error" })
    }
}
