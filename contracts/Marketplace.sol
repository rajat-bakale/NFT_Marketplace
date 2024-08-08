// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTMarketplace is Ownable {
    struct Listing {
        uint256 tokenId;
        uint256 price;
        address seller;
        bool isListed;
    }

    struct Offer {
        uint256 price;
        address buyer;
    }

    mapping(address => mapping(uint256 => Listing)) public listings;
   
    mapping(address => mapping(uint256 => Offer[])) public offers;
   
    mapping(address => uint256) public userBalances;

    event NFTListed(address indexed nftContract, uint256 indexed tokenId, uint256 price, address indexed seller);
    event NFTBought(address indexed nftContract, uint256 indexed tokenId, uint256 price, address indexed buyer);
    event OfferMade(address indexed nftContract, uint256 indexed tokenId, uint256 price, address indexed buyer);
    event OfferAccepted(address indexed nftContract, uint256 indexed tokenId, uint256 price, address indexed seller);
    event ListingCancelled(address indexed nftContract, uint256 indexed tokenId);
    event FundsDeposited(address indexed user, uint256 amount);
    event FundsWithdrawn(address indexed user, uint256 amount);

    constructor() Ownable(msg.sender) {}

    function listNFT(address _nftContract, uint256 _tokenId, uint256 _price) external {
        IERC721 nft = IERC721(_nftContract);
        require(nft.ownerOf(_tokenId) == msg.sender, "Not the owner");
        require(nft.getApproved(_tokenId) == address(this), "Marketplace not approved");

        listings[_nftContract][_tokenId] = Listing(_tokenId, _price, msg.sender, true);

        emit NFTListed(_nftContract, _tokenId, _price, msg.sender);
    }

    function buyNFT(address _nftContract, uint256 _tokenId) external payable {
        Listing storage listing = listings[_nftContract][_tokenId];
        require(listing.isListed, "NFT not listed");
        require(msg.value == listing.price, "Incorrect value");

        IERC721(_nftContract).transferFrom(listing.seller, msg.sender, _tokenId);
        payable(listing.seller).transfer(msg.value);

        listing.isListed = false;

        emit NFTBought(_nftContract, _tokenId, listing.price, msg.sender);
    }

    function makeOffer(address _nftContract, uint256 _tokenId) external payable {
        require(msg.value > 0, "Offer price must be greater than zero");

        offers[_nftContract][_tokenId].push(Offer(msg.value, msg.sender));

        emit OfferMade(_nftContract, _tokenId, msg.value, msg.sender);
    }

    function acceptOffer(address _nftContract, uint256 _tokenId, uint256 _offerIndex) external {
        Offer memory offer = offers[_nftContract][_tokenId][_offerIndex];
        Listing storage listing = listings[_nftContract][_tokenId];
        require(offer.price > 0, "Invalid offer");
        require(listing.isListed, "NFT not listed");
        require(listing.seller == msg.sender, "Not the seller");

        IERC721(_nftContract).transferFrom(msg.sender, offer.buyer, _tokenId);
        payable(msg.sender).transfer(offer.price);

        listing.isListed = false;
        delete offers[_nftContract][_tokenId][_offerIndex];

        emit OfferAccepted(_nftContract, _tokenId, offer.price, msg.sender);
    }

    function cancelListing(address _nftContract, uint256 _tokenId) external {
        Listing storage listing = listings[_nftContract][_tokenId];
        require(listing.seller == msg.sender, "Not the seller");
        require(listing.isListed, "NFT not listed");

        listing.isListed = false;

        emit ListingCancelled(_nftContract, _tokenId);
    }

    function depositFunds() external payable {
        require(msg.value > 0, "No funds sent");

        userBalances[msg.sender] += msg.value;

        emit FundsDeposited(msg.sender, msg.value);
    }

    function withdrawFunds() external {
        uint256 balance = userBalances[msg.sender];
        require(balance > 0, "No funds to withdraw");

        userBalances[msg.sender] = 0;
        payable(msg.sender).transfer(balance);

        emit FundsWithdrawn(msg.sender, balance);
    }

    receive() external payable {
        userBalances[msg.sender] += msg.value;
    }
}
