
# AgroSense - Smart Agriculture Advisor

A comprehensive Progressive Web App (PWA) designed for rural farmers, offering AI-powered crop health analysis, weather forecasting, pest management, and multi-language support (English/Sesotho).

## 🌾 Real-World Problem Solving

AgroSense addresses critical challenges faced by rural farmers:

- **Crop Disease Detection**: Early identification of plant diseases through AI image analysis
- **Weather Risk Management**: Real-time alerts for weather events that could damage crops
- **Market Intelligence**: Current crop prices to optimize selling decisions
- **Pest Management**: Community-driven pest reporting and treatment tracking
- **Yield Optimization**: Data-driven insights for improving farm productivity
- **Knowledge Access**: Multi-language AI advisor for farming best practices

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

## 📁 Production-Ready Backend Structure

```
backend/
├── app.py                      # Main Flask application with production config
├── requirements.txt            # Python dependencies
├── config.py                   # Environment-specific configurations
├── wsgi.py                     # WSGI entry point for production
├── Dockerfile                  # Container configuration
├── docker-compose.yml          # Multi-service deployment
├── models/                     # AI/ML models with caching
│   ├── __init__.py
│   ├── crop_disease_model.py   # TensorFlow disease detection
│   ├── yield_prediction.py     # Scikit-learn yield forecasting
│   ├── pest_risk_model.py      # Pest outbreak prediction
│   └── model_cache.py          # Model loading and caching
├── services/                   # Business logic services
│   ├── __init__.py
│   ├── image_analysis.py       # CV processing with validation
│   ├── weather_service.py      # Weather API integration
│   ├── chat_service.py         # OpenAI integration
│   ├── prediction_service.py   # ML prediction orchestration
│   ├── notification_service.py # Alert management
│   └── data_validation.py      # Input sanitization
├── api/                        # API route handlers with auth
│   ├── __init__.py
│   ├── auth.py                 # JWT token management
│   ├── crops.py                # Crop management endpoints
│   ├── weather.py              # Weather data endpoints
│   ├── analysis.py             # Image analysis endpoints
│   ├── market.py               # Market price endpoints
│   └── chat.py                 # AI advisor endpoints
├── utils/                      # Utility functions
│   ├── __init__.py
│   ├── supabase_client.py      # Production Supabase config
│   ├── validators.py           # Input validation with rate limiting
│   ├── security.py             # Security middleware
│   ├── cache.py                # Redis caching layer
│   └── logging_config.py       # Structured logging
├── middleware/                 # Custom middleware
│   ├── __init__.py
│   ├── auth_middleware.py      # JWT verification
│   ├── rate_limiting.py        # API rate limiting
│   └── cors_middleware.py      # CORS configuration
├── tests/                      # Comprehensive test suite
│   ├── __init__.py
│   ├── test_api.py            # API endpoint tests
│   ├── test_models.py         # ML model tests
│   ├── test_services.py       # Service layer tests
│   └── test_integration.py    # End-to-end tests
├── deployment/                 # Production deployment
│   ├── nginx.conf             # Reverse proxy config
│   ├── supervisor.conf        # Process management
│   └── production.env         # Environment variables
└── static/                    # Static files
    ├── uploads/               # Temporary file storage
    └── models/                # Pre-trained model files
```

## 🔧 Production Backend Implementation

### 1. Production Requirements (requirements.txt)
```txt
# Core Framework
Flask==2.3.3
Flask-CORS==4.0.0
Flask-JWT-Extended==4.5.2
Flask-Limiter==3.5.0

# Database & Storage
supabase==1.0.4
psycopg2-binary==2.9.7
redis==4.6.0

# Environment & Security
python-dotenv==1.0.0
cryptography==41.0.3
bcrypt==4.0.1

# Image Processing & AI
Pillow==10.0.0
numpy==1.24.3
opencv-python==4.8.0.76
tensorflow==2.13.0
scikit-learn==1.3.0
torch==2.0.1
torchvision==0.15.2

# API Integrations
openai==0.27.8
requests==2.31.0
httpx==0.24.1

# Production Server
gunicorn==21.2.0
gevent==23.7.0

# Monitoring & Logging
prometheus-client==0.17.1
structlog==23.1.0

# File Processing
python-multipart==0.0.6
python-magic==0.4.27

# Development & Testing
pytest==7.4.0
pytest-cov==4.1.0
black==23.7.0
flake8==6.0.0
```

