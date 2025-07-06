
import React, { useState } from 'react';
import { Trash2, Edit2, Eye } from 'lucide-react';
import { useOptimizedCarData } from '@/hooks/useOptimizedCarData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import OptimizedCarImageCarousel from '../optimized/OptimizedCarImageCarousel';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface AdminCarListProps {
  onEditCar?: (carId: string) => void;
}

const AdminCarList = ({ onEditCar }: AdminCarListProps) => {
  const { cars, removeCar, loading } = useOptimizedCarData();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDeleteCar = async (carId: string) => {
    setDeletingId(carId);
    try {
      await removeCar(carId);
    } catch (error) {
      console.error('Error deleting car:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPriceRangeColor = (priceRange: string) => {
    if (priceRange.includes('$30,000')) return 'bg-purple-100 text-purple-800';
    if (priceRange.includes('$25,000')) return 'bg-blue-100 text-blue-800';
    if (priceRange.includes('$20,000')) return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-white text-lg">Loading cars...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Current Inventory ({cars.length} cars)</h2>
      </div>

      {cars.length === 0 ? (
        <Card className="bg-black/20 border-white/10">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-white/80 text-lg mb-4">No cars in inventory</p>
            <p className="text-white/60">Add your first car to get started</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {cars.map((car) => (
            <Card key={car.id} className="overflow-hidden hover:shadow-lg transition-shadow bg-black/20 border-white/10">
              <div className="relative">
                <OptimizedCarImageCarousel
                  images={car.images}
                  alt={`${car.make} ${car.model}`}
                  className=""
                  aspectRatio="aspect-video"
                />
                {car.allowTestDrive && (
                  <Badge className="absolute top-2 left-2 bg-green-500 hover:bg-green-600 z-10">
                    Test Drive Available
                  </Badge>
                )}
              </div>
              
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg text-white">
                    {car.year} {car.make} {car.model}
                  </CardTitle>
                  <Badge variant="outline" className="text-white border-white/20">
                    {car.priceRange}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <p className="text-2xl font-bold text-green-400">
                    ${car.price.toLocaleString()}
                  </p>
                  <div className="text-sm text-white/60">
                    Added {formatDate(car.createdAt)}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-white/60">Mileage:</span>
                    <p className="font-medium text-white">{car.mileage.toLocaleString()} km</p>
                  </div>
                  <div>
                    <span className="text-white/60">Fuel:</span>
                    <p className="font-medium text-white">{car.fuelType}</p>
                  </div>
                </div>

                {car.features && (
                  <div className="text-sm">
                    <span className="text-white/60">Features:</span>
                    <p className="truncate font-medium text-white" title={car.features}>
                      {car.features}
                    </p>
                  </div>
                )}
                
                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => window.open(`/car/${car.id}`, '_blank')}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  
                  {onEditCar && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => onEditCar(car.id)}
                    >
                      <Edit2 className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  )}
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        disabled={deletingId === car.id}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Car</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this {car.year} {car.make} {car.model}? 
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDeleteCar(car.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminCarList;
