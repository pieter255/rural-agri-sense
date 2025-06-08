
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  Sprout, 
  Camera, 
  CloudRain, 
  TrendingUp, 
  MessageSquare,
  Plus,
  Bell
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { farmLocationService } from '@/services/dataService';
import DashboardStats from '@/components/DashboardStats';
import FarmManagement from '@/components/FarmManagement';
import ImageAnalysis from '@/components/ImageAnalysis';
import WeatherDashboard from '@/components/WeatherDashboard';
import ForecastDashboard from '@/components/ForecastDashboard';
import ChatAdvisor from '@/components/ChatAdvisor';
import AddFarmModal from '@/components/AddFarmModal';
import AddCropModal from '@/components/AddCropModal';

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddFarm, setShowAddFarm] = useState(false);
  const [showAddCrop, setShowAddCrop] = useState(false);

  // Fetch farms data for the AddCropModal
  const { data: farms = [] } = useQuery({
    queryKey: ['user-farms', user?.id],
    queryFn: () => farmLocationService.getByUserId(user!.id),
    enabled: !!user?.id
  });

  const tabs = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: BarChart3,
      component: <DashboardStats />
    },
    { 
      id: 'farms', 
      label: 'Farms', 
      icon: Sprout,
      component: <FarmManagement />
    },
    { 
      id: 'camera', 
      label: 'Camera', 
      icon: Camera,
      component: <ImageAnalysis />
    },
    { 
      id: 'weather', 
      label: 'Weather', 
      icon: CloudRain,
      component: <WeatherDashboard />
    },
    { 
      id: 'forecast', 
      label: 'Forecast', 
      icon: TrendingUp,
      component: <ForecastDashboard />
    },
    { 
      id: 'advisor', 
      label: 'Advisor', 
      icon: MessageSquare,
      component: <ChatAdvisor />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.name || 'Farmer'}!
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your farms and monitor your crops effectively
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
            <Button 
              size="sm"
              onClick={() => setShowAddFarm(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Farm
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setShowAddCrop(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Crop
            </Button>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Custom Tab Navigation */}
          <div className="flex flex-wrap gap-2 mb-6 bg-white p-2 rounded-lg shadow-sm border">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-md transition-all duration-200 font-medium text-sm ${
                    isActive 
                      ? 'bg-green-500 text-white shadow-md transform scale-105' 
                      : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-white' : ''}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          {tabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="mt-0">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  {tab.component}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>

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

export default Dashboard;
