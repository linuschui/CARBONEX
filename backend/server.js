// ENVIRONMENT VARIABLES
require("dotenv").config()

// EXPRESS APPLICATION
const express = require("express")
const app = express()
const PORT = process.env.PORT || 5001
app.use(express.json())

// CORS
const cors = require("cors")
const corsOptions = require("./config/corsOptions")
app.use(cors(corsOptions))

// START SERVER
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`)
    console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`)
})

// DATABASE CONNECTION
const {
    sequelize, 
    Company, 
    CompanyAccountBalance, 
    OutstandingRequest, 
    RequestReceived
} = require("./models")
sequelize.authenticate()
    .then(() => {
        console.log("✅ Database Connected Successfully")
        return sequelize.sync({
            alter: false // Don't alter in production
        })
    })
    .then(() => {
        console.log("✅ Models Synchronized")
    })
    .catch(error => {
        console.error("❌ Database Connection Error: ", error)
    })

const { Op } = require("sequelize")


// AUTHENTICATION
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const JWT_SECRET = process.env.JWT_SECRET || "secret-key"
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1]
    if (!token) return res.status(401).json({
        error: "❌ Access Denied"
    })
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({
            error: "❌ Invalid Token"
        })
        req.user = user
        next()
    })
}

// DEFAULT ENDPOINT
app.get("/", (req, res) => {
    return res.status(200).json({
        message: "200 OK"
    })
})

// ROUTES
const apiRoutes = require("./routes/apiRoutes")
app.use("/api", apiRoutes)

// [1] : Register/Login + Authentication (JWT) - DONE
const authRoutes = require("./routes/authRoutes")
app.use("/api/auth", authRoutes)

// [2] : Company Outstanding Balance
app.get("/api/balance", authenticateToken, async (req, res) => {
    try {
        const result = await Company.findOne({
            where: { 
                company_id: req.user.companyId 
            },
            include: [{
                model: CompanyAccountBalance,
                as: "balance",
                attributes: ["carbon_balance", "cash_balance"]
            }]
        })
        
        if (!result) {
            return res.status(404).json({
                error: "❌ Balance Not Found"
            })
        }

        res.json({
            company_name: result.company_name, 
            carbon_balance: result.balance.carbon_balance, 
            cash_balance: result.balance.cash_balance
        })
    } catch (error) {
        console.error("❌ Balance Fetch Error: ", error)
        res.status(500).json({
            error: "❌ Server Error"
        })
    }
})

// [3] : User's Outstanding Requests
app.get("/api/requests/my", authenticateToken, async (req, res) => {
    try {
        const requests = await OutstandingRequest.findAll({
            where: {
                requestor_company_id: req.user.companyId, 
                // status: "Pending"
            }, 
            include: [{
                model: Company, 
                as: "target", 
                attributes: ["company_name"]
            }], 
            order: [["request_date", "DESC"]]
        })

        const formattedRequests = requests.map(req => ({
            request_id: req.request_id, 
            target_company_name: req.target.company_name, 
            request_type: req.request_type, 
            carbon_unit_price: req.carbon_unit_price, 
            carbon_quantity: req.carbon_quantity, 
            request_reason: req.request_reason, 
            request_date: req.request_date, 
            status: req.status
        }))

        res.json(formattedRequests)
    } catch (error) {
        console.error("❌ Fetch Requests Error: ", error)
        res.status(500).json({
            error: "❌ Server Error"
        })
    }
})

// [4a] : Create New Request
app.post("/api/requests", authenticateToken, async (req, res) => {
    const transaction = await sequelize.transaction()
    try {
        const { targetCompanyId, requestType, carbonUnitPrice, carbonQuantity, requestReason } = req.body

        const newRequest = await OutstandingRequest.create({
            requestor_company_id: req.user.companyId, 
            target_company_id: targetCompanyId, 
            request_type: requestType, 
            carbon_unit_price: carbonUnitPrice, 
            carbon_quantity: carbonQuantity, 
            request_reason: requestReason
        }, {
            transaction
        })

        await RequestReceived.create({
            request_id: newRequest.request_id, 
            target_company_id: targetCompanyId
        }, {
            transaction
        })
        
        await transaction.commit()
        res.status(201).json(newRequest)
    } catch (error) {
        await transaction.rollback()
        console.error("❌ Create Request Error: ", error)
        res.status(500).json({
            error: error
        })
    }
})


// [4b] : Edit Request
app.put("/api/requests/:id", authenticateToken, async (req, res) => {
    try {
        const { id } = req.params
        const { carbonUnitPrice, carbonQuantity, requestReason } = req.body
        const [ updated ] = await OutstandingRequest.update(
            {
                carbon_unit_price: carbonUnitPrice, 
                carbon_quantity: carbonQuantity, 
                request_reason: requestReason
            }, {
                where: {
                    request_id: id, 
                    requestor_company_id: req.user.companyId, 
                    // status: "Pending"
                }
            }
        )
        
        if (updated === 0) {
            return res.status(404).json({
                error: "Request Not Found Or Cannot Be Edited"
            })
        }
        
        const updatedRequest = await OutstandingRequest.findByPk(id)
        res.json(updatedRequest)
    } catch (error) {
        console.error("❌ Edit Request Error: ", error)
        res.status(500).json({
            error: "❌ Server Error"
        })
    }
})

