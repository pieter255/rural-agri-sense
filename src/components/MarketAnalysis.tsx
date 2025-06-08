
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, DollarSign, BarChart3 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { marketService } from '@/services/dataService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const MarketAnalysis = () => {
  const [selectedCrop, setSelectedCrop] = useState<string>('all');

  // Fetch market prices
  const { data: marketPrices = [] } = useQuery({
    queryKey: ['market-prices'],
    queryFn: marketService.getLatestPrices,
    refetchInterval: 60 * 60 * 1000, // Refresh every hour
  });

  // Generate historical price trends (simulated for demo)
  const generateHistoricalData = (cropType: string) => {
    const basePrice = marketPrices.find(p => p.crop_type === cropType)?.price_per_kg || 10;
    const days = 30;
    const data = [];
    
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const variance = (Math.random() - 0.5) * 0.2; // ±20% variance
      const price = basePrice * (1 + variance);
      
      data.push({
        date: date.toISOString().split('T')[0],
        price: Number(price.toFixed(2)),
        volume: Math.floor(Math.random() * 1000) + 500,
      });
    }
    return data;
  };

  // Calculate price trends
  const calculateTrend = (cropType: string) => {
    const currentPrice = marketPrices.find(p => p.crop_type === cropType)?.price_per_kg || 0;
    const historicalData = generateHistoricalData(cropType);
    const lastWeekPrice = historicalData[historicalData.length - 7]?.price || currentPrice;
    const change = ((currentPrice - lastWeekPrice) / lastWeekPrice) * 100;
    
    return {
      current: currentPrice,
      change: change,
      trend: change > 0 ? 'up' : change < 0 ? 'down' : 'stable'
    };
  };

  // Get unique crop types
  const cropTypes = [...new Set(marketPrices.map(p => p.crop_type))];

  // Filter data based on selection
  const filteredPrices = selectedCrop === 'all' 
    ? marketPrices 
    : marketPrices.filter(p => p.crop_type === selectedCrop);

  // Calculate market summary
  const marketSummary = {
    totalCrops: cropTypes.length,
    avgPrice: marketPrices.reduce((sum, p) => sum + p.price_per_kg, 0) / marketPrices.length,
    highestPrice: Math.max(...marketPrices.map(p => p.price_per_kg)),
    lowestPrice: Math.min(...marketPrices.map(p => p.price_per_kg)),
  };

  return (
    <div className="space-y-6">
      {/* Market Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tracked Crops</p>
                <p className="text-2xl font-bold text-blue-600">
                  {marketSummary.totalCrops}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average Price</p>
                <p className="text-2xl font-bold text-green-600">
                  M{marketSummary.avgPrice.toFixed(2)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Highest Price</p>
                <p className="text-2xl font-bold text-purple-600">
                  M{marketSummary.highestPrice.toFixed(2)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Lowest Price</p>
                <p className="text-2xl font-bold text-orange-600">
                  M{marketSummary.lowestPrice.toFixed(2)}
                </p>
              </div>
              <TrendingDown className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Crop Filter */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Market Price Analysis</CardTitle>
            <Select value={selectedCrop} onValueChange={setSelectedCrop}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select crop" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Crops</SelectItem>
                {cropTypes.map(crop => (
                  <SelectItem key={crop} value={crop} className="capitalize">
                    {crop}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {selectedCrop !== 'all' && (
            <div className="mb-6">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={generateHistoricalData(selectedCrop)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'price' ? `M${value}` : value,
                      name === 'price' ? 'Price per kg' : 'Volume'
                    ]}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#10b981" 
                    fill="#10b981" 
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Price Table */}
      <Card>
        <CardHeader>
          <CardTitle>Current Market Prices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Crop</th>
                  <th className="text-left p-3">Current Price</th>
                  <th className="text-left p-3">7-Day Change</th>
                  <th className="text-left p-3">Market</th>
                  <th className="text-left p-3">Location</th>
                  <th className="text-left p-3">Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {filteredPrices.map((price) => {
                  const trend = calculateTrend(price.crop_type);
                  
                  return (
                    <tr key={price.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <span className="font-medium capitalize">{price.crop_type}</span>
                      </td>
                      <td className="p-3">
                        <span className="text-lg font-bold">M{price.price_per_kg}</span>
                        <span className="text-sm text-gray-500">/kg</span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          {trend.trend === 'up' ? (
                            <TrendingUp className="h-4 w-4 text-green-500" />
                          ) : trend.trend === 'down' ? (
                            <TrendingDown className="h-4 w-4 text-red-500" />
                          ) : (
                            <div className="h-4 w-4" />
                          )}
                          <span className={`text-sm font-medium ${
                            trend.trend === 'up' ? 'text-green-600' :
                            trend.trend === 'down' ? 'text-red-600' :
                            'text-gray-600'
                          }`}>
                            {trend.change > 0 ? '+' : ''}{trend.change.toFixed(1)}%
                          </span>
                        </div>
                      </td>
                      <td className="p-3">{price.market_name || 'Local Market'}</td>
                      <td className="p-3">{price.location}</td>
                      <td className="p-3">
                        <span className="text-sm text-gray-500">
                          {new Date(price.price_date).toLocaleDateString()}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Market Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Market Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Best Selling Crops</h4>
              <div className="space-y-2">
                {marketPrices
                  .sort((a, b) => b.price_per_kg - a.price_per_kg)
                  .slice(0, 3)
                  .map((price, index) => (
                    <div key={price.id} className="flex justify-between items-center">
                      <span className="capitalize">{price.crop_type}</span>
                      <Badge variant="secondary">M{price.price_per_kg}/kg</Badge>
                    </div>
                  ))}
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Market Opportunities</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>High Demand</span>
                  <Badge variant="outline">Tomatoes</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Price Rising</span>
                  <Badge variant="outline">Beans</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Stable Market</span>
                  <Badge variant="outline">Maize</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketAnalysis;
