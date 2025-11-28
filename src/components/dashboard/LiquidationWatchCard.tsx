// FILE: src/components/dashboard/LiquidationWatchCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, TrendingUp } from "lucide-react";
import { Position } from "@/hooks/useBlockchainData"; // Import the Position type

// Filter to only show positions with a health factor below a certain threshold
const getAtRiskPositions = (positions: Position[]) => {
  return positions
    .filter(p => (p.healthFactor || 999) < 2.0) // Threshold for "at risk"
    .map(p => ({
      protocol: p.protocol,
      asset: p.collateral?.amount.split(' ')[1] || 'Asset', // Crude way to get asset symbol
      healthFactor: p.healthFactor || 999,
      status: (p.healthFactor || 999) < 1.5 ? "caution" : "watch", // Differentiate status
    }))
    .slice(0, 2); // Show max 2
};

interface LiquidationWatchCardProps {
  overallHealthFactor: number;
  atRiskPositions: Position[];
}

// Update component to accept props
export function LiquidationWatchCard({ overallHealthFactor, atRiskPositions }: LiquidationWatchCardProps) {
  
  const formattedHealthFactor = overallHealthFactor.toFixed(2);
  const healthFactorStatus = overallHealthFactor >= 2.0 ? "text-success" : overallHealthFactor >= 1.5 ? "text-warning" : "text-danger";
  const healthFactorGradient = overallHealthFactor >= 2.0 ? "bg-gradient-success" : overallHealthFactor >= 1.5 ? "bg-gradient-warning" : "bg-gradient-danger";

  // Use the derived at-risk positions
  const watchlist = getAtRiskPositions(atRiskPositions);

  return (
    <Card className="shadow-card bg-gradient-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {overallHealthFactor < 2.0 ? <AlertCircle className="h-5 w-5 text-warning" /> : <TrendingUp className="h-5 w-5 text-success" />}
          Liquidation Watch
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Overall Health Factor</span>
            <span className={`text-lg font-bold ${healthFactorStatus}`}>{formattedHealthFactor}</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className={`${healthFactorGradient} h-2 rounded-full transition-all duration-500`}
              // Health factor bar is scaled up to 4.0 for max width.
              style={{ width: `${Math.min((overallHealthFactor / 4) * 100, 100)}%` }}
            />
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-medium">{watchlist.length > 0 ? "At-Risk Positions" : "No Positions on Watch"}</h4>
          {watchlist.length > 0 ? (
            watchlist.map((position, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary border border-border hover:border-primary transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{position.protocol}</p>
                    <p className="text-sm text-muted-foreground">{position.asset}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-mono">{position.healthFactor.toFixed(2)}</span>
                  <Badge 
                    variant={position.status === "caution" ? "secondary" : "destructive"}
                    className={
                      position.status === "caution" 
                        ? "bg-warning/20 text-warning border-warning/50"
                        : "bg-danger/20 text-danger border-danger/50"
                    }
                  >
                    {position.status === "caution" ? "Watch" : "Caution"}
                  </Badge>
                </div>
              </div>
            ))
          ) : (
            <div className="text-sm text-muted-foreground p-3 rounded-lg bg-secondary border border-border">
              All monitored positions are currently safe.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
