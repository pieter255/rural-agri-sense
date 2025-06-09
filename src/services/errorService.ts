
import useNotification from '@/hooks/useNotification';

export interface AppError {
  code: string;
  message: string;
  details?: any;
}

export class ErrorService {
  private static instance: ErrorService;
  private notificationHook: any;

  static getInstance(): ErrorService {
    if (!ErrorService.instance) {
      ErrorService.instance = new ErrorService();
    }
    return ErrorService.instance;
  }

  setNotificationHook(hook: any) {
    this.notificationHook = hook;
  }

  handleError(error: any, context?: string): AppError {
    console.error(`Error in ${context}:`, error);

    let appError: AppError;

    if (error?.code === 'PGRST301') {
      appError = {
        code: 'AUTH_REQUIRED',
        message: 'Please log in to access this feature',
        details: error
      };
    } else if (error?.code === 'PGRST116') {
      appError = {
        code: 'NOT_FOUND',
        message: 'The requested data was not found',
        details: error
      };
    } else if (error?.message?.includes('JWT')) {
      appError = {
        code: 'SESSION_EXPIRED',
        message: 'Your session has expired. Please log in again.',
        details: error
      };
    } else if (error?.message?.includes('network')) {
      appError = {
        code: 'NETWORK_ERROR',
        message: 'Network error. Please check your connection.',
        details: error
      };
    } else {
      appError = {
        code: 'UNKNOWN_ERROR',
        message: error?.message || 'An unexpected error occurred',
        details: error
      };
    }

    if (this.notificationHook?.showError) {
      this.notificationHook.showError(appError.message);
    }

    return appError;
  }

  handleSuccess(message: string) {
    if (this.notificationHook?.showSuccess) {
      this.notificationHook.showSuccess(message);
    }
  }
}

export const errorService = ErrorService.getInstance();
