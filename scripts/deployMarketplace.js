const hre = require("hardhat");

async function main() {
  const marketplace = await hre.ethers.deployContract("Marketplace");
  await marketplace.waitForDeployment();

  console.log(`Marketplace contract deployed to:${marketplace.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
