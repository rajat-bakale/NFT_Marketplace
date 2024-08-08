const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Marketplace Contract", function () {
  let nft;
  let marketplace;
  let owner;
  let seller;
  let buyer;

  beforeEach(async function () {
    [owner, seller, buyer] = await ethers.getSigners();

    const NFT = await ethers.getContractFactory("NFT");
    nft = await NFT.deploy();
    await nft.deployed();

    const Marketplace = await ethers.getContractFactory("Marketplace");
    marketplace = await Marketplace.deploy();
    await marketplace.deployed();

    await nft.mintNFT(seller.address, "tokenURI_1");
    await nft.connect(seller).approve(marketplace.address, 1);
  });

  it("Should list an NFT", async function () {
    await marketplace.connect(seller).listNFT(nft.address, 1, ethers.utils.parseEther("1"));

    const listing = await marketplace.listings(nft.address, 1);
    expect(listing.price).to.equal(ethers.utils.parseEther("1"));
    expect(listing.seller).to.equal(seller.address);
    expect(listing.isListed).to.equal(true);
  });

  it("Should allow buying an NFT", async function () {
    await marketplace.connect(seller).listNFT(nft.address, 1, ethers.utils.parseEther("1"));

    await marketplace.connect(buyer).buyNFT(nft.address, 1, { value: ethers.utils.parseEther("1") });

    expect(await nft.ownerOf(1)).to.equal(buyer.address);

    const listing = await marketplace.listings(nft.address, 1);
    expect(listing.isListed).to.equal(false);
  });

  it("Should make an offer for an NFT", async function () {
    await marketplace.connect(buyer).makeOffer(nft.address, 1, { value: ethers.utils.parseEther("0.5") });

    const offers = await marketplace.offers(nft.address, 1, 0);
    expect(offers.price).to.equal(ethers.utils.parseEther("0.5"));
    expect(offers.buyer).to.equal(buyer.address);
  });

  it("Should accept an offer", async function () {
    await marketplace.connect(seller).listNFT(nft.address, 1, ethers.utils.parseEther("1"));
    await marketplace.connect(buyer).makeOffer(nft.address, 1, { value: ethers.utils.parseEther("0.5") });

    await marketplace.connect(seller).acceptOffer(nft.address, 1, 0);

    expect(await nft.ownerOf(1)).to.equal(buyer.address);

    const listing = await marketplace.listings(nft.address, 1);
    expect(listing.isListed).to.equal(false);
  });

  it("Should cancel a listing", async function () {
    await marketplace.connect(seller).listNFT(nft.address, 1, ethers.utils.parseEther("1"));
    await marketplace.connect(seller).cancelListing(nft.address, 1);

    const listing = await marketplace.listings(nft.address, 1);
    expect(listing.isListed).to.equal(false);
  });

  it("Should deposit and withdraw funds", async function () {
    await marketplace.connect(buyer).depositFunds({ value: ethers.utils.parseEther("1") });
    expect(await marketplace.userBalances(buyer.address)).to.equal(ethers.utils.parseEther("1"));

    await marketplace.connect(buyer).withdrawFunds();
    expect(await marketplace.userBalances(buyer.address)).to.equal(0);
  });
});
