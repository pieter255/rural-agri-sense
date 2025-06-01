
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  Thermometer, 
  Droplets, 
  Wind, 
  Eye, 
  Gauge,
  Sunrise,
  Sunset,
  Calendar
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const WeatherDashboard = () => {
  const [currentWeather, setCurrentWeather] = useState<any>(null);
  const [forecast, setForecast] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    // Mock weather data (replace with actual API integration)
    const mockCurrentWeather = {
      location: "Maseru, Lesotho",
      temperature: 24,
      feelsLike: 26,
      humidity: 68,
      windSpeed: 12,
      windDirection: "NE",
      visibility: 10,
      pressure: 1013,
      uvIndex: 6,
      condition: "partly-cloudy",
      description: t('partlyCloudy'),
      sunrise: "06:15",
      sunset: "18:45"
    };

    const mockForecast = [
      { date: "Today", high: 26, low: 18, condition: "sunny", precipitation: 10 },
      { date: "Tomorrow", high: 24, low: 16, condition: "partly-cloudy", precipitation: 20 },
      { date: "Wednesday", high: 22, low: 14, condition: "rainy", precipitation: 80 },
      { date: "Thursday", high: 20, low: 12, condition: "cloudy", precipitation: 40 },
      { date: "Friday", high: 23, low: 15, condition: "sunny", precipitation: 5 },
    ];

    setTimeout(() => {
      setCurrentWeather(mockCurrentWeather);
      setForecast(mockForecast);
      setLoading(false);
    }, 1000);
  }, [t]);

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny': return <Sun className="h-8 w-8 text-yellow-500" />;
      case 'partly-cloudy': return <Cloud className="h-8 w-8 text-gray-500" />;
      case 'cloudy': return <Cloud className="h-8 w-8 text-gray-600" />;
      case 'rainy': return <CloudRain className="h-8 w-8 text-blue-500" />;
      default: return <Sun className="h-8 w-8 text-yellow-500" />;
    }
  };

  const getConditionColor = (precipitation: number) => {
    if (precipitation >= 70) return 'destructive';
    if (precipitation >= 40) return 'secondary';
    return 'default';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-16 bg-gray-200 rounded"></div>
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Weather */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5" />
            {t('currentWeather')}
          </CardTitle>
          <CardDescription>{currentWeather?.location}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Main Weather Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {getWeatherIcon(currentWeather?.condition)}
              <div>
                <div className="text-3xl font-bold">{currentWeather?.temperature}°C</div>
                <div className="text-gray-500">{t('feelsLike')} {currentWeather?.feelsLike}°C</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-medium">{currentWeather?.description}</div>
              <div className="text-sm text-gray-500">{new Date().toLocaleDateString()}</div>
            </div>
          </div>

          {/* Weather Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4 text-center">
                <Droplets className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-700">{currentWeather?.humidity}%</div>
                <div className="text-sm text-blue-600">{t('humidity')}</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-50 border-gray-200">
              <CardContent className="p-4 text-center">
                <Wind className="h-6 w-6 text-gray-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-700">{currentWeather?.windSpeed} km/h</div>
                <div className="text-sm text-gray-600">{t('windSpeed')}</div>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4 text-center">
                <Eye className="h-6 w-6 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-700">{currentWeather?.visibility} km</div>
                <div className="text-sm text-green-600">{t('visibility')}</div>
              </CardContent>
            </Card>

            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-4 text-center">
                <Gauge className="h-6 w-6 text-purple-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-700">{currentWeather?.pressure} hPa</div>
                <div className="text-sm text-purple-600">{t('pressure')}</div>
              </CardContent>
            </Card>
          </div>

          {/* Sun Times */}
          <div className="flex justify-between items-center bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Sunrise className="h-5 w-5 text-yellow-600" />
              <div>
                <div className="font-medium">{t('sunrise')}</div>
                <div className="text-sm text-gray-600">{currentWeather?.sunrise}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Sunset className="h-5 w-5 text-orange-600" />
              <div>
                <div className="font-medium">{t('sunset')}</div>
                <div className="text-sm text-gray-600">{currentWeather?.sunset}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 5-Day Forecast */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {t('fiveDayForecast')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {forecast.map((day, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div className="flex items-center gap-3">
                  {getWeatherIcon(day.condition)}
                  <div>
                    <div className="font-medium">{day.date}</div>
                    <div className="text-sm text-gray-500">{t('precipitation')}: {day.precipitation}%</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant={getConditionColor(day.precipitation)}>
                    {day.precipitation}% {t('rain')}
                  </Badge>
                  <div className="text-right">
                    <div className="font-bold">{day.high}°</div>
                    <div className="text-sm text-gray-500">{day.low}°</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Agricultural Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>{t('agriculturalRecommendations')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="font-medium text-green-800">{t('irrigation')}</div>
              <div className="text-sm text-green-600">{t('irrigationAdvice')}</div>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="font-medium text-blue-800">{t('planting')}</div>
              <div className="text-sm text-blue-600">{t('plantingAdvice')}</div>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="font-medium text-yellow-800">{t('pestControl')}</div>
              <div className="text-sm text-yellow-600">{t('pestAdvice')}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeatherDashboard;