// [4c] : Delete Request
app.delete("/api/requests/:id", authenticateToken, async (req, res) => {
    try { 
        const { id } = req.params
        const [ updated ] = await OutstandingRequest.update(
            { 
                status: "Deleted" 
            }, 
            { 
                where: {
                    request_id: id, 
                    requestor_company_id: req.user.companyId, 
                    status: "Pending"
                }
            }
        )

        if (updated === 0) {
            return res.status(404).json({
                error: "Request Not Found Or Cannot Be Edited"
            })
        }
        
        res.json({
            message: "Request Deleted Successfully"
        })
    } catch (error) {
        console.error("❌ Delete Request Error: ", error)
        res.status(500).json({
            error: "❌ Server Error"
        })
    }
})

// [5] : Get Requests From Other Compainies
app.get("/api/requests/received", authenticateToken, async (req, res) => {
    try { 
        const requests = await OutstandingRequest.findAll({
            where: {
                target_company_id: req.user.companyId, 
                status: "Pending"
            },
            include: [
                {
                    model: Company, 
                    as: "requestor", 
                    attributes: ["company_name"]
                }, 
                {
                    model: RequestReceived, 
                    as: "receivedInfo", 
                    attributes: ["viewed"]
                }
            ],
            order: [["request_date", "DESC"]]
        })

        const formattedRequests = requests.map(req => ({
            request_id: req.request_id, 
            requestor_company_name: req.requestor.company_name, 
            request_type: req.request_type, 
            carbon_unit_price: req.carbon_unit_price, 
            carbon_quantity: req.carbon_quantity, 
            request_reason: req.request_reason, 
            status: req.status, 
            viewed: req.receivedInfo ? req.receivedInfo.viewed : false, 
            request_date: req.request_date
        }))
        res.json(formattedRequests)
    } catch (error) {
        console.error("Fetch Received Requests Error: ", error)
        res.status(500).json({
            error: "Server Error"
        })
    }
})

// [6a] : Accept/Reject Request (Single)
app.post("/api/requests/:id/respond/single", authenticateToken, async (req, res) => {
    const transaction = await sequelize.transaction()

    try {
        const { id } = req.params
        const { action } = req.body

        const request = await OutstandingRequest.findOne({
            where: {
                request_id: id, 
                target_company_id: req.user.companyId, 
                status: "Pending"
            }, transaction
        })

        if (!request) {
            await transaction.rollback()
            return res.status(404).json({
                error: "Request Not Found"
            })
        }

        const newStatus = action === "accept" ? "Accepted" : "Rejected"

        if (action === "accept") {
            const totalAmount = parseFloat(request.carbon_unit_price) * parseFloat(request.carbon_quantity)

            // Case 1 : Current User Sells
            if (request.request_type === "Buy") {
                await CompanyAccountBalance.decrement(
                    {
                        carbon_balance: request.carbon_quantity
                    }, 
                    {
                        where: {
                            company_id: req.user.companyId
                        }, 
                        transaction
                    }
                )
                await CompanyAccountBalance.increment(
                    {
                        cash_balance: totalAmount
                    }, 
                    {
                        where: {
                            company_id: req.user.companyId
                        }, 
                        transaction
                    }
                )
                await CompanyAccountBalance.increment(
                    {
                        carbon_balance: request.carbon_quantity
                    }, 
                    {
                        where: {
                            company_id: request.requestor_company_id
                        }, 
                        transaction
                    }
                )
                await CompanyAccountBalance.decrement(
                    {
                        cash_balance: totalAmount
                    }, 
                    {
                        where: {
                            company_id: request.requestor_company_id
                        }, 
                        transaction
                    }
                )
            // Case 2 : Current User Buys
            } else {
                await CompanyAccountBalance.increment(
                    {
                        carbon_balance: request.carbon_quantity
                    }, 
                    {
                        where: {
                            company_id: req.user.companyId
                        }, 
                        transaction
                    }
                )
                await CompanyAccountBalance.decrement(
                    {
                        cash_balance: totalAmount
                    }, 
                    {
                        where: {
                            company_id: req.user.companyId
                        }, 
                        transaction
                    }
                )
                await CompanyAccountBalance.decrement(
                    {
                        carbon_balance: request.carbon_quantity
                    }, 
                    {
                        where: {
                            company_id: request.requestor_company_id
                        }, 
                        transaction
                    }
                )
                await CompanyAccountBalance.increment(
                    {
                        cash_balance: totalAmount
                    }, 
                    {
                        where: {
                            company_id: request.requestor_company_id
                        }, 
                        transaction
                    }
                )
            }
        }
        await request.update({ 
                status: newStatus
            }, {
                transaction
            })

        await transaction.commit()

        res.json({
            message: `Request ${newStatus} Successfully`
        })
    } catch (error) {
        await transaction.rollback()
        console.error("❌ Respond To Request Error: ", error)
        res.status(500).json({
            error: "❌ Server Errror"
        })
    }
})

