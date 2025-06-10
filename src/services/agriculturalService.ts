
import { supabase } from '@/integrations/supabase/client';
import { errorService } from '@/services/errorService';

export interface WeatherAlert {
  id: string;
  alert_type: string;
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  expires_at?: string;
  is_read: boolean;
  created_at: string;
}

export interface CropData {
  id: string;
  crop_type: string;
  planting_date: string;
  expected_harvest_date?: string;
  area_hectares: number;
  growth_stage: string;
  variety?: string;
  notes?: string;
}

export interface MarketPrice {
  id: string;
  crop_type: string;
  price_per_kg: number;
  location: string;
  market_name?: string;
  price_date: string;
}

export class AgriculturalService {
  private static instance: AgriculturalService;

  static getInstance(): AgriculturalService {
    if (!AgriculturalService.instance) {
      AgriculturalService.instance = new AgriculturalService();
    }
    return AgriculturalService.instance;
  }

  // Weather Alerts Management
  async getActiveAlerts(userId: string): Promise<WeatherAlert[]> {
    try {
      const { data, error } = await supabase
        .from('agricultural_alerts')
        .select('*')
        .eq('user_id', userId)
        .or('expires_at.is.null,expires_at.gt.now()')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      errorService.handleError(error, 'getActiveAlerts');
      return [];
    }
  }

  async markAlertAsRead(alertId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('agricultural_alerts')
        .update({ is_read: true })
        .eq('id', alertId);

      if (error) throw error;
      return true;
    } catch (error) {
      errorService.handleError(error, 'markAlertAsRead');
      return false;
    }
  }

  // Crop Management
  async getUserCrops(userId: string): Promise<CropData[]> {
    try {
      const { data, error } = await supabase
        .from('user_crops')
        .select('*')
        .eq('user_id', userId)
        .order('planting_date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      errorService.handleError(error, 'getUserCrops');
      return [];
    }
  }

  async addCrop(cropData: Omit<CropData, 'id'> & { user_id: string }): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_crops')
        .insert([cropData]);

      if (error) throw error;
      errorService.handleSuccess('Crop added successfully');
      return true;
    } catch (error) {
      errorService.handleError(error, 'addCrop');
      return false;
    }
  }

  async updateCropStage(cropId: string, growthStage: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_crops')
        .update({ growth_stage: growthStage })
        .eq('id', cropId);

      if (error) throw error;
      errorService.handleSuccess('Crop stage updated');
      return true;
    } catch (error) {
      errorService.handleError(error, 'updateCropStage');
      return false;
    }
  }

  // Market Prices
  async getMarketPrices(location?: string): Promise<MarketPrice[]> {
    try {
      let query = supabase
        .from('market_prices')
        .select('*')
        .order('price_date', { ascending: false });

      if (location) {
        query = query.eq('location', location);
      }

      const { data, error } = await query.limit(50);

      if (error) throw error;
      return data || [];
    } catch (error) {
      errorService.handleError(error, 'getMarketPrices');
      return [];
    }
  }

  // Weather Data
  async getWeatherHistory(latitude: number, longitude: number, days: number = 7) {
    try {
      const { data, error } = await supabase
        .from('weather_data')
        .select('*')
        .gte('latitude', latitude - 0.1)
        .lte('latitude', latitude + 0.1)
        .gte('longitude', longitude - 0.1)
        .lte('longitude', longitude + 0.1)
        .gte('date_recorded', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .order('date_recorded', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      errorService.handleError(error, 'getWeatherHistory');
      return [];
    }
  }

  // Pest Reports
  async submitPestReport(pestData: {
    user_id: string;
    pest_name: string;
    crop_type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description?: string;
    farm_location_id?: string;
    affected_area_percentage?: number;
  }): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('pest_reports')
        .insert([{
          ...pestData,
          disease_type: 'pest_infestation', // Default value for enum
          reported_at: new Date().toISOString()
        }]);

      if (error) throw error;
      errorService.handleSuccess('Pest report submitted successfully');
      return true;
    } catch (error) {
      errorService.handleError(error, 'submitPestReport');
      return false;
    }
  }

  // Farming Activities
  async logActivity(activityData: {
    user_id: string;
    activity_type: string;
    description: string;
    date_performed: string;
    crop_id?: string;
    cost?: number;
    notes?: string;
  }): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('farming_activities')
        .insert([activityData]);

      if (error) throw error;
      errorService.handleSuccess('Activity logged successfully');
      return true;
    } catch (error) {
      errorService.handleError(error, 'logActivity');
      return false;
    }
  }

  async getActivities(userId: string, limit: number = 20) {
    try {
      const { data, error } = await supabase
        .from('farming_activities')
        .select('*')
        .eq('user_id', userId)
        .order('date_performed', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      errorService.handleError(error, 'getActivities');
      return [];
    }
  }
}

export const agriculturalService = AgriculturalService.getInstance();
