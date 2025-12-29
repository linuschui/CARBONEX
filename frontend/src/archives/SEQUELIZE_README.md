# Carbon Credit Trading Platform - Sequelize Setup

This version uses **Sequelize ORM** instead of raw SQL queries for better code organization and maintainability.

## 📁 Updated Project Structure

```
carbon-credit-platform/
├── docker-compose.yml
├── backend/
│   ├── Dockerfile
│   ├── docker-entrypoint.sh          # ← NEW: Handles DB initialization
│   ├── package.json
│   ├── server.js                      # ← UPDATED: Uses Sequelize
│   ├── seed-data.js                   # ← NEW: Seeds database with sample data
│   ├── .env
│   ├── config/
│   │   └── database.js                # ← NEW: Sequelize configuration
│   └── models/
│       └── index.js                   # ← NEW: Sequelize models
└── frontend/
    ├── Dockerfile
    ├── nginx.conf
    ├── package.json
    ├── public/
    │   └── index.html
    └── src/
        ├── index.js
        ├── App.js
        ├── App.css
        └── components/
            ├── Login.js
            ├── Login.css
            ├── Dashboard.js
            ├── Dashboard.css
            ├── RequestsReceived.js
            └── RequestsReceived.css
```

## 🆕 What's Changed?

### **Removed Files:**
- ❌ `backend/init.sql` - No longer needed
- ❌ `backend/setup-db.js` - Replaced by seed-data.js

### **New Files:**
- ✅ `backend/config/database.js` - Sequelize database connection
- ✅ `backend/models/index.js` - Sequelize models (Company, Balance, Request, etc.)
- ✅ `backend/seed-data.js` - Populates database with sample data
- ✅ `backend/docker-entrypoint.sh` - Automatically seeds DB on first run

### **Updated Files:**
- ✅ `backend/server.js` - Now uses Sequelize queries instead of raw SQL
- ✅ `backend/package.json` - Added Sequelize dependencies
- ✅ `backend/Dockerfile` - Uses entrypoint script
- ✅ `docker-compose.yml` - Removed init.sql volume mount

## 🚀 Quick Start with Docker

### **Step 1: Create Project Structure**

```bash
mkdir carbon-credit-platform
cd carbon-credit-platform

# Create folders
mkdir -p backend/config
mkdir -p backend/models
mkdir -p frontend/src/components
mkdir -p frontend/public
```

### **Step 2: Copy All Files**

Copy the files into this structure:
- Root level: `docker-compose.yml`
- Backend files into `backend/` folder
- Frontend files into `frontend/` folder

### **Step 3: Make Entrypoint Executable**

```bash
chmod +x backend/docker-entrypoint.sh
```

### **Step 4: Start Everything**

```bash
docker-compose up --build
```

The entrypoint script will:
1. ✅ Wait for PostgreSQL to be ready
2. ✅ Check if database has data
3. ✅ Automatically seed database if empty
4. ✅ Start the server

### **Step 5: Access Application**

- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:5000/health
- **Login:** contact@greentech.com / password123

## 💻 Running Locally Without Docker

### **Step 1: Install PostgreSQL**

```bash
# macOS
brew install postgresql
brew services start postgresql

# Ubuntu
sudo apt-get install postgresql
sudo service postgresql start
```

### **Step 2: Create Database**

```bash
psql -U postgres
```

```sql
CREATE USER carbonuser WITH PASSWORD 'carbonpass123';
CREATE DATABASE carbon_credit_db OWNER carbonuser;
GRANT ALL PRIVILEGES ON DATABASE carbon_credit_db TO carbonuser;
\q
```

### **Step 3: Setup Backend**

```bash
cd backend

# Install dependencies
npm install

# Create .env file with these contents:
cat > .env << EOF
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=carbon_credit_db
DB_USER=carbonuser
DB_PASSWORD=carbonpass123
JWT_SECRET=your-super-secret-jwt-key
EOF

# Seed database
npm run seed

# Start server
npm start
```

