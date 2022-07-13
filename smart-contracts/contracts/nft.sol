// SPDX-License-Identifier: MIT

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

contract MyNFT is ERC721, IERC2981, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    using Strings for uint256;

    Counters.Counter private tokenCounter;

    string private baseURI;

    string private collectionURI;
    
    string public PROVENANCE_HASH;

    uint256 public numReservedTokens;

    mapping(address => uint256) public preSaleMintCounts; 
    bytes32 public preSaleListMerkleRoot;

    enum SaleState {
        Inactive,
        PreSale,
        PublicSale
    }

    SaleState public saleState = SaleState.Inactive;

    address public royaltyReceiverAddress;

    // ============ CUSTOMIZE VALUES BELOW ============
    uint256 public constant MAX_TOTAL_SUPPLY = 8000;

    uint256 public constant MAX_PRE_SALE_MINTS = 3;
    uint256 public constant PRE_SALE_PRICE = 0.01 ether;

    uint256 public constant MAX_PUBLIC_SALE_MINTS = 5;
    uint256 public constant PUBLIC_SALE_PRICE = 0.02 ether;

    uint256 public constant MAX_RESERVE_TOKENS = 200;
    uint256 public constant MAX_TOKENS_PER_WALLET = 5; 
    
    uint256 public constant ROYALTY_PERCENTAGE = 5;
    // ================================================

    constructor(address _royaltyReceiverAddress)
        ERC721("My NFT Collection", "MYNFT")
    {
        royaltyReceiverAddress = _royaltyReceiverAddress;
        assert(MAX_TOKENS_PER_WALLET >= MAX_PRE_SALE_MINTS);
        assert(MAX_TOKENS_PER_WALLET >= MAX_PUBLIC_SALE_MINTS);
    }

    // ============ ACCESS CONTROL MODIFIERS ============
    modifier preSaleActive() {
        require(saleState == SaleState.PreSale, "Pre sale is not open");
        _;
    }

    modifier publicSaleActive() {
        require(saleState == SaleState.PublicSale, "Public sale is not open");
        _;
    }

    modifier maxTokensPerWallet(uint256 numberOfTokens) {
        require(
            balanceOf(msg.sender) + numberOfTokens <= MAX_TOKENS_PER_WALLET,
            "Exceeds max tokens per wallet"
        );
        _;
    }

    modifier canMint(uint256 numberOfTokens) {
        require(
            tokenCounter.current() + numberOfTokens <=
                MAX_TOTAL_SUPPLY - MAX_RESERVE_TOKENS + numReservedTokens,
            "Insufficient tokens remaining"
        );
        _;
    }

    modifier canReserveTokens(uint256 numberOfTokens) {
        require(
            numReservedTokens + numberOfTokens <= MAX_RESERVE_TOKENS,
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

    modifier isValidPreSaleAddress(bytes32[] calldata merkleProof) {
        require(
            MerkleProof.verify(
                merkleProof,
                preSaleListMerkleRoot,
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
            "Exceeds max number for public mint"
        );
        for (uint256 i = 0; i < numberOfTokens; i++) {
            _safeMint(msg.sender, nextTokenId());
        }
    }

    function mintPreSale(uint8 numberOfTokens, bytes32[] calldata merkleProof)
        external
        payable
        nonReentrant
        preSaleActive
        isCorrectPayment(PRE_SALE_PRICE, numberOfTokens)
        canMint(numberOfTokens)
        isValidPreSaleAddress(merkleProof)
    {
        uint256 numAlreadyMinted = preSaleMintCounts[msg.sender];

        require(
            numAlreadyMinted + numberOfTokens <= MAX_PRE_SALE_MINTS,
            "Exceeds max number for pre sale mint"
        );

        preSaleMintCounts[msg.sender] = numAlreadyMinted + numberOfTokens;

        for (uint256 i = 0; i < numberOfTokens; i++) {
            _safeMint(msg.sender, nextTokenId());
        }
    }

    /**
     * @dev reserve tokens for self
     */
    function reserveTokens(uint256 numToReserve)
        external
        nonReentrant
        onlyOwner
        canReserveTokens(numToReserve)
    {
        numReservedTokens += numToReserve;

        for (uint256 i = 0; i < numToReserve; i++) {
            _safeMint(msg.sender, nextTokenId());
        }
    }

    /**
     * @dev gift token directly to list of recipients
     */
    function giftTokens(address[] calldata addresses)
        external
        nonReentrant
        onlyOwner
        canReserveTokens(addresses.length)
    {
        uint256 numRecipients = addresses.length;
        numReservedTokens += numRecipients;

        for (uint256 i = 0; i < numRecipients; i++) {
            _safeMint(addresses[i], nextTokenId());
        }
    }

    // ============ PUBLIC READ-ONLY FUNCTIONS ============
    function getBaseURI() external view returns (string memory) {
        return baseURI;
    }

    function getContractURI() external view returns (string memory) {
        return collectionURI;
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
    function contractURI() public view returns (string memory) {
        return collectionURI;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(_exists(tokenId), "Non-existent token");

        return
            string(abi.encodePacked(baseURI, "/", tokenId.toString(), ".json"));
    }

    /**
     * @dev support EIP-2981 interface for royalties
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
            SafeMath.div(SafeMath.mul(salePrice, ROYALTY_PERCENTAGE), 100)
        );
    }

    /**
     * @dev support EIP-2981 interface for royalties
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721, IERC165)
        returns (bool)
    {
        return
            interfaceId == type(IERC2981).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    // ============ OWNER-ONLY ADMIN FUNCTIONS ============
    function setPublicSaleActive() external onlyOwner {
        saleState = SaleState.PublicSale;
    }

    function setPreSaleActive() external onlyOwner {
        saleState = SaleState.PreSale;
    }

    function setSaleInactive() external onlyOwner {
        saleState = SaleState.Inactive;
    }

    /**
     * @dev used for allowlisting pre sale addresses
     */
    function setPreSaleListMerkleRoot(bytes32 merkleRoot) external onlyOwner {
        preSaleListMerkleRoot = merkleRoot;
    }

    /**
     * @dev used for art reveals
     */
    function setBaseURI(string memory _baseURI) external onlyOwner {
        baseURI = _baseURI;
    }

    function setCollectionURI(string memory _collectionURI) external onlyOwner {
        collectionURI = _collectionURI;
    }
    
    function setProvenanceHash(string calldata hash) public onlyOwner {
        PROVENANCE_HASH = hash;
    }

    function setRoyaltyReceiverAddress(address _royaltyReceiverAddress)
        external
        onlyOwner
    {
        royaltyReceiverAddress = _royaltyReceiverAddress;
    }

    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        payable(msg.sender).transfer(balance);
    }

    function withdrawTokens(IERC20 token) public onlyOwner {
        uint256 balance = token.balanceOf(address(this));
        token.transfer(msg.sender, balance);
    }

    /**
     * @dev enable contract to receive ethers in royalty
     */
    receive() external payable {}
}
