import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { toast } from './use-toast';

// Contract ABI for SimpleVoting
const VOTING_CONTRACT_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "candidateCount",
        "type": "uint256"
      }
    ],
    "name": "ContractDeployed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "voter",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "candidateId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "candidateName",
        "type": "string"
      }
    ],
    "name": "Voted",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "candidates",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "voteCount",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllCandidates",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "voteCount",
            "type": "uint256"
          }
        ],
        "internalType": "struct SimpleVoting.Candidate[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_candidateId",
        "type": "uint256"
      }
    ],
    "name": "getCandidate",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "voteCount",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getCandidateCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_voter",
        "type": "address"
      }
    ],
    "name": "getHasVoted",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_candidateId",
        "type": "uint256"
      }
    ],
    "name": "getVotes",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "hasVoted",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_candidateId",
        "type": "uint256"
      }
    ],
    "name": "vote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// Demo contract address (you'll need to deploy and update this)
const CONTRACT_ADDRESS = "0x82dd6cFc854C37282f00409D9d658De1CD3f554a"; // Updated to deployed contract address

export interface Candidate {
  id: number;
  name: string;
  voteCount: number;
}

interface VotingContractState {
  contract: ethers.Contract | null;
  candidates: Candidate[];
  isLoading: boolean;
  error: string | null;
  hasVoted: boolean;
  totalVotes: number;
}

export const useVotingContract = (
  provider: ethers.BrowserProvider | null,
  signer: ethers.JsonRpcSigner | null,
  account: string | null
) => {
  const [state, setState] = useState<VotingContractState>({
    contract: null,
    candidates: [],
    isLoading: false,
    error: null,
    hasVoted: false,
    totalVotes: 0,
  });

  // Initialize contract
  useEffect(() => {
    if (provider && signer) {
      try {
        const contract = new ethers.Contract(CONTRACT_ADDRESS, VOTING_CONTRACT_ABI, signer);
        setState(prev => ({
          ...prev,
          contract,
          error: null,
        }));
      } catch (error: any) {
        setState(prev => ({
          ...prev,
          error: error.message || 'Failed to initialize contract',
        }));
      }
    } else {
      setState(prev => ({
        ...prev,
        contract: null,
      }));
    }
  }, [provider, signer]);

  // Load contract data
  const loadContractData = useCallback(async () => {
    if (!state.contract || !account) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Get all candidates
      const candidatesData = await state.contract.getAllCandidates();
      const candidates: Candidate[] = candidatesData.map((candidate: any) => ({
        id: Number(candidate.id),
        name: candidate.name,
        voteCount: Number(candidate.voteCount),
      }));

      // Check if user has voted
      const hasVoted = await state.contract.getHasVoted(account);

      // Calculate total votes
      const totalVotes = candidates.reduce((sum, candidate) => sum + candidate.voteCount, 0);

      setState(prev => ({
        ...prev,
        candidates,
        hasVoted,
        totalVotes,
        isLoading: false,
        error: null,
      }));

    } catch (error: any) {
      // If contract not found, use demo data
      const demoCandidates: Candidate[] = [
        { id: 0, name: "Candidate A", voteCount: 15 },
        { id: 1, name: "Candidate B", voteCount: 23 },
        { id: 2, name: "Candidate C", voteCount: 8 },
      ];

      setState(prev => ({
        ...prev,
        candidates: demoCandidates,
        hasVoted: false,
        totalVotes: 46,
        isLoading: false,
        error: 'Using demo data - Contract not deployed yet',
      }));

      toast({
        title: "Demo Mode",
        description: "Contract not deployed. Using demo data for UI preview.",
        variant: "default",
      });
    }
  }, [state.contract, account]);

  // Vote for a candidate
  const vote = useCallback(async (candidateId: number) => {
    if (!state.contract || !account) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to vote",
        variant: "destructive",
      });
      return;
    }

    if (state.hasVoted) {
      toast({
        title: "Already Voted",
        description: "You have already cast your vote",
        variant: "destructive",
      });
      return;
    }

    setState(prev => ({ ...prev, isLoading: true }));

    try {
      // Call the vote function
      const tx = await state.contract.vote(candidateId);
      
      toast({
        title: "Transaction Submitted",
        description: "Your vote is being processed...",
      });

      // Wait for transaction to be mined
      await tx.wait();

      toast({
        title: "Vote Successful!",
        description: `Your vote for ${state.candidates[candidateId]?.name} has been recorded`,
      });

      // Reload contract data
      await loadContractData();

    } catch (error: any) {
      let errorMessage = "Failed to vote";
      
      if (error.message.includes("already voted")) {
        errorMessage = "You have already voted";
      } else if (error.message.includes("Invalid candidate")) {
        errorMessage = "Invalid candidate selected";
      } else if (error.message.includes("user rejected")) {
        errorMessage = "Transaction was rejected";
      }

      setState(prev => ({ ...prev, isLoading: false }));
      
      toast({
        title: "Vote Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [state.contract, account, state.hasVoted, state.candidates, loadContractData]);

  // Load data when contract or account changes
  useEffect(() => {
    loadContractData();
  }, [loadContractData]);

  // Set up event listeners
  useEffect(() => {
    if (!state.contract) return;

    const handleVoted = (voter: string, candidateId: number, candidateName: string) => {
      toast({
        title: "New Vote Cast",
        description: `Someone voted for ${candidateName}`,
      });
      
      // Reload data to get updated vote counts
      loadContractData();
    };

    // Listen for Voted events
    state.contract.on("Voted", handleVoted);

    return () => {
      state.contract.off("Voted", handleVoted);
    };
  }, [state.contract, loadContractData]);

  return {
    ...state,
    vote,
    refreshData: loadContractData,
    isConnected: !!state.contract && !!account,
  };
};