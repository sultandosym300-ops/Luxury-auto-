import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Quote from "@/pages/Quote";
import Booking from "@/pages/Booking";
import Track from "@/pages/Track";
import Portal from "@/pages/Portal";
import Garage from "@/pages/Garage";

import AdminLayout from "@/components/layout/AdminLayout";
import AdminLogin from "@/pages/admin/AdminLogin";
import Dashboard from "@/pages/admin/Dashboard";
import BookingsList from "@/pages/admin/BookingsList";
import CustomersList from "@/pages/admin/CustomersList";
import ServicesList from "@/pages/admin/ServicesList";
import TechniciansList from "@/pages/admin/TechniciansList";
import Analytics from "@/pages/admin/Analytics";
import Portfolio from "@/pages/admin/Portfolio";
import Settings from "@/pages/admin/Settings";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const queryClient = new QueryClient();

function AdminRoutes() {
  return (
    <AdminLayout>
      <Switch>
        <Route path="/admin" component={Dashboard} />
        <Route path="/admin/bookings" component={BookingsList} />
        <Route path="/admin/customers" component={CustomersList} />
        <Route path="/admin/services" component={ServicesList} />
        <Route path="/admin/technicians" component={TechniciansList} />
        <Route path="/admin/analytics" component={Analytics} />
        <Route path="/admin/portfolio" component={Portfolio} />
        <Route path="/admin/settings" component={Settings} />
        <Route component={NotFound} />
      </Switch>
    </AdminLayout>
  );
}

function PublicRoutes() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-[#070707]">
      <Navbar />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/quote" component={Quote} />
          <Route path="/booking" component={Booking} />
          <Route path="/track/:reference?" component={Track} />
          <Route path="/portal" component={Portal} />
          <Route path="/portal/garage" component={Garage} />
          <Route path="/portal/garage/:id" component={Garage} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/*?" component={AdminRoutes} />
      <Route path="/*?" component={PublicRoutes} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
