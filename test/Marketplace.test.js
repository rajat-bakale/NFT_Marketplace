const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Marketplace Contract", function () {
  let NFT, nft, Marketplace, marketplace, owner, addr1, addr2;

  beforeEach(async function () {
    NFT = await ethers.getContractFactory("NFT");
    [owner, addr1, addr2] = await ethers.getSigners();
    nft = await NFT.deploy();
    await nft.waitForDeployment();


    Marketplace = await ethers.getContractFactory("Marketplace");
    marketplace = await Marketplace.deploy();
    await marketplace.waitForDeployment();

    
    await nft.mintNFT(addr1.address, "https://example.com/token/1");
    await nft.connect(addr1).approve(marketplace.target, 1);
  });

  it("Should list an NFT for sale", async function () {
    await marketplace.connect(addr1).createMarketItem(nft.target, 1, ethers.parseEther("1"));

    const items = await marketplace.fetchMarketItems();
    expect(items.length).to.equal(1);
    expect(items[0].price.toString()).to.equal(ethers.parseEther("1").toString());
    expect(items[0].owner).to.equal(ethers.ZeroAddress);
    expect(items[0].seller).to.equal(addr1.address);
  });

  it("Should allow a user to buy an NFT", async function () {
    await marketplace.connect(addr1).createMarketItem(nft.target, 1, ethers.parseEther("1"));

    await marketplace.connect(addr2).createMarketSale(1, { value: ethers.parseEther("1") });

    const newOwner = await nft.ownerOf(1);
    expect(newOwner).to.equal(addr2.address);

    const items = await marketplace.fetchMarketItems();
    expect(items.length).to.equal(0);
  });

  it("Should fail if the price is not correct", async function () {
    await marketplace.connect(addr1).createMarketItem(nft.target, 1, ethers.parseEther("1"));

    await expect(
      marketplace.connect(addr2).createMarketSale(1, { value: ethers.parseEther("0.5") })
    ).to.be.revertedWith("Please submit the asking price");
  });

  it("Should allow the seller to cancel the listing", async function () {
    await marketplace.connect(addr1).createMarketItem(nft.target, 1, ethers.parseEther("1"));

    await marketplace.connect(addr1).cancelListing(1);

    const newOwner = await nft.ownerOf(1);
    expect(newOwner).to.equal(addr1.address);

    const items = await marketplace.fetchMarketItems();
    expect(items.length).to.equal(0);
  });
});
