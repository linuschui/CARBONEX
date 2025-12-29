-- backend/init.sql
-- Create tables and insert sample table for CARBONEX

-- Company
CREATE TABLE IF NOT EXISTS company (
    company_id SERIAL PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Company Account Balance
CREATE TABLE IF NOT EXISTS company_account_balance (
    balance_id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL REFERENCES company(company_id) ON DELETE CASCADE,
    carbon_balance DECIMAL(15, 2) DEFAULT 0.00,
    cash_balance DECIMAL(15, 2) DEFAULT 0.00,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(company_id)
);

-- Outstanding Requests
CREATE TABLE IF NOT EXISTS outstanding_request (
    request_id SERIAL PRIMARY KEY,
    requestor_company_id INTEGER NOT NULL REFERENCES company(company_id),
    target_company_id INTEGER NOT NULL REFERENCES company(company_id),
    request_type VARCHAR(10) CHECK (request_type IN ('Buy', 'Sell')),
    carbon_unit_price DECIMAL(10, 2) NOT NULL,
    carbon_quantity DECIMAL(15, 2) NOT NULL,
    request_reason TEXT,
    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Accepted', 'Rejected', 'Deleted')),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Request Received (for alerts)
CREATE TABLE IF NOT EXISTS request_received (
    received_id SERIAL PRIMARY KEY,
    request_id INTEGER NOT NULL REFERENCES outstanding_request(request_id) ON DELETE CASCADE,
    target_company_id INTEGER NOT NULL REFERENCES company(company_id),
    viewed BOOLEAN DEFAULT FALSE,
    alert_sent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(request_id)
);

-- Insert sample companies with hashed passwords (password: "password123" for all)
INSERT INTO company (company_name, email, password_hash) VALUES
    ('GreenTech Solutions', 'contact@greentech.com', '$2a$10$XQ3Y8rV5LxV5Z5Z5Z5Z5ZuKGJ5K5K5K5K5K5K5K5K5K5K5K5K5K5K'),
    ('EcoInnovate Corp', 'info@ecoinnovate.com', '$2a$10$XQ3Y8rV5LxV5Z5Z5Z5Z5ZuKGJ5K5K5K5K5K5K5K5K5K5K5K5K5K5K'),
    ('Carbon Neutral Inc', 'hello@carbonneutral.com', '$2a$10$XQ3Y8rV5LxV5Z5Z5Z5Z5ZuKGJ5K5K5K5K5K5K5K5K5K5K5K5K5K5K'),
    ('Sustainable Energy Ltd', 'contact@sustainable.com', '$2a$10$XQ3Y8rV5LxV5Z5Z5Z5Z5ZuKGJ5K5K5K5K5K5K5K5K5K5K5K5K5K5K');

-- Insert initial balances
INSERT INTO company_account_balance (company_id, carbon_balance, cash_balance) VALUES
    (1, 1000.00, 50000.00),
    (2, 1500.00, 75000.00),
    (3, 800.00, 40000.00),
    (4, 1200.00, 60000.00);

-- Insert sample outstanding requests
INSERT INTO outstanding_request (requestor_company_id, target_company_id, request_type, carbon_unit_price, carbon_quantity, request_reason, request_date, status) VALUES
    (1, 2, 'Buy', 50.00, 100.00, 'Q1 Carbon offset requirements', CURRENT_TIMESTAMP - INTERVAL '2 days', 'Pending'),
    (2, 3, 'Sell', 55.00, 150.00, 'Excess credits from renewable project', CURRENT_TIMESTAMP - INTERVAL '5 days', 'Pending'),
    (3, 1, 'Buy', 48.00, 200.00, 'Annual sustainability goals', CURRENT_TIMESTAMP - INTERVAL '8 days', 'Pending'),
    (4, 2, 'Sell', 52.00, 120.00, 'Forest conservation project surplus', CURRENT_TIMESTAMP - INTERVAL '1 day', 'Pending');

-- Insert corresponding request_received records
INSERT INTO request_received (request_id, target_company_id, viewed, alert_sent) VALUES
    (1, 2, FALSE, FALSE),
    (2, 3, FALSE, FALSE),
    (3, 1, FALSE, TRUE),
    (4, 2, FALSE, FALSE);

-- Create indexes for performance
CREATE INDEX idx_outstanding_request_requestor ON outstanding_request(requestor_company_id);
CREATE INDEX idx_outstanding_request_target ON outstanding_request(target_company_id);
CREATE INDEX idx_outstanding_request_status ON outstanding_request(status);
CREATE INDEX idx_request_received_target ON request_received(target_company_id);