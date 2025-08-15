# 🚀 Deployment Guide for Base Mainnet

## Prerequisites

1. **MetaMask Setup**
   - Install MetaMask extension
   - Add Base mainnet to MetaMask (if not already added)
   - Ensure you have ETH on Base for gas fees

2. **Environment Setup**
   - Create `.env` file in project root
   - Add your private key: `PRIVATE_KEY=your_private_key_here`
   - Add Base RPC: `BASE_RPC_URL=https://mainnet.base.org`

## Step-by-Step Deployment

### 1. Install Dependencies
```bash
npm install
```

### 2. Compile Contract
```bash
npx hardhat compile
```

### 3. Deploy to Base Mainnet
```bash
npx hardhat run scripts/deploy.js --network base
```

### 4. Update Frontend
After deployment, copy the contract address from the console output and update:
- File: `src/hooks/useVotingContract.ts`
- Line 224: Replace the CONTRACT_ADDRESS with your deployed address

### 5. Test the dApp
```bash
npm run dev
```

Visit `http://localhost:8080` and test:
1. Connect MetaMask (ensure Base mainnet is selected)
2. Vote for a candidate
3. View results

## GitHub Auto-Sync

Since your GitHub is connected to Lovable, all code changes automatically sync to your repository. No manual push required!

## Verification (Optional)

To verify your contract on BaseScan:
```bash
npx hardhat verify --network base YOUR_CONTRACT_ADDRESS
```

## Production Deployment

Your Lovable app can be deployed to production using the "Publish" button in the top-right corner of the Lovable editor.

## Gas Costs on Base

Base typically has very low gas fees compared to Ethereum mainnet:
- Contract deployment: ~$0.50-$2
- Voting transaction: ~$0.01-$0.05

## Need Help?

If you encounter issues:
1. Check MetaMask is on Base mainnet
2. Ensure sufficient ETH for gas
3. Verify contract address is correctly updated in the frontend
4. Check console for error messages