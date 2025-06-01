
import { toast } from '@/hooks/use-toast';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface NotificationOptions {
  title?: string;
  description?: string;
  duration?: number;
}

const useNotification = () => {
  const showNotification = (
    type: NotificationType,
    message: string,
    options: NotificationOptions = {}
  ) => {
    const { title, description, duration = 5000 } = options;

    const getTitle = () => {
      if (title) return title;
      switch (type) {
        case 'success':
          return 'Success';
        case 'error':
          return 'Error';
        case 'warning':
          return 'Warning';
        case 'info':
          return 'Info';
        default:
          return 'Notification';
      }
    };

    toast({
      title: getTitle(),
      description: description || message,
      duration,
      variant: type === 'error' ? 'destructive' : 'default',
    });
  };

  const showSuccess = (message: string, options?: NotificationOptions) =>
    showNotification('success', message, options);

  const showError = (message: string, options?: NotificationOptions) =>
    showNotification('error', message, options);

  const showWarning = (message: string, options?: NotificationOptions) =>
    showNotification('warning', message, options);

  const showInfo = (message: string, options?: NotificationOptions) =>
    showNotification('info', message, options);

  // For PWA push notifications
  const requestNotificationPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  };

  const showPushNotification = (title: string, options?: NotificationOptions) => {
    if (Notification.permission === 'granted') {
      new Notification(title, {
        body: options?.description,
        icon: '/icon-192x192.png',
        badge: '/icon-192x192.png',
      });
    }
  };

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    requestNotificationPermission,
    showPushNotification,
  };
};

export default useNotification;
