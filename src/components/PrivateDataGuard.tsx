
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, User, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useNavigate } from 'react-router-dom';

interface PrivateDataGuardProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  onLoginClick?: () => void;
  showAuthError?: boolean;
}

const PrivateDataGuard = ({ 
  children, 
  title = "Private Content", 
  description = "This content is only available to registered users.",
  onLoginClick,
  showAuthError = false
}: PrivateDataGuardProps) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Card className="border-2 border-dashed border-gray-300">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  if (isAuthenticated && user) {
    return <>{children}</>;
  }

  const handleLoginClick = () => {
    if (onLoginClick) {
      onLoginClick();
    } else {
      navigate('/');
    }
  };

  return (
    <Card className="border-2 border-dashed border-gray-300">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 p-3 bg-gray-100 rounded-full">
          {showAuthError ? (
            <AlertCircle className="h-8 w-8 text-red-500" />
          ) : (
            <Lock className="h-8 w-8 text-gray-500" />
          )}
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {showAuthError ? "Authentication Error" : title}
        </h3>
        
        <p className="text-gray-600 mb-6 max-w-md">
          {showAuthError 
            ? "There was an issue with your authentication. Please sign in again."
            : description
          }
        </p>
        
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <User className="h-4 w-4" />
          <span>
            {showAuthError ? "Re-authentication required" : "Sign in required to view this content"}
          </span>
        </div>

        <Button 
          onClick={handleLoginClick}
          className="bg-green-500 hover:bg-green-600"
        >
          {showAuthError ? "Sign In Again" : "Sign In to View"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PrivateDataGuard;
