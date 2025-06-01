
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Cloud, 
  Thermometer, 
  Droplets, 
  Wind, 
  Camera, 
  MessageCircle, 
  TrendingUp, 
  AlertTriangle,
  Leaf,
  Sun,
  Menu,
  Globe
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import ImageAnalysis from '@/components/ImageAnalysis';
import ChatAdvisor from '@/components/ChatAdvisor';
import WeatherDashboard from '@/components/WeatherDashboard';
import ForecastDashboard from '@/components/ForecastDashboard';
import LanguageToggle from '@/components/LanguageToggle';
import { useLanguage } from '@/hooks/useLanguage';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t, language } = useLanguage();

  // Mock data for demonstration
  const weatherData = {
    temperature: 24,
    humidity: 68,
    windSpeed: 12,
    condition: 'partly-cloudy',
    description: t('partlyCloudy')
  };

  const alerts = [
    { id: 1, type: 'weather', message: t('rainExpected'), severity: 'medium' },
    { id: 2, type: 'pest', message: t('pestAlert'), severity: 'high' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-green-500 p-2 rounded-lg">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">AgroSense</h1>
                <p className="text-xs text-gray-500">{t('smartAgricultureAdvisor')}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <LanguageToggle />
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('welcomeMessage')}</h2>
          <p className="text-gray-600">{t('dashboardDescription')}</p>
        </div>

        {/* Alerts Section */}
        {alerts.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
              {t('alerts')}
            </h3>
            <div className="grid gap-3">
              {alerts.map((alert) => (
                <Card key={alert.id} className="border-l-4 border-l-yellow-500">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                      <Badge variant={alert.severity === 'high' ? 'destructive' : 'secondary'}>
                        {alert.severity === 'high' ? t('high') : t('medium')}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 bg-white">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">{t('dashboard')}</span>
            </TabsTrigger>
            <TabsTrigger value="camera" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              <span className="hidden sm:inline">{t('camera')}</span>
            </TabsTrigger>
            <TabsTrigger value="weather" className="flex items-center gap-2">
              <Cloud className="h-4 w-4" />
              <span className="hidden sm:inline">{t('weather')}</span>
            </TabsTrigger>
            <TabsTrigger value="forecast" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">{t('forecast')}</span>
            </TabsTrigger>
            <TabsTrigger value="advisor" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline">{t('advisor')}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100">{t('temperature')}</p>
                      <p className="text-2xl font-bold">{weatherData.temperature}°C</p>
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
                      <p className="text-2xl font-bold">{weatherData.humidity}%</p>
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
                      <p className="text-2xl font-bold">{weatherData.windSpeed} km/h</p>
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
                      <p className="text-2xl font-bold">{weatherData.description}</p>
                    </div>
                    <Sun className="h-8 w-8 text-yellow-200" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>{t('quickActions')}</CardTitle>
                <CardDescription>{t('quickActionsDescription')}</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  onClick={() => setActiveTab('camera')}
                  className="h-24 bg-green-500 hover:bg-green-600 flex flex-col items-center justify-center space-y-2"
                >
                  <Camera className="h-8 w-8" />
                  <span>{t('analyzeCrop')}</span>
                </Button>
                
                <Button 
                  onClick={() => setActiveTab('advisor')}
                  className="h-24 bg-blue-500 hover:bg-blue-600 flex flex-col items-center justify-center space-y-2"
                >
                  <MessageCircle className="h-8 w-8" />
                  <span>{t('askAdvisor')}</span>
                </Button>
                
                <Button 
                  onClick={() => setActiveTab('forecast')}
                  className="h-24 bg-purple-500 hover:bg-purple-600 flex flex-col items-center justify-center space-y-2"
                >
                  <TrendingUp className="h-8 w-8" />
                  <span>{t('viewForecast')}</span>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="camera">
            <ImageAnalysis />
          </TabsContent>

          <TabsContent value="weather">
            <WeatherDashboard />
          </TabsContent>

          <TabsContent value="forecast">
            <ForecastDashboard />
          </TabsContent>

          <TabsContent value="advisor">
            <ChatAdvisor />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
