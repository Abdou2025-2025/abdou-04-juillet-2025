import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { SplashScreen } from "@/components/ui/splash-screen";
import Home from "./pages/Home";
import Ranking from "./pages/Ranking";
import Club from "./pages/Club";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Landing from "./pages/Landing";
import { useAuth } from "@/hooks/useAuth";

const queryClient = new QueryClient();

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const { user, loading } = useAuth();

  // Forcer le mode sombre au chargement
  useEffect(() => {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }, []);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  if (loading) return null;

  // Route guard
  function PrivateRoute({ children }) {
    if (!user) return <Navigate to="/" replace />;
    return children;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="relative">
            <Routes>
              <Route path="/" element={user ? <Home /> : <Landing />} />
              <Route path="/ranking" element={<PrivateRoute><Ranking /></PrivateRoute>} />
              <Route path="/club" element={<PrivateRoute><Club /></PrivateRoute>} />
              <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
              <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            {user && <BottomNavigation />}
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
