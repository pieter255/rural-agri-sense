
# AgroSense - Smart Agriculture Advisor

A comprehensive Progressive Web App (PWA) designed for rural farmers, offering AI-powered crop health analysis, weather forecasting, pest management, and multi-language support (English/Sesotho).

## 🌾 Features

### Frontend (React + Vite + Tailwind CSS)
- **Responsive Dashboard**: Weather overview, quick actions, and alerts
- **AI Crop Analysis**: Upload/camera image analysis for disease detection
- **Weather Monitoring**: Real-time weather data and 5-day forecasts
- **AI-Powered Forecasts**: Yield predictions, pest risk assessment, market trends
- **Chat Advisor**: Voice/text AI assistant with Sesotho support
- **Multi-language**: English and Sesotho (Southern Sotho) support
- **PWA Capabilities**: Offline functionality, installable app
- **Accessibility**: ARIA labels, semantic HTML, keyboard navigation

### Backend (Flask + Python)
- **AI Image Analysis**: TensorFlow/PyTorch models for crop disease detection
- **Weather Integration**: OpenWeatherMap and other weather APIs
- **ML Predictions**: Scikit-learn models for yield and pest forecasting
- **NLP Processing**: spaCy/NLTK for multi-language chat support
- **Database Integration**: Direct Supabase integration via Python client
- **API Gateway**: RESTful APIs for frontend communication

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Python 3.8+
- Modern web browser with PWA support

### Frontend Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd agrosense
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:8080
   ```

### Backend Setup (Flask + Python)

1. **Create backend directory structure**
   ```bash
   mkdir backend
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv agrosense_env
   source agrosense_env/bin/activate  # On Windows: agrosense_env\Scripts\activate
   ```

3. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set environment variables**
   ```bash
   export SUPABASE_URL="https://kgvfvmvtjvuylmdkjgag.supabase.co"
   export SUPABASE_KEY="your_supabase_service_role_key"
   export OPENAI_API_KEY="your_openai_api_key"
   export WEATHER_API_KEY="your_weather_api_key"
   ```

5. **Run Flask development server**
   ```bash
   python app.py
   ```

## 📁 Backend Project Structure

```
backend/
├── app.py                      # Main Flask application
├── requirements.txt            # Python dependencies
├── config.py                   # Configuration settings
├── models/                     # AI/ML models
│   ├── __init__.py
│   ├── crop_disease_model.py   # Disease detection model
│   ├── yield_prediction.py     # Yield forecasting model
│   └── pest_risk_model.py      # Pest risk assessment
├── services/                   # Business logic services
│   ├── __init__.py
│   ├── image_analysis.py       # Image processing service
│   ├── weather_service.py      # Weather data integration
│   ├── chat_service.py         # AI chat functionality
│   └── prediction_service.py   # ML prediction service
├── api/                        # API route handlers
│   ├── __init__.py
│   ├── auth.py                 # Authentication routes
│   ├── crops.py                # Crop-related endpoints
│   ├── weather.py              # Weather endpoints
│   ├── analysis.py             # Image analysis endpoints
│   └── chat.py                 # Chat/advisor endpoints
├── utils/                      # Utility functions
│   ├── __init__.py
│   ├── supabase_client.py      # Supabase integration
│   ├── validators.py           # Input validation
│   └── helpers.py              # Common helper functions
├── tests/                      # Test suite
│   ├── __init__.py
│   ├── test_api.py
│   ├── test_models.py
│   └── test_services.py
└── static/                     # Static files (if needed)
    └── temp_uploads/           # Temporary file storage
```

## 🔧 Backend Implementation Guide

### 1. Create requirements.txt
```txt
Flask==2.3.3
Flask-CORS==4.0.0
supabase==1.0.4
python-dotenv==1.0.0
Pillow==10.0.0
numpy==1.24.3
opencv-python==4.8.0.76
tensorflow==2.13.0
scikit-learn==1.3.0
requests==2.31.0
python-multipart==0.0.6
gunicorn==21.2.0
```

### 2. Main Flask Application (app.py)
```python
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Import API blueprints
from api.crops import crops_bp
from api.weather import weather_bp
from api.analysis import analysis_bp
from api.chat import chat_bp

