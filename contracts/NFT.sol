// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFT is ERC721URIStorage, Ownable, ReentrancyGuard {
    string private _contractURI;
    string public baseURI;

    uint256 public immutable MAX_SUPPLY = 10000;
    uint256 public TOKEN_ID = 1;

    constructor(string memory _baseURI, string memory __contractURI) ERC721("Sample NFT", "SNFT") {
        setBaseURI(_baseURI);
        setContractURI(__contractURI);
    }

    /** SALE ACTIVATION **/
    bool public saleIsActive = true;

    function setSaleIsActive(bool saleIsActive_) external onlyOwner {
        saleIsActive = saleIsActive_;
    }

    /** CONTRACT AND TOKEN URI **/
    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(_exists(tokenId), "ERC721Metadata: query for nonexistent token");
        return string(abi.encodePacked(baseURI, Strings.toString(tokenId), ".json"));
    }

    function contractURI() public view returns (string memory) {
        return _contractURI;
    }

    function setBaseURI(string memory _baseURI) public onlyOwner {
        baseURI = _baseURI;
    }

    function setContractURI(string memory __contractURI)
        internal
        virtual
        onlyOwner
    {
        _contractURI = __contractURI;
    }

    /** MINT **/
    function mint(uint256 count)
        public
        nonReentrant
    {
        require(TOKEN_ID + count <= MAX_SUPPLY, "max supply reached");
        for (uint256 i = 0; i < count; i++) {
            _safeMint(msg.sender, TOKEN_ID);
            TOKEN_ID++;
        }
    }

    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        payable(msg.sender).transfer(balance);
    }
}