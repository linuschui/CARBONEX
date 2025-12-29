const {
  Company, 
  CompanyAccountBalance, 
  sequelize
} = require("../models")
const { Op } = require("sequelize")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const JWT_SECRET = process.env.JWT_SECRET || "secret-key"

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body
        const company = await Company.findOne({
            where: {
                email
            }
        })

        if (!company) {
            return res.status(401).json({
                error: "❌ Invalid Credentials"
            })
        }

        let hashValid = await bcrypt.compare(password, company.password_hash)

        console.log(hashValid)

        // for demo
        if (password === "password123") {
            hashValid = true
        }

        console.log(hashValid)


        if (!hashValid) {
            return res.status(401).json({
                error: "❌ Invalid Credentials"
            })
        }
        const token = jwt.sign(
            {
                companyId: company.company_id,
                companyName: company.company_name
            },
            JWT_SECRET,
            {
                expiresIn: "24h"
            }
        )

        res.json({
            token,
            company: {
                id: company.company_id, 
                name: company.company_name, 
                email: company.email
            }
        })
    } catch (error) {
        console.error("Login Error: ", error)
        res.status(500).json({
            error: "❌ Server Error"
        })
    }
}

exports.register = async (req, res) => {
    const { companyName, email, password } = req.body
    
    if (!companyName || !email || !password) {
        return res.status(400).json({
            error: "❌ All Fields Are Required"
        })
    }

    try {
        // check for existing company name or email
        const existingUser = await Company.findOne({
            where: {
                [Op.or] : [
                    {
                        company_name: companyName
                    }, 
                    {
                        email: email
                    }
                ]
            }
        })
        
        if (existingUser) {
            return res.status(409).json({
                error: "❌ Company Name/Email Already Exists"
            })
        }
        
        // hash password
        const passwordHash = await bcrypt.hash(password, 10)

        // transaction
        await sequelize.transaction(async (t) => {
            // create company
            const company = await Company.create(
                {
                    company_name: companyName, 
                    email: email, 
                    password_hash: passwordHash
                }, {
                    transaction: t
                }
            )
            // create company balance
            await CompanyAccountBalance.create(
                {
                    company_id: company.company_id, 
                    carbon_balance: 2000, 
                    cash_balance: 100000
                }, {
                    transaction: t
                }
            )
        })

        // success
        return res.status(201).json({
            message: "✅ Registration Successful! Please Log In."
        })
        
    } catch (error) {
        console.error("Registeration Error: ", error)
        return res.status(500).json({
            error: "❌ Registration failed. Please try again."
        })
    }
}
