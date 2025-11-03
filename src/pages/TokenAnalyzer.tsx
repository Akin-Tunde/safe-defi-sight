import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, AlertTriangle, CheckCircle, PieChart, XCircle } from "lucide-react";
import { useBlockchainData, TokenAnalysisResult } from "@/hooks/useBlockchainData";
import { toast } from "sonner";

export default function TokenAnalyzer() {
  const [address, setAddress] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<TokenAnalysisResult | null>(null);
  const { analyzeToken } = useBlockchainData();

  const handleAnalyze = async () => {
    if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
      toast.error("Please enter a valid Ethereum address");
      return;
    }

    setAnalyzing(true);
    setAnalysisResult(null);

    try {
      const result = await analyzeToken(address);
      setAnalysisResult(result);
      toast.success("Token analysis complete");
    } catch (error) {
      toast.error("Failed to analyze token. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };
  
  const getRiskBadge = (score: number) => {
    if (score > 75) return <Badge className="bg-success/20 text-success border-success/50">Low Risk</Badge>;
    if (score > 40) return <Badge className="bg-warning/20 text-warning border-warning/50">Medium Risk</Badge>;
    return <Badge className="bg-danger/20 text-danger border-danger/50">High Risk</Badge>;
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
              placeholder="0x... (try '0x...bad' for a bad result)"
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

      {analysisResult && !analyzing && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-card bg-gradient-card border-border">
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Token</span>
                  <span className="font-bold">{analysisResult.summary.name}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Symbol</span>
                  <span className="font-mono">{analysisResult.summary.symbol}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Supply</span>
                  <span className="font-mono">{analysisResult.summary.totalSupply}</span>
                </div>
              </div>
              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Safety Score ({analysisResult.summary.safetyScore}/100)</span>
                  {getRiskBadge(analysisResult.summary.safetyScore)}
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
                <span className={`font-bold ${analysisResult.liquidity.lockedPercentage > 90 ? 'text-success' : 'text-warning'}`}>{analysisResult.liquidity.lockedPercentage}%</span>
              </div>
               {analysisResult.liquidity.unlockedLiquidity && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary border border-danger/50">
                  <AlertTriangle className="h-4 w-4 text-danger" />
                  <span className="text-sm text-danger">Significant portion of liquidity is unlocked</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-card bg-gradient-card border-border">
            <CardHeader>
              <CardTitle>Holder Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                <span className="text-sm">Top 10 Holders own</span>
                <span className={`font-bold ${analysisResult.holders.isConcentrated ? 'text-danger' : 'text-success'}`}>{analysisResult.holders.top10HolderPercentage}%</span>
              </div>
              {analysisResult.holders.isConcentrated && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary border border-warning/50">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  <span className="text-sm text-warning">High concentration in few wallets</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-card bg-gradient-card border-border">
            <CardHeader>
              <CardTitle>Contract Code Checks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                <span className="text-sm">Honeypot</span>
                <div className="flex items-center gap-2">
                  {analysisResult.contract.isHoneypot ? (
                     <>
                      <XCircle className="h-4 w-4 text-danger" />
                      <span className="font-bold text-danger">Detected</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="font-bold text-success">Not a honeypot</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                <span className="text-sm">Malicious Functions</span>
                 <div className="flex items-center gap-2">
                  {analysisResult.contract.hasMaliciousFunctions ? (
                     <>
                      <XCircle className="h-4 w-4 text-danger" />
                      <span className="font-bold text-danger">Found</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="font-bold text-success">None Found</span>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
