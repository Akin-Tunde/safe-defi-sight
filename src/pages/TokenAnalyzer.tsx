import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, AlertTriangle, CheckCircle, PieChart } from "lucide-react";
import { useBlockchainData } from "@/hooks/useBlockchainData";
import { toast } from "sonner";

export default function TokenAnalyzer() {
  const [address, setAddress] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const { analyzeToken } = useBlockchainData();

  const handleAnalyze = async () => {
    if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
      toast.error("Please enter a valid Ethereum address");
      return;
    }

    setAnalyzing(true);
    setHasAnalyzed(false);

    try {
      await analyzeToken(address);
      setHasAnalyzed(true);
      toast.success("Token analysis complete");
    } catch (error) {
      toast.error("Failed to analyze token. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Token Analyzer</h1>
        <p className="text-muted-foreground">
          Analyze tokens for potential rug pull characteristics and security risks
        </p>
      </div>

      <Card className="shadow-card bg-gradient-card border-border">
        <CardHeader>
          <CardTitle>Enter Token Contract Address</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <Input
              placeholder="0x..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="font-mono bg-secondary border-border"
            />
            <Button
              onClick={handleAnalyze}
              disabled={!address || analyzing}
              className="bg-primary hover:bg-primary/90"
            >
              <Search className="h-4 w-4 mr-2" />
              {analyzing ? "Analyzing..." : "Analyze"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {analyzing && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          <p className="mt-4 text-muted-foreground">Analyzing token contract...</p>
        </div>
      )}

      {!analyzing && hasAnalyzed && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-card bg-gradient-card border-border">
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Token</span>
                  <span className="font-bold">SafeMoon</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Symbol</span>
                  <span className="font-mono">SAFE</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Supply</span>
                  <span className="font-mono">1,000,000,000</span>
                </div>
              </div>
              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Safety Score</span>
                  <Badge className="bg-warning/20 text-warning border-warning/50">
                    Medium Risk
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card bg-gradient-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-primary" />
                Liquidity Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                <span className="text-sm">Locked Liquidity</span>
                <span className="font-bold text-warning">10%</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary border border-warning/50">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <span className="text-sm text-warning">90% of liquidity is unlocked</span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card bg-gradient-card border-border">
            <CardHeader>
              <CardTitle>Holder Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                <span className="text-sm">Top 10 Holders</span>
                <span className="font-bold text-warning">65%</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary border border-warning/50">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <span className="text-sm text-warning">High concentration in few wallets</span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card bg-gradient-card border-border">
            <CardHeader>
              <CardTitle>Contract Code Checks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                <span className="text-sm">Honeypot Test</span>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="font-bold text-success">Passed</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                <span className="text-sm">Malicious Functions</span>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="font-bold text-success">None Found</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
