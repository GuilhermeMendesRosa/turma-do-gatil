-- Add audit and soft delete columns to all tables
-- V12__add_audit_and_soft_delete_columns.sql

-- Table: cats
ALTER TABLE cats
    ADD COLUMN created_at TIMESTAMP,
    ADD COLUMN updated_at TIMESTAMP,
    ADD COLUMN created_by VARCHAR(255),
    ADD COLUMN last_updated_by VARCHAR(255),
    ADD COLUMN deleted_at TIMESTAMP,
    ADD COLUMN deleted_by VARCHAR(255);

-- Table: adopters
ALTER TABLE adopters
    ADD COLUMN created_at TIMESTAMP,
    ADD COLUMN updated_at TIMESTAMP,
    ADD COLUMN created_by VARCHAR(255),
    ADD COLUMN last_updated_by VARCHAR(255),
    ADD COLUMN deleted_at TIMESTAMP,
    ADD COLUMN deleted_by VARCHAR(255);

-- Table: adoptions
ALTER TABLE adoptions
    ADD COLUMN created_at TIMESTAMP,
    ADD COLUMN updated_at TIMESTAMP,
    ADD COLUMN created_by VARCHAR(255),
    ADD COLUMN last_updated_by VARCHAR(255),
    ADD COLUMN deleted_at TIMESTAMP,
    ADD COLUMN deleted_by VARCHAR(255);

-- Table: sterilizations
ALTER TABLE sterilizations
    ADD COLUMN created_at TIMESTAMP,
    ADD COLUMN updated_at TIMESTAMP,
    ADD COLUMN created_by VARCHAR(255),
    ADD COLUMN last_updated_by VARCHAR(255),
    ADD COLUMN deleted_at TIMESTAMP,
    ADD COLUMN deleted_by VARCHAR(255);

-- Table: notes
ALTER TABLE notes
    ADD COLUMN created_at TIMESTAMP,
    ADD COLUMN updated_at TIMESTAMP,
    ADD COLUMN created_by VARCHAR(255),
    ADD COLUMN last_updated_by VARCHAR(255),
    ADD COLUMN deleted_at TIMESTAMP,
    ADD COLUMN deleted_by VARCHAR(255);

-- Table: addresses
ALTER TABLE addresses
    ADD COLUMN created_at TIMESTAMP,
    ADD COLUMN updated_at TIMESTAMP,
    ADD COLUMN created_by VARCHAR(255),
    ADD COLUMN last_updated_by VARCHAR(255),
    ADD COLUMN deleted_at TIMESTAMP,
    ADD COLUMN deleted_by VARCHAR(255);

-- Table: users (already has created_at, so only add the new columns)
ALTER TABLE users
    ADD COLUMN updated_at TIMESTAMP,
    ADD COLUMN created_by VARCHAR(255),
    ADD COLUMN last_updated_by VARCHAR(255),
    ADD COLUMN deleted_at TIMESTAMP,
    ADD COLUMN deleted_by VARCHAR(255);

-- Table: properties
ALTER TABLE properties
    ADD COLUMN created_at TIMESTAMP,
    ADD COLUMN updated_at TIMESTAMP,
    ADD COLUMN created_by VARCHAR(255),
    ADD COLUMN last_updated_by VARCHAR(255),
    ADD COLUMN deleted_at TIMESTAMP,
    ADD COLUMN deleted_by VARCHAR(255);

-- Populate existing records with default values
UPDATE cats SET created_at = NOW(), created_by = 'system' WHERE created_at IS NULL;
UPDATE adopters SET created_at = NOW(), created_by = 'system' WHERE created_at IS NULL;
UPDATE adoptions SET created_at = NOW(), created_by = 'system' WHERE created_at IS NULL;
UPDATE sterilizations SET created_at = NOW(), created_by = 'system' WHERE created_at IS NULL;
UPDATE notes SET created_at = NOW(), created_by = 'system' WHERE created_at IS NULL;
UPDATE addresses SET created_at = NOW(), created_by = 'system' WHERE created_at IS NULL;
UPDATE users SET created_by = 'system' WHERE created_by IS NULL;
UPDATE properties SET created_at = NOW(), created_by = 'system' WHERE created_at IS NULL;

-- Make created_at NOT NULL after populating existing data (except for properties which has String PK)
ALTER TABLE cats ALTER COLUMN created_at SET NOT NULL;
ALTER TABLE adopters ALTER COLUMN created_at SET NOT NULL;
ALTER TABLE adoptions ALTER COLUMN created_at SET NOT NULL;
ALTER TABLE sterilizations ALTER COLUMN created_at SET NOT NULL;
ALTER TABLE notes ALTER COLUMN created_at SET NOT NULL;
ALTER TABLE addresses ALTER COLUMN created_at SET NOT NULL;

-- Create indexes for soft delete queries (improves performance when filtering by deleted_at)
CREATE INDEX idx_cats_deleted_at ON cats(deleted_at);
CREATE INDEX idx_adopters_deleted_at ON adopters(deleted_at);
CREATE INDEX idx_adoptions_deleted_at ON adoptions(deleted_at);
CREATE INDEX idx_sterilizations_deleted_at ON sterilizations(deleted_at);
CREATE INDEX idx_notes_deleted_at ON notes(deleted_at);
CREATE INDEX idx_addresses_deleted_at ON addresses(deleted_at);
CREATE INDEX idx_users_deleted_at ON users(deleted_at);
CREATE INDEX idx_properties_deleted_at ON properties(deleted_at);