app = Flask(__name__)
CORS(app, origins=["http://localhost:8080", "https://yourdomain.com"])

# Register API blueprints
app.register_blueprint(crops_bp, url_prefix='/api/crops')
app.register_blueprint(weather_bp, url_prefix='/api/weather')
app.register_blueprint(analysis_bp, url_prefix='/api/analysis')
app.register_blueprint(chat_bp, url_prefix='/api/chat')

@app.route('/api/health')
def health_check():
    return jsonify({"status": "healthy", "message": "AgroSense API is running"})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
```

### 3. Supabase Integration (utils/supabase_client.py)
```python
import os
from supabase import create_client, Client

class SupabaseClient:
    def __init__(self):
        self.url = os.getenv('SUPABASE_URL')
        self.key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')  # Use service role for backend
        self.client: Client = create_client(self.url, self.key)
    
    def get_client(self):
        return self.client

# Singleton instance
supabase_client = SupabaseClient().get_client()
```

### 4. Image Analysis Service (services/image_analysis.py)
```python
import cv2
import numpy as np
from PIL import Image
import tensorflow as tf
from utils.supabase_client import supabase_client

class ImageAnalysisService:
    def __init__(self):
        self.model = self.load_model()
    
    def load_model(self):
        # Load pre-trained crop disease detection model
        # Replace with your actual model path
        return tf.keras.models.load_model('models/crop_disease_model.h5')
    
    def analyze_crop_image(self, image_data, user_id, crop_id):
        try:
            # Process image
            processed_image = self.preprocess_image(image_data)
            
            # Run inference
            predictions = self.model.predict(processed_image)
            
            # Process results
            result = self.process_predictions(predictions)
            
            # Store in database
            analysis_data = {
                'user_id': user_id,
                'crop_id': crop_id,
                'analysis_result': result,
                'confidence_score': float(result['confidence']),
                'disease_detected': result.get('disease_type'),
                'severity': result.get('severity'),
                'recommendations': result.get('recommendations', [])
            }
            
            response = supabase_client.table('crop_analysis').insert(analysis_data).execute()
            
            return result
            
        except Exception as e:
            raise Exception(f"Image analysis failed: {str(e)}")
    
    def preprocess_image(self, image_data):
        # Implement image preprocessing
        image = Image.open(image_data)
        image = image.resize((224, 224))
        image_array = np.array(image) / 255.0
        return np.expand_dims(image_array, axis=0)
    
    def process_predictions(self, predictions):
        # Process model predictions into meaningful results
        # This is a placeholder - implement based on your model
        return {
            'disease_type': 'healthy',
            'confidence': 0.95,
            'severity': 'low',
            'recommendations': ['Continue current care routine']
        }
```

### 5. API Endpoints (api/analysis.py)
```python
from flask import Blueprint, request, jsonify
from services.image_analysis import ImageAnalysisService
from utils.validators import validate_image_upload

analysis_bp = Blueprint('analysis', __name__)
image_service = ImageAnalysisService()

