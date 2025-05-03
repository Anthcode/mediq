/*
  Update profiles table schema
  
  Changes:
  1. Add role column
  2. Add updated_at column and trigger
  3. Make first_name and last_name optional as per schema design
  4. Add default role as 'patient'
*/

-- Add new columns to profiles
ALTER TABLE profiles
  ALTER COLUMN first_name DROP NOT NULL,
  ALTER COLUMN last_name DROP NOT NULL,
  ADD COLUMN IF NOT EXISTS role VARCHAR(20) NOT NULL DEFAULT 'patient',
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

-- Add trigger for updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Update existing profiles to have the default role
UPDATE profiles SET role = 'patient' WHERE role IS NULL;

-- Add policy for administrators to manage all profiles
CREATE POLICY "Administrators can manage all profiles"
  ON profiles
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'administrator');

-- Grant necessary permissions
GRANT ALL ON profiles TO authenticated;