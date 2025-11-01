import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAccount, useBalance, useDisconnect } from 'wagmi';
import { formatEther } from 'viem';

interface WalletContextType {
  address: string | undefined;
  isConnected: boolean;
  chainId: number | undefined;
  balance: string | undefined;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const { address, isConnected, chainId } = useAccount();
  const { disconnect } = useDisconnect();
  const [balance, setBalance] = useState<string>();

  const { data: balanceData } = useBalance({
    address: address,
  });

  useEffect(() => {
    if (balanceData) {
      setBalance(parseFloat(formatEther(balanceData.value)).toFixed(4));
    }
  }, [balanceData]);

  return (
    <WalletContext.Provider
      value={{
        address,
        isConnected,
        chainId,
        balance,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
