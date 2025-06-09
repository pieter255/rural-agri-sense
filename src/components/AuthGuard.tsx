
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  fallback,
  redirectTo = '/' 
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <Card className="max-w-md mx-auto mt-8">
        <CardContent className="text-center py-8">
          <div className="mb-4 flex justify-center">
            <div className="p-3 bg-red-100 rounded-full">
              <Lock className="h-8 w-8 text-red-600" />
            </div>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Authentication Required
          </h3>
          
          <p className="text-gray-600 mb-6">
            You need to be logged in to access this feature.
          </p>
          
          <Button 
            onClick={() => navigate(redirectTo)}
            className="bg-green-500 hover:bg-green-600"
          >
            Go to Login
          </Button>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
