const express = require("express")
const router = express.Router()
const apiController = require("../controllers/apiController")

// Companies
router.get("/companies", apiController.getAllCompanies)

// Account balances
router.get("/account_balances", apiController.getAllBalances)

// Requests
router.get("/outstanding", apiController.getAllOutstandingRequests)
router.get("/received", apiController.getAllReceivedRequests)

module.exports = router
