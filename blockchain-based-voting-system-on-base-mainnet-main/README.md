# DecentralVote - Blockchain Voting dApp

A complete beginner-friendly decentralized voting application built on Base blockchain. This project demonstrates how to create a simple yet secure voting system using Solidity smart contracts and React frontend.

## 🌟 Features

- **Secure Voting**: Votes are stored immutably on the Base blockchain
- **One Vote Per Address**: Smart contract prevents double voting
- **Transparent Results**: All votes are publicly verifiable
- **Real-time Updates**: Live vote counting and results display
- **MetaMask Integration**: Seamless wallet connection
- **Responsive Design**: Works on desktop and mobile devices
- **Demo Mode**: UI preview without contract deployment

## 🏗️ Project Structure

```
├── src/
│   ├── contracts/
│   │   └── SimpleVoting.sol          # Solidity smart contract
│   ├── components/
│   │   ├── WalletConnect.tsx         # Wallet connection component
│   │   ├── VotingInterface.tsx       # Voting UI component
│   │   └── VotingResults.tsx         # Results display component
│   ├── hooks/
│   │   ├── useWeb3.ts               # Web3 connection hook
│   │   └── useVotingContract.ts     # Contract interaction hook
│   ├── pages/
│   │   └── Index.tsx                # Main application page
│   └── index.css                    # Design system & styles
├── scripts/
│   ├── deploy.js                    # Contract deployment script
│   └── test.js                      # Contract testing script
├── hardhat.config.js                # Hardhat configuration
├── package.json                     # Dependencies
└── README.md                        # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- MetaMask browser extension
- Some Base mainnet ETH

### 1. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd simple-voting-dapp

# Install dependencies
npm install
```

### 2. Smart Contract Setup

```bash
# Install Hardhat globally (if not already installed)
npm install -g hardhat

# Compile the smart contract
npx hardhat compile

# Deploy to Base mainnet
npx hardhat run scripts/deploy.js --network base

# Run tests
npx hardhat test
```

### 3. Frontend Setup

```bash
# Start the development server
npm run dev

# Open your browser to http://localhost:8080
```

### 4. Connect MetaMask

1. Make sure MetaMask is installed
2. Switch to Base mainnet
3. Click "Connect MetaMask" in the app
4. Start voting!

## 📋 Smart Contract Details

### SimpleVoting.sol

The contract includes:

- **Candidates**: Three predefined candidates (A, B, C)
- **Vote Tracking**: Prevents double voting per address
- **Vote Counting**: Tracks votes for each candidate
- **Events**: Emits events for transparency
- **View Functions**: Get results and candidate info

### Key Functions

```solidity
function vote(uint _candidateId) public
function getVotes(uint _candidateId) public view returns (uint)
function getCandidateCount() public view returns (uint)
function getAllCandidates() public view returns (Candidate[] memory)
function getHasVoted(address _voter) public view returns (bool)
```

## 🎨 Frontend Features

### Components

- **WalletConnect**: Handles MetaMask connection and network switching
- **VotingInterface**: Displays candidates and voting buttons
- **VotingResults**: Shows live results with charts and rankings

### State Management

- **useWeb3**: Manages wallet connection and Web3 provider
- **useVotingContract**: Handles contract interactions and data

### Design System

- Modern glassmorphism design
- Blockchain-themed blue/green color palette
- Responsive grid layouts
- Smooth animations and transitions
- Chart.js integration for data visualization

## 🔧 Configuration

### Environment Variables

Create a `.env` file for contract deployment:

```bash
PRIVATE_KEY=your_private_key_here
BASE_RPC_URL=https://mainnet.base.org
ETHERSCAN_API_KEY=your_basescan_api_key
```

### Network Configuration

The app is configured for Base mainnet by default. To change networks, update:

- `useWeb3.ts` - Chain ID and RPC URL
- `hardhat.config.js` - Network settings

## 🧪 Testing

### Smart Contract Tests

```bash
npx hardhat test
```

### Test Coverage

- Vote function success
- Double voting prevention
- Invalid candidate ID handling
- Vote counting accuracy
- Event emission

## 📦 Deployment

### Contract Deployment

```bash
# Deploy to Base mainnet
npx hardhat run scripts/deploy.js --network base

# Verify on BaseScan
npx hardhat verify --network base CONTRACT_ADDRESS
```

### Frontend Deployment

The React app can be deployed to:

- **Vercel**: `npm run build && vercel --prod`
- **Netlify**: `npm run build` then drag `/dist` folder
- **GitHub Pages**: Use GitHub Actions workflow

## 🛡️ Security Features

- **Reentrancy Protection**: Simple state changes prevent attacks
- **Input Validation**: All user inputs are validated
- **Access Control**: Only wallet owners can vote for themselves
- **Double Vote Prevention**: Mapping tracks voting status
- **Gas Optimization**: Minimal storage usage

## 🔍 Troubleshooting

### Common Issues

1. **MetaMask not detected**: Install MetaMask browser extension
2. **Wrong network**: Switch to Base mainnet in MetaMask
3. **Transaction failed**: Ensure sufficient ETH for gas fees
4. **Contract not found**: Deploy contract or use demo mode

### Demo Mode

If contract is not deployed, the app shows demo data:
- 3 candidates with sample vote counts
- All UI features work except actual voting
- Perfect for testing and development

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📚 Learning Resources

- [Base Documentation](https://docs.base.org/)
- [Solidity Docs](https://docs.soliditylang.org/)
- [Hardhat Tutorial](https://hardhat.org/tutorial/)
- [ethers.js Guide](https://docs.ethers.io/)
- [MetaMask Integration](https://docs.metamask.io/)

## 📄 License

MIT License - see LICENSE file for details

## 🎯 Next Steps

Potential enhancements for learning:

- Add candidate registration
- Implement voting deadlines
- Add admin features
- Multiple voting rounds
- Token-based voting weights
- IPFS integration for candidate data

---

Built with ❤️ for learning blockchain development