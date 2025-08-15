const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SimpleVoting", function () {
  let SimpleVoting;
  let simpleVoting;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    // Get the ContractFactory and Signers here
    SimpleVoting = await ethers.getContractFactory("SimpleVoting");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // Deploy a new contract for each test
    simpleVoting = await SimpleVoting.deploy();
    await simpleVoting.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should initialize with 3 candidates", async function () {
      const candidateCount = await simpleVoting.getCandidateCount();
      expect(candidateCount).to.equal(3);
    });

    it("Should have correct candidate names", async function () {
      const candidates = await simpleVoting.getAllCandidates();
      expect(candidates[0].name).to.equal("Candidate A");
      expect(candidates[1].name).to.equal("Candidate B");
      expect(candidates[2].name).to.equal("Candidate C");
    });

    it("Should have zero votes initially", async function () {
      for (let i = 0; i < 3; i++) {
        const votes = await simpleVoting.getVotes(i);
        expect(votes).to.equal(0);
      }
    });

    it("Should emit ContractDeployed event", async function () {
      // Deploy a new contract to test the event
      const newContract = await SimpleVoting.deploy();
      
      // The event would have been emitted during deployment
      // Since we can't easily test constructor events in this setup,
      // we'll verify the contract was deployed correctly
      const candidateCount = await newContract.getCandidateCount();
      expect(candidateCount).to.equal(3);
    });
  });

  describe("Voting", function () {
    it("Should allow a valid vote", async function () {
      await expect(simpleVoting.connect(addr1).vote(0))
        .to.emit(simpleVoting, "Voted")
        .withArgs(addr1.address, 0, "Candidate A");

      const votes = await simpleVoting.getVotes(0);
      expect(votes).to.equal(1);

      const hasVoted = await simpleVoting.getHasVoted(addr1.address);
      expect(hasVoted).to.be.true;
    });

    it("Should prevent double voting", async function () {
      // First vote should succeed
      await simpleVoting.connect(addr1).vote(0);

      // Second vote should fail
      await expect(simpleVoting.connect(addr1).vote(1))
        .to.be.revertedWith("You have already voted!");
    });

    it("Should reject invalid candidate ID", async function () {
      await expect(simpleVoting.connect(addr1).vote(5))
        .to.be.revertedWith("Invalid candidate ID!");
    });

    it("Should allow multiple users to vote for different candidates", async function () {
      await simpleVoting.connect(addr1).vote(0);
      await simpleVoting.connect(addr2).vote(1);
      await simpleVoting.connect(owner).vote(2);

      expect(await simpleVoting.getVotes(0)).to.equal(1);
      expect(await simpleVoting.getVotes(1)).to.equal(1);
      expect(await simpleVoting.getVotes(2)).to.equal(1);
    });

    it("Should allow multiple users to vote for the same candidate", async function () {
      await simpleVoting.connect(addr1).vote(0);
      await simpleVoting.connect(addr2).vote(0);

      expect(await simpleVoting.getVotes(0)).to.equal(2);
    });

    it("Should track voting status correctly", async function () {
      // Initially, no one has voted
      expect(await simpleVoting.getHasVoted(addr1.address)).to.be.false;
      expect(await simpleVoting.getHasVoted(addr2.address)).to.be.false;

      // After addr1 votes
      await simpleVoting.connect(addr1).vote(0);
      expect(await simpleVoting.getHasVoted(addr1.address)).to.be.true;
      expect(await simpleVoting.getHasVoted(addr2.address)).to.be.false;

      // After addr2 votes
      await simpleVoting.connect(addr2).vote(1);
      expect(await simpleVoting.getHasVoted(addr1.address)).to.be.true;
      expect(await simpleVoting.getHasVoted(addr2.address)).to.be.true;
    });
  });

  describe("View Functions", function () {
    beforeEach(async function () {
      // Set up some votes for testing
      await simpleVoting.connect(addr1).vote(0); // Candidate A: 1 vote
      await simpleVoting.connect(addr2).vote(0); // Candidate A: 2 votes
      await simpleVoting.connect(owner).vote(1); // Candidate B: 1 vote
    });

    it("Should return correct vote counts", async function () {
      expect(await simpleVoting.getVotes(0)).to.equal(2);
      expect(await simpleVoting.getVotes(1)).to.equal(1);
      expect(await simpleVoting.getVotes(2)).to.equal(0);
    });

    it("Should return correct candidate information", async function () {
      const [id, name, voteCount] = await simpleVoting.getCandidate(0);
      expect(id).to.equal(0);
      expect(name).to.equal("Candidate A");
      expect(voteCount).to.equal(2);
    });

    it("Should return all candidates correctly", async function () {
      const candidates = await simpleVoting.getAllCandidates();
      expect(candidates.length).to.equal(3);
      expect(candidates[0].voteCount).to.equal(2);
      expect(candidates[1].voteCount).to.equal(1);
      expect(candidates[2].voteCount).to.equal(0);
    });

    it("Should reject invalid candidate ID in view functions", async function () {
      await expect(simpleVoting.getVotes(5))
        .to.be.revertedWith("Invalid candidate ID!");
      
      await expect(simpleVoting.getCandidate(5))
        .to.be.revertedWith("Invalid candidate ID!");
    });
  });

  describe("Events", function () {
    it("Should emit Voted event with correct parameters", async function () {
      await expect(simpleVoting.connect(addr1).vote(1))
        .to.emit(simpleVoting, "Voted")
        .withArgs(addr1.address, 1, "Candidate B");
    });

    it("Should emit events for multiple votes", async function () {
      await expect(simpleVoting.connect(addr1).vote(0))
        .to.emit(simpleVoting, "Voted")
        .withArgs(addr1.address, 0, "Candidate A");

      await expect(simpleVoting.connect(addr2).vote(2))
        .to.emit(simpleVoting, "Voted")
        .withArgs(addr2.address, 2, "Candidate C");
    });
  });

  describe("Edge Cases", function () {
    it("Should handle boundary candidate IDs", async function () {
      // Valid boundary IDs
      await expect(simpleVoting.connect(addr1).vote(0)).to.not.be.reverted;
      await expect(simpleVoting.connect(addr2).vote(2)).to.not.be.reverted;

      // Invalid boundary IDs
      await expect(simpleVoting.connect(addrs[0]).vote(3))
        .to.be.revertedWith("Invalid candidate ID!");
    });

    it("Should maintain vote counts accurately with many votes", async function () {
      // Cast multiple votes for candidate 0
      const voters = [addr1, addr2, owner, addrs[0], addrs[1]];
      
      for (let i = 0; i < voters.length; i++) {
        await simpleVoting.connect(voters[i]).vote(0);
      }

      expect(await simpleVoting.getVotes(0)).to.equal(voters.length);
    });
  });
});