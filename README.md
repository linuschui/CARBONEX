# CARBONEX

A full-stack web application for trading carbon credits between companies, built for DBS TechTrek 2026 Hackathon.

**🆕 Now uses Sequelize ORM for better code organization!** See [SEQUELIZE_SETUP.md](SEQUELIZE_SETUP.md) for details.

## 🚀 Features

### Implemented Requirements
- ✅ **[1] Login & Authentication** - JWT-based authentication
- ✅ **[2] Balance Display** - View carbon credits and cash balances
- ✅ **[3] Outstanding Requests** - Display all your company's pending requests
- ✅ **[4] Request Management** - Create, edit, and delete buy/sell requests
- ✅ **[5] Received Requests** - View requests from other companies
- ✅ **[6] Accept/Reject Requests** - Individual and bulk operations
- ✅ **[7] Overdue Alerts** - Notifications for requests older than 7 days

## 🛠️ Tech Stack

**Frontend:**
- React 18
- React Router 7.11.0
- React Router Dom 18.2.0
- Axios 1.13.2
- CSS3

**Backend:**
- Node.js
- Express.js
- PostgreSQL
- JWT Authentication
- bcryptjs

**DevOps:**
- Docker
- Docker Compose
- Nginx

## 📋 Prerequisites

- Docker Desktop installed
- Docker Compose installed
- Ports 3000, 5001, and 5432 available

## 🚀 Quick Start

### Option 1: Using Docker (Recommended)

#### 1. Clone and Setup

```bash
# Create project structure
mkdir carbon-credit-platform
cd carbon-credit-platform
```

#### 2. Create Directory Structure

```
carbon-credit-platform/
├── README.md
├── docker-compose.yml
├── backend/
│   ├── Dockerfile
│   ├── docker-entrypoint.sh
│   ├── package.json
│   ├── server.js
│   ├── setup-db.js
│   ├── .env
│   └── init.sql
└── frontend/
    ├── Dockerfile
    ├── nginx.conf
    ├── package.json
    ├── public/
    │   └── index.html
    └── src/
        ├── index.js
        ├── index.css
        ├── App.js
        ├── App.css
        └── cards/
            ├── BalanceCard.js
            └── BalanceCard.css
        └── components/
            ├── Balance.js
            ├── Balance.css
            ├── Navbar.js
            ├── Navbar.css
            ├── Profile.js
            ├── Profile.css
            ├── ReceivedRequestsTable.js
            ├── ReceivedRequestsTable.css
            ├── RequestModal.js
            ├── RequestModal.css
            ├── SentRequestsTable.js
            └── SentRequestsTable.css
        └── context/
            └── WebContext.jsx
        └── images/
            ├── carbonex.png
            ├── carbonex_mini.png
            ├── dbs.png
            └── mbfc.png
        └── pages/
            ├── Home.js
            ├── Landing.js
            ├── Landing.css
            ├── Login.js
            ├── Login.css
            ├── ReceivedRequests.js
            └── ReceivedRequests.css
        └── routers/
            ├── Routers.jsx
            └── Routers.css

```

#### 3. Start the Application

```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build
```

#### 4. Access the Application

- **Frontend:** localhost:3000
- **Backend API:** localhost:5001
- **Database:** localhost:5432

### Option 2: Running Locally Without Docker

#### Prerequisites
- Node.js 14+ installed
- PostgreSQL 12+ installed and running

#### 1. Setup PostgreSQL Database

```bash
# Start PostgreSQL service
# macOS: brew services start postgresql
# Ubuntu: sudo service postgresql start
# Windows: Start from Services

# Create database and user
psql -U postgres
```

In PostgreSQL prompt:
```sql
CREATE USER carbonuser WITH PASSWORD 'carbonpass123';
CREATE DATABASE carbon_credit_db OWNER carbonuser;
GRANT ALL PRIVILEGES ON DATABASE carbon_credit_db TO carbonuser;
\q
```

#### 2. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create .env file (use the provided .env template)
# Make sure DB_HOST=localhost

# Initialize database with sample data
npm run setup-db

# Start backend server
npm start
```

You should see:
```
Database connected successfully
Server running on port 5000
Environment: development
```

#### 3. Setup Frontend

```bash
# In a new terminal
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

Frontend will automatically open at http://localhost:3000

### 5. Login Credentials

Use these demo accounts:

| Company | Email | Password |
|---------|-------|----------|
| GreenTech Solutions | contact@greentech.com | password123 |
| EcoInnovate Corp | info@ecoinnovate.com | password123 |
| Carbon Neutral Inc | hello@carbonneutral.com | password123 |
| Sustainable Energy Ltd | contact@sustainable.com | password123 |

## 📊 Sample Data

The database is pre-populated with:
- 4 companies with different balances
- Sample outstanding requests between companies
- Request received records with alert status

## 🔧 Development

### Stop Services
```bash
docker-compose down
```

### Stop and Remove Volumes (Clean Reset)
```bash
docker-compose down -v
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

### Rebuild After Changes
```bash
docker-compose up --build
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - Login with email and password

### Balance
- `GET /api/balance` - Get current company balance