// [6b] : Accept/Reject Request (Bulk)
app.post("/api/requests/respond/bulk", authenticateToken, async (req, res) => {
    const transaction = await sequelize.transaction()
    try {
        const { requestIds, action } = req.body
        if (!Array.isArray(requestIds) || requestIds.length === 0) {
            await transaction.rollback()
            return res.status(400).json({ error: "No requests selected" })
        }

        const newStatus = action === "accept" ? "Accepted" : "Rejected"

        for (const id of requestIds) {
            const request = await OutstandingRequest.findOne({
                where: {
                    request_id: id,
                    target_company_id: req.user.companyId,
                    status: "Pending"
                },
                transaction
            })

            if (!request) {
                throw new Error(`Request ${id} Not Found`)
            }

            if (action === "accept") {
                const totalAmount = parseFloat(request.carbon_unit_price) * parseFloat(request.carbon_quantity)

                if (request.request_type === "Buy") {
                    await CompanyAccountBalance.decrement(
                        { carbon_balance: request.carbon_quantity },
                        { where: { company_id: req.user.companyId }, transaction }
                    )
                    await CompanyAccountBalance.increment(
                        { cash_balance: totalAmount },
                        { where: { company_id: req.user.companyId }, transaction }
                    )
                    await CompanyAccountBalance.increment(
                        { carbon_balance: request.carbon_quantity },
                        { where: { company_id: request.requestor_company_id }, transaction }
                    )
                    await CompanyAccountBalance.decrement(
                        { cash_balance: totalAmount },
                        { where: { company_id: request.requestor_company_id }, transaction }
                    )
                } else {
                    await CompanyAccountBalance.increment(
                        { carbon_balance: request.carbon_quantity },
                        { where: { company_id: req.user.companyId }, transaction }
                    )
                    await CompanyAccountBalance.decrement(
                        { cash_balance: totalAmount },
                        { where: { company_id: req.user.companyId }, transaction }
                    )
                    await CompanyAccountBalance.decrement(
                        { carbon_balance: request.carbon_quantity },
                        { where: { company_id: request.requestor_company_id }, transaction }
                    )
                    await CompanyAccountBalance.increment(
                        { cash_balance: totalAmount },
                        { where: { company_id: request.requestor_company_id }, transaction }
                    )
                }
            }

            await request.update({ status: newStatus }, { transaction })
        }

        await transaction.commit()
        res.json({ message: `Requests ${newStatus} successfully` })

    } catch (error) {
        if (!transaction.finished) await transaction.rollback()
        console.error("❌ Respond To Request Error: ", error)
        res.status(500).json({ error: error.message || "❌ Server Error" })
    }
})


// [7] Get Overdue Alerts
app.get("/api/alerts/overdue", authenticateToken, async (req, res) => {
    const transaction = await sequelize.transaction()
    try {
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

        // Fetch requests with their corresponding received info
        const requests = await OutstandingRequest.findAll({
            where: {
                target_company_id: req.user.companyId,
                status: "Pending",
                request_date: {
                    [Op.lte]: sevenDaysAgo
                }
            },
            include: [
                {
                    model: Company,
                    as: "requestor",
                    attributes: ["company_name"]
                },
                {
                    model: RequestReceived,
                    as: "receivedInfo",
                    attributes: ["received_id", "viewed"]  // include received_id explicitly
                }
            ],
            order: [["request_date", "ASC"]],
            transaction
        })

        // Only pick requests that have not been viewed
        const notViewedRequests = requests.filter(r => r.receivedInfo && !r.receivedInfo.viewed)
        const notViewedIds = notViewedRequests.map(r => r.receivedInfo.received_id).filter(Boolean)

        if (notViewedIds.length > 0) {
            // Mark them as viewed
            await RequestReceived.update(
                { viewed: true },
                {
                    where: { received_id: notViewedIds },
                    transaction
                }
            )
        }

        await transaction.commit()

        // Return formatted requests, set viewed explicitly to true
        const formattedRequests = notViewedRequests.map(req => ({
            request_id: req.request_id,
            requestor_company_name: req.requestor.company_name,
            request_type: req.request_type,
            carbon_unit_price: req.carbon_unit_price,
            carbon_quantity: req.carbon_quantity,
            request_date: req.request_date,
            viewed: true  // explicitly return true
        }))

        res.json(formattedRequests)
    } catch (error) {
        await transaction.rollback()
        console.error("❌ Fetch Overdue Alerts Error: ", error)
        res.status(500).json({ error: "❌ Server Error" })
    }
})


// GRACEFUL SHUTDOWN
process.on("SIGTERM", () => {
    console.log("SIGTERM signal received: closing HTTP server")
    server.close(() => {
        console.log("HTTP Server Closed")
        sequelize.close().then(() => {
            console.log("Database Connection Closed")
            process.exit(0)
        })
    })
})

process.on("SIGINT", () => {
    console.log("SIGINT signal received: closing HTTP server")
    server.close(() => {
        console.log("HTTP Server Closed")
        sequelize.close().then(() => {
            console.log("Database Connection Closed")
            process.exit(0)
        })
    })
})
