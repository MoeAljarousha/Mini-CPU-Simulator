
export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  priceRange: string;
  mileage: number;
  fuelType: string;
  condition: string;
  engine: string;
  transmission: string;
  drivetrain: string;
  exteriorColor: string;
  interiorColor: string;
  stockNumber: string;
  vin: string;
  images: string[];
  features: string;
  trim: string;
  allowTestDrive: boolean;
  createdAt: string;
}

export const CAR_MAKES = [
  'Honda', 'Toyota', 'Ford', 'Chevrolet', 'Nissan', 'Hyundai', 
  'Kia', 'Mazda', 'Subaru', 'Volkswagen', 'Jeep', 'Dodge', 
  'Chrysler', 'Buick', 'GMC', 'Lexus', 'Acura', 'Infiniti'
] as const;

export const CAR_MODELS: Record<string, string[]> = {
  Honda: ['Civic', 'Accord', 'CR-V', 'Pilot', 'Fit', 'HR-V', 'Odyssey', 'Ridgeline'],
  Toyota: ['Camry', 'Corolla', 'RAV4', 'Highlander', 'Prius', 'Sienna', 'Tacoma', 'Tundra'],
  Ford: ['F-150', 'Escape', 'Explorer', 'Focus', 'Fusion', 'Mustang', 'Edge', 'Expedition'],
  Chevrolet: ['Silverado', 'Equinox', 'Malibu', 'Cruze', 'Tahoe', 'Suburban', 'Camaro', 'Corvette'],
  Nissan: ['Altima', 'Sentra', 'Rogue', 'Pathfinder', 'Titan', 'Versa', 'Maxima', 'Murano'],
  Hyundai: ['Elantra', 'Sonata', 'Tucson', 'Santa Fe', 'Accent', 'Genesis', 'Palisade', 'Venue', 'Veloster', 'Ioniq', 'Kona'],
  Kia: ['Forte', 'Optima', 'Sorento', 'Sportage', 'Rio', 'Stinger', 'Telluride', 'Soul'],
  Mazda: ['Mazda3', 'Mazda6', 'CX-5', 'CX-9', 'MX-5', 'CX-3', 'CX-30', 'CX-50'],
  Subaru: ['Outback', 'Forester', 'Impreza', 'Legacy', 'Crosstrek', 'Ascent', 'WRX', 'BRZ'],
  Volkswagen: ['Jetta', 'Passat', 'Tiguan', 'Atlas', 'Golf', 'Beetle', 'Arteon', 'ID.4'],
  Jeep: ['Wrangler', 'Grand Cherokee', 'Cherokee', 'Compass', 'Renegade', 'Gladiator', 'Patriot'],
  Dodge: ['Charger', 'Challenger', 'Durango', 'Journey', 'Grand Caravan', 'Ram 1500', 'Dart'],
  Chrysler: ['300', 'Pacifica', 'Voyager', 'Sebring', 'Town & Country'],
  Buick: ['Enclave', 'Encore', 'Envision', 'LaCrosse', 'Regal', 'Verano'],
  GMC: ['Sierra', 'Terrain', 'Acadia', 'Yukon', 'Canyon', 'Savana'],
  Lexus: ['ES', 'RX', 'NX', 'GX', 'LX', 'IS', 'GS', 'LS'],
  Acura: ['TLX', 'RDX', 'MDX', 'ILX', 'NSX', 'RLX', 'CDX'],
  Infiniti: ['Q50', 'Q60', 'QX50', 'QX60', 'QX80', 'Q70', 'QX30']
};

export const PRICE_RANGES = [
  'Under $5,000',
  '$5,000 - $10,000',
  '$10,000 - $15,000',
  '$15,000 - $20,000',
  '$20,000 - $25,000',
  '$25,000 - $30,000',
  '$30,000 - $35,000',
  'Over $35,000'
] as const;

export const CONDITIONS = [
  'New',
  'Like New',
  'Certified Pre-Owned (CPO)',
  'Used – Excellent',
  'Used – Good',
  'Used – Fair',
  'Salvage / Rebuilt'
] as const;

