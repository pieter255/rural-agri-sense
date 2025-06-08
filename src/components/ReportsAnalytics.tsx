
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Printer, BarChart3, TrendingUp, PieChart } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { cropService, yieldService, activityService, marketService } from '@/services/dataService';
import { BarChart, Bar, LineChart, Line, PieChart as RechartsPieChart, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

const ReportsAnalytics = () => {
  const [reportType, setReportType] = useState('overview');
  const [timeRange, setTimeRange] = useState('month');

  // Fetch all data for reports
  const { data: userCrops = [] } = useQuery({
    queryKey: ['user-crops'],
    queryFn: cropService.getAll,
  });

  const { data: yieldData = [] } = useQuery({
    queryKey: ['yield-data'],
    queryFn: yieldService.getAll,
  });

  const { data: activities = [] } = useQuery({
    queryKey: ['farming-activities'],
    queryFn: activityService.getAll,
  });

  const { data: marketPrices = [] } = useQuery({
    queryKey: ['market-prices'],
    queryFn: marketService.getLatestPrices,
  });

  // Calculate analytics data
  const analytics = {
    totalCrops: userCrops.length,
    totalArea: userCrops.reduce((sum, crop) => sum + crop.area_hectares, 0),
    totalActivities: activities.length,
    totalCosts: activities.reduce((sum, activity) => sum + (activity.cost || 0), 0),
    averageYield: yieldData.length > 0 
      ? yieldData.reduce((sum, y) => sum + (y.actual_yield_kg || 0), 0) / yieldData.length 
      : 0,
    totalRevenue: yieldData.reduce((sum, y) => sum + (y.total_revenue || 0), 0),
  };

  // Prepare chart data
  const cropDistribution = userCrops.reduce((acc, crop) => {
    acc[crop.crop_type] = (acc[crop.crop_type] || 0) + crop.area_hectares;
    return acc;
  }, {} as Record<string, number>);

  const pieChartData = Object.entries(cropDistribution).map(([crop, area]) => ({
    name: crop,
    value: area,
    area: area,
  }));

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  // Activity costs by month
  const monthlyCosts = activities.reduce((acc, activity) => {
    const month = format(new Date(activity.date_performed), 'MMM yyyy');
    acc[month] = (acc[month] || 0) + (activity.cost || 0);
    return acc;
  }, {} as Record<string, number>);

  const costChartData = Object.entries(monthlyCosts).map(([month, cost]) => ({
    month,
    cost,
  }));

  // Yield performance
  const yieldPerformance = userCrops.map(crop => {
    const yields = yieldData.filter(y => y.crop_id === crop.id);
    const avgYield = yields.length > 0 
      ? yields.reduce((sum, y) => sum + (y.actual_yield_kg || 0), 0) / yields.length 
      : 0;
    
    return {
      crop: crop.crop_type,
      area: crop.area_hectares,
      yield: avgYield,
      yieldPerHa: avgYield / crop.area_hectares,
    };
  });

  const generateReport = () => {
    const reportData = {
      overview: analytics,
      crops: userCrops,
      yields: yieldData,
      activities: activities,
      generatedAt: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `farm-report-${format(new Date(), 'yyyy-MM-dd')}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const printReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6 print:space-y-4">
      {/* Report Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start print:hidden">
        <div className="flex gap-4">
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Report Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overview">Farm Overview</SelectItem>
              <SelectItem value="crops">Crop Analysis</SelectItem>
              <SelectItem value="financial">Financial Report</SelectItem>
              <SelectItem value="activities">Activity Report</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button onClick={generateReport} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={printReport} variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
        </div>
      </div>

      {/* Report Header */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">AgroSense Farm Report</CardTitle>
          <p className="text-gray-600">
            Generated on {format(new Date(), 'MMMM dd, yyyy')} • {reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report
          </p>
        </CardHeader>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Crops</p>
              <p className="text-2xl font-bold text-green-600">{analytics.totalCrops}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Area</p>
              <p className="text-2xl font-bold text-blue-600">{analytics.totalArea.toFixed(1)} ha</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-purple-600">M{(analytics.totalRevenue / 1000).toFixed(1)}k</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Costs</p>
              <p className="text-2xl font-bold text-orange-600">M{(analytics.totalCosts / 1000).toFixed(1)}k</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Crop Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Crop Distribution by Area
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <RechartsPieChart data={pieChartData}>
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </RechartsPieChart>
                <Tooltip formatter={(value) => [`${value} ha`, 'Area']} />
              </RechartsPieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {pieChartData.map((item, index) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm capitalize">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Costs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Monthly Farm Costs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={costChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`M${value}`, 'Cost']} />
                <Bar dataKey="cost" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Tables */}
      <Card>
        <CardHeader>
          <CardTitle>Crop Performance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Crop</th>
                  <th className="text-left p-3">Area (ha)</th>
                  <th className="text-left p-3">Growth Stage</th>
                  <th className="text-left p-3">Total Yield (kg)</th>
                  <th className="text-left p-3">Yield/Ha</th>
                  <th className="text-left p-3">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {yieldPerformance.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-3 font-medium capitalize">{item.crop}</td>
                    <td className="p-3">{item.area}</td>
                    <td className="p-3">
                      <Badge variant="secondary">Growing</Badge>
                    </td>
                    <td className="p-3">{item.yield.toFixed(0)}</td>
                    <td className="p-3">{item.yieldPerHa.toFixed(0)}</td>
                    <td className="p-3">M{(item.yield * 15 / 1000).toFixed(2)}k</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Farm Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activities.slice(0, 10).map((activity) => (
              <div key={activity.id} className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">{activity.activity_type}</h4>
                  <p className="text-sm text-gray-600">{activity.description}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">M{activity.cost || 0}</p>
                  <p className="text-sm text-gray-500">
                    {format(new Date(activity.date_performed), 'MMM dd')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsAnalytics;
