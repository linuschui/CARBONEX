const {
    sequelize, 
    OutstandingRequest, 
    RequestReceived
} = require("./index")

async function insertOverdueRequests(count = 5) {
    const t = await sequelize.transaction();
    try {
        for (let i = 0; i < count; i++) {
            const requestId = 1000 + i; // Unique request IDs
            const targetCompanyId = 6;   // Company that will receive the request
            const requestorCompanyId = 1; // Company sending the request
            const requestType = i % 2 === 0 ? 'Buy' : 'Sell';
            const carbonUnitPrice = 10 + i;
            const carbonQuantity = 50 + i * 10;
            const requestDate = new Date(Date.now() - (8 + i) * 24 * 60 * 60 * 1000); // 8+ days ago = overdue

            // Create request
            const newRequest = await OutstandingRequest.create({
                requestor_company_id: requestorCompanyId,
                target_company_id: targetCompanyId,
                request_type: requestType,
                carbon_unit_price: carbonUnitPrice,
                carbon_quantity: carbonQuantity,
                requestReason: "test", 
                request_date: requestDate
            }, { transaction: t });

            // Create received info
            await RequestReceived.create({
                request_id: newRequest.request_id,
                target_company_id: targetCompanyId
            }, { transaction: t });
        }

        await t.commit();
        console.log(`✅ Inserted ${count} overdue requests successfully`);
    } catch (err) {
        await t.rollback();
        console.error("❌ Error inserting overdue requests:", err);
    }
}

// Insert 5 overdue requests
insertOverdueRequests(5);
