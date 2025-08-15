const hre = require("hardhat");

async function main() {
  console.log("🚀 Starting deployment...");

  // Get the contract factory
  const SimpleVoting = await hre.ethers.getContractFactory("SimpleVoting");

  console.log("📝 Deploying SimpleVoting contract...");

  // Deploy the contract
  const simpleVoting = await SimpleVoting.deploy();

  // Wait for deployment to complete
  await simpleVoting.waitForDeployment();

  const contractAddress = await simpleVoting.getAddress();

  console.log("✅ SimpleVoting deployed to:", contractAddress);

  // Verify the deployment by calling a read function
  const candidateCount = await simpleVoting.getCandidateCount();
  console.log("📊 Number of candidates:", candidateCount.toString());

  // Get all candidates
  const candidates = await simpleVoting.getAllCandidates();
  console.log("👥 Candidates:");
  candidates.forEach((candidate, index) => {
    console.log(`  ${index}: ${candidate.name} (${candidate.voteCount} votes)`);
  });

  console.log("\n🔧 To interact with this contract:");
  console.log(`1. Update CONTRACT_ADDRESS in src/hooks/useVotingContract.ts to: ${contractAddress}`);
  console.log("2. Make sure you're connected to the correct network");
  console.log("3. Start voting!");

  // If on a public network, provide verification command
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("\n🔍 To verify the contract on Etherscan:");
    console.log(`npx hardhat verify --network ${hre.network.name} ${contractAddress}`);
  }

  return contractAddress;
}

// Handle errors
main()
  .then((contractAddress) => {
    console.log("\n🎉 Deployment completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });