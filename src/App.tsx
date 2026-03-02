import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Register from "./pages/Register";
import Login from "./pages/Login";
import BrandDashboard from "./pages/brand/BrandDashboard";
import BrandCampaigns from "./pages/brand/BrandCampaigns";
import BrandCampaignDetails from "./pages/brand/BrandCampaignDetails";
import BrandCreators from "./pages/brand/BrandCreators";
import BrandMessages from "./pages/brand/BrandMessages";
import BrandProfile from "./pages/brand/BrandProfile";
import CreatorDashboard from "./pages/creator/CreatorDashboard";
import CreatorProjects from "./pages/creator/CreatorProjects";
import CreatorProjectDetails from "./pages/creator/CreatorProjectDetails";
import CreatorBuyChillies from "./pages/creator/CreatorBuyChillies";
import CreatorChilliesPayment from "./pages/creator/CreatorChilliesPayment";
import CreatorMessages from "./pages/creator/CreatorMessages";
import CreatorProfile from "./pages/creator/CreatorProfile";
import CreatorUploadContent from "./pages/creator/CreatorUploadContent";
import CreatorInvitations from "./pages/creator/CreatorInvitations";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminCampaigns from "./pages/admin/AdminCampaigns";
import AdminContentReview from "./pages/admin/AdminContentReview";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminCommunication from "./pages/admin/AdminCommunication";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          {/* About is now a section on the homepage */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/brand" element={<BrandDashboard />} />
          <Route path="/brand/campaigns" element={<BrandCampaigns />} />
          <Route path="/brand/campaigns/:id" element={<BrandCampaignDetails />} />
          <Route path="/brand/creators" element={<BrandCreators />} />
          <Route path="/brand/messages" element={<BrandMessages />} />
          <Route path="/brand/profile" element={<BrandProfile />} />
          <Route path="/creator" element={<CreatorDashboard />} />
          <Route path="/creator/projects" element={<CreatorProjects />} />
          <Route path="/creator/projects/:id" element={<CreatorProjectDetails />} />
          <Route path="/creator/invitations" element={<CreatorInvitations />} />
          <Route path="/creator/buy-chillies" element={<CreatorBuyChillies />} />
          <Route path="/creator/buy-chillies/payment" element={<CreatorChilliesPayment />} />
          <Route path="/creator/messages" element={<CreatorMessages />} />
          <Route path="/creator/profile" element={<CreatorProfile />} />
          <Route path="/creator/upload" element={<CreatorUploadContent />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/campaigns" element={<AdminCampaigns />} />
          <Route path="/admin/content-review" element={<AdminContentReview />} />
          <Route path="/admin/payments" element={<AdminPayments />} />
          <Route path="/admin/communication" element={<AdminCommunication />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
