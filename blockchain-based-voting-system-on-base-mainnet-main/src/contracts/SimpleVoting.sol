// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title SimpleVoting
 * @dev A simple decentralized voting contract for educational purposes
 */
contract SimpleVoting {
    // Struct to represent a candidate
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }
    
    // Array to store candidates
    Candidate[] public candidates;
    
    // Mapping to track if an address has voted
    mapping(address => bool) public hasVoted;
    
    // Event emitted when a vote is cast
    event Voted(address indexed voter, uint indexed candidateId, string candidateName);
    
    // Event emitted when contract is deployed
    event ContractDeployed(uint candidateCount);
    
    /**
     * @dev Constructor to initialize candidates
     */
    constructor() {
        // Initialize with three default candidates
        candidates.push(Candidate(0, "Candidate A", 0));
        candidates.push(Candidate(1, "Candidate B", 0));
        candidates.push(Candidate(2, "Candidate C", 0));
        
        emit ContractDeployed(candidates.length);
    }
    
    /**
     * @dev Function to vote for a candidate
     * @param _candidateId The ID of the candidate to vote for
     */
    function vote(uint _candidateId) public {
        // Require that the voter hasn't voted before
        require(!hasVoted[msg.sender], "You have already voted!");
        
        // Require valid candidate ID
        require(_candidateId < candidates.length, "Invalid candidate ID!");
        
        // Mark that this address has voted
        hasVoted[msg.sender] = true;
        
        // Increment the vote count for the candidate
        candidates[_candidateId].voteCount++;
        
        // Emit the Voted event
        emit Voted(msg.sender, _candidateId, candidates[_candidateId].name);
    }
    
    /**
     * @dev Get the vote count for a specific candidate
     * @param _candidateId The ID of the candidate
     * @return The number of votes for the candidate
     */
    function getVotes(uint _candidateId) public view returns (uint) {
        require(_candidateId < candidates.length, "Invalid candidate ID!");
        return candidates[_candidateId].voteCount;
    }
    
    /**
     * @dev Get the total number of candidates
     * @return The number of candidates
     */
    function getCandidateCount() public view returns (uint) {
        return candidates.length;
    }
    
    /**
     * @dev Get candidate information
     * @param _candidateId The ID of the candidate
     * @return id The candidate ID
     * @return name The candidate name
     * @return voteCount The candidate's vote count
     */
    function getCandidate(uint _candidateId) public view returns (uint id, string memory name, uint voteCount) {
        require(_candidateId < candidates.length, "Invalid candidate ID!");
        Candidate memory candidate = candidates[_candidateId];
        return (candidate.id, candidate.name, candidate.voteCount);
    }
    
    /**
     * @dev Get all candidates information
     * @return Array of all candidates
     */
    function getAllCandidates() public view returns (Candidate[] memory) {
        return candidates;
    }
    
    /**
     * @dev Check if an address has voted
     * @param _voter The address to check
     * @return Boolean indicating if the address has voted
     */
    function getHasVoted(address _voter) public view returns (bool) {
        return hasVoted[_voter];
    }
}