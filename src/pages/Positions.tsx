import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, CheckCircle, AlertCircle, Wallet } from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";
import { useBlockchainData } from "@/hooks/useBlockchainData";
import { useAppKit } from "@reown/appkit/react";

const mockPositions = [
  {
    protocol: "Aave V3",
    type: "Lending",
    collateral: { amount: "2.5 ETH", usd: "$4,250" },
    borrowed: { amount: "3,200 USDC", usd: "$3,200" },
    healthFactor: 1.85,
    liquidationPrice: "$1,280",
    audited: true,
    securityScore: 95,
  },
  {
    protocol: "Compound",
    type: "Lending",
    collateral: { amount: "0.15 WBTC", usd: "$6,450" },
    borrowed: { amount: "4,800 DAI", usd: "$4,800" },
    healthFactor: 1.42,
    liquidationPrice: "$32,000",
    audited: true,
    securityScore: 92,
  },
];

export default function Positions() {
  const { isConnected } = useWallet();
  const { positions, loading } = useBlockchainData();
  const { open } = useAppKit();

  const displayPositions = isConnected && positions.length > 0 ? positions : mockPositions;

  if (!isConnected) {
    return (
      <div className="container mx-auto p-6">
        <Card className="shadow-card bg-gradient-card border-border">
          <CardContent className="flex flex-col items-center justify-center py-16 space-y-4">
            <Wallet className="h-16 w-16 text-muted-foreground" />
            <h2 className="text-2xl font-bold">Connect Your Wallet</h2>
            <p className="text-muted-foreground text-center max-w-md">
              Connect your wallet to view your DeFi positions and monitor liquidation risks.
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
        <h1 className="text-3xl font-bold mb-2">Your Positions</h1>
        <p className="text-muted-foreground">
          Detailed breakdown of all your DeFi positions
        </p>
      </div>

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          <p className="mt-4 text-muted-foreground">Loading positions...</p>
        </div>
      )}

      <div className="space-y-4">
        {displayPositions.map((position, index) => (
          <Card key={index} className="shadow-card bg-gradient-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  {position.protocol}
                </CardTitle>
                <Badge variant="outline" className="border-primary/50 text-primary">
                  {position.type}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">
                      Collateral
                    </h4>
                    <p className="text-lg font-bold">{position.collateral.amount}</p>
                    <p className="text-sm text-muted-foreground">
                      {position.collateral.usd}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">
                      Borrowed
                    </h4>
                    <p className="text-lg font-bold">{position.borrowed.amount}</p>
                    <p className="text-sm text-muted-foreground">
                      {position.borrowed.usd}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-muted-foreground">
                        Health Factor
                      </h4>
                      <span className="text-lg font-bold text-success">
                        {position.healthFactor}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-gradient-success h-2 rounded-full"
                        style={{
                          width: `${Math.min((position.healthFactor / 2) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">
                      Liquidation Price
                    </h4>
                    <p className="text-lg font-bold">{position.liquidationPrice}</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-medium">Risk Analysis</h4>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {position.audited ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-success" />
                          <span className="text-sm text-success">Audited</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-4 w-4 text-warning" />
                          <span className="text-sm text-warning">No Audit Found</span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        Security Score:
                      </span>
                      <span className="text-sm font-bold text-success">
                        {position.securityScore}/100
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1 border-primary/50 hover:bg-primary/10">
                    Add Collateral
                  </Button>
                  <Button variant="outline" className="flex-1 border-primary/50 hover:bg-primary/10">
                    Repay Loan
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
