const sequelize = require("../config/dbConfig")
const { DataTypes } = require("sequelize")

const Company = sequelize.define("Company", {
    company_id: {
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true
    }, 
    company_name: {
        type: DataTypes.STRING(255), 
        allowNull: false, 
        unique: true
    }, 
    email: {
        type: DataTypes.STRING(255), 
        allowNull: false, 
        unique: true
    }, 
    password_hash: {
        type: DataTypes.STRING(255), 
        allowNull: false
    }
}, {
    tableName: "company", 
    timestamps: true, 
    createdAt: "created_at", 
    updatedAt: false
})

const CompanyAccountBalance = sequelize.define("CompanyAccountBalance", {
    balance_id: {
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true
    }, 
    company_id: {
        type: DataTypes.INTEGER, 
        allowNull: false, 
        unique: true, 
        references: {
            model: "company", 
            key: "company_id"
        }
    }, 
    carbon_balance: {
        type: DataTypes.DECIMAL(15, 2), 
        defaultValue: 0.0
    }, 
    cash_balance: {
        type: DataTypes.DECIMAL(15, 2), 
        defaultValue: 0.0
    }
}, {
    tableName: "company_account_balance", 
    timestamps: true, 
    createdAt: false, 
    updatedAt: "updated_at"
})

const OutstandingRequest = sequelize.define("OutstandingRequest", {
    request_id: {
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true
    }, 
    requestor_company_id: {
        type: DataTypes.INTEGER, 
        allowNull: false, 
        references: {
            model: "company", 
            key: "company_id"
        }
    }, 
    target_company_id: {
        type: DataTypes.INTEGER, 
        allowNull: false, 
        references: {
            model: "company", 
            key: "company_id"
        }
    }, 
    request_type: {
        type: DataTypes.ENUM("Buy", "Sell"), 
        allowNull: false
    }, 
    carbon_unit_price: {
        type: DataTypes.DECIMAL(15, 2), 
        allowNull: false
    }, 
    carbon_quantity: {
        type: DataTypes.DECIMAL(15, 2), 
        allowNull: false
    }, 
    request_reason: {
        type: DataTypes.TEXT
    }, 
    status: {
        type: DataTypes.ENUM("Pending", "Accepted", "Rejected", "Deleted"), 
        defaultValue: "Pending"
    }
}, {
    tableName: "outstanding_request", 
    timestamps: true, 
    createdAt: "request_date", 
    updatedAt: "updated_at"
})

const RequestReceived = sequelize.define("RequestReceived", {
    received_id: {
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true
    }, 
    request_id: {
        type: DataTypes.INTEGER, 
        allowNull: false, 
        unique: true, 
        references: {
            model: "outstanding_request", 
            key: "request_id"
        }
    }, 
    target_company_id: {
        type: DataTypes.INTEGER, 
        allowNull: false, 
        references: {
            model: "company", 
            key: "company_id"
        }
    }, 
    viewed: {
        type: DataTypes.BOOLEAN, 
        defaultValue: false
    }, 
    alert_sent: {
        type: DataTypes.BOOLEAN, 
        defaultValue: false
    }
}, {
    tableName: "request_received", 
    timestamps: true, 
    createdAt: "created_at", 
    updatedAt: false
})

// Define Associations
Company.hasOne(CompanyAccountBalance, {
    foreignKey: "company_id", 
    as: "balance"
})

CompanyAccountBalance.belongsTo(Company, {
    foreignKey: "company_id",
    as: "company"
})

Company.hasMany(OutstandingRequest, {
    foreignKey: "requestor_company_id", 
    as: "sentRequests"
})

Company.hasMany(OutstandingRequest, {
    foreignKey: "target_company_id", 
    as: "receivedRequests"
})

OutstandingRequest.belongsTo(Company, {
    foreignKey: "requestor_company_id", 
    as: "requestor"
})

OutstandingRequest.belongsTo(Company, {
    foreignKey: "target_company_id", 
    as: "target"
})

OutstandingRequest.hasOne(RequestReceived, {
    foreignKey: "request_id", 
    as: "receivedInfo"
})

RequestReceived.belongsTo(OutstandingRequest, {
    foreignKey: "request_id", 
    as: "request"
})

module.exports = {
    sequelize, 
    Company, 
    CompanyAccountBalance, 
    OutstandingRequest, 
    RequestReceived
}
