import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Register from "./pages/Register";
import Login from "./pages/Login";
import BrandDashboard from "./pages/brand/BrandDashboard";
import BrandCampaigns from "./pages/brand/BrandCampaigns";
import BrandCampaignDetails from "./pages/brand/BrandCampaignDetails";
import BrandCreators from "./pages/brand/BrandCreators";
import BrandCommunity from "./pages/brand/BrandCommunity";
import BrandCreatorDetails from "./pages/brand/BrandCreatorDetails";
import BrandMessages from "./pages/brand/BrandMessages";
import BrandProfile from "./pages/brand/BrandProfile";
import CreatorDashboard from "./pages/creator/CreatorDashboard";
import CreatorProjects from "./pages/creator/CreatorProjects";
import CreatorProjectDetails from "./pages/creator/CreatorProjectDetails";
import CreatorBuyChillies from "./pages/creator/CreatorBuyChillies";
import CreatorChilliesPayment from "./pages/creator/CreatorChilliesPayment";
import CreatorPaymentHistory from "./pages/creator/CreatorPaymentHistory";
import CreatorMessages from "./pages/creator/CreatorMessages";
import CreatorProfile from "./pages/creator/CreatorProfile";
import CreatorUploadContent from "./pages/creator/CreatorUploadContent";
import CreatorInvitations from "./pages/creator/CreatorInvitations";
import CreatorCommunity from "./pages/creator/CreatorCommunity";
import CreatorCompanyCommunity from "./pages/creator/CreatorCompanyCommunity";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminCampaigns from "./pages/admin/AdminCampaigns";
import AdminContentReview from "./pages/admin/AdminContentReview";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminCommunication from "./pages/admin/AdminCommunication";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import NotFound from "./pages/NotFound";
import AdminRoute from "./components/auth/AdminRoute";

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
          <Route path="/contact-us" element={<Contact />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/brand" element={<BrandDashboard />} />
          <Route path="/brand/campaigns" element={<BrandCampaigns />} />
          <Route path="/brand/campaigns/:id" element={<BrandCampaignDetails />} />
          <Route path="/brand/creators" element={<BrandCreators />} />
          <Route path="/brand/community" element={<BrandCommunity />} />
          <Route path="/brand/creators/:creatorId" element={<BrandCreatorDetails />} />
          <Route path="/brand/messages" element={<BrandMessages />} />
          <Route path="/brand/profile" element={<BrandProfile />} />
          <Route path="/creator" element={<CreatorDashboard />} />
          <Route path="/creator/projects" element={<CreatorProjects />} />
          <Route path="/creator/projects/:id" element={<CreatorProjectDetails />} />
          <Route path="/creator/invitations" element={<CreatorInvitations />} />
          <Route path="/creator/buy-chillies" element={<CreatorBuyChillies />} />
          <Route path="/creator/buy-chillies/payment" element={<CreatorChilliesPayment />} />
          <Route path="/creator/payment-history" element={<CreatorPaymentHistory />} />
          <Route path="/creator/community" element={<CreatorCommunity />} />
          <Route path="/creator/company-community" element={<CreatorCompanyCommunity />} />
          <Route path="/creator/messages" element={<CreatorMessages />} />
          <Route path="/creator/profile" element={<CreatorProfile />} />
          <Route path="/creator/upload" element={<CreatorUploadContent />} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
          <Route path="/admin/campaigns" element={<AdminRoute><AdminCampaigns /></AdminRoute>} />
          <Route path="/admin/content-review" element={<AdminRoute><AdminContentReview /></AdminRoute>} />
          <Route path="/admin/payments" element={<AdminRoute><AdminPayments /></AdminRoute>} />
          <Route path="/admin/communication" element={<AdminRoute><AdminCommunication /></AdminRoute>} />
          <Route path="/admin/analytics" element={<AdminRoute><AdminAnalytics /></AdminRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
