-- Create cars table
CREATE TABLE cars (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    make VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    year INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    price_range VARCHAR(50) NOT NULL,
    mileage INTEGER NOT NULL,
    fuel_type VARCHAR(20) NOT NULL,
    images TEXT[] NOT NULL DEFAULT '{}',
    features TEXT,
    allow_test_drive BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin_users table
CREATE TABLE admin_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Cars policies - anyone can read, only admins can modify
CREATE POLICY "Anyone can view cars" ON cars FOR SELECT USING (true);

CREATE POLICY "Only admins can insert cars" ON cars FOR INSERT 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Only admins can update cars" ON cars FOR UPDATE 
    USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Only admins can delete cars" ON cars FOR DELETE 
    USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE user_id = auth.uid()
        )
    );

-- Admin users policies - only admins can view admin list
CREATE POLICY "Only admins can view admin_users" ON admin_users FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE user_id = auth.uid()
        )
    );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_cars_updated_at 
    BEFORE UPDATE ON cars 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO cars (make, model, year, price, price_range, mileage, fuel_type, images, features, allow_test_drive) VALUES
('Honda', 'Civic', 2022, 24999, '$20,000 - $25,000', 15000, 'Gasoline', ARRAY['https://images.unsplash.com/photo-1493397212122-2b85dda8106b'], 'Apple CarPlay, Android Auto, Backup Camera, Bluetooth', true),
('Toyota', 'Camry', 2023, 28999, '$25,000 - $30,000', 8000, 'Gasoline', ARRAY['https://images.unsplash.com/photo-1518005020951-eccb494ad742'], 'Toyota Safety Sense 2.0, LED Headlights, Wireless Charging', true),
('Ford', 'Mustang', 2021, 35999, '$30,000 - $35,000', 22000, 'Gasoline', ARRAY['https://images.unsplash.com/photo-1527576539890-dfa815648363'], 'V8 Engine, Premium Sound System, Performance Suspension', false);