
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HunterProvider } from "@/context/HunterContext";
import Index from "./pages/Index";
import Quests from "./pages/Quests";
import Stats from "./pages/Stats";
import Training from "./pages/Training";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <HunterProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/quests" element={<Quests />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/training" element={<Training />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
        <Sonner />
      </HunterProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
