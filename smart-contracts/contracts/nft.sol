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

contract WoahNiceNFT is ERC721, IERC2981, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    using Strings for uint256;

    Counters.Counter private tokenCounter;

    string private baseURI;

    // project constraints
    uint256 public constant MAX_TOKENS_PER_WALLET = 9;
    uint256 public constant MAX_RESERVE_TOKENS = 200;
    uint256 public constant MAX_TOTAL_SUPPLY = 8000;

    uint256 public numGiftedTokens; // dynanic based on number of gifted tokens

    // used to validate claimlists
    mapping(address => bool) public claimed; // used for reserve tokens
    mapping(address => uint256) public presaleMintCounts; // used for presale list
    bytes32 public reserveMerkleRoot;
    bytes32 public claimlistMerkleRoot;

    // Sale info
    bool public isPublicSaleActive;
    bool public isPresaleActive;

    uint256 public constant MAX_CLAIMLIST_SALE_MINTS = 1;
    uint256 public constant CLAIMLIST_SALE_PRICE = 0.02 ether;

    uint256 public constant MAX_PUBLIC_SALE_MINTS = 5;
    uint256 public constant PUBLIC_SALE_PRICE = 0.06 ether;

    address public royaltyReceiverAddress;

    constructor(address _royaltyReceiverAddress)
        ERC721("Woah Nice NFT", "WOAH")
    {
        royaltyReceiverAddress = _royaltyReceiverAddress;
    }

    // ============ ACCESS CONTROL MODIFIERS ============
    modifier presaleActive() {
        require(isPresaleActive, "Presale is not open");
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
    function mint(uint256 numberOfTokens)
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
    function mintClaimlist(uint8 numberOfTokens, bytes32[] calldata merkleProof)
        external
        payable
        presaleActive
        nonReentrant
        canMint(MAX_CLAIMLIST_SALE_MINTS)
        isCorrectPayment(CLAIMLIST_SALE_PRICE, MAX_CLAIMLIST_SALE_MINTS)
        isValidMerkleProof(merkleProof, claimlistMerkleRoot)
    {
        uint256 numAlreadyMinted = presaleMintCounts[msg.sender];

        require(
            numAlreadyMinted + numberOfTokens <= MAX_CLAIMLIST_SALE_MINTS,
            "Claimed/invalid tokens requested"
        );

        presaleMintCounts[msg.sender] = numAlreadyMinted + numberOfTokens;

        for (uint256 i = 0; i < numberOfTokens; i++) {
            _safeMint(msg.sender, nextTokenId());
        }
    }

    /**
     * @dev used for reserve token gifting
     */
    function claim(bytes32[] calldata merkleProof)
        external
        isValidMerkleProof(merkleProof, reserveMerkleRoot)
        canGiftTokens(1)
    {
        require(!claimed[msg.sender], "Token already claimed");
        claimed[msg.sender] = true;
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
    /**
     * @dev used for reveals
     */
    function setBaseURI(string memory _baseURI) external onlyOwner {
        baseURI = _baseURI;
    }

    function setIsPublicSaleActive(bool _isPublicSaleActive)
        external
        onlyOwner
    {
        isPublicSaleActive = _isPublicSaleActive;
    }

    function setIsPresaleActive(bool _isPresaleActive) external onlyOwner {
        isPresaleActive = _isPresaleActive;
    }

    function setReserveListMerkleRoot(bytes32 merkleRoot) external onlyOwner {
        reserveMerkleRoot = merkleRoot;
    }

    function setClaimlistMerkleRoot(bytes32 merkleRoot) external onlyOwner {
        claimlistMerkleRoot = merkleRoot;
    }

    /**
     * @dev reserve tokens for gifting, team and giveaways
     */
    function reserveForGifting(uint256 numToReserve)
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
