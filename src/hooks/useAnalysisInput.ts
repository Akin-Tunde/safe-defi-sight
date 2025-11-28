// FILE: src/hooks/useAnalysisInput.ts
import { useState } from 'react';
import { toast } from 'sonner';

const ETHEREUM_ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;

export function useAnalysisInput(
  mutationFn: (address: string) => void,
  isPending: boolean,
  context: 'token' | 'contract'
) {
  const [address, setAddress] = useState("");

  const handleAnalyze = () => {
    // 1. Basic validation
    if (!address) {
      toast.error(`Please enter a contract address for ${context} analysis.`);
      return;
    }

    // 2. Format and structural validation
    const trimmedAddress = address.trim();
    if (!ETHEREUM_ADDRESS_REGEX.test(trimmedAddress)) {
      toast.error("Please enter a valid Ethereum-style contract address (e.g., 0x...).");
      return;
    }

    // 3. Execute the mutation
    if (!isPending) {
      mutationFn(trimmedAddress);
    }
  };

  return {
    address,
    setAddress,
    handleAnalyze,
    isDisabled: !address || isPending,
  };
}
