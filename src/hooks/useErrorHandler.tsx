
import { useEffect } from 'react';
import useNotification from '@/hooks/useNotification';
import { errorService } from '@/services/errorService';

export const useErrorHandler = () => {
  const notification = useNotification();

  useEffect(() => {
    errorService.setNotificationHook(notification);
  }, [notification]);

  return {
    handleError: (error: any, context?: string) => errorService.handleError(error, context),
    handleSuccess: (message: string) => errorService.handleSuccess(message)
  };
};
