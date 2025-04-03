import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import MusicPage from "./pages/MusicPage";
import NewsPage from "./pages/NewsPage";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "@/context/ThemeContext";
import { AudioProvider } from "@/context/AudioContext";
import MiniPlayer from "@/components/MiniPlayer";
import { useAudio } from "@/context/AudioContext";

const queryClient = new QueryClient();

// Wrapper component for MiniPlayer that uses the audio context
const AppContent = () => {
  const { showMiniPlayer } = useAudio();
  
  return (
    <>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/music" element={<MusicPage />} />
            <Route path="/news" element={<NewsPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        
        {/* Mini player component that appears at the bottom of the screen */}
        {showMiniPlayer && <MiniPlayer />}
      </TooltipProvider>
    </>
  );
};

const App = () => (
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <AudioProvider>
        <AppContent />
      </AudioProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
