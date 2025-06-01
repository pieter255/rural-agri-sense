
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, User } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface PrivateDataGuardProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  onLoginClick?: () => void;
}

const PrivateDataGuard = ({ 
  children, 
  title = "Private Content", 
  description = "This content is only available to registered users.",
  onLoginClick 
}: PrivateDataGuardProps) => {
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <Card className="border-2 border-dashed border-gray-300">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 p-3 bg-gray-100 rounded-full">
          <Lock className="h-8 w-8 text-gray-500" />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6 max-w-md">{description}</p>
        
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <User className="h-4 w-4" />
          <span>Sign in required to view this content</span>
        </div>

        <Button 
          onClick={onLoginClick}
          className="bg-green-500 hover:bg-green-600"
        >
          Sign In to View
        </Button>
      </CardContent>
    </Card>
  );
};

export default PrivateDataGuard;