export const ENGINES = [
  '1.0L I3',
  '1.0L I3 Turbo',
  '1.2L I4',
  '1.3L I4',
  '1.4L I4',
  '1.4L I4 Turbo',
  '1.5L I4',
  '1.5L I4 Turbo',
  '1.6L I4',
  '1.6L I4 Turbo',
  '1.8L I4',
  '1.8L I4 Hybrid',
  '2.0L I4',
  '2.0L I4 Turbo',
  '2.2L I4',
  '2.3L I4',
  '2.3L I4 Turbo',
  '2.4L I4',
  '2.5L I4',
  '2.5L I4 Hybrid',
  '2.5L I5',
  '2.7L I4',
  '3.0L I6',
  '3.0L I6 Twin-Turbo',
  '3.2L I6',
  '3.5L V6',
  '3.6L V6',
  '3.7L V6',
  '4.0L V6',
  '4.0L V8',
  '4.6L V8',
  '5.0L V8',
  '5.3L V8',
  '5.4L V8',
  '5.7L V8',
  '6.0L V8',
  '6.2L V8',
  '6.2L V8 Supercharged',
  '6.4L V8',
  '7.0L V8',
  'V10 (5.2L)',
  'V12 (6.0L)',
  'Rotary (1.3L)',
  '2.0L I4 Diesel',
  '2.8L I4 Diesel',
  '3.0L V6 Diesel',
  '3.0L I6 Diesel',
  '6.6L V8 Diesel (Duramax)',
  'Electric – Single Motor',
  'Electric – Dual Motor (AWD)',
  'Electric – Tri Motor',
  'Plug-In Hybrid (PHEV)',
  'Mild Hybrid (MHEV)',
  'Hydrogen Fuel Cell',
  'Other'
] as const;

export const TRANSMISSIONS = [
  'Automatic',
  'Manual',
  'CVT (Continuously Variable Transmission)',
  'Dual-Clutch (DCT)',
  'Semi-Automatic',
  'Tiptronic / Manumatic',
  'Automated Manual Transmission (AMT)',
  'Direct Drive (Electric Vehicles)',
  'Single-Speed (EVs)',
  'Other'
] as const;

export const DRIVETRAINS = [
  'FWD (Front-Wheel Drive)',
  'RWD (Rear-Wheel Drive)',
  'AWD (All-Wheel Drive)',
  '4WD (Four-Wheel Drive)',
  'Part-Time 4WD',
  'Full-Time 4WD',
  'eAWD (Electric All-Wheel Drive)',
  'Other'
] as const;

export const FUEL_TYPES = [
  'Gasoline',
  'Diesel',
  'Electric',
  'Hybrid (Gas/Electric)',
  'Plug-In Hybrid (PHEV)',
  'Hydrogen Fuel Cell',
  'Flex-Fuel (E85)',
  'Compressed Natural Gas (CNG)',
  'Liquefied Petroleum Gas (LPG)',
  'Other'
] as const;

export const EXTERIOR_COLORS = [
  'Black',
  'White',
  'Silver',
  'Gray',
  'Blue',
  'Red',
  'Green',
  'Yellow',
  'Orange',
  'Brown',
  'Gold',
  'Beige',
  'Purple',
  'Burgundy / Maroon',
  'Teal / Turquoise',
  'Matte (Black, Gray, etc.)',
  'Two-Tone',
  'Custom / Wrapped',
  'Other'
] as const;

export const INTERIOR_COLORS = [
  'Black',
  'Gray',
  'Beige / Tan',
  'Brown / Saddle',
  'White / Ivory',
  'Red',
  'Blue',
  'Burgundy',
  'Two-Tone',
  'Custom',
  'Other'
] as const;