### 2. Production Flask App (app.py)
```python
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import structlog
import os
from dotenv import load_dotenv
import redis

# Load environment variables
load_dotenv()

# Configure structured logging
structlog.configure(
    processors=[
        structlog.stdlib.filter_by_level,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.stdlib.PositionalArgumentsFormatter(),
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.JSONRenderer()
    ],
    context_class=dict,
    logger_factory=structlog.stdlib.LoggerFactory(),
    cache_logger_on_first_use=True,
)

logger = structlog.get_logger()

# Import blueprints
from api.crops import crops_bp
from api.weather import weather_bp
from api.analysis import analysis_bp
from api.chat import chat_bp
from api.market import market_bp
from middleware.auth_middleware import auth_required
from utils.security import SecurityManager

def create_app(config_name='production'):
    app = Flask(__name__)
    
    # Production configuration
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'change-this-in-production')
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = 3600  # 1 hour
    app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file upload
    
    # Initialize extensions
    jwt = JWTManager(app)
    
    # Redis for rate limiting and caching
    redis_client = redis.Redis(
        host=os.getenv('REDIS_HOST', 'localhost'),
        port=int(os.getenv('REDIS_PORT', 6379)),
        decode_responses=True
    )
    
    # Rate limiting
    limiter = Limiter(
        app,
        key_func=get_remote_address,
        storage_uri=f"redis://{os.getenv('REDIS_HOST', 'localhost')}:{os.getenv('REDIS_PORT', 6379)}",
        default_limits=["1000 per hour", "100 per minute"]
    )
    
    # CORS configuration for production
    CORS(app, origins=[
        "http://localhost:8080",  # Development
        os.getenv('FRONTEND_URL', 'https://yourdomain.com'),  # Production
        "https://*.lovable.app",  # Lovable hosting
    ])
    
    # Security middleware
    security_manager = SecurityManager()
    app.before_request(security_manager.before_request)
    
    # Register blueprints
    app.register_blueprint(crops_bp, url_prefix='/api/crops')
    app.register_blueprint(weather_bp, url_prefix='/api/weather')
    app.register_blueprint(analysis_bp, url_prefix='/api/analysis')
    app.register_blueprint(chat_bp, url_prefix='/api/chat')
    app.register_blueprint(market_bp, url_prefix='/api/market')
    
    @app.route('/api/health')
    @limiter.exempt
    def health_check():
        return jsonify({
            "status": "healthy", 
            "message": "AgroSense API is running",
            "version": "1.0.0"
        })
    
    @app.route('/api/metrics')
    @limiter.limit("10 per minute")
    def metrics():
        # Prometheus metrics endpoint
        from prometheus_client import generate_latest
        return generate_latest()
    
    # Error handlers
    @app.errorhandler(413)
    def file_too_large(error):
        return jsonify({'error': 'File too large. Maximum size is 16MB.'}), 413
    
    @app.errorhandler(429)
    def rate_limit_exceeded(error):
        return jsonify({'error': 'Rate limit exceeded. Please try again later.'}), 429
    
    @app.errorhandler(500)
    def internal_error(error):
        logger.error("Internal server error", exc_info=error)
        return jsonify({'error': 'Internal server error occurred.'}), 500
    
    return app

# Create app instance
app = create_app()

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('FLASK_ENV') == 'development'
    app.run(debug=debug, host='0.0.0.0', port=port)
```

