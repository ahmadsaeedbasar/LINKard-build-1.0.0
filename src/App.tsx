import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Search from "./pages/Search";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SignupInfluencer from "./pages/SignupInfluencer";
import SignupClient from "./pages/SignupClient";
import CreatorProfile from "./pages/CreatorProfile";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import EditProfile from "./pages/EditProfile";
import AnalyticsProvider from "./components/AnalyticsProvider";
import { AuthProvider } from "./context/AuthContext";
import { ProfileProvider } from "./context/ProfileContext";
import { InquiryProvider } from "./context/InquiryContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ProfileProvider>
            <InquiryProvider>
              <AnalyticsProvider>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/accounts/login" element={<Login />} />
                  <Route path="/accounts/signup" element={<Signup />} />
                  <Route path="/accounts/signup/influencer" element={<SignupInfluencer />} />
                  <Route path="/accounts/signup/client" element={<SignupClient />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/settings/profile" element={<EditProfile />} />
                  <Route path="/:handle" element={<CreatorProfile />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AnalyticsProvider>
            </InquiryProvider>
          </ProfileProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;