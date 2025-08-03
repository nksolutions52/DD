# K-Health Dental Clinic Management System

A comprehensive dental clinic management system built with Spring Boot (PostgreSQL) backend and React frontend.

## Features

- **Patient Management**: Complete patient records and history
- **Appointment Scheduling**: Calendar-based appointment management
- **Pharmacy Management**: Medicine inventory and prescription handling
- **Point of Sale**: Pharmacy sales transactions
- **Reports & Analytics**: Comprehensive reporting dashboard
- **User Management**: Role-based access control

## Technology Stack

### Backend
- Spring Boot 3.2.3
- PostgreSQL Database
- JPA/Hibernate
- Maven

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Vite

## Database Migration from MySQL to PostgreSQL

### Prerequisites
1. Install PostgreSQL on your system
2. Create a database named `dental_clinic`
3. Update the database credentials in `application.properties`

### Migration Steps

1. **Update Database Configuration**
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/dental_clinic
   spring.datasource.username=postgres
   spring.datasource.password=your_password
   spring.datasource.driver-class-name=org.postgresql.Driver
   spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
   ```

2. **Run the Initial Schema Migration**
   - The system will automatically create tables using the new PostgreSQL schema
   - Initial data will be populated automatically

3. **Data Migration (if you have existing MySQL data)**
   - Export data from MySQL using `mysqldump`
   - Convert MySQL dump to PostgreSQL format
   - Import data into PostgreSQL

## Setup Instructions

### Backend Setup
1. Navigate to the `backend` directory
2. Update database credentials in `src/main/resources/application.properties`
3. Run the application:
   ```bash
   mvn spring-boot:run
   ```

### Frontend Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

The API is available at `http://localhost:8080/api` with the following main endpoints:

- `/auth` - Authentication
- `/patients` - Patient management
- `/appointments` - Appointment scheduling
- `/medicines` - Pharmacy inventory
- `/prescriptions` - Prescription management
- `/pharmacy-sales` - Sales transactions
- `/reports` - Analytics and reporting
- `/users` - User management

## Database Schema

The PostgreSQL database includes the following main tables:
- `users` - System users and authentication
- `roles` - User roles and permissions
- `patients` - Patient records
- `appointments` - Appointment scheduling
- `medicines` - Pharmacy inventory
- `prescriptions` - Medical prescriptions
- `pharmacy_sales` - Sales transactions
- `treatments` - Treatment records
- `amounts` - Payment records

## Key Changes in PostgreSQL Migration

1. **Database Driver**: Changed from MySQL Connector to PostgreSQL JDBC driver
2. **Hibernate Dialect**: Updated to PostgreSQL dialect
3. **Data Types**: 
   - `JSON` columns changed to `JSONB` for better performance
   - `BIGINT AUTO_INCREMENT` changed to `BIGSERIAL`
   - String casting updated from `CAST(id AS string)` to `CAST(id AS text)`
4. **Schema**: Optimized for PostgreSQL best practices

## Environment Variables

For production deployment, set the following environment variables:
- `DATABASE_URL` - PostgreSQL connection string
- `DATABASE_USERNAME` - Database username
- `DATABASE_PASSWORD` - Database password

## License

This project is proprietary software for K-Health clinic management.
