
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import DashboardStats from '@/components/DashboardStats';
import WeatherDashboard from '@/components/WeatherDashboard';
import WeatherAlerts from '@/components/WeatherAlerts';
import FarmManagement from '@/components/FarmManagement';
import MarketAnalysis from '@/components/MarketAnalysis';
import YieldPrediction from '@/components/YieldPrediction';
import ImageAnalysis from '@/components/ImageAnalysis';
import ForecastDashboard from '@/components/ForecastDashboard';
import ReportsAnalytics from '@/components/ReportsAnalytics';
import FarmCalendar from '@/components/FarmCalendar';
import ChatAdvisor from '@/components/ChatAdvisor';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ErrorBoundaryWrapper from '@/components/ErrorBoundaryWrapper';

const Dashboard = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  // Redirect to auth if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <ErrorBoundaryWrapper>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Farm Dashboard</h1>
          <p className="text-gray-600">Monitor your farms, track weather, and optimize your agricultural operations.</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="weather">Weather</TabsTrigger>
            <TabsTrigger value="farms">Farms</TabsTrigger>
            <TabsTrigger value="market">Market</TabsTrigger>
            <TabsTrigger value="predictions">Predictions</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="advisor">AI Advisor</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <DashboardStats />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <WeatherAlerts />
              <ForecastDashboard />
            </div>
            <ReportsAnalytics />
          </TabsContent>

          <TabsContent value="weather" className="space-y-6">
            <WeatherDashboard />
            <WeatherAlerts />
          </TabsContent>

          <TabsContent value="farms">
            <FarmManagement />
          </TabsContent>

          <TabsContent value="market">
            <MarketAnalysis />
          </TabsContent>

          <TabsContent value="predictions">
            <YieldPrediction />
          </TabsContent>

          <TabsContent value="analysis">
            <ImageAnalysis />
          </TabsContent>

          <TabsContent value="calendar">
            <FarmCalendar />
          </TabsContent>

          <TabsContent value="advisor">
            <ChatAdvisor />
          </TabsContent>
        </Tabs>
      </div>
    </ErrorBoundaryWrapper>
  );
};

export default Dashboard;
