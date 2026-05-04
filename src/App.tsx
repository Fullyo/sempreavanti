import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Index from "./pages/Index";
import Villas from "./pages/Villas";
import Staff from "./pages/Staff";
import Chef from "./pages/Chef";
import Wellness from "./pages/Wellness";
import Location from "./pages/Location";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Weddings from "./pages/Weddings";
import PrivateEvents from "./pages/PrivateEvents";
import Surfing from "./pages/experiences/Surfing";
import Boats from "./pages/experiences/Boats";
import Golf from "./pages/experiences/Golf";
import Ocean from "./pages/experiences/Ocean";
import Land from "./pages/experiences/Land";
import Cultural from "./pages/experiences/Cultural";
import Pricing from "./pages/Pricing";
import Book from "./pages/Book";
import Menu from "./pages/Menu";
import ConciergeGuide from "./pages/ConciergeGuide";


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
          <Route path="/staff" element={<Staff />} />
          <Route path="/chef" element={<Chef />} />
          <Route path="/wellness" element={<Wellness />} />
          <Route path="/experiences" element={<Navigate to="/experiences/surfing" replace />} />
          <Route path="/experiences/surfing" element={<Surfing />} />
          <Route path="/experiences/boats" element={<Boats />} />
          <Route path="/experiences/golf" element={<Golf />} />
          <Route path="/experiences/ocean" element={<Ocean />} />
          <Route path="/experiences/land" element={<Land />} />
          <Route path="/experiences/cultural" element={<Cultural />} />
          <Route path="/weddings" element={<Weddings />} />
          <Route path="/events" element={<PrivateEvents />} />
          <Route path="/location" element={<Location />} />
          <Route path="/concierge" element={<Navigate to="/villas" replace />} />
          <Route path="/transportation" element={<Navigate to="/location" replace />} />
          <Route path="/guide" element={<Pricing />} />
          <Route path="/pricing" element={<Navigate to="/guide" replace />} />
          <Route path="/book" element={<Book />} />
          <Route path="/menu" element={<Menu />} />
          
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
  </QueryClientProvider>
);

export default App;
