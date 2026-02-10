import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Index from "./pages/Index";
import Villas from "./pages/Villas";
import Chef from "./pages/Chef";
import Wellness from "./pages/Wellness";
import Experiences from "./pages/Experiences";
import Events from "./pages/Events";
import Location from "./pages/Location";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import { Navigate } from "react-router-dom";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/villas" element={<Villas />} />
          <Route path="/chef" element={<Chef />} />
          <Route path="/wellness" element={<Wellness />} />
          <Route path="/experiences" element={<Experiences />} />
          <Route path="/events" element={<Events />} />
          <Route path="/location" element={<Location />} />
          <Route path="/concierge" element={<Navigate to="/villas" replace />} />
          <Route path="/transportation" element={<Navigate to="/location" replace />} />
          <Route path="/pricing" element={<Navigate to="/contact" replace />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
  </QueryClientProvider>
);

export default App;
