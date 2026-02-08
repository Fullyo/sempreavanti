import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Villas from "./pages/Villas";
import Chef from "./pages/Chef";
import Wellness from "./pages/Wellness";
import Experiences from "./pages/Experiences";
import Events from "./pages/Events";
import Location from "./pages/Location";
import Concierge from "./pages/Concierge";
import Transportation from "./pages/Transportation";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/villas" element={<Villas />} />
          <Route path="/chef" element={<Chef />} />
          <Route path="/wellness" element={<Wellness />} />
          <Route path="/experiences" element={<Experiences />} />
          <Route path="/events" element={<Events />} />
          <Route path="/location" element={<Location />} />
          <Route path="/concierge" element={<Concierge />} />
          <Route path="/transportation" element={<Transportation />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
  </QueryClientProvider>
);

export default App;
