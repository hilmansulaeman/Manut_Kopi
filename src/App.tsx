import { useState, useEffect } from "react";
import SplashScreen from "./imports/SplashScreen";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import IngredientLibrary from "./components/pages/IngredientLibrary";
import IngredientDetail from "./components/pages/IngredientDetail";
import AllReports from "./components/pages/AllReports";
import Settings from "./components/pages/Settings";
import StockOut from "./components/pages/StockOut";
import UserManagement from "./components/pages/UserManagement";
import SalesHistory from "./components/pages/SalesHistory"; // Import SalesHistory
import PurchaseReceipts from "./components/pages/PurchaseReceipts"; // Import PurchaseReceipts
import StockAdjustments from "./components/pages/StockAdjustments"; // Import StockAdjustments
import StockMovementHistory from "./components/pages/StockMovementHistory"; // Import StockMovementHistory
import MinimumStockIndicator from "./components/pages/MinimumStockIndicator"; // Import MinimumStockIndicator
import MasterData from "./components/pages/MasterData"; // Import MasterData
import { StockProvider } from "./context/StockContext";
import { ProfileProvider } from "./context/ProfileContext";
import { SidebarProvider } from "./context/SidebarContext";
import { UserProvider } from "./context/UserContext"; // Import UserProvider
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";

type AppState = "splash" | "login" | "dashboard" | "ingredient-library" | "ingredient-detail" | "all-reports" | "settings" | "stock-out" | "user-management" | "sales-history" | "purchase-receipts" | "stock-adjustments" | "stock-movement-history" | "minimum-stock" | "master-data";

export default function App() {
  const [appState, setAppState] = useState<AppState>("login"); // Reverted to login for full flow testing
  const [selectedIngredientId, setSelectedIngredientId] = useState<string | null>(null);

  const handleLogin = () => {
    setAppState("dashboard");
  };

  const handleLogout = () => {
    setAppState("login");
  };

  const handleMenuChange = (menu: string) => {
    console.log('App handleMenuChange called with:', menu);
    if (menu === 'dashboard') {
      setAppState('dashboard');
    } else if (menu === 'ingredient-library') {
      setAppState('ingredient-library');
    } else if (menu === 'all-reports') {
      setAppState('all-reports');
    } else if (menu === 'settings') {
      setAppState('settings');
    } else if (menu === 'stock-out') {
      setAppState('stock-out');
    } else if (menu === 'user-management') {
      setAppState('user-management');
    } else if (menu === 'sales-history') {
      setAppState('sales-history');
    } else if (menu === 'purchase-receipts') {
      setAppState('purchase-receipts');
    } else if (menu === 'stock-adjustments') {
      setAppState('stock-adjustments');
    } else if (menu === 'stock-movement-history') {
      setAppState('stock-movement-history');
    } else if (menu === 'minimum-stock') {
      setAppState('minimum-stock');
    } else if (menu === 'master-data') {
      setAppState('master-data');
    }
  };

  const handleViewIngredientDetail = (ingredientId: string) => {
    console.log('App handleViewIngredientDetail called with:', ingredientId);
    setSelectedIngredientId(ingredientId);
    setAppState('ingredient-detail');
  };

  const handleBackFromDetail = () => {
    setAppState('ingredient-library');
    setSelectedIngredientId(null);
  };

  return (
    <ProfileProvider>
      <StockProvider>
        <SidebarProvider>
          <UserProvider>
              <div className="size-full">
                {appState === "splash" && <SplashScreen />}
            {appState === "login" && <Login onLogin={handleLogin} />}
            {appState === "dashboard" && (
              <Dashboard 
                onLogout={handleLogout} 
                onMenuChange={handleMenuChange}
              />
            )}
            {appState === "ingredient-library" && (
              <IngredientLibrary 
                onLogout={handleLogout}
                onMenuChange={handleMenuChange}
                onViewDetail={handleViewIngredientDetail}
              />
            )}
            {appState === "ingredient-detail" && selectedIngredientId !== null && (
              <IngredientDetail
                ingredientId={selectedIngredientId}
                onBack={handleBackFromDetail}
                onLogout={handleLogout}
                onMenuChange={handleMenuChange}
              />
            )}
            {appState === "all-reports" && (
              <AllReports
                onLogout={handleLogout}
                onMenuChange={handleMenuChange}
              />
            )}
            {appState === "settings" && (
              <Settings
                onLogout={handleLogout}
                onMenuChange={handleMenuChange}
              />
            )}
            {appState === "stock-out" && (
              <StockOut
                onLogout={handleLogout}
                onMenuChange={handleMenuChange}
              />
            )}
            {appState === "user-management" && (
              <UserManagement
                onLogout={handleLogout}
                onMenuChange={handleMenuChange}
              />
            )}
            {appState === "sales-history" && (
              <SalesHistory
                onLogout={handleLogout}
                onMenuChange={handleMenuChange}
              />
            )}
            {appState === "purchase-receipts" && (
              <PurchaseReceipts
                onLogout={handleLogout}
                onMenuChange={handleMenuChange}
              />
            )}
            {appState === "stock-adjustments" && (
              <StockAdjustments
                onLogout={handleLogout}
                onMenuChange={handleMenuChange}
              />
            )}
            {appState === "stock-movement-history" && (
              <StockMovementHistory
                onLogout={handleLogout}
                onMenuChange={handleMenuChange}
              />
            )}
            {appState === "minimum-stock" && (
              <MinimumStockIndicator
                onLogout={handleLogout}
                onMenuChange={handleMenuChange}
              />
            )}
            {appState === "master-data" && (
              <MasterData
                onLogout={handleLogout}
                onMenuChange={handleMenuChange}
              />
            )}
              <Toaster />
              <Sonner />
            </div>
          </UserProvider>
        </SidebarProvider>
      </StockProvider>
    </ProfileProvider>
  );
}
