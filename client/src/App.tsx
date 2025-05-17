import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Events from "@/pages/Events";
import Donate from "@/pages/Donate";
import Gallery from "@/pages/Gallery";
import Videos from "@/pages/Videos";
import Contact from "@/pages/Contact";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Profile from "@/pages/Profile";

// Admin pages
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminBanners from "@/pages/admin/Banners";
import AdminEvents from "@/pages/admin/Events";
import AdminGallery from "@/pages/admin/Gallery";
import AdminVideos from "@/pages/admin/Videos";
import AdminDonations from "@/pages/admin/Donations";
import AdminDonationCategories from "@/pages/admin/DonationCategories";
import AdminQuotes from "@/pages/admin/Quotes";
import AdminUsers from "@/pages/admin/Users";
import AdminMessages from "@/pages/admin/Messages";

function Router() {
  return (
    <Switch>
      {/* Main routes */}
      <Route path="/" component={Home} />
      <Route path="/events" component={Events} />
      <Route path="/donate" component={Donate} />
      <Route path="/gallery" component={Gallery} />
      <Route path="/videos" component={Videos} />
      <Route path="/contact" component={Contact} />
      
      {/* Authentication routes */}
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/profile" component={Profile} />
      
      {/* Admin routes */}
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/banners" component={AdminBanners} />
      <Route path="/admin/events" component={AdminEvents} />
      <Route path="/admin/gallery" component={AdminGallery} />
      <Route path="/admin/videos" component={AdminVideos} />
      <Route path="/admin/donations" component={AdminDonations} />
      <Route path="/admin/donation-categories" component={AdminDonationCategories} />
      <Route path="/admin/quotes" component={AdminQuotes} />
      <Route path="/admin/users" component={AdminUsers} />
      <Route path="/admin/messages" component={AdminMessages} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Router />
    </QueryClientProvider>
  );
}

export default App;
