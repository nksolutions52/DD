# Database Migration Guide: MySQL to PostgreSQL

This guide will help you migrate your existing MySQL database to PostgreSQL for the K-Health Dental Clinic Management System.

## Prerequisites

1. **Install PostgreSQL**
   - Download and install PostgreSQL from https://www.postgresql.org/download/
   - Ensure PostgreSQL service is running
   - Create a database named `dental_clinic`

2. **Install Migration Tools**
   ```bash
   # Install pgloader for data migration (optional)
   # On Ubuntu/Debian:
   sudo apt-get install pgloader
   
   # On macOS:
   brew install pgloader
   ```

## Step 1: Backup Existing MySQL Data

```bash
# Create a backup of your existing MySQL database
mysqldump -u root -p dental_clinic > dental_clinic_backup.sql
```

## Step 2: Update Application Configuration

The application configuration has been updated to use PostgreSQL. Key changes:

### Database Connection
- **Driver**: `org.postgresql.Driver`
- **URL Format**: `jdbc:postgresql://localhost:5432/dental_clinic`
- **Dialect**: `org.hibernate.dialect.PostgreSQLDialect`

### Maven Dependencies
- Removed: `mysql-connector-j`
- Added: `postgresql` JDBC driver

## Step 3: Schema Migration

The new PostgreSQL schema includes these improvements:

### Data Type Changes
- `JSON` → `JSONB` (better performance and indexing)
- `BIGINT AUTO_INCREMENT` → `BIGSERIAL`
- String casting: `CAST(id AS string)` → `CAST(id AS text)`

### New Features
- Enhanced indexing for better query performance
- Row Level Security (RLS) enabled on all tables
- Optimized for PostgreSQL-specific features

## Step 4: Data Migration Options

### Option A: Fresh Start (Recommended for Development)
1. Start the Spring Boot application
2. The application will automatically create the PostgreSQL schema
3. Initial sample data will be populated automatically

### Option B: Migrate Existing Data

#### Using pgloader (Automated)
```bash
# Create a pgloader configuration file
cat > migrate.load << EOF
LOAD DATABASE
    FROM mysql://root:password@localhost/dental_clinic
    INTO postgresql://postgres:password@localhost/dental_clinic

WITH include drop, create tables, create indexes, reset sequences

SET work_mem to '16MB', maintenance_work_mem to '512 MB';
EOF

# Run the migration
pgloader migrate.load
```

#### Manual Migration
1. **Export MySQL data**:
   ```bash
   mysqldump -u root -p --no-create-info --complete-insert dental_clinic > data_only.sql
   ```

2. **Convert MySQL syntax to PostgreSQL**:
   - Replace backticks (`) with double quotes (")
   - Update date/time formats
   - Convert AUTO_INCREMENT to SERIAL
   - Update data types as needed

3. **Import to PostgreSQL**:
   ```bash
   psql -U postgres -d dental_clinic -f converted_data.sql
   ```

## Step 5: Verification

After migration, verify the data:

```sql
-- Connect to PostgreSQL
psql -U postgres -d dental_clinic

-- Check table counts
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'patients', COUNT(*) FROM patients
UNION ALL
SELECT 'appointments', COUNT(*) FROM appointments
UNION ALL
SELECT 'medicines', COUNT(*) FROM medicines
UNION ALL
SELECT 'prescriptions', COUNT(*) FROM prescriptions;

-- Verify data integrity
SELECT p.first_name, p.last_name, COUNT(a.id) as appointment_count
FROM patients p
LEFT JOIN appointments a ON p.id = a.patient_id
GROUP BY p.id, p.first_name, p.last_name
ORDER BY p.id;
```

## Step 6: Update Production Configuration

For production deployment, update the database configuration:

```properties
# Production PostgreSQL Configuration
spring.datasource.url=jdbc:postgresql://your-postgres-host:5432/dental_clinic
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.datasource.driver-class-name=org.postgresql.Driver
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# Connection pool settings for production
spring.datasource.hikari.maximum-pool-size=20
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.connection-timeout=20000
spring.datasource.hikari.idle-timeout=300000
spring.datasource.hikari.max-lifetime=1200000
```

## Troubleshooting

### Common Issues and Solutions

1. **Connection Refused**
   - Ensure PostgreSQL service is running
   - Check if the database `dental_clinic` exists
   - Verify connection credentials

2. **Schema Creation Errors**
   - Ensure the user has CREATE privileges
   - Check for conflicting table names

3. **Data Type Conversion Errors**
   - Review the conversion mappings
   - Check for MySQL-specific functions in queries

4. **Performance Issues**
   - Run `ANALYZE` on all tables after migration
   - Consider creating additional indexes based on query patterns

### Useful PostgreSQL Commands

```sql
-- Check database size
SELECT pg_size_pretty(pg_database_size('dental_clinic'));

-- List all tables
\dt

-- Describe table structure
\d table_name

-- Check active connections
SELECT * FROM pg_stat_activity WHERE datname = 'dental_clinic';

-- Update table statistics
ANALYZE;
```

## Benefits of PostgreSQL Migration

1. **Better JSON Support**: JSONB provides better performance and indexing
2. **Advanced Features**: Window functions, CTEs, and advanced SQL features
3. **Better Concurrency**: Superior handling of concurrent transactions
4. **Extensibility**: Rich ecosystem of extensions
5. **Standards Compliance**: Better SQL standard compliance
6. **Performance**: Generally better performance for complex queries

## Rollback Plan

If you need to rollback to MySQL:

1. Keep your MySQL backup file
2. Revert the application.properties changes
3. Update pom.xml to use MySQL connector
4. Restore from the MySQL backup

## Support

For issues during migration:
1. Check the application logs for specific error messages
2. Verify PostgreSQL server logs
3. Ensure all dependencies are correctly updated
4. Test the migration process in a development environment first