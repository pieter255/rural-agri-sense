
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Cloud, CloudRain, Sun, Wind } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { weatherService, alertService } from '@/services/dataService';
import { useAuth } from '@/hooks/useAuth';
import useNotification from '@/hooks/useNotification';

const WeatherAlerts = () => {
  const { user, isAuthenticated } = useAuth();
  const { showSuccess, showError } = useNotification();
  const queryClient = useQueryClient();

  // Fetch current weather alerts
  const { data: alerts = [] } = useQuery({
    queryKey: ['weather-alerts'],
    queryFn: alertService.getAll,
    enabled: isAuthenticated,
    refetchInterval: 5 * 60 * 1000, // Check every 5 minutes
  });

  // Fetch weather data for predictions
  const { data: weatherData } = useQuery({
    queryKey: ['current-weather'],
    queryFn: async () => {
      const lat = -29.3167; // Maseru coordinates
      const lng = 27.4833;
      return await weatherService.getForLocation(lat, lng, 3);
    },
    refetchInterval: 30 * 60 * 1000, // Update every 30 minutes
  });

  const markAsReadMutation = useMutation({
    mutationFn: alertService.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weather-alerts'] });
      showSuccess('Alert marked as read');
    },
    onError: () => {
      showError('Failed to mark alert as read');
    }
  });

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny': return <Sun className="h-5 w-5 text-yellow-500" />;
      case 'rainy': return <CloudRain className="h-5 w-5 text-blue-500" />;
      case 'cloudy': return <Cloud className="h-5 w-5 text-gray-500" />;
      case 'stormy': return <Wind className="h-5 w-5 text-purple-500" />;
      default: return <Sun className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const unreadAlerts = alerts.filter(alert => !alert.is_read);

  return (
    <div className="space-y-6">
      {/* Current Weather Summary */}
      {weatherData && weatherData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getWeatherIcon(weatherData[0].condition || 'sunny')}
              Current Weather Conditions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Temperature</p>
                <p className="text-lg font-bold text-blue-600">
                  {weatherData[0].temperature_max}°C
                </p>
              </div>
              <div className="text-center p-3 bg-cyan-50 rounded-lg">
                <p className="text-sm text-gray-600">Humidity</p>
                <p className="text-lg font-bold text-cyan-600">
                  {weatherData[0].humidity}%
                </p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">Rainfall</p>
                <p className="text-lg font-bold text-green-600">
                  {weatherData[0].rainfall_mm || 0}mm
                </p>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600">Wind Speed</p>
                <p className="text-lg font-bold text-purple-600">
                  {weatherData[0].wind_speed_kmh}km/h
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Alerts */}
      {unreadAlerts.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="h-5 w-5" />
              Active Weather Alerts ({unreadAlerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {unreadAlerts.map((alert) => (
              <div key={alert.id} className="bg-white p-4 rounded-lg border border-orange-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-gray-900">{alert.title}</h4>
                      <Badge variant={getSeverityColor(alert.severity)}>
                        {alert.severity}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-2">{alert.message}</p>
                    <p className="text-xs text-gray-500">
                      Alert Type: {alert.alert_type}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => markAsReadMutation.mutate(alert.id)}
                    disabled={markAsReadMutation.isPending}
                  >
                    Mark as Read
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* No Alerts Message */}
      {unreadAlerts.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Sun className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">All Clear!</h3>
            <p className="text-gray-600">No active weather alerts at this time.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WeatherAlerts;
