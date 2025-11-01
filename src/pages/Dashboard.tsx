import { RiskScoreCard } from "@/components/dashboard/RiskScoreCard";
import { LiquidationWatchCard } from "@/components/dashboard/LiquidationWatchCard";
import { HighRiskTokensCard } from "@/components/dashboard/HighRiskTokensCard";
import { VulnerableContractsCard } from "@/components/dashboard/VulnerableContractsCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/WalletContext";
import { useBlockchainData } from "@/hooks/useBlockchainData";
import { Wallet, AlertCircle } from "lucide-react";
import { useAppKit } from "@reown/appkit/react";

export default function Dashboard() {
  const { isConnected } = useWallet();
  const { loading, error } = useBlockchainData();
  const { open } = useAppKit();

  if (!isConnected) {
    return (
      <div className="container mx-auto p-6">
        <Card className="shadow-card bg-gradient-card border-border">
          <CardContent className="flex flex-col items-center justify-center py-16 space-y-4">
            <Wallet className="h-16 w-16 text-muted-foreground" />
            <h2 className="text-2xl font-bold">Connect Your Wallet</h2>
            <p className="text-muted-foreground text-center max-w-md">
              Connect your wallet to monitor your DeFi positions, analyze risks, and protect your investments in real-time.
            </p>
            <Button 
              onClick={() => open()}
              className="bg-primary hover:bg-primary/90 text-primary-foreground mt-4"
              size="lg"
            >
              <Wallet className="h-5 w-5 mr-2" />
              Connect Wallet
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Risk Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor your DeFi positions and potential risks in real-time
        </p>
      </div>

      {error && (
        <Card className="border-danger/50 bg-danger/10">
          <CardContent className="flex items-center gap-3 py-4">
            <AlertCircle className="h-5 w-5 text-danger" />
            <p className="text-sm text-danger">{error}</p>
          </CardContent>
        </Card>
      )}

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          <p className="mt-4 text-muted-foreground">Loading your positions...</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RiskScoreCard />
        <LiquidationWatchCard />
        <HighRiskTokensCard />
        <VulnerableContractsCard />
      </div>
    </div>
  );
}
