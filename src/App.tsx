// FILE: src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { WagmiProvider } from "wagmi";
import { WalletProvider } from "@/contexts/WalletContext";
import { config } from "@/lib/wallet-config";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Header } from "@/components/layout/Header";
import Dashboard from "./pages/Dashboard";
import Positions from "./pages/Positions";
import TokenAnalyzer from "./pages/TokenAnalyzer";
import ContractScanner from "./pages/ContractScanner";
import Alerts from "./pages/Alerts";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "next-themes";
import { MobileFooter } from "@/components/layout/MobileFooter"; // <-- 1. IMPORT THE NEW COMPONENT
import { sdk as miniAppSdk } from '@farcaster/miniapp-sdk';
import { useEffect } from "react";

const queryClient = new QueryClient();
function FarcasterProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    miniAppSdk.actions.ready();
  }, []);

  return <>{children}</>;
}
const App = () => (
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
       <FarcasterProvider>
      <WalletProvider>
        
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <SidebarProvider>
                <div className="flex min-h-screen w-full">
                  <AppSidebar />
                  <div className="flex-1 flex flex-col">
                    <Header />
                    {/* 2. ADD PADDING TO THE BOTTOM OF THE MAIN CONTENT */}
                    <main className="flex-1 pb-16 md:pb-0"> 
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/positions" element={<Positions />} />
                        <Route path="/token-analyzer" element={<TokenAnalyzer />} />
                        <Route path="/contract-scanner" element={<ContractScanner />} />
                        <Route path="/alerts" element={<Alerts />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </main>
                  </div>
                </div>
                <MobileFooter /> {/* <-- 3. RENDER THE FOOTER */}
              </SidebarProvider>
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
        
      </WalletProvider>
      </FarcasterProvider>
    </QueryClientProvider>
  </WagmiProvider>
);

export default App;