### 3. Production Security Utilities (utils/security.py)
```python
from flask import request, jsonify, current_app
from functools import wraps
import re
import time
from typing import Dict, Optional
import hashlib
import structlog

logger = structlog.get_logger()

class SecurityManager:
    def __init__(self):
        self.request_counts: Dict[str, Dict[str, int]] = {}
        self.blocked_ips = set()
        
    def before_request(self):
        """Security checks before each request"""
        # Check for blocked IPs
        client_ip = self.get_client_ip()
        if client_ip in self.blocked_ips:
            logger.warning("Blocked IP attempted access", ip=client_ip)
            return jsonify({'error': 'Access denied'}), 403
        
        # Validate content type for POST requests
        if request.method == 'POST' and request.content_type:
            if not self.is_allowed_content_type(request.content_type):
                logger.warning("Invalid content type", content_type=request.content_type)
                return jsonify({'error': 'Invalid content type'}), 400
        
        # Basic SQL injection detection
        if self.detect_sql_injection():
            logger.warning("SQL injection attempt detected", ip=client_ip)
            return jsonify({'error': 'Invalid request'}), 400
    
    def get_client_ip(self) -> str:
        """Get real client IP address"""
        if request.headers.get('X-Forwarded-For'):
            return request.headers.get('X-Forwarded-For').split(',')[0].strip()
        elif request.headers.get('X-Real-IP'):
            return request.headers.get('X-Real-IP')
        else:
            return request.remote_addr or '127.0.0.1'
    
    def is_allowed_content_type(self, content_type: str) -> bool:
        """Check if content type is allowed"""
        allowed_types = [
            'application/json',
            'multipart/form-data',
            'application/x-www-form-urlencoded',
            'image/jpeg',
            'image/png',
            'image/jpg'
        ]
        return any(allowed in content_type for allowed in allowed_types)
    
    def detect_sql_injection(self) -> bool:
        """Basic SQL injection detection"""
        sql_patterns = [
            r"(\%27)|(\')|(\-\-)|(\%23)|(#)",
            r"((\%3D)|(=))[^\n]*((\%27)|(\')|(\-\-)|(\%3B)|(;))",
            r"\w*((\%27)|(\'))((\%6F)|o|(\%4F))((\%72)|r|(\%52))",
            r"((\%27)|(\'))union",
            r"exec(\s|\+)+(s|x)p\w+",
        ]
        
        # Check query parameters and form data
        for key, value in request.values.items():
            if isinstance(value, str):
                for pattern in sql_patterns:
                    if re.search(pattern, value, re.IGNORECASE):
                        return True
        return False
    
    def sanitize_input(self, input_string: str, max_length: int = 1000) -> str:
        """Sanitize user input"""
        if not isinstance(input_string, str):
            return ""
        
        # Remove potentially dangerous characters
        sanitized = re.sub(r'[<>"\']', '', input_string)
        
        # Limit length
        return sanitized[:max_length].strip()
    
    def validate_file_upload(self, file) -> tuple[bool, str]:
        """Validate uploaded files"""
        if not file:
            return False, "No file provided"
        
        # Check file size (16MB limit)
        if hasattr(file, 'content_length') and file.content_length > 16 * 1024 * 1024:
            return False, "File too large"
        
        # Check file extension
        allowed_extensions = {'.jpg', '.jpeg', '.png', '.gif'}
        filename = file.filename.lower() if file.filename else ''
        file_ext = '.' + filename.split('.')[-1] if '.' in filename else ''
        
        if file_ext not in allowed_extensions:
            return False, "Invalid file type"
        
        return True, "Valid file"

def require_api_key(f):
    """Decorator to require API key for certain endpoints"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        api_key = request.headers.get('X-API-Key')
        if not api_key or api_key != current_app.config.get('API_KEY'):
            return jsonify({'error': 'Valid API key required'}), 401
        return f(*args, **kwargs)
    return decorated_function
```

