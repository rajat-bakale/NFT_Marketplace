const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFT Contract", function () {
  let NFT;
  let nft;
  let owner;
  let addr1;

  beforeEach(async function () {
    NFT = await ethers.getContractFactory("NFT");
    [owner, addr1] = await ethers.getSigners();
    nft = await NFT.deploy();
    await nft.waitForDeployment();
  });

  it("Should deploy the NFT contract and set the correct owner", async function () {
    expect(await nft.owner()).to.equal(owner.address);
  });

  it("Should mint an NFT", async function () {
    const tokenURI = "https://example.com/token1";
    await nft.mintNFT(addr1.address, tokenURI);
    expect(await nft.totalSupply()).to.equal(BigInt(1));
    expect(await nft.ownerOf(1)).to.equal(addr1.address);
    expect(await nft.tokenURI(1)).to.equal(tokenURI);
  });

  it("Should return the total supply", async function () {
    const tokenURI = "https://example.com/token1";
    await nft.mintNFT(addr1.address, tokenURI);
    expect(await nft.totalSupply()).to.equal(BigInt(1));
  });
});
