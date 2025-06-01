
import React, { createContext, useContext, useState, useEffect } from 'react';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Translation dictionary
const translations = {
  en: {
    // General
    smartAgricultureAdvisor: 'Smart Agriculture Advisor',
    welcomeMessage: 'Welcome to AgroSense',
    dashboardDescription: 'Your intelligent farming companion for better yields',
    navigation: 'Navigation',
    currentLanguage: 'Current Language',
    aiPowered: 'AI Powered',
    
    // Navigation
    dashboard: 'Dashboard',
    camera: 'Camera',
    weather: 'Weather',
    forecast: 'Forecast',
    advisor: 'Advisor',
    
    // Weather
    currentWeather: 'Current Weather',
    temperature: 'Temperature',
    humidity: 'Humidity',
    windSpeed: 'Wind Speed',
    condition: 'Condition',
    partlyCloudy: 'Partly Cloudy',
    feelsLike: 'Feels like',
    visibility: 'Visibility',
    pressure: 'Pressure',
    sunrise: 'Sunrise',
    sunset: 'Sunset',
    fiveDayForecast: '5-Day Forecast',
    precipitation: 'Precipitation',
    rain: 'Rain',
    
    // Alerts
    alerts: 'Alerts',
    rainExpected: 'Rain expected in the next 24 hours',
    pestAlert: 'Pest alert: Monitor crops for armyworm activity',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    
    // Quick Actions
    quickActions: 'Quick Actions',
    quickActionsDescription: 'Access key features quickly',
    analyzeCrop: 'Analyze Crop',
    askAdvisor: 'Ask Advisor',
    viewForecast: 'View Forecast',
    
    // Image Analysis
    cropHealthAnalysis: 'Crop Health Analysis',
    cropAnalysisDescription: 'Upload or capture images to diagnose crop health issues',
    uploadImage: 'Upload Image',
    uploadDescription: 'Take a photo or upload from your device',
    useCamera: 'Use Camera',
    uploadFromDevice: 'Upload from Device',
    analyzingImage: 'Analyzing Image...',
    analysisWait: 'This may take a few moments',
    analysisResults: 'Analysis Results',
    diagnosis: 'Diagnosis',
    recommendations: 'Recommendations',
    confidence: 'Confidence',
    analyzeAnother: 'Analyze Another Image',
    fileSizeError: 'File size must be less than 5MB',
    fileTypeError: 'Please select an image file',
    analysisError: 'Error analyzing image. Please try again.',
    cameraError: 'Camera access denied. Please use file upload.',
    
    // Crop Health
    healthyCrop: 'Healthy Crop',
    leafBlight: 'Leaf Blight Disease',
    nutrientDeficiency: 'Nutrient Deficiency',
    continueCurrentPractices: 'Continue current farming practices',
    monitorRegularly: 'Monitor crops regularly for changes',
    applyFungicide: 'Apply appropriate fungicide treatment',
    improveVentilation: 'Improve air circulation around plants',
    removeAffectedLeaves: 'Remove and dispose of affected leaves',
    applyFertilizer: 'Apply balanced fertilizer',
    soilTesting: 'Conduct soil testing for nutrients',
    adjustWatering: 'Adjust watering schedule',
    
    // AI Advisor
    aiAdvisor: 'AI Advisor',
    aiAdvisorDescription: 'Chat with our AI agriculture expert for personalized advice',
    typeMessage: 'Type your farming question...',
    speechNotSupported: 'Speech recognition not supported in this browser',
    
    // Forecasting
    aiPoweredForecasts: 'AI-Powered Forecasts',
    forecastDescription: 'Advanced predictions for yield, pest risks, and market trends',
    yieldPrediction: 'Yield Prediction',
    pestForecast: 'Pest Forecast',
    marketPrediction: 'Market Prediction',
    expectedYield: 'Expected Yield',
    fromLastSeason: 'from last season',
    yieldFactors: 'Yield Factors',
    factorsAffectingYield: 'Key factors affecting your crop yield',
    yieldTrend: 'Yield Trend',
    
    // Pest Management
    pestRiskAssessment: 'Pest Risk Assessment',
    risk: 'Risk',
    probability: 'Probability',
    preventionMeasures: 'Prevention Measures',
    armyworm: 'Fall Armyworm',
    aphids: 'Aphids',
    cutworm: 'Cutworm',
    regularMonitoring: 'Implement regular crop monitoring schedule',
    biologicalControl: 'Use biological control agents',
    cropRotation: 'Practice crop rotation',
    
    // Market
    currentPrice: 'Current Price',
    predictedPrice: 'Predicted Price',
    expectedIncrease: 'Expected Increase',
    marketFactors: 'Market Factors',
    factorsInfluencingPrice: 'Factors influencing market price',
    priceHistory: 'Price History',
    increasedDemand: 'Increased export demand',
    favorableWeather: 'Favorable weather conditions',
    reducedSupply: 'Reduced supply from neighboring regions',
    
    // Agricultural Recommendations
    agriculturalRecommendations: 'Agricultural Recommendations',
    irrigation: 'Irrigation',
    irrigationAdvice: 'Water early morning to reduce evaporation',
    planting: 'Planting',
    plantingAdvice: 'Good conditions for planting this week',
    pestControl: 'Pest Control',
    pestAdvice: 'Monitor for pest activity during warm weather',
    
    // Weather factors
    weather: 'Weather',
    soilHealth: 'Soil Health',
    pestRisk: 'Pest Risk',
    waterAvailability: 'Water Availability'
  },
  st: {
    // General
    smartAgricultureAdvisor: 'Moeletsi oa Temo e Bohlale',
    welcomeMessage: 'Re u amohela ho AgroSense',
    dashboardDescription: 'Motsoalle oa hao oa bohlale oa temo bakeng sa lijalo tse molemo',
    navigation: 'Tataiso',
    currentLanguage: 'Puo ea Hajoale',
    aiPowered: 'AI e Matla',
    
    // Navigation
    dashboard: 'Boto ea Taolo',
    camera: 'Khamera',
    weather: 'Leholimo',
    forecast: 'Ponelopele',
    advisor: 'Moeletsi',
    
    // Weather
    currentWeather: 'Leholimo la Hajoale',
    temperature: 'Mocheso',
    humidity: 'Mongobo',
    windSpeed: 'Lebelo la Moea',
    condition: 'Boemo',
    partlyCloudy: 'Maru a Mmaloa',
    feelsLike: 'Ho utloa joaloka',
    visibility: 'Pono',
    pressure: 'Khatello',
    sunrise: 'Khalefo ea Letsatsi',
    sunset: 'Makhallo a Letsatsi',
    fiveDayForecast: 'Ponelopele ea Matsatsi a 5',
    precipitation: 'Pula',
    rain: 'Pula',
    
    // Alerts
    alerts: 'Litemoso',
    rainExpected: 'Pula e lebelletsoe ka lihora tse 24 tse tlang',
    pestAlert: 'Temoso ea likokoanyana: Hlokola lijalo bakeng sa kokoanyana ea corn',
    high: 'Holimo',
    medium: 'Mahareng',
    low: 'Tlase',
    
    // Quick Actions
    quickActions: 'Liketso tse Potlakang',
    quickActionsDescription: 'Fumana likarolo tsa bohlokoa kapele',
    analyzeCrop: 'Hlahlobisa Selo',
    askAdvisor: 'Botsa Moeletsi',
    viewForecast: 'Sheba Ponelopele',
    
    // Image Analysis
    cropHealthAnalysis: 'Tlhahlobo ea Bophelo bo Botle ba Lijalo',
    cropAnalysisDescription: 'Kenya kapa nka linepe ho hlahlobisa mathata a bophelo bo botle ba lijalo',
    uploadImage: 'Kenya Setšoantšo',
    uploadDescription: 'Nka setšoantšo kapa kenya ho tsoa setsing sa hao',
    useCamera: 'Sebelisa Khamera',
    uploadFromDevice: 'Kenya ho tsoang Setsing',
    analyzingImage: 'Re hlahlobisa Setšoantšo...',
    analysisWait: 'Sena se ka nka nako e itseng',
    analysisResults: 'Liphetho tsa Tlhahlobo',
    diagnosis: 'Teko',
    recommendations: 'Likeletso',
    confidence: 'Tšepo',
    analyzeAnother: 'Hlahlobisa Setšoantšo se Seng',
    fileSizeError: 'Boholo ba faele bo tlameha ho ba ka tlase ho 5MB',
    fileTypeError: 'Ka kopo khetha faele ea setšoantšo',
    analysisError: 'Phoso ho hlahlobisa setšoantšo. Ka kopo leka hape.',
    cameraError: 'Phihlello ea khamera e hanyeetsoe. Ka kopo sebelisa kenyo ea faele.',
    
    // Crop Health
    healthyCrop: 'Selo se Phetseng Hantle',
    leafBlight: 'Lefu la Makhasi',
    nutrientDeficiency: 'Khaello ea Lijo',
    continueCurrentPractices: 'Tsoela pele ka mekhoa ea hajoale ea temo',
    monitorRegularly: 'Hlokola lijalo kamehla bakeng sa liphetoho',
    applyFungicide: 'Sebelisa kalafi e nepahetseng ea fungicide',
    improveVentilation: 'Ntlafatsa phallo ea moea ho potoloha limela',
    removeAffectedLeaves: 'Tlosa u lahle makhasi a amehileng',
    applyFertilizer: 'Sebelisa monono o lekanang',
    soilTesting: 'Etsa tlhahlobo ea mobu bakeng sa lijo',
    adjustWatering: 'Lokisa lenaneo la ho nosetsa',
    
    // AI Advisor
    aiAdvisor: 'Moeletsi oa AI',
    aiAdvisorDescription: 'Buisana le setsebi sa rona sa AI sa temo bakeng sa keletso e ikhethileng',
    typeMessage: 'Ngola potso ea hao ea temo...',
    speechNotSupported: 'Temoho ea puo ha e tšehetsehe sefuleng sena',
    
    // Forecasting
    aiPoweredForecasts: 'Liponelopele tse Matla tsa AI',
    forecastDescription: 'Liponelopele tse tsoetseng pele bakeng sa tekanyo, kotsi ea likokoanyana le mekhoa ea mebaraka',
    yieldPrediction: 'Ponelopele ea Tekanyo',
    pestForecast: 'Ponelopele ea Likokoanyana',
    marketPrediction: 'Ponelopele ea \'Maraka',
    expectedYield: 'Tekanyo e Lebelletseng',
    fromLastSeason: 'ho tloha selemong se fetileng',
    yieldFactors: 'Lintlha tsa Tekanyo',
    factorsAffectingYield: 'Lintlha tsa bohlokoa tse amang tekanyo ea hao',
    yieldTrend: 'Mokhoa oa Tekanyo',
    
    // Pest Management
    pestRiskAssessment: 'Tekolo ea Kotsi ea Likokoanyana',
    risk: 'Kotsi',
    probability: 'Monyetla',
    preventionMeasures: 'Mehato ea Thibelo',
    armyworm: 'Kokoanyana ea Mabele',
    aphids: 'Li-aphid',
    cutworm: 'Kokoanyana ea ho Seha',
    regularMonitoring: 'Kenya tšebetsong lenaneo la ho hlokola lijalo kamehla',
    biologicalControl: 'Sebelisa li-agent tsa taolo ea tlhaho',
    cropRotation: 'Etsisa phetoho ea lijalo',
    
    // Market
    currentPrice: 'Theko ea Hajoale',
    predictedPrice: 'Theko e Boletsoeng Esale pele',
    expectedIncrease: 'Keketseho e Lebelletseng',
    marketFactors: 'Lintlha tsa \'Maraka',
    factorsInfluencingPrice: 'Lintlha tse susumetsang theko ea \'maraka',
    priceHistory: 'Nalane ea Litheko',
    increasedDemand: 'Tlhoko e eketsehileng ea kantle',
    favorableWeather: 'Maemo a leholimo a molemo',
    reducedSupply: 'Phomolo e fokotsehileng libakeng tse haufi',
    
    // Agricultural Recommendations
    agriculturalRecommendations: 'Likeletso tsa Temo',
    irrigation: 'Ho Nosetsa',
    irrigationAdvice: 'Nosetsa hoseng ho fokotsa mongobo',
    planting: 'Ho Jala',
    plantingAdvice: 'Maemo a mabotse a ho jala bekeng ena',
    pestControl: 'Taolo ea Likokoanyana',
    pestAdvice: 'Hlokola mesebetsi ea likokoanyana nakong ea leholimo le chesang',
    
    // Weather factors
    weather: 'Leholimo',
    soilHealth: 'Bophelo bo Botle ba Mobu',
    pestRisk: 'Kotsi ea Likokoanyana',
    waterAvailability: 'Ho Fumaneha ha Metsi'
  }
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    // Load saved language preference
    const savedLanguage = localStorage.getItem('agroSenseLanguage');
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'st')) {
      setLanguage(savedLanguage);
    }
  }, []);

  const updateLanguage = (newLanguage: string) => {
    setLanguage(newLanguage);
    localStorage.setItem('agroSenseLanguage', newLanguage);
  };

  const t = (key: string): string => {
    const langTranslations = translations[language as keyof typeof translations] || translations.en;
    return langTranslations[key as keyof typeof langTranslations] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: updateLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
