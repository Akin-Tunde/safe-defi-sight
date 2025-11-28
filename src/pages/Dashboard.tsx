// FILE: src/pages/Dashboard.tsx
import { RiskScoreCard } from "@/components/dashboard/RiskScoreCard";
import { LiquidationWatchCard } from "@/components/dashboard/LiquidationWatchCard";
import { HighRiskTokensCard } from "@/components/dashboard/HighRiskTokensCard";
import { VulnerableContractsCard } from "@/components/dashboard/VulnerableContractsCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/WalletContext";
import { usePositions, Position } from "@/hooks/useBlockchainData"; 
import { Wallet, AlertCircle } from "lucide-react";
import { useAppKit } from "@reown/appkit/react";

// Helper function to calculate an overall risk score/health factor
const calculateOverallMetrics = (positions: Position[]) => {
  if (!positions.length) return { riskScore: 85, overallHealthFactor: 2.0 }; // Default to a safe score

  // Calculate average health factor
  const totalHealthFactor = positions.reduce((sum, p) => sum + (p.healthFactor || 0), 0);
  const overallHealthFactor = totalHealthFactor / positions.length;

  // Simple risk score based on the lowest security score found
  const lowestSecurityScore = positions.reduce((min, p) => Math.min(min, p.securityScore), 100);
  
  // Example complex risk calculation:
  // 50% from lowest security score, 50% from health factor (scaled 1.0=0, 2.0=100)
  // Max score is 100, Min is 0.
  // Health factor score: Max(0, HF - 1) * 100. Capped at 100.
  const healthFactorScore = Math.min(Math.max((overallHealthFactor - 1) * 100, 0), 100);
  const riskScore = Math.round((lowestSecurityScore * 0.5) + (healthFactorScore * 0.5));

  return { 
    riskScore: Math.min(Math.max(riskScore, 1), 99), // Keep it between 1 and 99
    overallHealthFactor
  };
}

export default function Dashboard() {
  const { isConnected } = useWallet();
  // Fetch positions and destructure loading/error states
  const { data: positions = [], isLoading, isError, error } = usePositions();
  const { open } = useAppKit();
  
  // Calculate metrics
  const { riskScore, overallHealthFactor } = calculateOverallMetrics(positions);


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

      {isError && (
        <Card className="border-danger/50 bg-danger/10">
          <CardContent className="flex items-center gap-3 py-4">
            <AlertCircle className="h-5 w-5 text-danger" />
            {/* Displaying actual error message */}
            <p className="text-sm text-danger">{error.message || "An unknown error occurred while fetching data."}</p>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          <p className="mt-4 text-muted-foreground">Loading your positions...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pass data as props */}
          <RiskScoreCard score={riskScore} />
          <LiquidationWatchCard overallHealthFactor={overallHealthFactor} atRiskPositions={positions} />
          <HighRiskTokensCard /> 
          <VulnerableContractsCard />
        </div>
      )}
    </div>
  );
}
