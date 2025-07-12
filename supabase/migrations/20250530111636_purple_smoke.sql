-- Insert initial users
INSERT INTO users (id, name, email, password, role, avatar) VALUES
(1, 'Dr. John Smith', 'admin@example.com', 'password123', 'admin', 'https://randomuser.me/api/portraits/men/32.jpg'),
(2, 'Dr. Sarah Johnson', 'dentist@example.com', 'password123', 'dentist', 'https://randomuser.me/api/portraits/women/44.jpg'),
(3, 'Emma Davis', 'receptionist@example.com', 'password123', 'receptionist', 'https://randomuser.me/api/portraits/women/68.jpg');

-- Insert initial patients
INSERT INTO patients (id, first_name, last_name, email, phone, date_of_birth, gender, address, medical_history, insurance_info, created_at, last_visit) VALUES
(1, 'Michael', 'Brown', 'michael.brown@example.com', '(555) 123-4567', '1985-06-15', 'male', '123 Main St, Anytown, CA 12345', 'No significant medical history', 'DentalCare Plus #12345678', '2023-01-15 10:30:00', '2023-06-22 14:00:00'),
(2, 'Jessica', 'Miller', 'jessica.miller@example.com', '(555) 987-6543', '1990-03-22', 'female', '456 Oak Ave, Somewhere, NY 67890', 'Allergic to penicillin', 'HealthFirst Dental #87654321', '2023-02-10 09:15:00', '2023-07-05 11:30:00'),
(3, 'David', 'Wilson', 'david.wilson@example.com', '(555) 456-7890', '1978-11-30', 'male', '789 Pine St, Elsewhere, TX 54321', 'Hypertension, takes lisinopril', 'DentalPlus #23456789', '2023-03-05 13:45:00', '2023-05-18 16:15:00');

-- Insert initial medicines
INSERT INTO medicines (id, name, type, description, manufacturer, stock, unit, price, created_at, updated_at) VALUES
(1, 'Amoxicillin', 'tablet', 'Antibiotic for bacterial infections', 'PharmaCorp', 500, 'tablets', 0.5, '2024-03-01 10:00:00', '2024-03-01 10:00:00'),
(2, 'Ibuprofen', 'tablet', 'Pain reliever and anti-inflammatory', 'MediCo', 1000, 'tablets', 0.3, '2024-03-01 10:00:00', '2024-03-01 10:00:00'),
(3, 'Lidocaine', 'injection', 'Local anesthetic', 'AnestheCare', 200, 'vials', 5.0, '2024-03-01 10:00:00', '2024-03-01 10:00:00');