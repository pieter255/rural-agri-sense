
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import useNotification from '@/hooks/useNotification';
import { Loader2, Eye, EyeOff } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  switchToRegister: () => void;
}

const LoginModal = ({ isOpen, onClose, switchToRegister }: LoginModalProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});
  const { login, isLoading } = useAuth();
  const { t } = useLanguage();
  const { showSuccess, showError } = useNotification();

  const validateField = (name: string, value: string) => {
    const errors: {[key: string]: string} = {};
    
    if (name === 'email') {
      if (!value) {
        errors.email = 'Email is required';
      } else if (!value.includes('@')) {
        errors.email = 'Please enter a valid email address';
      }
    }
    
    if (name === 'password') {
      if (!value) {
        errors.password = 'Password is required';
      } else if (value.length < 6) {
        errors.password = 'Password must be at least 6 characters';
      }
    }
    
    return errors;
  };

  const handleFieldChange = (name: string, value: string) => {
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
    
    // Clear field-specific errors
    const errors = validateField(name, value);
    setFieldErrors(prev => ({ ...prev, ...errors }));
    
    // Clear general error
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    // Validate all fields
    const emailErrors = validateField('email', email);
    const passwordErrors = validateField('password', password);
    const allErrors = { ...emailErrors, ...passwordErrors };

    if (Object.keys(allErrors).length > 0) {
      setFieldErrors(allErrors);
      return;
    }

    try {
      const success = await login(email, password);
      if (success) {
        showSuccess('Welcome back!', {
          description: 'You have been logged in successfully.',
        });
        onClose();
        setEmail('');
        setPassword('');
        setFieldErrors({});
      }
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred. Please try again.';
      setError(errorMessage);
      showError('Login failed', { description: errorMessage });
    }
  };

  const handleClose = () => {
    setEmail('');
    setPassword('');
    setError('');
    setFieldErrors({});
    setShowPassword(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Login to AgroSense</DialogTitle>
          <DialogDescription>
            Enter your credentials to access your personalized farming dashboard
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => handleFieldChange('email', e.target.value)}
              disabled={isLoading}
              className={fieldErrors.email ? 'border-red-500' : ''}
              aria-describedby={fieldErrors.email ? 'email-error' : undefined}
            />
            {fieldErrors.email && (
              <p id="email-error" className="text-sm text-red-600">{fieldErrors.email}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => handleFieldChange('password', e.target.value)}
                disabled={isLoading}
                className={fieldErrors.password ? 'border-red-500 pr-10' : 'pr-10'}
                aria-describedby={fieldErrors.password ? 'password-error' : undefined}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {fieldErrors.password && (
              <p id="password-error" className="text-sm text-red-600">{fieldErrors.password}</p>
            )}
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </Button>
        </form>

        <div className="text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={switchToRegister}
            className="text-green-600 hover:underline font-medium"
            disabled={isLoading}
          >
            Register here
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