You should see:
```
✅ Database connected successfully
✅ Models synchronized
🚀 Server running on port 5000
📊 Environment: development
```

### **Step 4: Setup Frontend**

```bash
cd frontend
npm install
npm start
```

## 🎯 Sequelize Benefits

### **1. Clean Code**
**Before (Raw SQL):**
```javascript
const result = await pool.query(
  'SELECT * FROM company WHERE email = $1',
  [email]
);
```

**After (Sequelize):**
```javascript
const company = await Company.findOne({ where: { email } });
```

### **2. Automatic Migrations**
Models automatically sync with database:
```javascript
await sequelize.sync({ alter: true });
```

### **3. Relationships**
```javascript
Company.hasOne(CompanyAccountBalance, { foreignKey: 'company_id' });
// Now you can do:
const company = await Company.findOne({ include: 'balance' });
```

### **4. Transactions**
```javascript
const transaction = await sequelize.transaction();
try {
  await Request.create({...}, { transaction });
  await transaction.commit();
} catch (error) {
  await transaction.rollback();
}
```

### **5. Query Builder**
```javascript
const overdueRequests = await OutstandingRequest.findAll({
  where: {
    target_company_id: companyId,
    status: 'Pending',
    request_date: { [Op.lt]: sevenDaysAgo }
  },
  include: ['requestor', 'receivedInfo'],
  order: [['request_date', 'ASC']]
});
```

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

## 🔧 Useful Commands

### **Reseed Database**
```bash
# With Docker
docker-compose exec backend npm run seed

# Locally
cd backend
npm run seed
```

### **Access Database**
```bash
# With Docker
docker-compose exec db psql -U carbonuser -d carbon_credit_db

# Locally
psql -U carbonuser -d carbon_credit_db
```

### **View Tables**
```sql
\dt
\d company
\d company_account_balance
```

### **Check Data**
```sql
SELECT * FROM company;
SELECT * FROM outstanding_request;
```

## 🔍 Troubleshooting

### **Issue: "relation does not exist"**
Database tables weren't created. Run seed:
```bash
npm run seed
```

### **Issue: "Database connection error"**
Check PostgreSQL is running and credentials are correct:
```bash
psql -h localhost -U carbonuser -d carbon_credit_db
```

### **Issue: Docker container keeps restarting**
Check logs:
```bash
docker-compose logs backend
```

Make sure docker-entrypoint.sh is executable:
```bash
chmod +x backend/docker-entrypoint.sh
```

### **Issue: "npm run seed" fails**
Make sure database exists:
```bash
createdb -U postgres carbon_credit_db -O carbonuser
```

## 📚 Sequelize Documentation

Learn more about Sequelize:
- Official Docs: https://sequelize.org/docs/v6/
- Querying: https://sequelize.org/docs/v6/core-concepts/model-querying-basics/
- Associations: https://sequelize.org/docs/v6/core-concepts/assocs/
- Migrations: https://sequelize.org/docs/v6/other-topics/migrations/

## ✅ Verification

After setup, verify everything works:

```bash
# 1. Check server is running
curl http://localhost:5000/health

# 2. Check database has data
docker-compose exec backend node -e "
const {Company} = require('./models');
Company.count().then(c => console.log('Companies:', c));
"

# 3. Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"contact@greentech.com","password":"password123"}'
```

## 🎓 Key Differences from Raw SQL

| Feature | Raw SQL | Sequelize |
|---------|---------|-----------|
| Queries | Manual string building | Query builder methods |
| Migrations | Manual SQL files | Automatic sync |
| Validation | Manual checks | Built-in validators |
| Relationships | Manual joins | Automatic includes |
| Transactions | Manual BEGIN/COMMIT | Managed transactions |
| Type Safety | None | JavaScript types |

Sequelize makes the code more maintainable and easier to work with! 🚀