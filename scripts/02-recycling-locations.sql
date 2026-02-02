-- Create recycling_locations table for admin-managed zones
CREATE TABLE IF NOT EXISTS recycling_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  radius_meters INTEGER DEFAULT 100,
  active BOOLEAN DEFAULT true,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add columns to recycling_submissions for GPS tracking
ALTER TABLE recycling_submissions 
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8),
ADD COLUMN IF NOT EXISTS is_within_allowed_zone BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS matched_location_id UUID REFERENCES recycling_locations(id);

-- Enable RLS on recycling_locations
ALTER TABLE recycling_locations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for recycling_locations
CREATE POLICY "Users can view all recycling locations" ON recycling_locations FOR SELECT USING (true);
CREATE POLICY "Only admins can create locations" ON recycling_locations FOR INSERT WITH CHECK (
  auth.uid() IN (SELECT user_id FROM admin_users)
);
CREATE POLICY "Only admins can update locations" ON recycling_locations FOR UPDATE USING (
  auth.uid() IN (SELECT user_id FROM admin_users)
);
CREATE POLICY "Only admins can delete locations" ON recycling_locations FOR DELETE USING (
  auth.uid() IN (SELECT user_id FROM admin_users)
);

-- Create admin_users helper table if it doesn't exist
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view admin list" ON admin_users FOR SELECT USING (true);
