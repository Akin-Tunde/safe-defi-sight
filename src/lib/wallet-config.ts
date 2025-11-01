import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mainnet, polygon, arbitrum, optimism, base } from 'viem/chains'
import type { AppKitNetwork } from '@reown/appkit/networks'
import { cookieStorage, createStorage } from 'wagmi'

// Get projectId from https://cloud.reown.com
export const projectId = import.meta.env.VITE_REOWN_PROJECT_ID || 'demo-project-id'

if (!projectId) {
  console.warn('VITE_REOWN_PROJECT_ID is not set. Using demo project ID.')
}

export const networks = [mainnet, polygon, arbitrum, optimism, base] as [AppKitNetwork, ...AppKitNetwork[]]

// Set up Wagmi adapter
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: false,
  projectId,
  networks
})

// Create modal
export const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks,
  metadata: {
    name: 'DeFi Risk Analyzer',
    description: 'Monitor your DeFi positions and potential risks in real-time',
    url: typeof window !== 'undefined' ? window.location.origin : '',
    icons: ['https://avatars.githubusercontent.com/u/37784886']
  },
  features: {
    analytics: true,
    email: false,
    socials: false
  },
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent': 'hsl(198 93% 60%)',
    '--w3m-border-radius-master': '12px'
  }
})

export const config = wagmiAdapter.wagmiConfig
