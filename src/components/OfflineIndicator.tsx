
import { Alert, AlertDescription } from '@/components/ui/alert';
import { WifiOff, Wifi } from 'lucide-react';
import useOffline from '@/hooks/useOffline';

const OfflineIndicator = () => {
  const { isOffline } = useOffline();

  if (!isOffline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <Alert className="rounded-none border-x-0 border-t-0 bg-yellow-50 border-yellow-200">
        <WifiOff className="h-4 w-4" />
        <AlertDescription className="text-yellow-800">
          You are currently offline. Some features may be limited.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default OfflineIndicator;
