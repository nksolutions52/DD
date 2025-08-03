/*
  # Create initial database schema for dental clinic system

  1. New Tables
    - `users` - System users (doctors, admin, receptionist)
    - `patients` - Patient records
    - `appointments` - Appointment scheduling
    - `medicines` - Pharmacy inventory
    - `prescriptions` - Medical prescriptions
    - `prescription_items` - Individual prescription items
    - `pharmacy_customers` - Pharmacy customer records
    - `pharmacy_sales` - Pharmacy sales transactions
    - `pharmacy_sale_items` - Individual sale items
    - `treatments` - Treatment records
    - `amounts` - Payment records
    - `roles` - User roles and permissions
    - `manufacturers` - Medicine manufacturers
    - `medicine_types` - Medicine type categories

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for each table

  3. Initial Data
    - Insert default roles
    - Insert sample users, patients, and medicines
*/

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  role_id BIGINT REFERENCES roles(id),
  avatar VARCHAR(500)
);

-- Create patients table
CREATE TABLE IF NOT EXISTS patients (
  id BIGSERIAL PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) NOT NULL,
  date_of_birth DATE NOT NULL,
  gender VARCHAR(10) NOT NULL,
  address TEXT NOT NULL,
  medical_history TEXT,
  insurance_info VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT now(),
  last_visit TIMESTAMPTZ
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id BIGSERIAL PRIMARY KEY,
  patient_id BIGINT NOT NULL,
  patient_name VARCHAR(255) NOT NULL,
  dentist_id BIGINT NOT NULL,
  dentist_name VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status VARCHAR(50) NOT NULL,
  type VARCHAR(50) NOT NULL,
  treatment_type VARCHAR(50) DEFAULT 'dental',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create medicines table
