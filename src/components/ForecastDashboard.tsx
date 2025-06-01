
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Leaf, 
  Bug, 
  Droplets,
  DollarSign,
  Calendar,
  BarChart3
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useLanguage } from '@/hooks/useLanguage';

const ForecastDashboard = () => {
  const [forecastData, setForecastData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    // Mock forecast data (replace with actual ML model integration)
    const mockForecastData = {
      yieldPrediction: {
        crop: "Maize",
        expectedYield: 4.2,
        previousYield: 3.8,
        confidence: 85,
        factors: [
          { name: t('weather'), impact: 15, positive: true },
          { name: t('soilHealth'), impact: 10, positive: true },
          { name: t('pestRisk'), impact: -5, positive: false },
          { name: t('waterAvailability'), impact: 8, positive: true }
        ]
      },
      pestForecast: {
        riskLevel: "medium",
        pests: [
          { name: t('armyworm'), probability: 65, severity: "high" },
          { name: t('aphids'), probability: 40, severity: "medium" },
          { name: t('cutworm'), probability: 25, severity: "low" }
        ],
        preventionMeasures: [
          t('regularMonitoring'),
          t('biologicalControl'),
          t('cropRotation')
        ]
      },
      marketPrediction: {
        currentPrice: 2.80,
        predictedPrice: 3.20,
        priceChange: 14.3,
        harvestMonth: "May 2024",
        marketFactors: [
          t('increasedDemand'),
          t('favorableWeather'),
          t('reducedSupply')
        ]
      },
      monthlyData: [
        { month: 'Jan', yield: 3.2, price: 2.50, rainfall: 120 },
        { month: 'Feb', yield: 3.5, price: 2.65, rainfall: 95 },
        { month: 'Mar', yield: 3.8, price: 2.80, rainfall: 140 },
        { month: 'Apr', yield: 4.0, price: 2.95, rainfall: 180 },
        { month: 'May', yield: 4.2, price: 3.20, rainfall: 160 },
        { month: 'Jun', yield: 3.9, price: 3.10, rainfall: 45 }
      ]
    };

    setTimeout(() => {
      setForecastData(mockForecastData);
      setLoading(false);
    }, 1500);
  }, [t]);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'default';
      default: return 'default';
    }
  };

  const getTrendIcon = (value: number) => {
    return value > 0 ? 
      <TrendingUp className="h-4 w-4 text-green-500" /> : 
      <TrendingDown className="h-4 w-4 text-red-500" />;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="h-40 bg-gray-200 rounded"></div>
              <div className="grid grid-cols-3 gap-4">
                <div className="h-20 bg-gray-200 rounded"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            {t('aiPoweredForecasts')}
          </CardTitle>
          <CardDescription>
            {t('forecastDescription')}
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="yield" className="space-y-6">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
          <TabsTrigger value="yield" className="flex items-center gap-2">
            <Leaf className="h-4 w-4" />
            {t('yieldPrediction')}
          </TabsTrigger>
          <TabsTrigger value="pest" className="flex items-center gap-2">
            <Bug className="h-4 w-4" />
            {t('pestForecast')}
          </TabsTrigger>
          <TabsTrigger value="market" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            {t('marketPrediction')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="yield" className="space-y-6">
          {/* Yield Prediction Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100">{t('expectedYield')}</p>
                    <p className="text-2xl font-bold">{forecastData.yieldPrediction.expectedYield} t/ha</p>
                  </div>
                  <Leaf className="h-8 w-8 text-green-200" />
                </div>
                <div className="mt-4 flex items-center gap-2">
                  {getTrendIcon(forecastData.yieldPrediction.expectedYield - forecastData.yieldPrediction.previousYield)}
                  <span className="text-sm">
                    {((forecastData.yieldPrediction.expectedYield - forecastData.yieldPrediction.previousYield) / forecastData.yieldPrediction.previousYield * 100).toFixed(1)}% {t('fromLastSeason')}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{forecastData.yieldPrediction.confidence}%</div>
                  <div className="text-sm text-gray-600">{t('confidence')}</div>
                  <Progress value={forecastData.yieldPrediction.confidence} className="mt-3" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">{forecastData.yieldPrediction.crop}</div>
                  <div className="text-sm text-gray-600">{t('currentCrop')}</div>
                  <Badge className="mt-2">{t('inSeason')}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Yield Factors */}
          <Card>
            <CardHeader>
              <CardTitle>{t('yieldFactors')}</CardTitle>
              <CardDescription>{t('factorsAffectingYield')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {forecastData.yieldPrediction.factors.map((factor: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${factor.positive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="font-medium">{factor.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {factor.positive ? 
                        <TrendingUp className="h-4 w-4 text-green-500" /> : 
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      }
                      <span className={`font-bold ${factor.positive ? 'text-green-600' : 'text-red-600'}`}>
                        {factor.positive ? '+' : ''}{factor.impact}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Yield Chart */}
          <Card>
            <CardHeader>
              <CardTitle>{t('yieldTrend')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={forecastData.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="yield" 
                    stroke="#22c55e" 
                    strokeWidth={3}
                    dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pest" className="space-y-6">
          {/* Pest Risk Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{t('pestRiskAssessment')}</span>
                <Badge variant={getRiskColor(forecastData.pestForecast.riskLevel)}>
                  {t(forecastData.pestForecast.riskLevel)} {t('risk')}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {forecastData.pestForecast.pests.map((pest: any, index: number) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Bug className="h-5 w-5 text-orange-500" />
                      <span className="font-medium">{pest.name}</span>
                    </div>
                    <Badge variant={getRiskColor(pest.severity)}>
                      {t(pest.severity)}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{t('probability')}</span>
                      <span className="font-medium">{pest.probability}%</span>
                    </div>
                    <Progress value={pest.probability} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Prevention Measures */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                {t('preventionMeasures')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {forecastData.pestForecast.preventionMeasures.map((measure: string, index: number) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span>{measure}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="market" className="space-y-6">
          {/* Market Prediction Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <DollarSign className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">${forecastData.marketPrediction.currentPrice}</div>
                <div className="text-sm text-gray-600">{t('currentPrice')}</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-8 w-8 text-blue-200 mx-auto mb-2" />
                <div className="text-2xl font-bold">${forecastData.marketPrediction.predictedPrice}</div>
                <div className="text-sm text-blue-100">{t('predictedPrice')}</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  {getTrendIcon(forecastData.marketPrediction.priceChange)}
                  <span className="text-2xl font-bold text-green-600">
                    +{forecastData.marketPrediction.priceChange}%
                  </span>
                </div>
                <div className="text-sm text-gray-600">{t('expectedIncrease')}</div>
              </CardContent>
            </Card>
          </div>

          {/* Market Factors */}
          <Card>
            <CardHeader>
              <CardTitle>{t('marketFactors')}</CardTitle>
              <CardDescription>{t('factorsInfluencingPrice')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {forecastData.marketPrediction.marketFactors.map((factor: string, index: number) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span>{factor}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Price Chart */}
          <Card>
            <CardHeader>
              <CardTitle>{t('priceHistory')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={forecastData.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar 
                    dataKey="price" 
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ForecastDashboard;
