
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Thermometer, Droplets, Wind, Sun, TrendingUp, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { weatherService, alertService, cropService, marketService } from '@/services/dataService';
import { useLanguage } from '@/hooks/useLanguage';
import { useQuery } from '@tanstack/react-query';

const DashboardStats = () => {
  const { user, isAuthenticated } = useAuth();
  const { t } = useLanguage();

  // Fetch weather data
  const { data: weatherData } = useQuery({
    queryKey: ['weather-data'],
    queryFn: async () => {
      // Default to Maseru, Lesotho coordinates
      const lat = -29.3167;
      const lng = 27.4833;
      const data = await weatherService.getForLocation(lat, lng, 1);
      return data[0] || null;
    },
    refetchInterval: 30 * 60 * 1000, // Refetch every 30 minutes
  });

  // Fetch alerts
  const { data: alerts = [] } = useQuery({
    queryKey: ['alerts'],
    queryFn: alertService.getAll,
    enabled: isAuthenticated,
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });

  // Fetch user crops for personalized data
  const { data: userCrops = [] } = useQuery({
    queryKey: ['user-crops'],
    queryFn: cropService.getAll,
    enabled: isAuthenticated,
  });

  // Fetch market prices
  const { data: marketPrices = [] } = useQuery({
    queryKey: ['market-prices'],
    queryFn: marketService.getLatestPrices,
    refetchInterval: 60 * 60 * 1000, // Refetch every hour
  });

  // Calculate farm statistics
  const farmStats = {
    totalCrops: userCrops.length,
    totalArea: userCrops.reduce((sum, crop) => sum + (crop.area_hectares || 0), 0),
    activeCrops: userCrops.filter(crop => 
      crop.growth_stage && !['harvest', 'maturity'].includes(crop.growth_stage)
    ).length
  };

  // Get unread alerts
  const unreadAlerts = alerts.filter(alert => !alert.is_read);

  return (
    <div className="space-y-6">
      {/* Weather Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">{t('temperature')}</p>
                <p className="text-2xl font-bold">
                  {weatherData?.temperature_max || 24}°C
                </p>
                <p className="text-sm text-blue-100">
                  Min: {weatherData?.temperature_min || 18}°C
                </p>
              </div>
              <Thermometer className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cyan-100">{t('humidity')}</p>
                <p className="text-2xl font-bold">
                  {weatherData?.humidity || 68}%
                </p>
                <p className="text-sm text-cyan-100">
                  {weatherData?.rainfall_mm ? `Rain: ${weatherData.rainfall_mm}mm` : 'No rain'}
                </p>
              </div>
              <Droplets className="h-8 w-8 text-cyan-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-gray-500 to-gray-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-100">{t('windSpeed')}</p>
                <p className="text-2xl font-bold">
                  {weatherData?.wind_speed_kmh || 12} km/h
                </p>
                <p className="text-sm text-gray-100">
                  {weatherData?.wind_direction || 'NE'}
                </p>
              </div>
              <Wind className="h-8 w-8 text-gray-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100">{t('condition')}</p>
                <p className="text-lg font-bold">
                  {weatherData?.condition === 'sunny' ? 'Sunny' :
                   weatherData?.condition === 'partly_cloudy' ? 'Partly Cloudy' :
                   weatherData?.condition === 'cloudy' ? 'Cloudy' :
                   weatherData?.condition === 'rainy' ? 'Rainy' : 'Clear'}
                </p>
                <p className="text-sm text-yellow-100">
                  UV: {weatherData?.uv_index || 7}
                </p>
              </div>
              <Sun className="h-8 w-8 text-yellow-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Section */}
      {unreadAlerts.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
            <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
            {t('alerts')} ({unreadAlerts.length})
          </h3>
          <div className="grid gap-3">
            {unreadAlerts.slice(0, 3).map((alert) => (
              <Card key={alert.id} className="border-l-4 border-l-yellow-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{alert.title}</p>
                      <p className="text-sm text-gray-600">{alert.message}</p>
                    </div>
                    <Badge variant={alert.severity === 'high' || alert.severity === 'critical' ? 'destructive' : 'secondary'}>
                      {alert.severity}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Farm Statistics (only for authenticated users) */}
      {isAuthenticated && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Farm Overview - {user?.name}'s Farm
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800">Total Crops</h4>
                <p className="text-2xl font-bold text-green-600">{farmStats.totalCrops}</p>
                <p className="text-sm text-green-600">Registered crops</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800">Farm Area</h4>
                <p className="text-2xl font-bold text-blue-600">{farmStats.totalArea.toFixed(1)} ha</p>
                <p className="text-sm text-blue-600">Total cultivated</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-800">Active Crops</h4>
                <p className="text-2xl font-bold text-purple-600">{farmStats.activeCrops}</p>
                <p className="text-sm text-purple-600">Currently growing</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Market Prices */}
      {marketPrices.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
              Latest Market Prices
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {marketPrices.slice(0, 6).map((price) => (
                <div key={price.id} className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium capitalize">{price.crop_type}</span>
                    <span className="text-green-600 font-bold">M{price.price_per_kg}/kg</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{price.location}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DashboardStats;
