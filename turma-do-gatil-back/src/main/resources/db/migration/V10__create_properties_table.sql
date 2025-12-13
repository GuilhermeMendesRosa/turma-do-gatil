-- Create properties table
CREATE TABLE IF NOT EXISTS properties (
    key VARCHAR(255) PRIMARY KEY,
    value VARCHAR(255) NOT NULL
);

-- Insert default properties
INSERT INTO properties (key, value) VALUES ('sterilizationMinDays', '90');
INSERT INTO properties (key, value) VALUES ('sterilizationMaxDays', '180');
