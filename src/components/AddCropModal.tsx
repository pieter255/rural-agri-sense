
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cropService } from '@/services/dataService';
import { useAuth } from '@/hooks/useAuth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useNotification from '@/hooks/useNotification';
import type { Database } from '@/integrations/supabase/types';

type CropType = Database['public']['Enums']['crop_type'];
type GrowthStage = Database['public']['Enums']['growth_stage'];
type FarmLocation = Database['public']['Tables']['farm_locations']['Row'];

interface AddCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  farms: FarmLocation[];
}

const cropTypes: CropType[] = [
  'maize', 'beans', 'wheat', 'sorghum', 'sunflower', 
  'potato', 'tomato', 'cabbage', 'onion', 'carrot'
];

const growthStages: GrowthStage[] = [
  'planting', 'germination', 'vegetative', 'flowering', 
  'fruiting', 'maturity', 'harvest'
];

const AddCropModal = ({ isOpen, onClose, farms }: AddCropModalProps) => {
  const { user } = useAuth();
  const { showSuccess, showError } = useNotification();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    crop_type: '' as CropType,
    variety: '',
    planting_date: '',
    expected_harvest_date: '',
    area_hectares: '',
    growth_stage: 'planting' as GrowthStage,
    farm_location_id: '',
    notes: ''
  });

  const mutation = useMutation({
    mutationFn: cropService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-crops'] });
      showSuccess('Crop added successfully!');
      setFormData({
        crop_type: '' as CropType,
        variety: '',
        planting_date: '',
        expected_harvest_date: '',
        area_hectares: '',
        growth_stage: 'planting',
        farm_location_id: '',
        notes: ''
      });
      onClose();
    },
    onError: (error: any) => {
      console.error('Error adding crop:', error);
      showError('Failed to add crop. Please try again.');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      showError('User not found');
      return;
    }

    if (!formData.crop_type || !formData.planting_date || !formData.area_hectares) {
      showError('Please fill in all required fields');
      return;
    }

    mutation.mutate({
      user_id: user.id,
      crop_type: formData.crop_type,
      variety: formData.variety || null,
      planting_date: formData.planting_date,
      expected_harvest_date: formData.expected_harvest_date || null,
      area_hectares: parseFloat(formData.area_hectares),
      growth_stage: formData.growth_stage,
      farm_location_id: formData.farm_location_id || null,
      notes: formData.notes || null
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Crop</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="crop_type">Crop Type *</Label>
            <Select value={formData.crop_type} onValueChange={(value) => handleInputChange('crop_type', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select crop type" />
              </SelectTrigger>
              <SelectContent>
                {cropTypes.map((crop) => (
                  <SelectItem key={crop} value={crop} className="capitalize">
                    {crop}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="variety">Variety</Label>
            <Input
              id="variety"
              value={formData.variety}
              onChange={(e) => handleInputChange('variety', e.target.value)}
              placeholder="e.g., White Maize, Roma Tomato"
            />
          </div>

          {farms.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="farm">Farm Location</Label>
              <Select value={formData.farm_location_id} onValueChange={(value) => handleInputChange('farm_location_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select farm (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {farms.map((farm) => (
                    <SelectItem key={farm.id} value={farm.id}>
                      {farm.name} ({farm.size_hectares} ha)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="planting_date">Planting Date *</Label>
              <Input
                id="planting_date"
                type="date"
                value={formData.planting_date}
                onChange={(e) => handleInputChange('planting_date', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="harvest_date">Expected Harvest</Label>
              <Input
                id="harvest_date"
                type="date"
                value={formData.expected_harvest_date}
                onChange={(e) => handleInputChange('expected_harvest_date', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="area">Area (hectares) *</Label>
            <Input
              id="area"
              type="number"
              step="0.01"
              value={formData.area_hectares}
              onChange={(e) => handleInputChange('area_hectares', e.target.value)}
              placeholder="1.5"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="growth_stage">Growth Stage</Label>
            <Select value={formData.growth_stage} onValueChange={(value) => handleInputChange('growth_stage', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {growthStages.map((stage) => (
                  <SelectItem key={stage} value={stage} className="capitalize">
                    {stage}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Additional notes about this crop..."
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Adding...' : 'Add Crop'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCropModal;
