import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Wallet, LogOut } from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";
import { useAppKit } from "@reown/appkit/react";

export function Header() {
  const { address, isConnected, balance, chainId, disconnect } = useWallet();
  const { open } = useAppKit();

  const getChainName = (chainId?: number) => {
    switch (chainId) {
      case 1: return "Ethereum";
      case 137: return "Polygon";
      case 42161: return "Arbitrum";
      case 10: return "Optimism";
      case 8453: return "Base";
      default: return "Unknown";
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
      </div>
      
      <div className="flex items-center gap-3">
        {isConnected && address ? (
          <>
            <div className="hidden md:flex items-center gap-2">
              <Badge variant="outline" className="border-primary/50 text-primary">
                {getChainName(chainId)}
              </Badge>
              <div className="text-sm">
                <div className="font-mono text-muted-foreground">{formatAddress(address)}</div>
                {balance && <div className="text-xs text-muted-foreground">{balance} ETH</div>}
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => open()}
              className="border-primary/50 hover:bg-primary/10"
            >
              <Wallet className="h-4 w-4 mr-2" />
              Account
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => disconnect()}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <Button 
            onClick={() => open()}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Wallet className="h-4 w-4 mr-2" />
            Connect Wallet
          </Button>
        )}
      </div>
    </header>
  );
}
