-- Add trim column to cars table
ALTER TABLE public.cars 
ADD COLUMN trim VARCHAR DEFAULT 'Base';