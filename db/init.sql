-- Create application user for database connection
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'bain_user') THEN
        CREATE USER bain_user WITH ENCRYPTED PASSWORD 'Password123';
    END IF;
END $$;

-- Create database and assign ownership to application user if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_database WHERE datname = 'bainfullstack') THEN
        CREATE DATABASE bainfullstack OWNER bain_user;
    END IF;
END $$;

-- Grant privileges to application user
GRANT CONNECT ON DATABASE bainfullstack TO bain_user;
GRANT USAGE, CREATE ON SCHEMA public TO bain_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO bain_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO bain_user;

-- Switch to the bainfullstack database
\c bainfullstack;

-- Create the table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'Test') THEN
        CREATE TABLE Test (
            id SERIAL PRIMARY KEY,
            test_value VARCHAR(100) NOT NULL
        );
    END IF;
END $$;

-- Insert data only if the table is empty
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Test LIMIT 1) THEN
        INSERT INTO Test(test_value) VALUES ('Test Value 1'), ('Test Value 2');
    END IF;
END $$;
