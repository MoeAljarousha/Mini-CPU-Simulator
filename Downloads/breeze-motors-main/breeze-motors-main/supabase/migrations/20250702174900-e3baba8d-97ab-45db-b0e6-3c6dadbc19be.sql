-- Add new car fields
ALTER TABLE cars ADD COLUMN condition VARCHAR(50) NOT NULL DEFAULT 'Used – Good';
ALTER TABLE cars ADD COLUMN engine VARCHAR(100) NOT NULL DEFAULT 'Other';
ALTER TABLE cars ADD COLUMN transmission VARCHAR(50) NOT NULL DEFAULT 'Automatic';
ALTER TABLE cars ADD COLUMN drivetrain VARCHAR(50) NOT NULL DEFAULT 'FWD (Front-Wheel Drive)';
ALTER TABLE cars ADD COLUMN exterior_color VARCHAR(50) NOT NULL DEFAULT 'Other';
ALTER TABLE cars ADD COLUMN interior_color VARCHAR(50) NOT NULL DEFAULT 'Other';
ALTER TABLE cars ADD COLUMN stock_number VARCHAR(100) NOT NULL DEFAULT 'N/A';
ALTER TABLE cars ADD COLUMN vin VARCHAR(17) NOT NULL DEFAULT 'N/A';

-- Update existing records to have default values
UPDATE cars SET 
  condition = 'Used – Good',
  engine = 'Other',
  transmission = 'Automatic',
  drivetrain = 'FWD (Front-Wheel Drive)',
  exterior_color = 'Other',
  interior_color = 'Other',
  stock_number = 'N/A',
  vin = 'N/A'
WHERE condition IS NULL;