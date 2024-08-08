const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Marketplace Contract", function () {
  let Marketplace, NFT;
  let marketplace, nft;
  let owner, seller, buyer, other;

  beforeEach(async function () {
    NFT = await ethers.getContractFactory("NFT");
    [owner, seller, buyer, other] = await ethers.getSigners();
    nft = await NFT.deploy();
    await nft.waitForDeployment();

    Marketplace = await ethers.getContractFactory("Marketplace");
    marketplace = await Marketplace.deploy();
    await marketplace.waitForDeployment();

    await nft.mintNFT(seller.address, "https://example.com/token1");
  });

  it("Should list an NFT on the marketplace", async function () {
    await nft.connect(seller).approve(marketplace.target, 1);
    await marketplace.connect(seller).listNFT(nft.target, 1, ethers.parseEther("1"));

    const listing = await marketplace.listings(nft.target, 1);
    expect(listing.seller).to.equal(seller.address);
    expect(listing.price).to.equal(ethers.parseEther("1"));
    expect(listing.isListed).to.equal(true);
  });

  it("Should allow a user to buy an NFT", async function () {
    await nft.connect(seller).approve(marketplace.target, 1);
    await marketplace.connect(seller).listNFT(nft.target, 1, ethers.parseEther("1"));

    await marketplace.connect(buyer).buyNFT(nft.target, 1, { value: ethers.parseEther("1") });

    const newOwner = await nft.ownerOf(1);
    expect(newOwner).to.equal(buyer.address);

    const listing = await marketplace.listings(nft.target, 1);
    expect(listing.isListed).to.equal(false);
  });

  it("Should allow a user to make an offer on an NFT", async function () {
    await nft.connect(seller).approve(marketplace.target, 1);
    await marketplace.connect(seller).listNFT(nft.target, 1, ethers.parseEther("1"));

    await marketplace.connect(buyer).makeOffer(nft.target, 1, { value: ethers.parseEther("0.5") });

    const offer = await marketplace.offers(nft.target, 1, 0);
    expect(offer.buyer).to.equal(buyer.address);
    expect(offer.price).to.equal(ethers.parseEther("0.5"));
  });

  it("Should allow the seller to accept an offer", async function () {
    await nft.connect(seller).approve(marketplace.target, 1);
    await marketplace.connect(seller).listNFT(nft.target, 1, ethers.parseEther("1"));

    await marketplace.connect(buyer).makeOffer(nft.target, 1, { value: ethers.parseEther("0.5") });

    const sellerInitialBalance = await ethers.provider.getBalance(seller.address);

    await marketplace.connect(seller).acceptOffer(nft.target, 1, 0);

    const newOwner = await nft.ownerOf(1);
    expect(newOwner).to.equal(buyer.address);

    const sellerFinalBalance = await ethers.provider.getBalance(seller.address);
    expect(sellerFinalBalance).to.be.above(sellerInitialBalance);
  });

  it("Should allow the seller to cancel a listing", async function () {
    await nft.connect(seller).approve(marketplace.target, 1);
    await marketplace.connect(seller).listNFT(nft.target, 1, ethers.parseEther("1"));

    await marketplace.connect(seller).cancelListing(nft.target, 1);

    const listing = await marketplace.listings(nft.target, 1);
    expect(listing.isListed).to.equal(false);
  });
});