### Requests
- `GET /api/requests/my` - Get your company's requests
- `GET /api/requests/received` - Get requests from other companies
- `POST /api/requests` - Create new request
- `PUT /api/requests/:id` - Edit existing request
- `DELETE /api/requests/:id` - Delete request
- `POST /api/requests/:id/respond/single` - Accept/reject single request
- `POST /api/requests/respond/bulk` - Accept/reject bulk requests

### Alerts
- `GET /api/alerts/overdue` - Get overdue requests (>7 days)

### Utilities (Development Use)
- `GET /api/companies` - Get list of all companies
- `GET /api/account_balances` - Get list of all companies
- `GET /api/outstanding` - Get list of all companies
- `GET /api/received` - Get list of all companies

## 🎯 User Guide

### Dashboard Page
1. **View Balances** - See your carbon credits and cash
2. **Create Request** - Click "Create New Request" button
3. **Edit Request** - Click "Edit" on any pending request
4. **Delete Request** - Click "Delete" to remove a request

### Requests Received Page
1. **View Incoming Requests** - See all requests from other companies
2. **Overdue Alert** - Red banner shows unviewed requests older than 7 days
3. **Accept/Reject** - Individual buttons for each request
4. **Bulk Operations** - Select multiple requests and use bulk actions

## 🔐 Security Features

- JWT token authentication
- Password hashing (bcryptjs)
- Protected API routes
- CORS configuration
- Input validation

## 📝 Database Schema

### Tables
- `company` - Company information and credentials
- `company_account_balance` - Carbon and cash balances
- `outstanding_request` - All buy/sell requests
- `request_received` - Tracking received requests and alerts

## 📊 Database Models

### **Company Model**
```javascript
{
  company_id: INTEGER (PK),
  company_name: STRING,
  email: STRING,
  password_hash: STRING,
  created_at: TIMESTAMP
}
```

### **CompanyAccountBalance Model**
```javascript
{
  balance_id: INTEGER (PK),
  company_id: INTEGER (FK),
  carbon_balance: DECIMAL,
  cash_balance: DECIMAL,
  updated_at: TIMESTAMP
}
```

### **OutstandingRequest Model**
```javascript
{
  request_id: INTEGER (PK),
  requestor_company_id: INTEGER (FK),
  target_company_id: INTEGER (FK),
  request_type: ENUM('Buy', 'Sell'),
  carbon_unit_price: DECIMAL,
  carbon_quantity: DECIMAL,
  request_reason: TEXT,
  status: ENUM('Pending', 'Accepted', 'Rejected', 'Deleted'),
  request_date: TIMESTAMP,
  updated_at: TIMESTAMP
}
```

### **RequestReceived Model**
```javascript
{
  received_id: INTEGER (PK),
  request_id: INTEGER (FK),
  target_company_id: INTEGER (FK),
  viewed: BOOLEAN,
  alert_sent: BOOLEAN,
  created_at: TIMESTAMP
}
```

## 🐛 Troubleshooting

### Backend Server Exits Immediately

**Problem:** Server logs "Server running on port 5000" then exits

**Solution:**
1. Make sure PostgreSQL is running
2. Check database credentials in `.env`
3. Test database connection: `psql -h localhost -U carbonuser -d carbon_credit_db`
4. If database doesn't exist, run `npm run setup-db`

See **TROUBLESHOOTING.md** for detailed solutions.

### Port Already in Use
```bash
# Check what's using the port
lsof -i :3000
lsof -i :5000
lsof -i :5432

# Kill the process or change ports in docker-compose.yml
```

### Database Connection Issues

**Error: "ECONNREFUSED 127.0.0.1:5432"**
- PostgreSQL is not running. Start it first.

**Error: "database does not exist"**
```bash
# Create the database
psql -U postgres -c "CREATE DATABASE carbon_credit_db OWNER carbonuser;"
cd backend
npm run setup-db
```

### Docker Issues
```bash
# Reset everything
docker-compose down -v
docker-compose up --build

# View logs
docker-compose logs -f backend
```

## 🎨 Customization

### Change API URL
Edit `frontend/package.json`:
```json
"proxy": "http://your-backend-url:5000"
```

### Change Database Credentials
Edit `docker-compose.yml` environment variables

### Modify JWT Secret
Edit `backend/server.js` or use environment variable

## 📦 Production Deployment

For production:
1. Change JWT_SECRET to a strong random value
2. Use strong database passwords
3. Enable HTTPS
4. Set up proper logging
5. Configure rate limiting
6. Add input sanitization
7. Set up monitoring

## 🏆 Bonus Features (To Implement)

- [ ] **[B1]** Dashboard with visualizations
- [ ] **[B2]** Data insights and recommendations
- [ ] **[B3]** Multi-layer approval workflow

## 📄 License

MIT License - Feel free to use for the hackathon!

## 🤝 Contributing

This is a hackathon project. Feel free to fork and modify!

## 📞 Support

For issues or questions during the hackathon, check the logs:
```bash
docker-compose logs -f
```

---

**Built for DBS TechTrek 2026 Hackathon**

<br/>
<br/>
<img src="./frontend/src/images/carbonex_mini.png" alt="CARBONEX" width="300">
<br />
<img src="./frontend/src/images/dbs.png" alt="DBS" width="300">