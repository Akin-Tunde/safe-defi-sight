// FILE: src/pages/ContractScanner.tsx
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileCode, Shield, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { scanContract, ContractScanResult } from "@/hooks/useBlockchainData";
import { toast } from "sonner";
import { useAnalysisInput } from "@/hooks/useAnalysisInput"; // <-- NEW IMPORT

export default function ContractScanner() {
  
  const { mutate, data: scanResult, isPending: scanning } = useMutation({
    mutationFn: scanContract,
    onSuccess: () => {
      toast.success("Contract scan complete");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to scan contract. Please try again.");
    }
  });

  // Use the new centralized hook
  const { address, setAddress, handleAnalyze: handleScan, isDisabled } = useAnalysisInput(
    mutate,
    scanning,
    'contract'
  );
  
  const getSeverityBadge = (level: 'Critical' | 'Medium' | 'Low') => {
    if (level === "Critical") return <Badge className="bg-danger/20 text-danger border-danger/50">Critical</Badge>;
    if (level === "Medium") return <Badge className="bg-warning/20 text-warning border-warning/50">Medium</Badge>;
    return <Badge variant="outline">Low</Badge>;
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
              disabled={isDisabled}
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

      {scanResult && !scanning && (
        <div className="space-y-6">
          <Card className="shadow-card bg-gradient-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Security Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
               <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                <span className="text-sm">Source Code Verified</span>
                {scanResult.isVerified ? (
                    <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-success" /><span className="font-bold text-success">Yes</span></div>
                ) : (
                    <div className="flex items-center gap-2"><XCircle className="h-4 w-4 text-danger" /><span className="font-bold text-danger">No</span></div>
                )}
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                <span className="text-sm">Known Exploits</span>
                 {scanResult.knownExploits ? (
                    <div className="flex items-center gap-2"><XCircle className="h-4 w-4 text-danger" /><span className="font-bold text-danger">Yes</span></div>
                ) : (
                    <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-success" /><span className="font-bold text-success">None</span></div>
                )}
              </div>
               <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                <span className="text-sm">Security Audit</span>
                 {scanResult.audit.hasAudit ? (
                    <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-success" /><span className="font-bold text-success">Found ({scanResult.audit.auditBy})</span></div>
                ) : (
                    <div className="flex items-center gap-2"><XCircle className="h-4 w-4 text-danger" /><span className="font-bold text-danger">Not Found</span></div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card bg-gradient-card border-border">
            <CardHeader>
              <CardTitle>Automated Vulnerability Scan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {scanResult.vulnerabilities.length > 0 ? (
                scanResult.vulnerabilities.map((vuln, index) => (
                  <div key={index} className={`p-3 rounded-lg ${vuln.level === 'Critical' ? 'bg-danger/10 border border-danger/50' : 'bg-warning/10 border border-warning/50'}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`font-medium ${vuln.level === 'Critical' ? 'text-danger' : 'text-warning'}`}>{vuln.type}</span>
                      {getSeverityBadge(vuln.level)}
                    </div>
                    <p className="text-sm text-muted-foreground">{vuln.description}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="h-10 w-10 text-success mx-auto mb-3" />
                  <p className="text-muted-foreground">No critical or medium vulnerabilities found.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