CREATE TABLE IF NOT EXISTS medicines (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  description TEXT,
  manufacturer VARCHAR(255),
  stock INTEGER NOT NULL,
  unit VARCHAR(50) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  date_of_mfg DATE,
  date_of_expiry DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create manufacturers table
CREATE TABLE IF NOT EXISTS manufacturers (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create medicine_types table
CREATE TABLE IF NOT EXISTS medicine_types (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create prescriptions table
CREATE TABLE IF NOT EXISTS prescriptions (
  id BIGSERIAL PRIMARY KEY,
  patient_id BIGINT NOT NULL,
  patient_name VARCHAR(255) NOT NULL,
  appointment_id BIGINT NOT NULL,
  dentist_id BIGINT NOT NULL,
  dentist_name VARCHAR(255) NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create prescription_items table
CREATE TABLE IF NOT EXISTS prescription_items (
  id BIGSERIAL PRIMARY KEY,
  prescription_id BIGINT REFERENCES prescriptions(id) ON DELETE CASCADE,
  medicine_id BIGINT NOT NULL,
  medicine_name VARCHAR(255) NOT NULL,
  medicine_type VARCHAR(50) NOT NULL,
  dosage VARCHAR(100) NOT NULL,
  frequency VARCHAR(100) NOT NULL,
  duration VARCHAR(100) NOT NULL,
  instructions TEXT
);

-- Create pharmacy_customers table
CREATE TABLE IF NOT EXISTS pharmacy_customers (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(255),
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create pharmacy_sales table
CREATE TABLE IF NOT EXISTS pharmacy_sales (
  id BIGSERIAL PRIMARY KEY,
  customer_id BIGINT REFERENCES pharmacy_customers(id),
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  sgst DECIMAL(10,2) NOT NULL,
  cgst DECIMAL(10,2) NOT NULL,
  discount DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create pharmacy_sale_items table
CREATE TABLE IF NOT EXISTS pharmacy_sale_items (
  id BIGSERIAL PRIMARY KEY,
  sale_id BIGINT REFERENCES pharmacy_sales(id) ON DELETE CASCADE,
  medicine_id BIGINT NOT NULL,
  medicine_name VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL
);

-- Create treatments table
CREATE TABLE IF NOT EXISTS treatments (
  id BIGSERIAL PRIMARY KEY,
  appointment_id BIGINT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create amounts table
CREATE TABLE IF NOT EXISTS amounts (
  id BIGSERIAL PRIMARY KEY,
  appointment_id BIGINT NOT NULL,
  patient_id BIGINT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_type VARCHAR(20) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE manufacturers ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicine_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescription_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE pharmacy_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE pharmacy_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE pharmacy_sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE treatments ENABLE ROW LEVEL SECURITY;
ALTER TABLE amounts ENABLE ROW LEVEL SECURITY;

-- Create policies (basic read access for authenticated users)
CREATE POLICY "Allow read access for authenticated users" ON roles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read access for authenticated users" ON users FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read access for authenticated users" ON patients FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read access for authenticated users" ON appointments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read access for authenticated users" ON medicines FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read access for authenticated users" ON manufacturers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read access for authenticated users" ON medicine_types FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read access for authenticated users" ON prescriptions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read access for authenticated users" ON prescription_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read access for authenticated users" ON pharmacy_customers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read access for authenticated users" ON pharmacy_sales FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read access for authenticated users" ON pharmacy_sale_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read access for authenticated users" ON treatments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read access for authenticated users" ON amounts FOR SELECT TO authenticated USING (true);

-- Insert default roles
INSERT INTO roles (name, description, permissions) VALUES
('admin', 'Administrator with full access', '{"dashboard": true, "patients": true, "appointments": true, "calendar": true, "pharmacy": true, "pharmacy-pos": true, "reports": true, "configure": true, "users": true}'),
('doctor', 'Doctor with limited access', '{"dashboard": true, "patients": true, "appointments": true, "calendar": true, "pharmacy": true, "reports": true}'),
('dentist', 'Dentist with medical access', '{"dashboard": true, "patients": true, "appointments": true, "calendar": true, "pharmacy": true, "reports": true}'),
('receptionist', 'Receptionist with basic access', '{"dashboard": true, "patients": true, "appointments": true, "calendar": true}');

-- Insert initial users
INSERT INTO users (name, email, password, role, role_id, avatar) VALUES
('Dr. John Smith', 'admin@example.com', 'password123', 'admin', (SELECT id FROM roles WHERE name = 'admin'), 'https://randomuser.me/api/portraits/men/32.jpg'),
('Dr. Sarah Johnson', 'dentist@example.com', 'password123', 'dentist', (SELECT id FROM roles WHERE name = 'dentist'), 'https://randomuser.me/api/portraits/women/44.jpg'),
('Emma Davis', 'receptionist@example.com', 'password123', 'receptionist', (SELECT id FROM roles WHERE name = 'receptionist'), 'https://randomuser.me/api/portraits/women/68.jpg');

-- Insert initial patients
INSERT INTO patients (first_name, last_name, email, phone, date_of_birth, gender, address, medical_history, insurance_info, created_at, last_visit) VALUES
('Michael', 'Brown', 'michael.brown@example.com', '(555) 123-4567', '1985-06-15', 'male', '123 Main St, Anytown, CA 12345', 'No significant medical history', 'DentalCare Plus #12345678', '2023-01-15 10:30:00', '2023-06-22 14:00:00'),
('Jessica', 'Miller', 'jessica.miller@example.com', '(555) 987-6543', '1990-03-22', 'female', '456 Oak Ave, Somewhere, NY 67890', 'Allergic to penicillin', 'HealthFirst Dental #87654321', '2023-02-10 09:15:00', '2023-07-05 11:30:00'),
('David', 'Wilson', 'david.wilson@example.com', '(555) 456-7890', '1978-11-30', 'male', '789 Pine St, Elsewhere, TX 54321', 'Hypertension, takes lisinopril', 'DentalPlus #23456789', '2023-03-05 13:45:00', '2023-05-18 16:15:00'),
('Emily', 'Taylor', 'emily.taylor@example.com', '(555) 789-0123', '1995-09-08', 'female', '101 Maple Dr, Nowhere, FL 98765', 'No significant medical history', 'CareFirst Dental #34567890', '2023-04-20 10:00:00', '2023-08-02 13:45:00'),
('Robert', 'Anderson', 'robert.anderson@example.com', '(555) 234-5678', '1982-07-17', 'male', '202 Cedar Ln, Anyplace, WA 13579', 'Asthma, uses albuterol inhaler', 'DentalCare Plus #45678901', '2023-05-12 14:30:00', '2023-08-12 10:30:00');

-- Insert initial manufacturers
INSERT INTO manufacturers (name) VALUES
('PharmaCorp'),
('MediCo'),
('AnestheCare'),
('DentalPharma'),
('OralCare');

-- Insert initial medicine types
INSERT INTO medicine_types (name) VALUES
('tablet'),
('injection'),
('solution'),
('gel'),
('capsule'),
('syrup'),
('cream'),
('drops');

-- Insert initial medicines
INSERT INTO medicines (name, type, description, manufacturer, stock, unit, price, date_of_mfg, date_of_expiry, created_at, updated_at) VALUES
('Amoxicillin', 'tablet', 'Antibiotic for bacterial infections', 'PharmaCorp', 500, 'tablets', 0.5, '2024-01-01', '2025-12-31', '2024-03-01 10:00:00', '2024-03-01 10:00:00'),
('Ibuprofen', 'tablet', 'Pain reliever and anti-inflammatory', 'MediCo', 1000, 'tablets', 0.3, '2024-01-01', '2025-12-31', '2024-03-01 10:00:00', '2024-03-01 10:00:00'),
('Lidocaine', 'injection', 'Local anesthetic', 'AnestheCare', 200, 'vials', 5.0, '2024-01-01', '2025-12-31', '2024-03-01 10:00:00', '2024-03-01 10:00:00'),
('Chlorhexidine', 'solution', 'Oral antiseptic', 'DentalPharma', 150, 'bottles', 8.0, '2024-01-01', '2025-12-31', '2024-03-01 10:00:00', '2024-03-01 10:00:00'),
('Fluoride Gel', 'gel', 'Cavity prevention', 'OralCare', 100, 'tubes', 12.0, '2024-01-01', '2025-12-31', '2024-03-01 10:00:00', '2024-03-01 10:00:00');

-- Insert initial appointments
INSERT INTO appointments (patient_id, patient_name, dentist_id, dentist_name, date, start_time, end_time, status, type, treatment_type, notes, created_at) VALUES
(1, 'Michael Brown', 2, 'Dr. Sarah Johnson', '2024-03-20', '09:00', '09:30', 'confirmed', 'check-up', 'dental', 'Regular check-up appointment', '2024-03-01 10:00:00'),
(2, 'Jessica Miller', 2, 'Dr. Sarah Johnson', '2024-03-20', '10:00', '11:00', 'scheduled', 'filling', 'dental', 'Filling for lower right molar', '2024-03-01 10:00:00'),
(3, 'David Wilson', 1, 'Dr. John Smith', '2024-03-20', '14:00', '15:00', 'confirmed', 'root-canal', 'dental', 'Root canal treatment for upper left incisor', '2024-03-01 10:00:00'),
(4, 'Emily Taylor', 2, 'Dr. Sarah Johnson', '2024-03-21', '11:30', '12:00', 'scheduled', 'cleaning', 'dental', 'Regular dental cleaning', '2024-03-01 10:00:00'),
(5, 'Robert Anderson', 1, 'Dr. John Smith', '2024-03-21', '15:30', '16:30', 'scheduled', 'extraction', 'dental', 'Extraction of wisdom tooth', '2024-03-01 10:00:00');

-- Insert initial prescriptions
INSERT INTO prescriptions (patient_id, patient_name, appointment_id, dentist_id, dentist_name, notes, created_at) VALUES
(1, 'Michael Brown', 1, 2, 'Dr. Sarah Johnson', 'Take antibiotics after meals', '2024-03-01 10:00:00'),
(2, 'Jessica Miller', 2, 2, 'Dr. Sarah Johnson', 'Take pain relievers as needed', '2024-03-01 10:00:00');

-- Insert prescription items
INSERT INTO prescription_items (prescription_id, medicine_id, medicine_name, medicine_type, dosage, frequency, duration, instructions) VALUES
(1, 1, 'Amoxicillin', 'tablet', '500mg', '3 times daily', '7 days', 'Take after meals'),
(1, 2, 'Ibuprofen', 'tablet', '400mg', 'As needed', '5 days', 'Take for pain'),
(2, 2, 'Ibuprofen', 'tablet', '400mg', '2 times daily', '3 days', 'Take after meals');

-- Insert sample pharmacy customers
INSERT INTO pharmacy_customers (name, phone, email, address) VALUES
('Michael Brown', '(555) 123-4567', 'michael.brown@example.com', '123 Main St, Anytown, CA 12345'),
('Jessica Miller', '(555) 987-6543', 'jessica.miller@example.com', '456 Oak Ave, Somewhere, NY 67890');

-- Insert sample treatments
INSERT INTO treatments (appointment_id, description) VALUES
(1, 'Routine dental examination and cleaning completed successfully'),
(3, 'Root canal procedure completed with local anesthesia');

-- Insert sample amounts
INSERT INTO amounts (appointment_id, patient_id, amount, payment_type) VALUES
(1, 1, 150.00, 'cash'),
(3, 3, 800.00, 'online');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_patients_phone ON patients(phone);
CREATE INDEX IF NOT EXISTS idx_patients_email ON patients(email);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date);
CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_dentist_id ON appointments(dentist_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_patient_id ON prescriptions(patient_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_appointment_id ON prescriptions(appointment_id);
CREATE INDEX IF NOT EXISTS idx_medicines_name ON medicines(name);
CREATE INDEX IF NOT EXISTS idx_pharmacy_customers_phone ON pharmacy_customers(phone);
CREATE INDEX IF NOT EXISTS idx_treatments_appointment_id ON treatments(appointment_id);
CREATE INDEX IF NOT EXISTS idx_amounts_appointment_id ON amounts(appointment_id);
CREATE INDEX IF NOT EXISTS idx_amounts_patient_id ON amounts(patient_id);