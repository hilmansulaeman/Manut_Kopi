import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import IngredientLibrary from "./pages/IngredientLibrary";
import IngredientDetail from "./pages/IngredientDetail"; // Import the new detail page
import AllReports from "./pages/AllReports";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import SplashScreen from "./components/SplashScreen";
import ProtectedRoute from "./components/ProtectedRoute"; // Import ProtectedRoute
import { ProfileProvider, useProfile } from "./context/ProfileContext"; // Import ProfileProvider and useProfile
import { StockProvider } from "./context/StockContext"; // Import StockProvider

const queryClient = new QueryClient();

const AppContent = () => {
  const [showSplash, setShowSplash] = useState(true);
  const navigate = useNavigate();
  const { isLoggedIn } = useProfile(); // Use isLoggedIn from ProfileContext
  const location = useLocation(); // Move declaration here

  useEffect(() => {
    if (!showSplash) {
      if (isLoggedIn && location.pathname === '/login') {
        navigate('/'); // If logged in and on login page, go to dashboard
      } else if (!isLoggedIn && location.pathname !== '/login') {
        navigate('/login'); // If not logged in and not on login page, go to login page
      }
    }
  }, [showSplash, isLoggedIn, navigate, location.pathname]);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  return (
    <Routes>
      {showSplash && location.pathname === '/' ? (
        <Route path="/" element={<SplashScreen onFinish={handleSplashFinish} />} />
      ) : (
        <>
          <Route path="/login" element={<Login />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Index />} />
          <Route path="/ingredient/library" element={<IngredientLibrary />} />
          <Route path="/ingredient/detail/:id" element={<IngredientDetail />} />
            <Route path="/reports" element={<AllReports />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </>
      )}
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ProfileProvider> {/* Wrap AppContent with ProfileProvider */}
          <StockProvider> {/* Wrap AppContent with StockProvider */}
            <AppContent />
          </StockProvider>
        </ProfileProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
