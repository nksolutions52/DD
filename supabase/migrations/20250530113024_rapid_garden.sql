-- Insert initial users
INSERT INTO users (name, email, password, role, avatar) VALUES
('Dr. John Smith', 'admin@example.com', 'password123', 'admin', 'https://randomuser.me/api/portraits/men/32.jpg'),
('Dr. Sarah Johnson', 'dentist@example.com', 'password123', 'dentist', 'https://randomuser.me/api/portraits/women/44.jpg'),
('Emma Davis', 'receptionist@example.com', 'password123', 'receptionist', 'https://randomuser.me/api/portraits/women/68.jpg');

-- Insert initial patients
INSERT INTO patients (first_name, last_name, email, phone, date_of_birth, gender, address, medical_history, insurance_info, created_at, last_visit) VALUES
('Michael', 'Brown', 'michael.brown@example.com', '(555) 123-4567', '1985-06-15', 'male', '123 Main St, Anytown, CA 12345', 'No significant medical history', 'DentalCare Plus #12345678', '2023-01-15 10:30:00', '2023-06-22 14:00:00'),
('Jessica', 'Miller', 'jessica.miller@example.com', '(555) 987-6543', '1990-03-22', 'female', '456 Oak Ave, Somewhere, NY 67890', 'Allergic to penicillin', 'HealthFirst Dental #87654321', '2023-02-10 09:15:00', '2023-07-05 11:30:00'),
('David', 'Wilson', 'david.wilson@example.com', '(555) 456-7890', '1978-11-30', 'male', '789 Pine St, Elsewhere, TX 54321', 'Hypertension, takes lisinopril', 'DentalPlus #23456789', '2023-03-05 13:45:00', '2023-05-18 16:15:00'),
('Emily', 'Taylor', 'emily.taylor@example.com', '(555) 789-0123', '1995-09-08', 'female', '101 Maple Dr, Nowhere, FL 98765', 'No significant medical history', 'CareFirst Dental #34567890', '2023-04-20 10:00:00', '2023-08-02 13:45:00'),
('Robert', 'Anderson', 'robert.anderson@example.com', '(555) 234-5678', '1982-07-17', 'male', '202 Cedar Ln, Anyplace, WA 13579', 'Asthma, uses albuterol inhaler', 'DentalCare Plus #45678901', '2023-05-12 14:30:00', '2023-08-12 10:30:00');

-- Insert initial medicines
INSERT INTO medicines (name, type, description, manufacturer, stock, unit, price, created_at, updated_at) VALUES
('Amoxicillin', 'tablet', 'Antibiotic for bacterial infections', 'PharmaCorp', 500, 'tablets', 0.5, '2024-03-01 10:00:00', '2024-03-01 10:00:00'),
('Ibuprofen', 'tablet', 'Pain reliever and anti-inflammatory', 'MediCo', 1000, 'tablets', 0.3, '2024-03-01 10:00:00', '2024-03-01 10:00:00'),
('Lidocaine', 'injection', 'Local anesthetic', 'AnestheCare', 200, 'vials', 5.0, '2024-03-01 10:00:00', '2024-03-01 10:00:00'),
('Chlorhexidine', 'solution', 'Oral antiseptic', 'DentalPharma', 150, 'bottles', 8.0, '2024-03-01 10:00:00', '2024-03-01 10:00:00'),
('Fluoride Gel', 'gel', 'Cavity prevention', 'OralCare', 100, 'tubes', 12.0, '2024-03-01 10:00:00', '2024-03-01 10:00:00');

-- Insert initial appointments
INSERT INTO appointments (patient_id, patient_name, dentist_id, dentist_name, date, start_time, end_time, status, type, notes, created_at) VALUES
(1, 'Michael Brown', 2, 'Dr. Sarah Johnson', '2024-03-20', '09:00', '09:30', 'confirmed', 'check-up', 'Regular check-up appointment', '2024-03-01 10:00:00'),
(2, 'Jessica Miller', 2, 'Dr. Sarah Johnson', '2024-03-20', '10:00', '11:00', 'scheduled', 'filling', 'Filling for lower right molar', '2024-03-01 10:00:00'),
(3, 'David Wilson', 1, 'Dr. John Smith', '2024-03-20', '14:00', '15:00', 'confirmed', 'root-canal', 'Root canal treatment for upper left incisor', '2024-03-01 10:00:00'),
(4, 'Emily Taylor', 2, 'Dr. Sarah Johnson', '2024-03-21', '11:30', '12:00', 'scheduled', 'cleaning', 'Regular dental cleaning', '2024-03-01 10:00:00'),
(5, 'Robert Anderson', 1, 'Dr. John Smith', '2024-03-21', '15:30', '16:30', 'scheduled', 'extraction', 'Extraction of wisdom tooth', '2024-03-01 10:00:00');

-- Insert initial prescriptions
INSERT INTO prescriptions (patient_id, patient_name, appointment_id, dentist_id, dentist_name, notes, created_at) VALUES
(1, 'Michael Brown', 1, 2, 'Dr. Sarah Johnson', 'Take antibiotics after meals', '2024-03-01 10:00:00'),
(2, 'Jessica Miller', 2, 2, 'Dr. Sarah Johnson', 'Take pain relievers as needed', '2024-03-01 10:00:00');

-- Insert prescription items
INSERT INTO prescription_items (prescription_id, medicine_id, medicine_name, medicine_type, dosage, frequency, duration, instructions) VALUES
(1, 1, 'Amoxicillin', 'tablet', '500mg', '3 times daily', '7 days', 'Take after meals'),
(1, 2, 'Ibuprofen', 'tablet', '400mg', 'As needed', '5 days', 'Take for pain'),
(2, 2, 'Ibuprofen', 'tablet', '400mg', '2 times daily', '3 days', 'Take after meals');