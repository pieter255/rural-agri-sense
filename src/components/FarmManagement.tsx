
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, MapPin, Calendar, Leaf, TrendingUp } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { farmLocationService, cropService } from '@/services/dataService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AddFarmModal from '@/components/AddFarmModal';
import AddCropModal from '@/components/AddCropModal';
import useNotification from '@/hooks/useNotification';

const FarmManagement = () => {
  const { user, isAuthenticated } = useAuth();
  const { showSuccess, showError } = useNotification();
  const queryClient = useQueryClient();
  const [showAddFarm, setShowAddFarm] = useState(false);
  const [showAddCrop, setShowAddCrop] = useState(false);

  // Fetch farm locations
  const { data: farms = [], isLoading: farmsLoading } = useQuery({
    queryKey: ['farm-locations'],
    queryFn: farmLocationService.getAll,
    enabled: isAuthenticated,
  });

  // Fetch user crops
  const { data: crops = [], isLoading: cropsLoading } = useQuery({
    queryKey: ['user-crops'],
    queryFn: cropService.getAll,
    enabled: isAuthenticated,
  });

  // Delete farm mutation
  const deleteFarmMutation = useMutation({
    mutationFn: farmLocationService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farm-locations'] });
      showSuccess('Farm deleted successfully');
    },
    onError: () => {
      showError('Failed to delete farm');
    }
  });

  // Delete crop mutation
  const deleteCropMutation = useMutation({
    mutationFn: cropService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-crops'] });
      showSuccess('Crop deleted successfully');
    },
    onError: () => {
      showError('Failed to delete crop');
    }
  });

  if (!isAuthenticated) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-600">Please log in to manage your farms and crops.</p>
        </CardContent>
      </Card>
    );
  }

  const getGrowthStageColor = (stage: string) => {
    switch (stage) {
      case 'planting': return 'bg-yellow-100 text-yellow-800';
      case 'germination': return 'bg-green-100 text-green-800';
      case 'vegetative': return 'bg-emerald-100 text-emerald-800';
      case 'flowering': return 'bg-pink-100 text-pink-800';
      case 'fruiting': return 'bg-orange-100 text-orange-800';
      case 'maturity': return 'bg-purple-100 text-purple-800';
      case 'harvest': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Farm Locations */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Farm Locations
              </CardTitle>
              <CardDescription>
                Manage your farm locations and properties
              </CardDescription>
            </div>
            <Button onClick={() => setShowAddFarm(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Farm
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {farmsLoading ? (
            <p>Loading farms...</p>
          ) : farms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {farms.map((farm) => (
                <Card key={farm.id} className="border">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{farm.name}</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteFarmMutation.mutate(farm.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Delete
                      </Button>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>Size: {farm.size_hectares} hectares</p>
                      <p>Coordinates: {farm.latitude.toFixed(4)}, {farm.longitude.toFixed(4)}</p>
                      {farm.soil_type && <p>Soil: {farm.soil_type}</p>}
                      {farm.elevation_meters && <p>Elevation: {farm.elevation_meters}m</p>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No farms registered yet</p>
              <Button onClick={() => setShowAddFarm(true)}>Add Your First Farm</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Crops */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="h-5 w-5" />
                Crops
              </CardTitle>
              <CardDescription>
                Track your planted crops and their growth stages
              </CardDescription>
            </div>
            <Button onClick={() => setShowAddCrop(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Crop
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {cropsLoading ? (
            <p>Loading crops...</p>
          ) : crops.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {crops.map((crop) => (
                <Card key={crop.id} className="border">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold capitalize">{crop.crop_type}</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteCropMutation.mutate(crop.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Delete
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      {crop.variety && (
                        <p className="text-sm text-gray-600">Variety: {crop.variety}</p>
                      )}
                      
                      <div className="flex items-center gap-2">
                        <Badge className={getGrowthStageColor(crop.growth_stage || 'planting')}>
                          {crop.growth_stage || 'planting'}
                        </Badge>
                      </div>
                      
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>Planted: {new Date(crop.planting_date).toLocaleDateString()}</span>
                        </div>
                        
                        {crop.expected_harvest_date && (
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            <span>Harvest: {new Date(crop.expected_harvest_date).toLocaleDateString()}</span>
                          </div>
                        )}
                        
                        <p>Area: {crop.area_hectares} hectares</p>
                      </div>
                      
                      {crop.notes && (
                        <p className="text-sm text-gray-600 italic">Notes: {crop.notes}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Leaf className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No crops planted yet</p>
              <Button onClick={() => setShowAddCrop(true)}>Plant Your First Crop</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <AddFarmModal 
        isOpen={showAddFarm} 
        onClose={() => setShowAddFarm(false)} 
      />
      <AddCropModal 
        isOpen={showAddCrop} 
        onClose={() => setShowAddCrop(false)}
        farms={farms}
      />
    </div>
  );
};

export default FarmManagement;
