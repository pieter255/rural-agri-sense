
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Sprout, 
  BarChart3, 
  CloudRain, 
  TrendingUp, 
  Shield, 
  Smartphone,
  Users,
  ArrowRight,
  CheckCircle,
  Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: Sprout,
      title: 'Smart Farm Management',
      description: 'Track your crops, monitor growth stages, and manage multiple farm locations efficiently.',
      color: 'text-green-600'
    },
    {
      icon: CloudRain,
      title: 'Weather Intelligence',
      description: 'Get real-time weather data and alerts to protect your crops from adverse conditions.',
      color: 'text-blue-600'
    },
    {
      icon: BarChart3,
      title: 'Market Analytics',
      description: 'Access current market prices and trends to maximize your profit margins.',
      color: 'text-purple-600'
    },
    {
      icon: TrendingUp,
      title: 'Yield Predictions',
      description: 'AI-powered yield predictions help you plan better and increase productivity.',
      color: 'text-orange-600'
    },
    {
      icon: Shield,
      title: 'Disease Detection',
      description: 'Upload crop images for instant disease detection and treatment recommendations.',
      color: 'text-red-600'
    },
    {
      icon: Smartphone,
      title: 'Mobile Optimized',
      description: 'Access your farm data anywhere, anytime with our mobile-responsive platform.',
      color: 'text-cyan-600'
    }
  ];

  const testimonials = [
    {
      name: 'Thabo Mokoena',
      location: 'Maseru, Lesotho',
      text: 'AgroSense helped me increase my maize yield by 30% last season. The weather alerts saved my crops twice!',
      rating: 5
    },
    {
      name: 'Mpho Sekantsi',
      location: 'Mafeteng, Lesotho',
      text: 'The market price tracking feature helps me sell at the right time. My profits have improved significantly.',
      rating: 5
    },
    {
      name: 'Lerato Thabane',
      location: 'Berea, Lesotho',
      text: 'Easy to use and very helpful for managing my vegetable farm. The disease detection is amazing!',
      rating: 5
    }
  ];

  const stats = [
    { label: 'Active Farmers', value: '2,500+' },
    { label: 'Farms Monitored', value: '15,000+' },
    { label: 'Hectares Tracked', value: '50,000+' },
    { label: 'Yield Increase', value: '25%' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4">
            🚀 Now with AI-Powered Insights
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Smart Farming for
            <span className="text-green-600"> Modern Agriculture</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Revolutionize your farming with AI-powered crop monitoring, weather intelligence, 
            and market insights. Join thousands of farmers already growing smarter.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button size="lg" className="text-lg px-8 py-3">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/auth">
                  <Button size="lg" className="text-lg px-8 py-3">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button size="lg" variant="outline" className="text-lg px-8 py-3">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Farm Smarter
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive tools designed specifically for farmers in Lesotho and beyond.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center mb-4`}>
                    <Icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Farmers Across Lesotho
            </h2>
            <p className="text-xl text-gray-600">
              See how AgroSense is transforming agriculture one farm at a time.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="h-full">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">"{testimonial.text}"</p>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-gray-500 text-sm">{testimonial.location}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Farm?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Join thousands of farmers who are already using AgroSense to increase yields, 
            reduce costs, and grow sustainably.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  View Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/auth">
                  <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Get Started Free
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button size="lg" variant="outline" className="text-lg px-8 py-3 text-white border-white hover:bg-white hover:text-green-600">
                    <Users className="mr-2 h-5 w-5" />
                    Join Community
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Sprout className="h-8 w-8 text-green-400" />
                <span className="text-xl font-bold">AgroSense</span>
              </div>
              <p className="text-gray-400">
                Empowering farmers with smart technology for sustainable agriculture.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Farm Management</li>
                <li>Weather Monitoring</li>
                <li>Market Analytics</li>
                <li>Disease Detection</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Community</li>
                <li>Contact Us</li>
                <li>Training</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>About Us</li>
                <li>Careers</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 AgroSense. All rights reserved. Made with ❤️ for farmers in Lesotho.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
