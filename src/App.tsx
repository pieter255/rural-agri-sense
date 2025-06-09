
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/hooks/useLanguage";
import { AuthProvider } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import ErrorBoundary from "@/components/ErrorBoundary";
import ErrorBoundaryWrapper from "@/components/ErrorBoundaryWrapper";
import OfflineIndicator from "@/components/OfflineIndicator";
import usePWA from "@/hooks/usePWA";
import usePerformance from "@/hooks/usePerformance";
import useSecurity from "@/hooks/useSecurity";
import useFeatureFlags from "@/hooks/useFeatureFlags";
import { useEffect } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    },
  },
});

const AppContent = () => {
  const { isInstallable, installPWA } = usePWA();
  const performanceMetrics = usePerformance();
  const { resetSessionTimeout } = useSecurity();
  const { isEnabled } = useFeatureFlags();

  useEffect(() => {
    // Initialize security session
    resetSessionTimeout();
    
    // Log performance metrics for monitoring
    if (performanceMetrics.loadTime > 0) {
      console.log('App Performance:', performanceMetrics);
    }
  }, [resetSessionTimeout, performanceMetrics]);

  return (
    <ErrorBoundary>
      <ErrorBoundaryWrapper>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          {isEnabled('offlineMode') && <OfflineIndicator />}
          <BrowserRouter>
            <div className="min-h-screen bg-gray-50">
              <Navigation />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/farms" element={<Dashboard />} />
                <Route path="/market" element={<Dashboard />} />
                <Route path="/community" element={<Dashboard />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </BrowserRouter>
          
          {/* PWA Install Prompt */}
          {isInstallable && (
            <div className="fixed bottom-4 right-4 z-50">
              <div className="bg-green-500 text-white p-4 rounded-lg shadow-lg">
                <p className="text-sm mb-2">Install AgroSense for better experience!</p>
                <button
                  onClick={installPWA}
                  className="bg-white text-green-500 px-3 py-1 rounded text-sm font-medium hover:bg-gray-100"
                >
                  Install App
                </button>
              </div>
            </div>
          )}
        </TooltipProvider>
      </ErrorBoundaryWrapper>
    </ErrorBoundary>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
