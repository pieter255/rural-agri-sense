
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

### Backend (Flask - Ready for Integration)
- **Image Analysis API**: Crop disease detection using AI models
- **Weather Integration**: OpenWeatherMap API integration
- **Forecast Models**: ML-powered yield and pest predictions
- **NLP Support**: Multi-language query processing
- **Database**: SQLite/PostgreSQL for data persistence

### AI Modules (Mock Implementation Included)
- **Computer Vision**: Crop disease classification
- **Machine Learning**: Yield and pest prediction models
- **Natural Language Processing**: Sesotho/English chat support
- **Voice Recognition**: Speech-to-text functionality

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Modern web browser with PWA support

### Installation & Setup

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

5. **Install as PWA** (Optional)
   - Open browser menu → "Install AgroSense" or "Add to Home Screen"

### Building for Production

```bash
# Build the application
npm run build

# Preview production build
npm run preview
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

### PWA Technologies
- **Service Worker** for offline functionality
- **Web Manifest** for app installation
- **Cache API** for offline data storage
- **Push API** for notifications

### AI Integration Points
- **Image Analysis**: Ready for TensorFlow.js integration
- **Speech Recognition**: Browser Web Speech API
- **NLP Processing**: Prepared for Rasa/spaCy integration

## 📊 Architecture Overview

```
/src
├── components/          # Reusable UI components
│   ├── ImageAnalysis.tsx    # Crop image upload/analysis
│   ├── ChatAdvisor.tsx      # AI chat interface
│   ├── WeatherDashboard.tsx # Weather display
│   ├── ForecastDashboard.tsx # AI predictions
│   └── LanguageToggle.tsx   # Language switcher
├── hooks/              # Custom React hooks
│   └── useLanguage.tsx     # Multi-language support
├── pages/              # Main application pages
│   └── Index.tsx           # Dashboard page
└── lib/                # Utility functions

/public
├── manifest.json       # PWA manifest
├── sw.js              # Service worker
└── icons/             # PWA icons
```

## 🎨 Design System

### Color Palette
- **Primary**: Agricultural green (#22c55e)
- **Secondary**: Earth tones and sky blues
- **Accent**: Warm oranges for alerts
- **Neutral**: Modern grays for text and borders

### Typography
- **Font**: Inter (Google Fonts)
- **Hierarchy**: Clear heading structure
- **Accessibility**: High contrast ratios

### Components
- **Cards**: Information containers with hover effects
- **Buttons**: Action-oriented with clear states
- **Forms**: Accessible inputs with validation
- **Charts**: Data visualization with Recharts

## 🧪 Testing & Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Mock Data
The application includes comprehensive mock data for:
- Weather conditions
- Crop analysis results
- AI chat responses
- Forecast predictions

Replace mock implementations with real API calls as needed.

## 🌐 Deployment

### Frontend Deployment
- **Recommended**: Vercel, Netlify
- **Alternative**: Firebase Hosting, AWS S3

### Backend Deployment (Future)
- **Recommended**: Railway, Heroku
- **Alternative**: AWS EC2, DigitalOcean

### Environment Variables
Create `.env` file for:
```env
VITE_WEATHER_API_KEY=your_openweather_api_key
VITE_BACKEND_URL=your_backend_url
```

## 🔒 Security & Privacy

### Data Handling
- Local storage for user preferences
- Secure API communication
- No sensitive data persistence without consent

### Privacy Features
- Offline-first approach
- Minimal data collection
- Clear privacy controls

## 🌟 Future Enhancements

### Phase 2 Features
- [ ] Real AI model integration
- [ ] Community chat functionality
- [ ] Advanced weather APIs
- [ ] Crop calendar integration
- [ ] Market price tracking
- [ ] Farm management tools

### Technical Improvements
- [ ] Backend API development
- [ ] Database optimization
- [ ] Performance monitoring
- [ ] Advanced PWA features
- [ ] Automated testing suite

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
