import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { errorService } from '@/services/errorService';

type Tables = Database['public']['Tables'];
type Profile = Tables['profiles']['Row'];
type FarmLocation = Tables['farm_locations']['Row'];
type UserCrop = Tables['user_crops']['Row'];
type CropAnalysis = Tables['crop_analysis']['Row'];
type PestReport = Tables['pest_reports']['Row'];
type YieldData = Tables['yield_data']['Row'];
type MarketPrice = Tables['market_prices']['Row'];
type AgriculturalAlert = Tables['agricultural_alerts']['Row'];
type FarmingActivity = Tables['farming_activities']['Row'];
type WeatherData = Tables['weather_data']['Row'];
type CropType = Database['public']['Enums']['crop_type'];

// Helper function to handle Supabase errors
const handleSupabaseError = (error: any, context: string) => {
  throw errorService.handleError(error, context);
};

// Farm Locations
export const farmLocationService = {
  async getAll(): Promise<FarmLocation[]> {
    try {
      const { data, error } = await supabase
        .from('farm_locations')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) handleSupabaseError(error, 'farmLocationService.getAll');
      return data || [];
    } catch (error) {
      handleSupabaseError(error, 'farmLocationService.getAll');
      return [];
    }
  },

  async getByUserId(userId: string): Promise<FarmLocation[]> {
    try {
      const { data, error } = await supabase
        .from('farm_locations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) handleSupabaseError(error, 'farmLocationService.getByUserId');
      return data || [];
    } catch (error) {
      handleSupabaseError(error, 'farmLocationService.getByUserId');
      return [];
    }
  },

  async create(farm: Omit<FarmLocation, 'id' | 'created_at'>): Promise<FarmLocation> {
    try {
      const { data, error } = await supabase
        .from('farm_locations')
        .insert(farm)
        .select()
        .single();
      
      if (error) handleSupabaseError(error, 'farmLocationService.create');
      return data;
    } catch (error) {
      handleSupabaseError(error, 'farmLocationService.create');
      throw error;
    }
  },

  async update(id: string, updates: Partial<FarmLocation>): Promise<FarmLocation> {
    try {
      const { data, error } = await supabase
        .from('farm_locations')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) handleSupabaseError(error, 'farmLocationService.update');
      return data;
    } catch (error) {
      handleSupabaseError(error, 'farmLocationService.update');
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('farm_locations')
        .delete()
        .eq('id', id);
      
      if (error) handleSupabaseError(error, 'farmLocationService.delete');
    } catch (error) {
      handleSupabaseError(error, 'farmLocationService.delete');
      throw error;
    }
  }
};

