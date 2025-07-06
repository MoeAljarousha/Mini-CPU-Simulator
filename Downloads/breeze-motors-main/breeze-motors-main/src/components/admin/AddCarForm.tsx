
import React, { useState, useEffect } from 'react';
import { useOptimizedCarData } from '@/hooks/useOptimizedCarData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CONDITIONS, ENGINES, TRANSMISSIONS, DRIVETRAINS, FUEL_TYPES, EXTERIOR_COLORS, INTERIOR_COLORS, CAR_MAKES, CAR_MODELS, CAR_TRIMS } from '@/types/car';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import OptimizedImageUpload from '../optimized/OptimizedImageUpload';

interface AddCarFormProps {
  onCarAdded: () => void;
  editingCar?: any;
  onEditComplete?: () => void;
}

const AddCarForm = ({ onCarAdded, editingCar, onEditComplete }: AddCarFormProps) => {
  const { addCar, updateCar } = useOptimizedCarData();
  
  const [formData, setFormData] = useState({
    make: editingCar?.make || '',
    model: editingCar?.model || '',
    year: editingCar?.year?.toString() || '',
    price: editingCar?.price?.toString() || '',
    mileage: editingCar?.mileage?.toString() || '',
    fuelType: editingCar?.fuelType || 'Gasoline',
    condition: editingCar?.condition || 'Used – Good',
    engine: editingCar?.engine || 'Other',
    transmission: editingCar?.transmission || 'Automatic',
    drivetrain: editingCar?.drivetrain || 'FWD (Front-Wheel Drive)',
    exteriorColor: editingCar?.exteriorColor || 'Other',
    interiorColor: editingCar?.interiorColor || 'Other',
    stockNumber: editingCar?.stockNumber || '',
    vin: editingCar?.vin || '',
    features: editingCar?.features || '',
    trim: editingCar?.trim || 'Base',
    allowTestDrive: editingCar?.allowTestDrive ?? true
  });
  const [images, setImages] = useState<string[]>(editingCar?.images || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update form data when editingCar changes
  useEffect(() => {
    if (editingCar) {
      setFormData({
        make: editingCar.make || '',
        model: editingCar.model || '',
        year: editingCar.year?.toString() || '',
        price: editingCar.price?.toString() || '',
        mileage: editingCar.mileage?.toString() || '',
        fuelType: editingCar.fuel_type || 'Gasoline',
        condition: editingCar.condition || 'Used – Good',
        engine: editingCar.engine || 'Other',
        transmission: editingCar.transmission || 'Automatic',
        drivetrain: editingCar.drivetrain || 'FWD (Front-Wheel Drive)',
        exteriorColor: editingCar.exterior_color || 'Other',
        interiorColor: editingCar.interior_color || 'Other',
        stockNumber: editingCar.stock_number || '',
        vin: editingCar.vin || '',
        features: editingCar.features || '',
        trim: editingCar.trim || 'Base',
        allowTestDrive: editingCar.allow_test_drive ?? true
      });
      setImages(editingCar.images || []);
    }
  }, [editingCar]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: value
      };
      
      // Clear model and trim when make changes
      if (name === 'make') {
        newData.model = '';
        newData.trim = '';
      }
      
      // Clear trim when model changes
      if (name === 'model') {
        newData.trim = '';
      }
      
      return newData;
    });
    
    // Clear error for this field when user makes a selection
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.make) newErrors.make = 'Please select a make';
    if (!formData.model) newErrors.model = 'Please select a model';
    if (!formData.year) newErrors.year = 'Please enter the year';
    if (!formData.price) newErrors.price = 'Please enter the price';
    if (!formData.mileage) newErrors.mileage = 'Please enter the mileage';
    if (!formData.stockNumber) newErrors.stockNumber = 'Please enter the stock number';
    if (!formData.vin) newErrors.vin = 'Please enter the VIN';
    if (images.length === 0) newErrors.images = 'Please add at least one image';

    // Validate numeric fields
    if (formData.year && (parseInt(formData.year) < 1990 || parseInt(formData.year) > 2040)) {
      newErrors.year = 'Year must be between 1990 and 2040';
    }
    if (formData.price && parseInt(formData.price) <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }
    if (formData.mileage && parseInt(formData.mileage) < 0) {
      newErrors.mileage = 'Mileage cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getPriceRange = (price: number) => {
    if (price < 20000) return 'Under $20,000';
    if (price < 25000) return '$20,000 - $25,000';
    if (price < 30000) return '$25,000 - $30,000';
    if (price < 35000) return '$30,000 - $35,000';
    return '$35,000+';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const price = parseInt(formData.price);
      const carData = {
        make: formData.make,
        model: formData.model,
        year: parseInt(formData.year),
        price: price,
        priceRange: getPriceRange(price),
        mileage: parseInt(formData.mileage),
        fuelType: formData.fuelType,
        condition: formData.condition,
        engine: formData.engine,
        transmission: formData.transmission,
        drivetrain: formData.drivetrain,
        exteriorColor: formData.exteriorColor,
        interiorColor: formData.interiorColor,
        stockNumber: formData.stockNumber,
        vin: formData.vin,
        images: images,
        features: formData.features,
        trim: formData.trim,
        allowTestDrive: formData.allowTestDrive
      };

      if (editingCar) {
        await updateCar(editingCar.id, carData);
      } else {
        await addCar(carData);
      }

      if (editingCar) {
        toast({
          title: "Success", 
          description: "Car updated successfully!",
        });
        onEditComplete?.();
      } else {
        // Reset form only when adding new car
        setFormData({
          make: '',
          model: '',
          year: '',
          price: '',
          mileage: '',
          fuelType: 'Gasoline',
          condition: 'Used – Good',
          engine: 'Other',
          transmission: 'Automatic',
          drivetrain: 'FWD (Front-Wheel Drive)',
          exteriorColor: 'Other',
          interiorColor: 'Other',
          stockNumber: '',
          vin: '',
          features: '',
          trim: 'Base',
          allowTestDrive: true
        });
        setImages([]);

        toast({
          title: "Success",
          description: "Car added successfully!",
        });

        onCarAdded();
      }
    } catch (error) {
      console.error('Error saving car:', error);
      toast({
        title: "Error",
        description: editingCar ? "Failed to update car" : "Failed to add car",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto bg-black/20 border-white/10">
      <CardHeader>
        <CardTitle className="text-2xl text-white">
          {editingCar ? 'Edit Car' : 'Add New Car to Inventory'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2 text-white">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="make" className="text-white">Make *</Label>
                  <Select value={formData.make} onValueChange={(value) => handleSelectChange('make', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select make" />
                    </SelectTrigger>
                    <SelectContent>
                      {CAR_MAKES.map((make) => (
                        <SelectItem key={make} value={make}>{make}</SelectItem>
                      ))}
                    </SelectContent>
                   </Select>
                   {errors.make && <p className="text-red-400 text-sm mt-1">{errors.make}</p>}
                 </div>
                 <div>
                   <Label htmlFor="model" className="text-white">Model *</Label>
                  <Select 
                    value={formData.model} 
                    onValueChange={(value) => handleSelectChange('model', value)}
                    disabled={!formData.make}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={formData.make ? "Select model" : "Select make first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.make && CAR_MODELS[formData.make]?.map((model) => (
                        <SelectItem key={model} value={model}>{model}</SelectItem>
                      ))}
                    </SelectContent>
                   </Select>
                   {errors.model && <p className="text-red-400 text-sm mt-1">{errors.model}</p>}
                 </div>
               </div>

              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="trim" className="text-white">Trim Level</Label>
                  <Select 
                    value={formData.trim} 
                    onValueChange={(value) => handleSelectChange('trim', value)}
                    disabled={!formData.make || !formData.model}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={formData.make && formData.model ? "Select trim level" : "Select make and model first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.make && formData.model && CAR_TRIMS[formData.make]?.[formData.model]?.map((trim) => (
                        <SelectItem key={trim} value={trim}>{trim}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="year" className="text-white">Year *</Label>
                  <Input
                    id="year"
                    name="year"
                    type="number"
                    value={formData.year}
                    onChange={handleInputChange}
                    placeholder="e.g., 2022"
                    min="1990"
                    max="2040"
                    required
                   />
                   {errors.year && <p className="text-red-400 text-sm mt-1">{errors.year}</p>}
                 </div>
                 <div>
                   <Label htmlFor="price" className="text-white">Price ($) *</Label>
                   <Input
                     id="price"
                     name="price"
                     type="number"
                     value={formData.price}
                     onChange={handleInputChange}
                     placeholder="e.g., 25000"
                     min="0"
                     required
                   />
                   {errors.price && <p className="text-red-400 text-sm mt-1">{errors.price}</p>}
                 </div>
                 <div>
                   <Label htmlFor="mileage" className="text-white">Mileage (km) *</Label>
                   <Input
                     id="mileage"
                     name="mileage"
                     type="number"
                     value={formData.mileage}
                     onChange={handleInputChange}
                     placeholder="e.g., 15000"
                     min="0"
                     required
                   />
                   {errors.mileage && <p className="text-red-400 text-sm mt-1">{errors.mileage}</p>}
                </div>
              </div>
            </div>

          {/* Vehicle Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2 text-white">Vehicle Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="condition" className="text-white">Condition *</Label>
                <Select value={formData.condition} onValueChange={(value) => handleSelectChange('condition', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    {CONDITIONS.map((condition) => (
                      <SelectItem key={condition} value={condition}>{condition}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="fuelType" className="text-white">Fuel Type *</Label>
                <Select value={formData.fuelType} onValueChange={(value) => handleSelectChange('fuelType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select fuel type" />
                  </SelectTrigger>
                  <SelectContent>
                    {FUEL_TYPES.map((fuelType) => (
                      <SelectItem key={fuelType} value={fuelType}>{fuelType}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="engine" className="text-white">Engine *</Label>
                <Select value={formData.engine} onValueChange={(value) => handleSelectChange('engine', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select engine" />
                  </SelectTrigger>
                  <SelectContent>
                    {ENGINES.map((engine) => (
                      <SelectItem key={engine} value={engine}>{engine}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="transmission" className="text-white">Transmission *</Label>
                <Select value={formData.transmission} onValueChange={(value) => handleSelectChange('transmission', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select transmission" />
                  </SelectTrigger>
                  <SelectContent>
                    {TRANSMISSIONS.map((transmission) => (
                      <SelectItem key={transmission} value={transmission}>{transmission}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="drivetrain" className="text-white">Drivetrain *</Label>
                <Select value={formData.drivetrain} onValueChange={(value) => handleSelectChange('drivetrain', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select drivetrain" />
                  </SelectTrigger>
                  <SelectContent>
                    {DRIVETRAINS.map((drivetrain) => (
                      <SelectItem key={drivetrain} value={drivetrain}>{drivetrain}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2 mt-8">
                <Switch
                  id="allowTestDrive"
                  checked={formData.allowTestDrive}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, allowTestDrive: checked }))}
                />
                <Label htmlFor="allowTestDrive" className="text-white">Allow Test Drive</Label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="exteriorColor" className="text-white">Exterior Color *</Label>
                <Select value={formData.exteriorColor} onValueChange={(value) => handleSelectChange('exteriorColor', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select exterior color" />
                  </SelectTrigger>
                  <SelectContent>
                    {EXTERIOR_COLORS.map((color) => (
                      <SelectItem key={color} value={color}>{color}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="interiorColor" className="text-white">Interior Color *</Label>
                <Select value={formData.interiorColor} onValueChange={(value) => handleSelectChange('interiorColor', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select interior color" />
                  </SelectTrigger>
                  <SelectContent>
                    {INTERIOR_COLORS.map((color) => (
                      <SelectItem key={color} value={color}>{color}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="stockNumber" className="text-white">Stock Number *</Label>
                <Input
                  id="stockNumber"
                  name="stockNumber"
                  value={formData.stockNumber}
                  onChange={handleInputChange}
                  placeholder="e.g., ABC123 or N/A"
                  required
                  />
                  {errors.stockNumber && <p className="text-red-400 text-sm mt-1">{errors.stockNumber}</p>}
                </div>
                <div>
                  <Label htmlFor="vin" className="text-white">VIN *</Label>
                  <Input
                    id="vin"
                    name="vin"
                    value={formData.vin}
                    onChange={handleInputChange}
                    placeholder="e.g., 1HGBH41JXMN109186 or N/A"
                    required
                  />
                  {errors.vin && <p className="text-red-400 text-sm mt-1">{errors.vin}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="features" className="text-white">Features & Equipment</Label>
              <Textarea
                id="features"
                name="features"
                value={formData.features}
                onChange={handleInputChange}
                placeholder="e.g., Apple CarPlay, Android Auto, Backup Camera, Bluetooth, Leather Seats..."
                rows={3}
              />
            </div>
          </div>

          {/* Images */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2 text-white">Images</h3>
            <OptimizedImageUpload 
              images={images} 
              onImagesChange={(newImages) => {
                setImages(newImages);
                // Clear images error when user adds images
                if (errors.images && newImages.length > 0) {
                  setErrors(prev => ({
                    ...prev,
                    images: ''
                  }));
                }
              }} 
            />
            {errors.images && <p className="text-red-400 text-sm mt-1">{errors.images}</p>}
          </div>

          <div className={editingCar ? "flex gap-4" : ""}>
            {editingCar && (
              <Button 
                type="button" 
                variant="outline"
                className="flex-1" 
                onClick={onEditComplete}
                disabled={isSubmitting}
                size="lg"
              >
                Cancel
              </Button>
            )}
            <Button 
              type="submit" 
              className={editingCar ? "flex-1" : "w-full"}
              disabled={isSubmitting}
              size="lg"
            >
              {isSubmitting 
                ? (editingCar ? 'Updating Car...' : 'Adding Car...') 
                : (editingCar ? 'Update Car' : 'Add Car to Inventory')
              }
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddCarForm;
