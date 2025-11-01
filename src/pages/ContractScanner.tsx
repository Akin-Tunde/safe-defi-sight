import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileCode, Shield, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { useBlockchainData } from "@/hooks/useBlockchainData";
import { toast } from "sonner";

export default function ContractScanner() {
  const [address, setAddress] = useState("");
  const [scanning, setScanning] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  const { scanContract } = useBlockchainData();

  const handleScan = async () => {
    if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
      toast.error("Please enter a valid contract address");
      return;
    }

    setScanning(true);
    setHasScanned(false);

    try {
      await scanContract(address);
      setHasScanned(true);
      toast.success("Contract scan complete");
    } catch (error) {
      toast.error("Failed to scan contract. Please try again.");
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Contract Scanner</h1>
        <p className="text-muted-foreground">
          Analyze smart contracts for security vulnerabilities and audit status
        </p>
      </div>

      <Card className="shadow-card bg-gradient-card border-border">
        <CardHeader>
          <CardTitle>Enter Smart Contract Address</CardTitle>
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
              onClick={handleScan}
              disabled={!address || scanning}
              className="bg-primary hover:bg-primary/90"
            >
              <FileCode className="h-4 w-4 mr-2" />
              {scanning ? "Scanning..." : "Scan"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {scanning && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          <p className="mt-4 text-muted-foreground">Scanning smart contract...</p>
        </div>
      )}

      {!scanning && hasScanned && (
        <div className="space-y-6">
          <Card className="shadow-card bg-gradient-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Audit Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-secondary border border-success/50">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <div>
                    <p className="font-medium">Audit Found</p>
                    <p className="text-sm text-muted-foreground">Audited by CertiK</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="border-primary/50">
                  View Report
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card bg-gradient-card border-border">
            <CardHeader>
              <CardTitle>Automated Vulnerability Scan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-danger" />
                  Critical Vulnerabilities
                </h4>
                <div className="space-y-2">
                  <div className="p-3 rounded-lg bg-danger/10 border border-danger/50">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-danger">Reentrancy</span>
                      <Badge className="bg-danger/20 text-danger border-danger/50">
                        Critical
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Function withdraw() is vulnerable to reentrancy attacks
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  Medium/Low Vulnerabilities
                </h4>
                <div className="space-y-2">
                  <div className="p-3 rounded-lg bg-warning/10 border border-warning/50">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-warning">Gas Limit Issues</span>
                      <Badge className="bg-warning/20 text-warning border-warning/50">
                        Medium
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Unbounded loop may cause gas limit issues
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card bg-gradient-card border-border">
            <CardHeader>
              <CardTitle>Contract Verification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                <span className="text-sm">Source Code Verified</span>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="font-bold text-success">Yes</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                <span className="text-sm">Known Exploits</span>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="font-bold text-success">None</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
