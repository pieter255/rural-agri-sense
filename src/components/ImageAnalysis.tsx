
import { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Camera, 
  Upload, 
  Image as ImageIcon, 
  CheckCircle, 
  AlertTriangle, 
  Loader2,
  X
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const ImageAnalysis = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();

  // Mock analysis function (replace with actual AI model integration)
  const analyzeImage = useCallback(async (imageFile: File) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock analysis result
      const mockResults = [
        {
          disease: t('healthyCrop'),
          confidence: 95,
          severity: 'none',
          recommendations: [t('continueCurrentPractices'), t('monitorRegularly')]
        },
        {
          disease: t('leafBlight'),
          confidence: 87,
          severity: 'medium',
          recommendations: [t('applyFungicide'), t('improveVentilation'), t('removeAffectedLeaves')]
        },
        {
          disease: t('nutrientDeficiency'),
          confidence: 78,
          severity: 'low',
          recommendations: [t('applyFertilizer'), t('soilTesting'), t('adjustWatering')]
        }
      ];
      
      // Randomly select a result for demo
      const result = mockResults[Math.floor(Math.random() * mockResults.length)];
      setAnalysisResult(result);
    } catch (err) {
      setError(t('analysisError'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError(t('fileSizeError'));
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setError(t('fileTypeError'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setAnalysisResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
      
      analyzeImage(file);
    }
  };

  const handleCameraCapture = () => {
    // In a real app, this would access the device camera
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          // Create video element and capture frame
          // For demo purposes, we'll just trigger file input
          fileInputRef.current?.click();
        })
        .catch(() => {
          setError(t('cameraError'));
        });
    } else {
      fileInputRef.current?.click();
    }
  };

  const resetAnalysis = () => {
    setSelectedImage(null);
    setAnalysisResult(null);
    setError(null);
    setLoading(false);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'none': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'low': case 'medium': case 'high': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default: return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            {t('cropHealthAnalysis')}
          </CardTitle>
          <CardDescription>
            {t('cropAnalysisDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Upload Area */}
          {!selectedImage && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center space-y-4">
              <div className="mx-auto w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <ImageIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">{t('uploadImage')}</h3>
                <p className="text-gray-500">{t('uploadDescription')}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={handleCameraCapture} className="flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  {t('useCamera')}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  {t('uploadFromDevice')}
                </Button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          )}

          {/* Selected Image */}
          {selectedImage && (
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={selectedImage}
                  alt="Selected crop"
                  className="w-full max-w-md mx-auto rounded-lg shadow-md"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2 bg-white"
                  onClick={resetAnalysis}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Loading State */}
              {loading && (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-center space-x-3">
                      <Loader2 className="h-6 w-6 animate-spin text-green-500" />
                      <div>
                        <p className="font-medium">{t('analyzingImage')}</p>
                        <p className="text-sm text-gray-500">{t('analysisWait')}</p>
                      </div>
                    </div>
                    <Progress value={65} className="mt-4" />
                  </CardContent>
                </Card>
              )}

              {/* Error State */}
              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Analysis Results */}
              {analysisResult && !loading && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        {getSeverityIcon(analysisResult.severity)}
                        {t('analysisResults')}
                      </span>
                      <Badge variant={getSeverityColor(analysisResult.severity)}>
                        {analysisResult.confidence}% {t('confidence')}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-lg mb-2">{t('diagnosis')}</h4>
                      <p className="text-gray-700">{analysisResult.disease}</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-lg mb-2">{t('recommendations')}</h4>
                      <ul className="space-y-2">
                        {analysisResult.recommendations.map((recommendation: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{recommendation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button 
                      onClick={resetAnalysis} 
                      variant="outline" 
                      className="w-full"
                    >
                      {t('analyzeAnother')}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ImageAnalysis;