export const CAR_TRIMS: Record<string, Record<string, string[]>> = {
  Honda: {
    'Civic': ['LX', 'EX', 'EX-L', 'Touring', 'Si', 'Type R'],
    'Accord': ['LX', 'EX', 'EX-L', 'Touring', 'Sport', 'Hybrid'],
    'CR-V': ['LX', 'EX', 'EX-L', 'Touring', 'Hybrid'],
    'Pilot': ['LX', 'EX', 'EX-L', 'Touring', 'Elite'],
    'Fit': ['LX', 'EX', 'EX-L'],
    'HR-V': ['LX', 'EX', 'EX-L'],
    'Odyssey': ['LX', 'EX', 'EX-L', 'Touring', 'Elite'],
    'Ridgeline': ['RT', 'RTL', 'RTL-E', 'Black Edition']
  },
  Toyota: {
    'Camry': ['LE', 'SE', 'XLE', 'XSE', 'TRD', 'Hybrid LE', 'Hybrid SE', 'Hybrid XLE', 'Hybrid XSE'],
    'Corolla': ['L', 'LE', 'SE', 'XLE', 'XSE', 'Hybrid LE', 'Hybrid SE'],
    'RAV4': ['LE', 'XLE', 'XLE Premium', 'Adventure', 'TRD Off-Road', 'Limited', 'Hybrid LE', 'Hybrid XLE', 'Hybrid XSE', 'Prime SE', 'Prime XSE'],
    'Highlander': ['L', 'LE', 'XLE', 'Limited', 'Platinum', 'Hybrid LE', 'Hybrid XLE', 'Hybrid Limited', 'Hybrid Platinum'],
    'Prius': ['L Eco', 'LE', 'XLE', 'Limited'],
    'Sienna': ['LE', 'XLE', 'XSE', 'Limited', 'Platinum'],
    'Tacoma': ['SR', 'SR5', 'TRD Sport', 'TRD Off-Road', 'Limited', 'TRD Pro'],
    'Tundra': ['SR', 'SR5', '1794', 'Platinum', 'TRD Pro', 'Capstone']
  },
  Ford: {
    'F-150': ['Regular Cab', 'SuperCab', 'SuperCrew', 'XL', 'XLT', 'Lariat', 'King Ranch', 'Platinum', 'Limited', 'Raptor'],
    'Escape': ['S', 'SE', 'SEL', 'Titanium'],
    'Explorer': ['Base', 'XLT', 'Limited', 'Platinum', 'ST'],
    'Focus': ['S', 'SE', 'SEL', 'Titanium', 'ST', 'RS'],
    'Fusion': ['S', 'SE', 'SEL', 'Titanium', 'Sport'],
    'Mustang': ['EcoBoost', 'EcoBoost Premium', 'GT', 'GT Premium', 'Mach 1', 'Shelby GT350', 'Shelby GT500'],
    'Edge': ['SE', 'SEL', 'Titanium', 'ST'],
    'Expedition': ['XLT', 'Limited', 'King Ranch', 'Platinum', 'MAX']
  },
  Chevrolet: {
    'Silverado': ['Work Truck', 'Custom', 'LT', 'RST', 'LTZ', 'High Country', 'ZR2'],
    'Equinox': ['L', 'LS', 'LT', 'Premier'],
    'Malibu': ['L', 'LS', 'LT', 'Premier'],
    'Cruze': ['L', 'LS', 'LT', 'Premier'],
    'Tahoe': ['LS', 'LT', 'RST', 'Premier', 'High Country'],
    'Suburban': ['LS', 'LT', 'RST', 'Premier', 'High Country'],
    'Camaro': ['1LS', '1LT', '2LT', '1SS', '2SS', 'ZL1'],
    'Corvette': ['1LT', '2LT', '3LT', 'Z06', 'ZR1']
  },
  Nissan: {
    'Altima': ['S', 'SV', 'SL', 'Platinum'],
    'Sentra': ['S', 'SV', 'SR'],
    'Rogue': ['S', 'SV', 'SL', 'Platinum'],
    'Pathfinder': ['S', 'SV', 'SL', 'Platinum'],
    'Titan': ['S', 'SV', 'SL', 'Platinum Reserve'],
    'Versa': ['S', 'SV', 'SR'],
    'Maxima': ['S', 'SV', 'SL', 'SR', 'Platinum'],
    'Murano': ['S', 'SV', 'SL', 'Platinum']
  },
  Hyundai: {
    'Elantra': ['SE', 'SEL', 'Limited', 'N Line'],
    'Sonata': ['SE', 'SEL', 'Limited'],
    'Tucson': ['SE', 'SEL', 'Limited'],
    'Santa Fe': ['SE', 'SEL', 'Limited', 'Calligraphy'],
    'Accent': ['SE', 'SEL'],
    'Genesis': ['3.8', '5.0'],
    'Palisade': ['SE', 'SEL', 'Limited', 'Calligraphy'],
    'Venue': ['SE', 'SEL'],
    'Veloster': ['2.0', 'Turbo', 'N'],
    'Ioniq': ['Blue', 'SEL', 'Limited'],
    'Kona': ['SE', 'SEL', 'Limited', 'N']
  },
  Kia: {
    'Forte': ['LXS', 'S', 'EX', 'GT'],
    'Optima': ['LX', 'S', 'EX', 'SX'],
    'Sorento': ['LX', 'S', 'EX', 'SX'],
    'Sportage': ['LX', 'S', 'EX', 'SX Turbo'],
    'Rio': ['LX', 'S'],
    'Stinger': ['GT-Line', 'GT1', 'GT2'],
    'Telluride': ['LX', 'S', 'EX', 'SX'],
    'Soul': ['LX', 'S', 'EX', 'GT-Line']
  }
};

export const SERVICE_TYPES = [
  'Oil Change',
  'Brake Pad Replacement',
  'Tire Service',
  'Battery Replacement',
  'Engine Diagnostics',
  'Car Detailing',
  'Safety Inspection',
  'General Repair',
  'Rust Treatment',
  'Paint Service'
] as const;
