Verified contract :- https://www.oklink.com/amoy/address/0x949d61bbea8b7decfce449b879bf75dc4a011d6e
                     https://www.oklink.com/amoy/address/0x4171c599185994be5f11189031183507e9366610
# NFT Marketplace Project
  This project is an implementation of an NFT marketplace on the Polygon network. It allows users to mint NFTs, list them for sale, buy listed NFTs, and make offers 
  on them. The project includes two smart contracts: one for creating and managing NFTs (NFT.sol) and another for the marketplace functionality (Marketplace.sol).

## Project Overview
This project includes two main contracts:
- NFT Contract (NFT.sol): An ERC721 token contract that allows the minting of unique tokens with metadata.
- Marketplace Contract (Marketplace.sol): A marketplace contract that allows users to list, buy, and make offers on NFTs.

## Features
- **NFT Minting**: Users can mint their own NFTs with unique metadata (name, description, image URL).
- **Listing NFTs for Sale**: Users can list their NFTs for sale by specifying a price.
- **Buying NFTs**: Users can buy listed NFTs by paying the specified price.
- **Making Offers on NFTs**: Users can make offers on listed NFTs, and the NFT owner can accept or reject these offers.
- **Canceling Listings**: The owner of a listed NFT can cancel the listing.

## Smart Contracts
  ### NFT Contract
  The NFT.sol contract is based on the ERC721 standard and uses the OpenZeppelin library. It includes functionality for minting NFTs with metadata and a function 
  to get the total supply of NFTs minted.
  #### Key Functions:
  - **mintNFT(address recipient, string memory tokenURI)**: Mints a new NFT to the specified recipient with the provided metadata URI.
  - **totalSupply()**: Returns the total number of NFTs minted.

  ### Marketplace Contract
  The Marketplace.sol contract manages the listing, buying, and selling of NFTs. It allows users to list NFTs for sale, buy them, and make offers.
  #### Key Functions:
 - **createMarketItem(IERC721 nftContract, uint256 tokenId, uint256 price)**: Lists an NFT for sale at a specified price.
 - **createMarketSale(uint256 itemId)**: Completes a sale when the correct price is paid.
 - **fetchMarketItems()**: Returns a list of all NFTs currently listed for sale.

## Prerequisites

- Node.js and npm
- Hardhat
- .env file with the following variables:
  - `PRIVATE_KEY`: Your private key for deployment.
  - `MUMBAI_RPC_URL`: RPC URL for the Amoy testnet.

## Installation and Deployment

1. **Install Dependencies**: Ensure you have Node.js, Hardhat, and the OpenZeppelin contracts installed.
   ```bash
   npm install
   ```

2. **Compile the Contract**:
   ```bash
   npx hardhat compile
   ```

3. **Deploy the Contract**: Update the deployment scripts and deploy to your preferred Polygon testnet or mainnet.
   ```bash
   npx hardhat run scripts/deployNFT.js --network mumbai
   npx hardhat run scripts/deployMarketplace.js --network mumbai
   ```

## Scripts
- **deployNFT.js**: Deploys the NFT.sol contract.
- **deployMarketplace.js**: Deploys the Marketplace.sol contract.

## Testing
Unit tests are written using Hardhat and Chai. The test cases cover all functionalities of both contracts.
  ### Running Tests
   ```bash
   npx hardhat test
   ```
  ### Test Files
  - **test/NFT.test.js**: Contains tests for the NFT.sol contract.
  - **test/Marketplace.test.js**: Contains tests for the Marketplace.sol contract.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
