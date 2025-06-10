
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Create a simple QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

// Minimal app to debug the dispatcher issue
const App = () => {
  console.log('App component rendering...');
  
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">AgroSense - Minimal Debug Mode</h1>
            <Routes>
              <Route path="/" element={<div>Home Page - Minimal Test</div>} />
              <Route path="/auth" element={<div>Auth Page - Minimal Test</div>} />
              <Route path="/dashboard" element={<div>Dashboard Page - Minimal Test</div>} />
              <Route path="*" element={<div>404 - Page Not Found</div>} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