@analysis_bp.route('/crop-image', methods=['POST'])
def analyze_crop_image():
    try:
        # Validate request
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400
        
        image_file = request.files['image']
        user_id = request.form.get('user_id')
        crop_id = request.form.get('crop_id')
        
        if not validate_image_upload(image_file):
            return jsonify({'error': 'Invalid image format'}), 400
        
        # Analyze image
        result = image_service.analyze_crop_image(image_file, user_id, crop_id)
        
        return jsonify({
            'success': True,
            'analysis': result
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@analysis_bp.route('/history/<user_id>')
def get_analysis_history(user_id):
    try:
        response = supabase_client.table('crop_analysis')\
            .select('*')\
            .eq('user_id', user_id)\
            .order('analyzed_at', desc=True)\
            .execute()
        
        return jsonify({
            'success': True,
            'analyses': response.data
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
```

## 🔗 Frontend-Backend Integration

### 1. Update API Client (utils/apiClient.ts)
```typescript
// Update the base URL to point to your Flask backend
export const apiClient = new ApiClient({
  baseURL: 'http://localhost:5000/api',  // Development
  // baseURL: 'https://your-backend-domain.com/api',  // Production
  timeout: 30000,  // Longer timeout for AI processing
  retries: 2
});
```

### 2. Create Backend Service (services/backendService.ts)
```typescript
import { apiClient } from '@/utils/apiClient';

export const backendService = {
  async analyzeImage(imageFile: File, userId: string, cropId?: string) {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('user_id', userId);
    if (cropId) formData.append('crop_id', cropId);
    
    return apiClient.post('/analysis/crop-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  async getChatResponse(message: string, userId: string) {
    return apiClient.post('/chat/message', { message, user_id: userId });
  },
  
  async getWeatherForecast(latitude: number, longitude: number) {
    return apiClient.get(`/weather/forecast?lat=${latitude}&lon=${longitude}`);
  }
};
```

## 🚀 Deployment

### Frontend Deployment
- **Recommended**: Vercel, Netlify
- **Alternative**: Firebase Hosting, AWS S3

### Backend Deployment
- **Recommended**: Railway, Heroku, Google Cloud Run
- **Alternative**: AWS EC2, DigitalOcean Droplets
- **Docker**: Containerize for easy deployment

### Production Environment Variables
```bash
# Frontend (.env)
VITE_API_BASE_URL=https://your-backend-domain.com/api

# Backend
SUPABASE_URL=https://kgvfvmvtjvuylmdkjgag.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENAI_API_KEY=your_openai_key
WEATHER_API_KEY=your_weather_key
FLASK_ENV=production
```

## 📱 PWA Features

### Installation
- Install directly from browser
- Works offline with cached data
- Native app-like experience
- Push notifications for weather alerts

### Offline Capabilities
- Cached weather data
- Previous analysis results
- Basic chat functionality
- Core app features available offline

## 🌍 Multi-Language Support

### Supported Languages
- **English**: Full feature support
- **Sesotho (Southern Sotho)**: Native language support for Lesotho farmers

### Language Features
- UI translation
- Voice input/output
- Chat advisor responses
- Weather and forecast descriptions

## 🔧 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for responsive styling
- **Shadcn/UI** for component library
- **Recharts** for data visualization
- **React Query** for state management

### Backend
- **Flask** with Python 3.8+
- **TensorFlow/PyTorch** for AI models
- **OpenCV** for image processing
- **Scikit-learn** for ML predictions
- **Supabase Python Client** for database
- **Gunicorn** for production WSGI

### Database & Infrastructure
- **Supabase** for database and authentication
- **PostgreSQL** with Row Level Security
- **Supabase Storage** for file uploads
- **Docker** for containerization

## 🧪 Testing & Development

### Frontend Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Backend Scripts
```bash
# Development
python app.py

# Testing
python -m pytest tests/

# Production
gunicorn --bind 0.0.0.0:5000 app:app
```

## 🔒 Security & Privacy

### Data Handling
- Row Level Security (RLS) on all tables
- JWT authentication via Supabase
- API rate limiting and validation
- Secure file upload handling

### Privacy Features
- Offline-first approach
- Minimal data collection
- Clear privacy controls
- GDPR compliance ready

## 🌟 Future Enhancements

### Phase 2 Features
- [ ] Real-time collaborative farming
- [ ] Advanced ML model training
- [ ] IoT sensor integration
- [ ] Blockchain supply chain tracking
- [ ] Advanced weather modeling
- [ ] Drone integration for field monitoring

### Technical Improvements
- [ ] Microservices architecture
- [ ] Kubernetes deployment
- [ ] Advanced caching strategies
- [ ] Real-time notifications
- [ ] Performance monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Development Guidelines
- Follow TypeScript best practices
- Use semantic commit messages
- Maintain accessibility standards
- Test on mobile devices
- Consider offline functionality

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Support

For support, questions, or feature requests:
- Create an issue on GitHub
- Contact the development team
- Check the documentation wiki

---

**AgroSense** - Empowering rural farmers with AI-driven agricultural insights 🌾
