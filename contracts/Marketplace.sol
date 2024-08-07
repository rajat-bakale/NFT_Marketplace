// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Marketplace is Ownable(0x930E583a2222682a40D2b4f9BB5ffC0f7AF3963a) {
    uint256 private _currentItemId;
    uint256 private _itemsSold;

    struct MarketItem {
        uint256 itemId;
        IERC721 nftContract;
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
    }

    mapping(uint256 => MarketItem) private idToMarketItem;

    event MarketItemCreated (
        uint256 indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool sold
    );

    event MarketItemSold (
        uint256 indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price
    );

    constructor() {
        _currentItemId = 0;
        _itemsSold = 0;
    }

    function createMarketItem(IERC721 nftContract, uint256 tokenId, uint256 price) public {
        require(price > 0, "Price must be at least 1 wei");

        _currentItemId += 1;
        uint256 itemId = _currentItemId;

        idToMarketItem[itemId] = MarketItem(
            itemId,
            nftContract,
            tokenId,
            payable(msg.sender),
            payable(address(0)),
            price,
            false
        );

        nftContract.transferFrom(msg.sender, address(this), tokenId);

        emit MarketItemCreated(
            itemId,
            address(nftContract),
            tokenId,
            msg.sender,
            address(0),
            price,
            false
        );
    }

    function createMarketSale(uint256 itemId) public payable {
        uint256 price = idToMarketItem[itemId].price;
        uint256 tokenId = idToMarketItem[itemId].tokenId;
        IERC721 nftContract = idToMarketItem[itemId].nftContract;

        require(msg.value == price, "Please submit the asking price");

        idToMarketItem[itemId].seller.transfer(msg.value);
        nftContract.transferFrom(address(this), msg.sender, tokenId);

        idToMarketItem[itemId].owner = payable(msg.sender);
        idToMarketItem[itemId].sold = true;
        _itemsSold += 1;

        emit MarketItemSold(
            itemId,
            address(nftContract),
            tokenId,
            idToMarketItem[itemId].seller,
            msg.sender,
            price
        );
    }

    function fetchMarketItems() public view returns (MarketItem[] memory) {
        uint itemCount = _currentItemId;
        uint unsoldItemCount = itemCount - _itemsSold;
        uint currentIndex = 0;

        MarketItem[] memory items = new MarketItem[](unsoldItemCount);
        for (uint i = 0; i < itemCount; i++) {
            if (idToMarketItem[i + 1].owner == address(0)) {
                uint currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }
}
