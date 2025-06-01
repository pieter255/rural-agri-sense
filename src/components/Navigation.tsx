
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Camera, 
  Cloud, 
  TrendingUp, 
  MessageCircle, 
  Menu, 
  X 
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  const navigationItems = [
    { id: 'dashboard', icon: Home, label: t('dashboard') },
    { id: 'camera', icon: Camera, label: t('camera') },
    { id: 'weather', icon: Cloud, label: t('weather') },
    { id: 'forecast', icon: TrendingUp, label: t('forecast') },
    { id: 'advisor', icon: MessageCircle, label: t('advisor') },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="bg-white shadow-lg"
        >
          {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-50" 
             onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Navigation Menu */}
      <nav className={`
        fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50
        md:relative md:translate-x-0 md:shadow-none
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">{t('navigation')}</h2>
          <div className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => {
                    onTabChange(item.id);
                    setMobileMenuOpen(false);
                  }}
                >
                  <Icon className="h-4 w-4 mr-3" />
                  {item.label}
                </Button>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navigation;
