

# DeFi Sight - Advanced Risk Analyzer

DeFi Sight is a comprehensive risk analysis dashboard designed to empower decentralized finance (DeFi) users. It provides real-time insights into your portfolio, helping you identify and mitigate risks such as potential liquidations, rug pulls, and smart contract vulnerabilities. By connecting your wallet, you get a holistic view of your positions across different protocols, enabling you to make informed decisions and protect your digital assets.

## Key Features

-   **Risk Dashboard**: At-a-glance overview of your portfolio's overall health with a dynamic risk score, liquidation watch, and alerts for high-risk tokens and vulnerable contracts.
-   **Position Monitoring**: In-depth analysis of your lending and borrowing positions, tracking crucial metrics like health factor and liquidation price.
-   **Token Analyzer**: Scan any token contract to detect potential "rug pull" characteristics, including liquidity lock status and holder concentration.
-   **Smart Contract Scanner**: Evaluate smart contracts for security vulnerabilities, audit history, and source code verification status.
-   **Seamless Wallet Integration**: Connect securely with your favorite wallet using WalletConnect & Wagmi to fetch and analyze your live on-chain data.

## Built With

This project is built with modern web technologies, ensuring a fast, responsive, and reliable user experience.

-   **Frontend**: [React](https://reactjs.org/)
-   **Build Tool**: [Vite](https://vitejs.dev/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
-   **Blockchain Interaction**: [Wagmi](https://wagmi.sh/) & [Viem](https://viem.sh/)
-   **Wallet Connectivity**: [@reown/appkit](https://web3modal.com/) (WalletConnect)
-   **Charting**: [Recharts](https://recharts.org/)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Make sure you have Node.js and npm installed on your machine.
- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [npm](https://www.npmjs.com/get-npm)

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone <YOUR_GIT_URL>
    cd akin-tunde-safe-defi-sight
    ```

2.  **Install NPM packages:**
    ```sh
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project by copying the example file:
    ```sh
    cp .env.example .env
    ```
    You will need to add the following keys:
    -   `VITE_REOWN_PROJECT_ID`: Your Project ID from [WalletConnect Cloud](https://cloud.walletconnect.com/).
    -   `VITE_ETHERSCAN_API_KEY`: Your API key from [Etherscan](https://etherscan.io/apis) (Optional, for enhanced on-chain data).
4.  **Run the development server:**
    ```sh
    npm run dev
    ```  

## Application Pages

-   **/ (Dashboard)**: The main overview page showing the portfolio risk score, liquidation watch, high-risk tokens, and vulnerable contracts.
-   **/positions**: A detailed list of the user's current DeFi positions with risk analysis for each.
-   **/token-analyzer**: A tool to input a token contract address and receive an analysis of its potential risks.
-   **/contract-scanner**: A utility to scan a smart contract address for audits, vulnerabilities, and verification status.
-   **/alerts**: A center for notifications regarding changes in risk levels for the user's positions.
-   **/settings**: A page for managing user preferences (currently a placeholder).
