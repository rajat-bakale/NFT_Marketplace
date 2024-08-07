const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFT Contract", function () {
  let NFT, nft, owner, addr1;

  beforeEach(async function () {
    NFT = await ethers.getContractFactory("NFT");
    [owner, addr1] = await ethers.getSigners();
    nft = await NFT.deploy();
    await nft.waitForDeployment();
  });

  it("Should mint a new NFT", async function () {
    const mintTx = await nft.mintNFT(addr1.address, "https://example.com/token/1");
    await mintTx.wait();

    const ownerOfToken = await nft.ownerOf(1);
    expect(ownerOfToken).to.equal(addr1.address);

    const tokenURI = await nft.tokenURI(1);
    expect(tokenURI).to.equal("https://example.com/token/1");
  });

  it("Should fail to mint NFT if not owner", async function () {
    await expect(
      nft.connect(addr1).mintNFT(addr1.address, "https://example.com/token/2")
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("Should return the correct total supply", async function () {
    await nft.mintNFT(addr1.address, "https://example.com/token/1");
    expect(await nft.totalSupply()).to.equal(1);
  });
});
