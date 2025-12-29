#!/bin/sh
# backend/docker-entrypoint.sh

set -e

echo "Waiting for PostgreSQL to be ready..."

# Wait for PostgreSQL
until node -e "const {Sequelize} = require('sequelize'); const s = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {host: process.env.DB_HOST, dialect: 'postgres', logging: false}); s.authenticate().then(() => {console.log('DB ready'); process.exit(0);}).catch(() => process.exit(1));" 2>/dev/null; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 2
done

echo "PostgreSQL is up - checking if database needs seeding..."

# Check if tables exist, if not seed
node -e "
const {sequelize, Company} = require('./models');
sequelize.authenticate()
  .then(() => Company.count())
  .then(count => {
    if (count === 0) {
      console.log('Database is empty, seeding...');
      process.exit(2);
    } else {
      console.log('Database already has data, skipping seed');
      process.exit(0);
    }
  })
  .catch(() => {
    console.log('Tables do not exist, seeding...');
    process.exit(2);
  });
" || {
  EXIT_CODE=$?
  if [ $EXIT_CODE -eq 2 ]; then
    echo "Running database seed..."
    npm run seed
  fi
}

echo "Starting application..."
exec "$@"