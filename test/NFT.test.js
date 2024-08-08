const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFT Contract", function () {
  let nft;
  let owner;
  let addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    const NFT = await ethers.getContractFactory("NFT");
    nft = await NFT.deploy();
    await nft.deployed();
  });

  it("Should mint a new NFT", async function () {
    const mintTx = await nft.mintNFT(addr1.address, "tokenURI_1");
    await mintTx.wait();

    expect(await nft.ownerOf(1)).to.equal(addr1.address);
    expect(await nft.tokenURI(1)).to.equal("tokenURI_1");
    expect(await nft.totalSupply()).to.equal(1);
  });

  it("Should return the total supply", async function () {
    expect(await nft.totalSupply()).to.equal(0);

    await nft.mintNFT(addr1.address, "tokenURI_1");
    expect(await nft.totalSupply()).to.equal(1);

    await nft.mintNFT(addr1.address, "tokenURI_2");
    expect(await nft.totalSupply()).to.equal(2);
  });

  it("Should not allow non-owner to mint", async function () {
    await expect(
      nft.connect(addr1).mintNFT(addr1.address, "tokenURI_3")
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });
});
