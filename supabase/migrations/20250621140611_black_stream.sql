/*
  # Create roles master table and update user management

  1. New Tables
    - `roles`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `description` (text)
      - `permissions` (jsonb)
      - `created_at` (timestamp)

  2. Changes
    - Update `users` table to reference roles table
    - Add foreign key constraint

  3. Security
    - Enable RLS on `roles` table
    - Add policies for role management
*/

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  permissions jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;

-- Create policies for roles
CREATE POLICY "Authenticated users can read roles"
  ON roles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can manage roles"
  ON roles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u 
      JOIN roles r ON u.role_id = r.id 
      WHERE u.id = auth.uid() AND r.name = 'admin'
    )
  );

-- Insert default roles
INSERT INTO roles (name, description, permissions) VALUES
('admin', 'Administrator with full access', '{"dashboard": true, "patients": true, "appointments": true, "calendar": true, "pharmacy": true, "pharmacy-pos": true, "reports": true, "configure": true, "users": true}'),
('doctor', 'Doctor with limited access', '{"dashboard": true, "patients": true, "appointments": true, "calendar": true, "pharmacy": true, "reports": true}'),
('receptionist', 'Receptionist with basic access', '{"dashboard": true, "patients": true, "appointments": true, "calendar": true}');

-- Add role_id column to users table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'role_id'
  ) THEN
    ALTER TABLE users ADD COLUMN role_id uuid REFERENCES roles(id);
  END IF;
END $$;

-- Update existing users with role IDs
UPDATE users SET role_id = (SELECT id FROM roles WHERE name = 'admin') WHERE role = 'admin';
UPDATE users SET role_id = (SELECT id FROM roles WHERE name = 'doctor') WHERE role = 'dentist';
UPDATE users SET role_id = (SELECT id FROM roles WHERE name = 'receptionist') WHERE role = 'receptionist';

-- Add constraint to ensure role_id is not null for new users
ALTER TABLE users ALTER COLUMN role_id SET NOT NULL;