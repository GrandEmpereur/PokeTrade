// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PaymentNFT is ERC721, Ownable {
    uint256 public tokenIdCounter;
    event NFTMinted(address indexed minter, uint256 indexed tokenId, uint256 amount);

    constructor() ERC721("PaymentNFT", "PNFT") Ownable(msg.sender) {
        tokenIdCounter = 0;
    }

    function payAndMint() external payable {
        require(msg.value > 0, "Must send some ether");
        _safeMint(msg.sender, tokenIdCounter);
        emit NFTMinted(msg.sender, tokenIdCounter, msg.value);
        tokenIdCounter++;
    }

    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
