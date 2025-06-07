
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { farmLocationService } from '@/services/dataService';
import { useAuth } from '@/hooks/useAuth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useNotification from '@/hooks/useNotification';

interface AddFarmModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddFarmModal = ({ isOpen, onClose }: AddFarmModalProps) => {
  const { user } = useAuth();
  const { showSuccess, showError } = useNotification();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    name: '',
    latitude: '',
    longitude: '',
    size_hectares: '',
    soil_type: '',
    elevation_meters: ''
  });

  const mutation = useMutation({
    mutationFn: farmLocationService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farm-locations'] });
      showSuccess('Farm added successfully!');
      setFormData({
        name: '',
        latitude: '',
        longitude: '',
        size_hectares: '',
        soil_type: '',
        elevation_meters: ''
      });
      onClose();
    },
    onError: (error: any) => {
      console.error('Error adding farm:', error);
      showError('Failed to add farm. Please try again.');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      showError('User not found');
      return;
    }

    if (!formData.name || !formData.latitude || !formData.longitude || !formData.size_hectares) {
      showError('Please fill in all required fields');
      return;
    }

    mutation.mutate({
      user_id: user.id,
      name: formData.name,
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude),
      size_hectares: parseFloat(formData.size_hectares),
      soil_type: formData.soil_type || null,
      elevation_meters: formData.elevation_meters ? parseInt(formData.elevation_meters) : null
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Get current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString()
          }));
          showSuccess('Location detected successfully!');
        },
        (error) => {
          console.error('Geolocation error:', error);
          showError('Could not get current location. Please enter coordinates manually.');
        }
      );
    } else {
      showError('Geolocation is not supported by this browser.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Farm Location</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Farm Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="e.g., Main Farm, North Field"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude *</Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) => handleInputChange('latitude', e.target.value)}
                placeholder="-29.3167"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude *</Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e) => handleInputChange('longitude', e.target.value)}
                placeholder="27.4833"
                required
              />
            </div>
          </div>

          <Button 
            type="button" 
            variant="outline" 
            onClick={getCurrentLocation}
            className="w-full"
          >
            Use Current Location
          </Button>

          <div className="space-y-2">
            <Label htmlFor="size">Farm Size (hectares) *</Label>
            <Input
              id="size"
              type="number"
              step="0.1"
              value={formData.size_hectares}
              onChange={(e) => handleInputChange('size_hectares', e.target.value)}
              placeholder="5.2"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="soil">Soil Type</Label>
            <Input
              id="soil"
              value={formData.soil_type}
              onChange={(e) => handleInputChange('soil_type', e.target.value)}
              placeholder="e.g., Clay, Sandy, Loam"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="elevation">Elevation (meters)</Label>
            <Input
              id="elevation"
              type="number"
              value={formData.elevation_meters}
              onChange={(e) => handleInputChange('elevation_meters', e.target.value)}
              placeholder="1500"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Adding...' : 'Add Farm'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddFarmModal;
