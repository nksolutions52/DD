-- Add customer reference to pharmacy_sales table
ALTER TABLE pharmacy_sales 
ADD COLUMN customer_id INTEGER REFERENCES pharmacy_customers(id),
ADD COLUMN customer_name VARCHAR(255) NOT NULL,
ADD COLUMN customer_phone VARCHAR(20) NOT NULL;