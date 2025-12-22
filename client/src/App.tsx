import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { SocketProvider } from "@/hooks/use-socket";
import { ProtectedRoute } from "@/lib/protected-route";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import Dashboard from "@/pages/dashboard";
import MemoryOrb from "@/pages/memory-orb";
import VirtualPet from "@/pages/virtual-pet";
import Friends from "@/pages/friends";
import Chat from "@/pages/chat";
import Games from "@/pages/games";
import Features from "@/pages/features";
import Privacy from "@/pages/privacy";
import Contact from "@/pages/contact";
import About from "@/pages/about";
import Help from "@/pages/help";

function Router() {
  return (
    <Switch>
      <ProtectedRoute path="/" component={Dashboard} />
      <ProtectedRoute path="/memory-orb" component={MemoryOrb} />
      <ProtectedRoute path="/pet" component={VirtualPet} />
      <ProtectedRoute path="/friends" component={Friends} />
      <ProtectedRoute path="/chat" component={Chat} />
      <ProtectedRoute path="/chat/:friendId" component={Chat} />
      <ProtectedRoute path="/games" component={Games} />
      <ProtectedRoute path="/features" component={Features} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/contact" component={Contact} />
      <Route path="/about" component={About} />
      <Route path="/help" component={Help} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <SocketProvider>
            <Toaster />
            <Router />
          </SocketProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
