const hre = require("hardhat");

async function main() {
  const nft = await hre.ethers.deployContract("NFT");
  await nft.waitForDeployment();

  console.log(`NFT contract deployed to:${nft.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
