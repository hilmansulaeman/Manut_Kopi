import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Index from "./pages/Index";
import IngredientLibrary from "./pages/IngredientLibrary";
import IngredientCategories from "./pages/IngredientCategories";
import AllReports from "./pages/AllReports";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import SplashScreen from "./components/SplashScreen";
import { ProfileProvider } from "./context/ProfileContext"; // Import ProfileProvider
import { StockProvider } from "./context/StockContext"; // Import StockProvider

const queryClient = new QueryClient();

const AppContent = () => {
  const [showSplash, setShowSplash] = useState(true);
  const navigate = useNavigate();

  const handleSplashFinish = () => {
    setShowSplash(false);
    navigate('/login');
  };

  return (
    <Routes>
      {showSplash ? (
        <Route path="/" element={<SplashScreen onFinish={handleSplashFinish} />} />
      ) : (
        <>
          <Route path="/" element={<Index />} />
          <Route path="/ingredient/library" element={<IngredientLibrary />} />
          <Route path="/ingredient/categories" element={<IngredientCategories />} />
          <Route path="/reports" element={<AllReports />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/login" element={<Login />} />
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