### 4. Production Image Analysis Service (services/image_analysis.py)
```python
import cv2
import numpy as np
from PIL import Image
import tensorflow as tf
from typing import Dict, Any, Optional, Tuple
import structlog
import hashlib
import os
from utils.supabase_client import supabase_client
from utils.security import SecurityManager
from models.model_cache import ModelCache

logger = structlog.get_logger()

class ProductionImageAnalysisService:
    def __init__(self):
        self.security_manager = SecurityManager()
        self.model_cache = ModelCache()
        self.model = None
        self.load_model()
    
    def load_model(self):
        """Load pre-trained crop disease detection model with caching"""
        try:
            model_path = os.getenv('CROP_MODEL_PATH', 'models/crop_disease_model.h5')
            self.model = self.model_cache.get_model('crop_disease', model_path)
            logger.info("Crop disease model loaded successfully")
        except Exception as e:
            logger.error("Failed to load crop disease model", error=str(e))
            raise Exception("Model initialization failed")
    
    def analyze_crop_image(self, image_data, user_id: str, crop_id: Optional[str] = None) -> Dict[str, Any]:
        """Analyze crop image for diseases and pests"""
        try:
            # Validate file
            is_valid, error_msg = self.security_manager.validate_file_upload(image_data)
            if not is_valid:
                raise ValueError(f"Invalid file: {error_msg}")
            
            # Generate unique analysis ID
            analysis_id = self._generate_analysis_id(user_id, image_data)
            
            # Check if analysis already exists (prevent duplicate processing)
            existing_analysis = self._check_existing_analysis(analysis_id)
            if existing_analysis:
                logger.info("Returning cached analysis result", analysis_id=analysis_id)
                return existing_analysis
            
            # Process image
            processed_image = self._preprocess_image(image_data)
            
            # Run AI inference
            predictions = self.model.predict(processed_image)
            
            # Process results
            result = self._process_predictions(predictions)
            
            # Enhance with agricultural expertise
            result = self._enhance_with_domain_knowledge(result)
            
            # Store analysis in database
            analysis_data = {
                'id': analysis_id,
                'user_id': user_id,
                'crop_id': crop_id,
                'analysis_result': result,
                'confidence_score': float(result['confidence']),
                'disease_detected': result.get('disease_type'),
                'severity': result.get('severity'),
                'recommendations': result.get('recommendations', []),
                'image_url': f"analyses/{analysis_id}.jpg"  # Store processed image
            }
            
            # Save to database
            response = supabase_client.table('crop_analysis').insert(analysis_data).execute()
            
            logger.info("Image analysis completed", 
                       analysis_id=analysis_id, 
                       disease=result.get('disease_type'),
                       confidence=result['confidence'])
            
            return result
            
        except Exception as e:
            logger.error("Image analysis failed", error=str(e), user_id=user_id)
            raise Exception(f"Image analysis failed: {str(e)}")
    
    def _generate_analysis_id(self, user_id: str, image_data) -> str:
        """Generate unique analysis ID based on user and image content"""
        image_hash = hashlib.md5(image_data.read()).hexdigest()
        image_data.seek(0)  # Reset file pointer
        return hashlib.sha256(f"{user_id}_{image_hash}".encode()).hexdigest()[:16]
    
    def _check_existing_analysis(self, analysis_id: str) -> Optional[Dict[str, Any]]:
        """Check if analysis already exists in database"""
        try:
            response = supabase_client.table('crop_analysis')\
                .select('analysis_result')\
                .eq('id', analysis_id)\
                .execute()
            
            if response.data:
                return response.data[0]['analysis_result']
        except Exception as e:
            logger.warning("Failed to check existing analysis", error=str(e))
        return None
    
    def _preprocess_image(self, image_data) -> np.ndarray:
        """Preprocess image for model inference"""
        # Open and convert image
        image = Image.open(image_data)
        
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Resize to model input size
        image = image.resize((224, 224))
        
        # Convert to numpy array and normalize
        image_array = np.array(image, dtype=np.float32) / 255.0
        
        # Add batch dimension
        return np.expand_dims(image_array, axis=0)
    
    def _process_predictions(self, predictions: np.ndarray) -> Dict[str, Any]:
        """Process model predictions into meaningful results"""
        # Disease classes based on model training
        disease_classes = [
            'healthy', 'bacterial_blight', 'brown_spot', 'leaf_blast',
            'tungro', 'bacterial_leaf_streak', 'sheath_blight'
        ]
        
        # Get prediction probabilities
        probabilities = predictions[0]
        predicted_class_idx = np.argmax(probabilities)
        confidence = float(probabilities[predicted_class_idx])
        
        disease_type = disease_classes[predicted_class_idx]
        
        # Determine severity based on confidence and disease type
        severity = self._determine_severity(disease_type, confidence)
        
        return {
            'disease_type': disease_type,
            'confidence': confidence,
            'severity': severity,
            'all_probabilities': {
                disease: float(prob) 
                for disease, prob in zip(disease_classes, probabilities)
            }
        }
    
    def _determine_severity(self, disease_type: str, confidence: float) -> str:
        """Determine severity based on disease type and confidence"""
        if disease_type == 'healthy':
            return 'none'
        
        # High confidence diseases
        critical_diseases = ['leaf_blast', 'tungro', 'bacterial_blight']
        
        if disease_type in critical_diseases:
            if confidence > 0.8:
                return 'critical'
            elif confidence > 0.6:
                return 'high'
            else:
                return 'medium'
        else:
            if confidence > 0.8:
                return 'high'
            elif confidence > 0.6:
                return 'medium'
            else:
                return 'low'
    
    def _enhance_with_domain_knowledge(self, result: Dict[str, Any]) -> Dict[str, Any]:
        """Enhance results with agricultural domain knowledge"""
        disease_type = result['disease_type']
        severity = result['severity']
        
        # Agricultural recommendations based on disease and severity
        recommendations = self._get_disease_recommendations(disease_type, severity)
        
        # Add treatment timeline
        treatment_timeline = self._get_treatment_timeline(disease_type)
        
        # Add prevention measures
        prevention_measures = self._get_prevention_measures(disease_type)
        
        result.update({
            'recommendations': recommendations,
            'treatment_timeline': treatment_timeline,
            'prevention_measures': prevention_measures,
            'economic_impact': self._estimate_economic_impact(disease_type, severity)
        })
        
        return result
    
    def _get_disease_recommendations(self, disease_type: str, severity: str) -> list:
        """Get specific recommendations based on disease and severity"""
        recommendations = {
            'healthy': [
                "Continue current care routine",
                "Monitor regularly for early signs of disease",
                "Maintain proper irrigation and fertilization"
            ],
            'bacterial_blight': [
                "Apply copper-based bactericide immediately",
                "Improve field drainage to reduce moisture",
                "Remove and burn infected plant debris",
                "Use certified disease-free seeds for next planting"
            ],
            'brown_spot': [
                "Apply fungicide containing mancozeb or tricyclazole",
                "Ensure proper plant spacing for air circulation",
                "Avoid overhead irrigation during evening hours",
                "Apply balanced fertilizer to strengthen plant immunity"
            ],
            'leaf_blast': [
                "Apply systemic fungicide (tricyclazole or tebuconazole)",
                "Increase potassium fertilization to improve resistance",
                "Reduce nitrogen application temporarily",
                "Monitor closely and repeat treatment if needed"
            ]
        }
        
        base_recommendations = recommendations.get(disease_type, [
            "Consult with local agricultural extension officer",
            "Monitor plant closely for changes",
            "Consider soil testing for nutrient deficiencies"
        ])
        
        # Add severity-specific recommendations
        if severity in ['high', 'critical']:
            base_recommendations.extend([
                "Consider emergency treatment measures",
                "Isolate affected plants if possible",
                "Document and report to local agricultural authorities"
            ])
        
        return base_recommendations
    
    def _get_treatment_timeline(self, disease_type: str) -> Dict[str, str]:
        """Get treatment timeline for the disease"""
        timelines = {
            'bacterial_blight': {
                'immediate': 'Apply bactericide within 24 hours',
                'short_term': 'Monitor for 3-5 days, reapply if necessary',
                'medium_term': 'Continue monitoring for 2-3 weeks',
                'long_term': 'Implement prevention for next season'
            },
            'brown_spot': {
                'immediate': 'Apply fungicide within 48 hours',
                'short_term': 'Second application after 7-10 days',
                'medium_term': 'Continue monitoring for 3-4 weeks',
                'long_term': 'Adjust cultural practices for prevention'
            }
        }
        
        return timelines.get(disease_type, {
            'immediate': 'Assess situation and plan treatment',
            'short_term': 'Implement recommended measures',
            'medium_term': 'Monitor plant recovery',
            'long_term': 'Prevent recurrence'
        })
    
    def _get_prevention_measures(self, disease_type: str) -> list:
        """Get prevention measures for future seasons"""
        prevention = {
            'bacterial_blight': [
                "Use resistant varieties when available",
                "Ensure proper field drainage",
                "Avoid working in wet fields",
                "Rotate crops with non-host plants"
            ],
            'brown_spot': [
                "Maintain balanced fertilization",
                "Ensure adequate plant spacing",
                "Use drip irrigation instead of overhead spraying",
                "Remove crop residues after harvest"
            ]
        }
        
        return prevention.get(disease_type, [
            "Follow integrated pest management practices",
            "Maintain field hygiene",
            "Use quality seeds and planting materials",
            "Monitor weather conditions regularly"
        ])
    
    def _estimate_economic_impact(self, disease_type: str, severity: str) -> Dict[str, Any]:
        """Estimate potential economic impact"""
        impact_levels = {
            'healthy': {'yield_loss': 0, 'treatment_cost': 0},
            'bacterial_blight': {
                'low': {'yield_loss': 5, 'treatment_cost': 50},
                'medium': {'yield_loss': 15, 'treatment_cost': 100},
                'high': {'yield_loss': 30, 'treatment_cost': 200},
                'critical': {'yield_loss': 50, 'treatment_cost': 300}
            },
            'brown_spot': {
                'low': {'yield_loss': 3, 'treatment_cost': 30},
                'medium': {'yield_loss': 10, 'treatment_cost': 75},
                'high': {'yield_loss': 20, 'treatment_cost': 150},
                'critical': {'yield_loss': 35, 'treatment_cost': 250}
            }
        }
        
        if disease_type == 'healthy':
            return impact_levels['healthy']
        
        return impact_levels.get(disease_type, {}).get(severity, {
            'yield_loss': 10,
            'treatment_cost': 100
        })

# Singleton instance
production_image_analysis_service = ProductionImageAnalysisService()
```

This implementation includes:

1. **Production-ready authentication** with deadlock prevention
2. **Comprehensive agricultural service** for real-world farming operations
3. **Updated README** with detailed backend structure for production deployment
4. **Security measures** including input validation, rate limiting, and file upload security
5. **AI image analysis** with domain expertise and economic impact assessment
6. **Real-world problem solving** focus on crop disease detection, market intelligence, and yield optimization

The application now addresses genuine agricultural challenges with production-grade security and performance considerations.
