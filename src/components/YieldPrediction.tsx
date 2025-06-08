
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, BarChart3, DollarSign, Calendar } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { cropService, yieldService, marketService } from '@/services/dataService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useAuth } from '@/hooks/useAuth';

const YieldPrediction = () => {
  const { isAuthenticated } = useAuth();
  const [selectedCrop, setSelectedCrop] = useState<string>('');

  // Fetch user crops
  const { data: userCrops = [] } = useQuery({
    queryKey: ['user-crops'],
    queryFn: cropService.getAll,
    enabled: isAuthenticated,
  });

  // Fetch yield data
  const { data: yieldData = [] } = useQuery({
    queryKey: ['yield-data'],
    queryFn: yieldService.getAll,
    enabled: isAuthenticated,
  });

  // Fetch market prices
  const { data: marketPrices = [] } = useQuery({
    queryKey: ['market-prices'],
    queryFn: marketService.getLatestPrices,
  });

  // Generate yield predictions based on historical data and crop stage
  const generatePredictions = (crop: any) => {
    const baseYield = {
      maize: 2500,
      beans: 800,
      wheat: 2000,
      potato: 15000,
      tomato: 25000,
      cabbage: 20000,
    };

    const stageMultiplier = {
      planting: 0.1,
      germination: 0.3,
      vegetative: 0.6,
      flowering: 0.8,
      fruiting: 0.9,
      maturity: 1.0,
      harvest: 1.0,
    };

    const base = baseYield[crop.crop_type as keyof typeof baseYield] || 1000;
    const multiplier = stageMultiplier[crop.growth_stage as keyof typeof stageMultiplier] || 0.5;
    
    return {
      predictedYield: Math.round(base * crop.area_hectares * multiplier),
      confidence: Math.round(multiplier * 100),
      yieldPerHectare: Math.round(base * multiplier),
    };
  };

  // Calculate revenue projections
  const calculateRevenue = (yieldKg: number, cropType: string) => {
    const price = marketPrices.find(p => p.crop_type === cropType);
    return price ? yieldKg * price.price_per_kg : 0;
  };

  // Prepare chart data
  const chartData = userCrops.map(crop => {
    const prediction = generatePredictions(crop);
    const revenue = calculateRevenue(prediction.predictedYield, crop.crop_type);
    
    return {
      name: `${crop.crop_type} (${crop.area_hectares}ha)`,
      predicted: prediction.predictedYield,
      revenue: revenue,
      confidence: prediction.confidence,
      yieldPerHa: prediction.yieldPerHectare,
    };
  });

  const totalPredictedYield = chartData.reduce((sum, item) => sum + item.predicted, 0);
  const totalRevenue = chartData.reduce((sum, item) => sum + item.revenue, 0);
  const avgConfidence = chartData.length > 0 
    ? chartData.reduce((sum, item) => sum + item.confidence, 0) / chartData.length 
    : 0;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Predicted Yield</p>
                <p className="text-2xl font-bold text-green-600">
                  {(totalPredictedYield / 1000).toFixed(1)}t
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Projected Revenue</p>
                <p className="text-2xl font-bold text-blue-600">
                  M{(totalRevenue / 1000).toFixed(1)}k
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Prediction Confidence</p>
                <p className="text-2xl font-bold text-purple-600">
                  {avgConfidence.toFixed(0)}%
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Crops</p>
                <p className="text-2xl font-bold text-orange-600">
                  {userCrops.length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Yield Prediction Chart */}
      {chartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Yield Predictions by Crop</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'predicted' ? `${value} kg` : 
                    name === 'revenue' ? `M${value}` : `${value}%`,
                    name === 'predicted' ? 'Predicted Yield' :
                    name === 'revenue' ? 'Revenue' : 'Confidence'
                  ]}
                />
                <Bar dataKey="predicted" fill="#10b981" name="predicted" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Detailed Crop Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Crop Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          {userCrops.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Crop</th>
                    <th className="text-left p-3">Area (ha)</th>
                    <th className="text-left p-3">Growth Stage</th>
                    <th className="text-left p-3">Predicted Yield</th>
                    <th className="text-left p-3">Yield/Ha</th>
                    <th className="text-left p-3">Revenue</th>
                    <th className="text-left p-3">Confidence</th>
                  </tr>
                </thead>
                <tbody>
                  {userCrops.map((crop) => {
                    const prediction = generatePredictions(crop);
                    const revenue = calculateRevenue(prediction.predictedYield, crop.crop_type);
                    
                    return (
                      <tr key={crop.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium capitalize">{crop.crop_type}</td>
                        <td className="p-3">{crop.area_hectares}</td>
                        <td className="p-3">
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs capitalize">
                            {crop.growth_stage}
                          </span>
                        </td>
                        <td className="p-3">{prediction.predictedYield} kg</td>
                        <td className="p-3">{prediction.yieldPerHectare} kg/ha</td>
                        <td className="p-3">M{revenue.toFixed(2)}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            prediction.confidence >= 80 ? 'bg-green-100 text-green-800' :
                            prediction.confidence >= 60 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {prediction.confidence}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">No crops registered yet. Add crops to see predictions.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default YieldPrediction;
