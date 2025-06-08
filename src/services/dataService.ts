
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

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

// Farm Locations
export const farmLocationService = {
  async getAll(): Promise<FarmLocation[]> {
    const { data, error } = await supabase
      .from('farm_locations')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async create(farm: Omit<FarmLocation, 'id' | 'created_at'>): Promise<FarmLocation> {
    const { data, error } = await supabase
      .from('farm_locations')
      .insert(farm)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<FarmLocation>): Promise<FarmLocation> {
    const { data, error } = await supabase
      .from('farm_locations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('farm_locations')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// User Crops
export const cropService = {
  async getAll(): Promise<UserCrop[]> {
    const { data, error } = await supabase
      .from('user_crops')
      .select(`
        *,
        farm_locations (*)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async create(crop: Omit<UserCrop, 'id' | 'created_at' | 'updated_at'>): Promise<UserCrop> {
    const { data, error } = await supabase
      .from('user_crops')
      .insert(crop)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<UserCrop>): Promise<UserCrop> {
    const { data, error } = await supabase
      .from('user_crops')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('user_crops')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Crop Analysis
export const analysisService = {
  async getAll(): Promise<CropAnalysis[]> {
    const { data, error } = await supabase
      .from('crop_analysis')
      .select(`
        *,
        user_crops (*)
      `)
      .order('analyzed_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async create(analysis: Omit<CropAnalysis, 'id' | 'analyzed_at'>): Promise<CropAnalysis> {
    const { data, error } = await supabase
      .from('crop_analysis')
      .insert(analysis)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async uploadImage(file: File, userId: string): Promise<string> {
    const fileName = `${userId}/${Date.now()}-${file.name}`;
    
    const { data, error } = await supabase.storage
      .from('crop-images')
      .upload(fileName, file);
    
    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from('crop-images')
      .getPublicUrl(fileName);
    
    return publicUrl;
  }
};

// Weather Data
export const weatherService = {
  async getForLocation(latitude: number, longitude: number, days: number = 7): Promise<WeatherData[]> {
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
  },

  async create(weather: Omit<WeatherData, 'id' | 'created_at'>): Promise<WeatherData> {
    const { data, error } = await supabase
      .from('weather_data')
      .insert(weather)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Market Prices
export const marketService = {
  async getLatestPrices(): Promise<MarketPrice[]> {
    const { data, error } = await supabase
      .from('market_prices')
      .select('*')
      .order('price_date', { ascending: false })
      .limit(20);
    
    if (error) throw error;
    return data || [];
  },

  async getPricesForCrop(cropType: CropType): Promise<MarketPrice[]> {
    const { data, error } = await supabase
      .from('market_prices')
      .select('*')
      .eq('crop_type', cropType)
      .order('price_date', { ascending: false })
      .limit(10);
    
    if (error) throw error;
    return data || [];
  }
};

// Agricultural Alerts
export const alertService = {
  async getAll(): Promise<AgriculturalAlert[]> {
    const { data, error } = await supabase
      .from('agricultural_alerts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async markAsRead(id: string): Promise<void> {
    const { error } = await supabase
      .from('agricultural_alerts')
      .update({ is_read: true })
      .eq('id', id);
    
    if (error) throw error;
  },

  async create(alert: Omit<AgriculturalAlert, 'id' | 'created_at'>): Promise<AgriculturalAlert> {
    const { data, error } = await supabase
      .from('agricultural_alerts')
      .insert(alert)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Pest Reports
export const pestService = {
  async getAll(): Promise<PestReport[]> {
    const { data, error } = await supabase
      .from('pest_reports')
      .select(`
        *,
        farm_locations (*)
      `)
      .order('reported_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async create(report: Omit<PestReport, 'id' | 'reported_at'>): Promise<PestReport> {
    const { data, error } = await supabase
      .from('pest_reports')
      .insert(report)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Yield Data
export const yieldService = {
  async getAll(): Promise<YieldData[]> {
    const { data, error } = await supabase
      .from('yield_data')
      .select(`
        *,
        user_crops (*)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async create(yieldData: Omit<YieldData, 'id' | 'created_at'>): Promise<YieldData> {
    const { data, error } = await supabase
      .from('yield_data')
      .insert(yieldData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Farming Activities
export const activityService = {
  async getAll(): Promise<FarmingActivity[]> {
    const { data, error } = await supabase
      .from('farming_activities')
      .select(`
        *,
        user_crops (*)
      `)
      .order('date_performed', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async create(activity: Omit<FarmingActivity, 'id' | 'created_at'>): Promise<FarmingActivity> {
    const { data, error } = await supabase
      .from('farming_activities')
      .insert(activity)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};
