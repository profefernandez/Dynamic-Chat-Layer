import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import { ChatProvider } from "./context/ChatContext";
import { ChatLayer } from "./components/ChatLayer";
import { OverlayLayer } from "./components/OverlayLayer";
import { Admin } from "./pages/Admin";

const queryClient = new QueryClient();

function MainApp() {
  return (
    <div className="relative w-full min-h-[100dvh] overflow-hidden bg-surface">
      {/* Base Layer: Chat interface always at the back */}
      <ChatLayer />
      {/* Overlay Layer: Translucent website on top */}
      <OverlayLayer />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/admin" component={Admin} />
      <Route path="/.*" component={MainApp} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ChatProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
        </ChatProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