// User Crops
export const cropService = {
  async getAll(): Promise<UserCrop[]> {
    try {
      const { data, error } = await supabase
        .from('user_crops')
        .select(`
          *,
          farm_locations (*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) handleSupabaseError(error, 'cropService.getAll');
      return data || [];
    } catch (error) {
      handleSupabaseError(error, 'cropService.getAll');
      return [];
    }
  },

  async create(crop: Omit<UserCrop, 'id' | 'created_at' | 'updated_at'>): Promise<UserCrop> {
    try {
      const { data, error } = await supabase
        .from('user_crops')
        .insert(crop)
        .select()
        .single();
      
      if (error) handleSupabaseError(error, 'cropService.create');
      return data;
    } catch (error) {
      handleSupabaseError(error, 'cropService.create');
      throw error;
    }
  },

  async update(id: string, updates: Partial<UserCrop>): Promise<UserCrop> {
    try {
      const { data, error } = await supabase
        .from('user_crops')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) handleSupabaseError(error, 'cropService.update');
      return data;
    } catch (error) {
      handleSupabaseError(error, 'cropService.update');
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_crops')
        .delete()
        .eq('id', id);
      
      if (error) handleSupabaseError(error, 'cropService.delete');
    } catch (error) {
      handleSupabaseError(error, 'cropService.delete');
      throw error;
    }
  }
};

// Crop Analysis
export const analysisService = {
  async getAll(): Promise<CropAnalysis[]> {
    try {
      const { data, error } = await supabase
        .from('crop_analysis')
        .select(`
          *,
          user_crops (*)
        `)
        .order('analyzed_at', { ascending: false });
      
      if (error) handleSupabaseError(error, 'analysisService.getAll');
      return data || [];
    } catch (error) {
      handleSupabaseError(error, 'analysisService.getAll');
      return [];
    }
  },

  async create(analysis: Omit<CropAnalysis, 'id' | 'analyzed_at'>): Promise<CropAnalysis> {
    try {
      const { data, error } = await supabase
        .from('crop_analysis')
        .insert(analysis)
        .select()
        .single();
      
      if (error) handleSupabaseError(error, 'analysisService.create');
      return data;
    } catch (error) {
      handleSupabaseError(error, 'analysisService.create');
      throw error;
    }
  },

  async uploadImage(file: File, userId: string): Promise<string> {
    try {
      const fileName = `${userId}/${Date.now()}-${file.name}`;
      
      const { data, error } = await supabase.storage
        .from('crop-images')
        .upload(fileName, file);
      
      if (error) handleSupabaseError(error, 'analysisService.uploadImage');
      
      const { data: { publicUrl } } = supabase.storage
        .from('crop-images')
        .getPublicUrl(fileName);
      
      return publicUrl;
    } catch (error) {
      handleSupabaseError(error, 'analysisService.uploadImage');
      throw error;
    }
  }
};

// Weather Data
export const weatherService = {
  async getForLocation(latitude: number, longitude: number, days: number = 7): Promise<WeatherData[]> {
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
      
      if (error) handleSupabaseError(error, 'weatherService.getForLocation');
      return data || [];
    } catch (error) {
      handleSupabaseError(error, 'weatherService.getForLocation');
      return [];
    }
  },

  async create(weather: Omit<WeatherData, 'id' | 'created_at'>): Promise<WeatherData> {
    try {
      const { data, error } = await supabase
        .from('weather_data')
        .insert(weather)
        .select()
        .single();
      
      if (error) handleSupabaseError(error, 'weatherService.create');
      return data;
    } catch (error) {
      handleSupabaseError(error, 'weatherService.create');
      throw error;
    }
  }
};

// Market Prices
export const marketService = {
  async getLatestPrices(): Promise<MarketPrice[]> {
    try {
      const { data, error } = await supabase
        .from('market_prices')
        .select('*')
        .order('price_date', { ascending: false })
        .limit(20);
      
      if (error) handleSupabaseError(error, 'marketService.getLatestPrices');
      return data || [];
    } catch (error) {
      handleSupabaseError(error, 'marketService.getLatestPrices');
      return [];
    }
  },

  async getPricesForCrop(cropType: CropType): Promise<MarketPrice[]> {
    try {
      const { data, error } = await supabase
        .from('market_prices')
        .select('*')
        .eq('crop_type', cropType)
        .order('price_date', { ascending: false })
        .limit(10);
      
      if (error) handleSupabaseError(error, 'marketService.getPricesForCrop');
      return data || [];
    } catch (error) {
      handleSupabaseError(error, 'marketService.getPricesForCrop');
      return [];
    }
  }
};

// Agricultural Alerts
export const alertService = {
  async getAll(): Promise<AgriculturalAlert[]> {
    try {
      const { data, error } = await supabase
        .from('agricultural_alerts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) handleSupabaseError(error, 'alertService.getAll');
      return data || [];
    } catch (error) {
      handleSupabaseError(error, 'alertService.getAll');
      return [];
    }
  },

  async markAsRead(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('agricultural_alerts')
        .update({ is_read: true })
        .eq('id', id);
      
      if (error) handleSupabaseError(error, 'alertService.markAsRead');
    } catch (error) {
      handleSupabaseError(error, 'alertService.markAsRead');
      throw error;
    }
  },

  async create(alert: Omit<AgriculturalAlert, 'id' | 'created_at'>): Promise<AgriculturalAlert> {
    try {
      const { data, error } = await supabase
        .from('agricultural_alerts')
        .insert(alert)
        .select()
        .single();
      
      if (error) handleSupabaseError(error, 'alertService.create');
      return data;
    } catch (error) {
      handleSupabaseError(error, 'alertService.create');
      throw error;
    }
  }
};

// Pest Reports
export const pestService = {
  async getAll(): Promise<PestReport[]> {
    try {
      const { data, error } = await supabase
        .from('pest_reports')
        .select(`
          *,
          farm_locations (*)
        `)
        .order('reported_at', { ascending: false });
      
      if (error) handleSupabaseError(error, 'pestService.getAll');
      return data || [];
    } catch (error) {
      handleSupabaseError(error, 'pestService.getAll');
      return [];
    }
  },

  async create(report: Omit<PestReport, 'id' | 'reported_at'>): Promise<PestReport> {
    try {
      const { data, error } = await supabase
        .from('pest_reports')
        .insert(report)
        .select()
        .single();
      
      if (error) handleSupabaseError(error, 'pestService.create');
      return data;
    } catch (error) {
      handleSupabaseError(error, 'pestService.create');
      throw error;
    }
  }
};

// Yield Data
export const yieldService = {
  async getAll(): Promise<YieldData[]> {
    try {
      const { data, error } = await supabase
        .from('yield_data')
        .select(`
          *,
          user_crops (*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) handleSupabaseError(error, 'yieldService.getAll');
      return data || [];
    } catch (error) {
      handleSupabaseError(error, 'yieldService.getAll');
      return [];
    }
  },

  async create(yieldData: Omit<YieldData, 'id' | 'created_at'>): Promise<YieldData> {
    try {
      const { data, error } = await supabase
        .from('yield_data')
        .insert(yieldData)
        .select()
        .single();
      
      if (error) handleSupabaseError(error, 'yieldService.create');
      return data;
    } catch (error) {
      handleSupabaseError(error, 'yieldService.create');
      throw error;
    }
  }
};

// Farming Activities
export const activityService = {
  async getAll(): Promise<FarmingActivity[]> {
    try {
      const { data, error } = await supabase
        .from('farming_activities')
        .select(`
          *,
          user_crops (*)
        `)
        .order('date_performed', { ascending: false });
      
      if (error) handleSupabaseError(error, 'activityService.getAll');
      return data || [];
    } catch (error) {
      handleSupabaseError(error, 'activityService.getAll');
      return [];
    }
  },

  async create(activity: Omit<FarmingActivity, 'id' | 'created_at'>): Promise<FarmingActivity> {
    try {
      const { data, error } = await supabase
        .from('farming_activities')
        .insert(activity)
        .select()
        .single();
      
      if (error) handleSupabaseError(error, 'activityService.create');
      return data;
    } catch (error) {
      handleSupabaseError(error, 'activityService.create');
      throw error;
    }
  }
};
