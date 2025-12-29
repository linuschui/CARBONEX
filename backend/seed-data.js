const bcrypt = require('bcryptjs')
const {
    sequelize,
    Company,
    CompanyAccountBalance,
    OutstandingRequest,
    RequestReceived
} = require('./models')

async function seedDatabase() {
    try {
        console.log("Starting database synchronization...")
        
        // Sync all models (create tables)
        await sequelize.sync({ 
            force: true 
        })
        console.log("✅ Database synchronized successfully!")
        const passwordHash = await bcrypt.hash('password123', 10);

        // Step 1 : Seed Companies
        console.log("Seeding companies...")
        const companies = await Company.bulkCreate([
            {
                company_name: "GreenTech Solutions",
                email: "contact@greentech.com",
                password_hash: passwordHash
            },
            {
                company_name: "EcoInnovate Corp",
                email: "info@ecoinnovate.com",
                password_hash: passwordHash
            },
            {
                company_name: "Carbon Neutral Inc",
                email: "hello@carbonneutral.com",
                password_hash: passwordHash
            },
            {
                company_name: "Sustainable Energy Ltd",
                email: "contact@sustainable.com",
                password_hash: passwordHash
            }
        ])
        console.log(`✅ Created ${companies.length} companies`);

        console.log("Seeding account balances...")
        await CompanyAccountBalance.bulkCreate([
            { 
                company_id: 1, 
                carbon_balance: 1000.00, 
                cash_balance: 50000.00 
            },
            { 
                company_id: 2, 
                carbon_balance: 1500.00, 
                cash_balance: 75000.00 
            },
            { 
                company_id: 3, 
                carbon_balance: 800.00, 
                cash_balance: 40000.00 
            },
            { 
                company_id: 4, 
                carbon_balance: 1200.00, 
                cash_balance: 60000.00 
            }
        ])
        console.log("✅ Account balances created")

        console.log("Seeding outstanding requests...")
        const requests = await OutstandingRequest.bulkCreate([
            {
                requestor_company_id: 1,
                target_company_id: 2,
                request_type: 'Buy',
                carbon_unit_price: 50.00,
                carbon_quantity: 100.00,
                request_reason: 'Q1 Carbon offset requirements',
                request_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
                status: 'Pending'
            },
            {
                requestor_company_id: 2,
                target_company_id: 3,
                request_type: 'Sell',
                carbon_unit_price: 55.00,
                carbon_quantity: 150.00,
                request_reason: 'Excess credits from renewable project',
                request_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
                status: 'Pending'
            },
            {
                requestor_company_id: 3,
                target_company_id: 1,
                request_type: 'Buy',
                carbon_unit_price: 48.00,
                carbon_quantity: 200.00,
                request_reason: 'Annual sustainability goals',
                request_date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago (overdue)
                status: 'Pending'
            },
            {
                requestor_company_id: 4,
                target_company_id: 2,
                request_type: 'Sell',
                carbon_unit_price: 52.00,
                carbon_quantity: 120.00,
                request_reason: 'Forest conservation project surplus',
                request_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
                status: 'Pending'
            }
        ]);
        console.log(`✅ Created ${requests.length} outstanding requests`)

        console.log("Seeding request received records...")
        await RequestReceived.bulkCreate([
            { 
                request_id: 1, 
                target_company_id: 2, 
                viewed: false, 
                alert_sent: false 
            },
            { 
                request_id: 2, 
                target_company_id: 3, 
                viewed: false, 
                alert_sent: false 
            },
            { 
                request_id: 3, 
                target_company_id: 1, 
                viewed: false, alert_sent: true 
            },
            { 
                request_id: 4, 
                target_company_id: 2, 
                viewed: false, 
                alert_sent: false 
            }
        ])
        console.log('✅ Request received records created')

        console.log("\n✅ Database seeded successfully!");
        console.log("\nTest Accounts (all use password: password123):")
        console.log("   1. contact@greentech.com")
        console.log("   2. info@ecoinnovate.com")
        console.log("   3. hello@carbonneutral.com")
        console.log("   4. contact@sustainable.com")

    } catch (error) {
        console.error("❌ Error seeding database: ", error)
        throw error
    } finally {
        await sequelize.close()
    }
}

// Run if called directly
if (require.main === module) {
    seedDatabase()
        .then(() => process.exit(0))
        .catch((error) => {
        console.error(error)
        process.exit(1)
        })
}

module.exports = seedDatabase
