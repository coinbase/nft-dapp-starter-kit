// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract NonFungibleCoinbae is ERC721, IERC2981, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    using Strings for uint256;

    Counters.Counter private tokenCounter;

    string private baseURI;

    // project constraints
    uint256 public constant MAX_TOKENS_PER_WALLET = 5;
    uint256 public constant MAX_RESERVE_TOKENS = 200;
    uint256 public constant MAX_TOTAL_SUPPLY = 8000;

    uint256 public numGiftedTokens; // dynamic based on number of gifted tokens

    // used to validate list
    mapping(address => bool) public reservedMintCounts; // used to reserved list
    mapping(address => uint256) public preSaleMintCounts; // used for presale list
    bytes32 public reserveListMerkleRoot;
    bytes32 public presaleListMerkleRoot;

    // Sale info
    bool public isReservedMintActive;
    bool public isPreSaleActive;
    bool public isPublicSaleActive;

    uint256 public constant MAX_PRE_SALE_MINTS = 1;
    uint256 public constant PRE_SALE_PRICE = 0.02 ether;

    uint256 public constant MAX_PUBLIC_SALE_MINTS = 5;
    uint256 public constant PUBLIC_SALE_PRICE = 0.06 ether;

    // Rotalty
    address public royaltyReceiverAddress;

    constructor(address _royaltyReceiverAddress)
        ERC721("Non Fungible Coinbaes", "COINBAE")
    {
        royaltyReceiverAddress = _royaltyReceiverAddress;
    }

    // ============ ACCESS CONTROL MODIFIERS ============
    modifier reservedMintActive() {
        require(isReservedMintActive, "Reserved minting is not open");
        _;
    }

    modifier preSaleActive() {
        require(isPreSaleActive, "Presale is not open");
        _;
    }

    modifier publicSaleActive() {
        require(isPublicSaleActive, "Public sale is not open");
        _;
    }

    modifier maxTokensPerWallet(uint256 numberOfTokens) {
        require(
            balanceOf(msg.sender) + numberOfTokens <= MAX_TOKENS_PER_WALLET,
            "Max tokens to mint is 9"
        );
        _;
    }

    modifier canMint(uint256 numberOfTokens) {
        require(
            tokenCounter.current() + numberOfTokens <=
                MAX_TOTAL_SUPPLY - MAX_RESERVE_TOKENS + numGiftedTokens,
            "Insufficient tokens remaining"
        );

        _;
    }

    modifier canGiftTokens(uint256 numberOfTokens) {
        require(
            numGiftedTokens + numberOfTokens <= MAX_RESERVE_TOKENS,
            "Insufficient token reserve"
        );
        require(
            tokenCounter.current() + numberOfTokens <= MAX_TOTAL_SUPPLY,
            "Insufficient tokens remaining"
        );
        _;
    }

    modifier isCorrectPayment(uint256 price, uint256 numberOfTokens) {
        require(
            price * numberOfTokens == msg.value,
            "Incorrect ETH value sent"
        );
        _;
    }

    modifier isValidMerkleProof(bytes32[] calldata merkleProof, bytes32 root) {
        require(
            MerkleProof.verify(
                merkleProof,
                root,
                keccak256(abi.encodePacked(msg.sender))
            ),
            "Address does not exist in list"
        );
        _;
    }

    // ============ PUBLIC FUNCTIONS FOR MINTING ============
    function mintPublicSale(uint256 numberOfTokens)
        external
        payable
        nonReentrant
        publicSaleActive
        isCorrectPayment(PUBLIC_SALE_PRICE, numberOfTokens)
        canMint(numberOfTokens)
        maxTokensPerWallet(numberOfTokens)
    {
        require(
            numberOfTokens <= MAX_PUBLIC_SALE_MINTS,
            "max public mint is 5"
        );
        for (uint256 i = 0; i < numberOfTokens; i++) {
            _safeMint(msg.sender, nextTokenId());
        }
    }

    /**
     * @dev can mint up to 3 tokens per allowlisted address
     * This is our regular presale list which operates like any other presale.
     * Only active during a presale
     */
    function mintPreSale(uint8 numberOfTokens, bytes32[] calldata merkleProof)
        external
        payable
        preSaleActive
        nonReentrant
        canMint(MAX_PRE_SALE_MINTS)
        isCorrectPayment(PRE_SALE_PRICE, MAX_PRE_SALE_MINTS)
        isValidMerkleProof(merkleProof, presaleListMerkleRoot)
    {
        uint256 numAlreadyMinted = preSaleMintCounts[msg.sender];

        require(
            numAlreadyMinted + numberOfTokens <= MAX_PRE_SALE_MINTS,
            "Claimed/invalid tokens requested"
        );

        preSaleMintCounts[msg.sender] = numAlreadyMinted + numberOfTokens;

        for (uint256 i = 0; i < numberOfTokens; i++) {
            _safeMint(msg.sender, nextTokenId());
        }
    }

    /**
     * @dev used for reserve token gifting
     */
    function mintReserved(bytes32[] calldata merkleProof)
        external
        isValidMerkleProof(merkleProof, reserveListMerkleRoot)
        canGiftTokens(1)
    {
        require(
            !reservedMintCounts[msg.sender],
            "Reserved token already claimed"
        );
        reservedMintCounts[msg.sender] = true;
        numGiftedTokens += 1;

        _safeMint(msg.sender, nextTokenId());
    }

    // ============ PUBLIC READ-ONLY FUNCTIONS ============
    function getBaseURI() external view returns (string memory) {
        return baseURI;
    }

    function getLastTokenId() external view returns (uint256) {
        return tokenCounter.current();
    }

    // ============ SUPPORTING FUNCTIONS ============
    function nextTokenId() private returns (uint256) {
        tokenCounter.increment();
        return tokenCounter.current();
    }

    // ============ FUNCTION OVERRIDES ============
    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(_exists(tokenId), "Nonexistent token");

        return
            string(abi.encodePacked(baseURI, "/", tokenId.toString(), ".json"));
    }

    /**
     * @dev See {IERC165-royaltyInfo}.
     */
    function royaltyInfo(uint256 tokenId, uint256 salePrice)
        external
        view
        override
        returns (address receiver, uint256 royaltyAmount)
    {
        require(_exists(tokenId), "Nonexistent token");

        return (
            royaltyReceiverAddress,
            SafeMath.div(SafeMath.mul(salePrice, 8), 100)
        );
    }

    // ============ OWNER-ONLY ADMIN FUNCTIONS ============
    function setIsPublicSaleActive(bool _isPublicSaleActive)
        external
        onlyOwner
    {
        isPublicSaleActive = _isPublicSaleActive;
    }

    function setIsPreSaleActive(bool _isPreSaleActive) external onlyOwner {
        isPreSaleActive = _isPreSaleActive;
    }

    function setReserveListMerkleRoot(bytes32 merkleRoot) external onlyOwner {
        reserveListMerkleRoot = merkleRoot;
    }

    function setPreSaleListMerkleRoot(bytes32 merkleRoot) external onlyOwner {
        presaleListMerkleRoot = merkleRoot;
    }

    /**
     * @dev used for art reveals
     */
    function setBaseURI(string memory _baseURI) external onlyOwner {
        baseURI = _baseURI;
    }

    /**
     * @dev reserve tokens for team
     */
    function reserveForTeam(uint256 numToReserve)
        external
        nonReentrant
        onlyOwner
        canGiftTokens(numToReserve)
    {
        numGiftedTokens += numToReserve;

        for (uint256 i = 0; i < numToReserve; i++) {
            _safeMint(msg.sender, nextTokenId());
        }
    }

    /**
     * @dev gift tokens directly to recipients
     */
    function giftTokens(address[] calldata addresses)
        external
        nonReentrant
        onlyOwner
        canGiftTokens(addresses.length)
    {
        uint256 numToGift = addresses.length;
        numGiftedTokens += numToGift;

        for (uint256 i = 0; i < numToGift; i++) {
            _safeMint(addresses[i], nextTokenId());
        }
    }

    /**
     * @dev receive royalties to specified address
     */
    function setRoyaltyReceiverAddress(address _royaltyReceiverAddress)
        external
        onlyOwner
    {
        royaltyReceiverAddress = _royaltyReceiverAddress;
    }

    /**
     * @dev withdraw from contract to owner account
     */
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        payable(msg.sender).transfer(balance);
    }

    function withdrawTokens(IERC20 token) public onlyOwner {
        uint256 balance = token.balanceOf(address(this));
        token.transfer(msg.sender, balance);
    }
}
