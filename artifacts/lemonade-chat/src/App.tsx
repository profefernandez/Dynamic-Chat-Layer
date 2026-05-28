import { useEffect, useRef } from "react";
import {
  ClerkProvider, SignIn, SignUp, Show, useClerk,
} from "@clerk/react";
import { publishableKeyFromHost } from "@clerk/react/internal";
import { shadcn } from "@clerk/themes";
import { Switch, Route, useLocation, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import { ChatProvider } from "./context/ChatContext";
import { AdminProvider } from "./context/AdminContext";
import { SiteShell } from "./components/SiteShell";
import { Admin } from "./pages/Admin";

const queryClient = new QueryClient();

const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

if (!clerkPubKey) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY");
}

const clerkAppearance = {
  theme: shadcn,
  cssLayerName: "clerk",
  options: {
    logoPlacement: "inside" as const,
    logoLinkUrl: basePath || "/",
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
    socialButtonsPlacement: "top" as const,
    socialButtonsVariant: "blockButton" as const,
  },
  variables: {
    colorPrimary: "#f2ca50",
    colorForeground: "#e3e2e7",
    colorMutedForeground: "#d0c5af",
    colorDanger: "#ffb4ab",
    colorBackground: "#1e1f23",
    colorInput: "#121317",
    colorInputForeground: "#e3e2e7",
    colorNeutral: "#4d4635",
    fontFamily: "Hanken Grotesk, sans-serif",
    borderRadius: "0.5rem",
  },
  elements: {
    rootBox: "w-full flex justify-center",
    cardBox: "bg-[#1e1f23] rounded-2xl w-[440px] max-w-full overflow-hidden border border-white/10",
    card: "!shadow-none !border-0 !bg-transparent !rounded-none",
    footer: "!shadow-none !border-0 !bg-transparent !rounded-none",
    headerTitle: "text-[#e3e2e7] font-serif text-2xl",
    headerSubtitle: "text-[#d0c5af]",
    socialButtonsBlockButton: "bg-[#121317] border border-white/10 hover:bg-white/5",
    socialButtonsBlockButtonText: "text-[#e3e2e7] font-medium",
    formFieldLabel: "text-[#d0c5af] uppercase tracking-widest text-xs",
    formFieldInput: "bg-[#121317] border-white/10 text-[#e3e2e7]",
    formButtonPrimary: "bg-[#f2ca50] text-[#3c2f00] hover:bg-[#e9c349]",
    footerActionLink: "text-[#f2ca50] hover:text-[#e9c349]",
    footerActionText: "text-[#d0c5af]",
    dividerText: "text-[#d0c5af]",
    dividerLine: "bg-white/10",
    logoBox: "justify-center mb-2",
    logoImage: "h-8 w-auto",
  },
};

function SignInPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-surface px-4">
      <SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} />
    </div>
  );
}

function SignUpPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-surface px-4">
      <SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`} />
    </div>
  );
}

function ProtectedAdmin() {
  return (
    <>
      <Show when="signed-in"><Admin /></Show>
      <Show when="signed-out"><Redirect to="/sign-in" /></Show>
    </>
  );
}

function MainApp() {
  return <SiteShell />;
}

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const qc = useQueryClient();
  const prev = useRef<string | null | undefined>(undefined);
  useEffect(() => {
    const unsub = addListener(({ user }) => {
      const id = user?.id ?? null;
      if (prev.current !== undefined && prev.current !== id) qc.clear();
      prev.current = id;
    });
    return unsub;
  }, [addListener, qc]);
  return null;
}

function RoutedShell() {
  const [location] = useLocation();
  const editMode = location.startsWith("/admin");
  return (
    <AdminProvider editMode={editMode}>
      <ChatProvider>
        <Switch>
          <Route path="/sign-in/*?" component={SignInPage} />
          <Route path="/sign-up/*?" component={SignUpPage} />
          <Route path="/admin" component={ProtectedAdmin} />
          <Route path="/.*" component={MainApp} />
        </Switch>
      </ChatProvider>
    </AdminProvider>
  );
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();
  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      localization={{
        signIn: { start: { title: "Sign in to 60 Watts", subtitle: "Admin access only" } },
        signUp: { start: { title: "Create account", subtitle: "Request admin access" } },
      }}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <ClerkQueryClientCacheInvalidator />
        <RoutedShell />
        <Toaster />
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function App() {
  return (
    <TooltipProvider>
      <WouterRouter base={basePath}>
        <ClerkProviderWithRoutes />
      </WouterRouter>
    </TooltipProvider>
  );
}

export default App;
