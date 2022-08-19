// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract MyNFT is ERC721, IERC2981, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    using Address for address payable;
    using Strings for uint256;

    Counters.Counter private tokenCounter;

    string private baseURI;

    string private collectionURI;
    
    string public provenanceHash;

    uint256 public numReservedTokens;

    mapping(address => uint256) public preSaleMintCounts; 
    
    bytes32 private preSaleListMerkleRoot;

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

    uint256 public constant ROYALTY_PERCENTAGE = 5;

    // ==================== EVENTS ====================
    event MintPublicSale(address indexed minter, uint256 indexed tokens);

    event MintPreSale(address indexed minter, uint256 indexed tokens);

    event ReserveTokens(uint256 indexed tokens);

    event GiftTokens(address[] indexed addresses);

    event SetSaleState(SaleState indexed state);

    event SetPreSaleMerkleRoot(bytes32 indexed root);

    event SetBaseURI(string indexed uri);

    event SetCollectionURI(string indexed uri);

    event SetRoyaltyReceiver(address indexed _address);

    event Withdraw(address indexed dest);

    event WithdrawToken(address indexed tokenAddress, address indexed dest);

    // ================================================

    constructor(address _royaltyReceiverAddress)
        ERC721("My NFT Collection", "MYNFT")
    {
        royaltyReceiverAddress = _royaltyReceiverAddress;
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

    modifier maxTokensPerPublicSaleMint(uint256 numberOfTokens) {
        require(
            numberOfTokens <= MAX_PUBLIC_SALE_MINTS,
            "Exceeds public mint max number"
        );
        _;
    }

    modifier maxTokensPerPreSaleMint(uint256 numberOfTokens) {
        require(
            preSaleMintCounts[msg.sender] + numberOfTokens <= MAX_PRE_SALE_MINTS,
            "Exceeds pre sale mint max number"
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

    modifier hasAddresses(address[] calldata addresses) {
        require(addresses.length > 0, "Addresses array empty");
        _;
    }

    modifier isValidPreSaleAddress(bytes32[] calldata merkleProof) {
        require(
            MerkleProof.verify(
                merkleProof,
                preSaleListMerkleRoot,
                keccak256(abi.encodePacked(msg.sender))
            ),
            "Address not in list"
        );
        _;
    }

    modifier isExistingToken(uint256 tokenId) {
        require(_exists(tokenId), "Non-existent token");
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
        maxTokensPerPublicSaleMint(numberOfTokens)
    {
        for (uint256 i = 0; i < numberOfTokens; i++) {
            _safeMint(msg.sender, nextTokenId());
        }

        emit MintPublicSale(msg.sender, numberOfTokens);
    }

    function mintPreSale(uint256 numberOfTokens, bytes32[] calldata merkleProof)
        external
        payable
        nonReentrant
        preSaleActive
        isCorrectPayment(PRE_SALE_PRICE, numberOfTokens)
        canMint(numberOfTokens)
        isValidPreSaleAddress(merkleProof)
        maxTokensPerPreSaleMint(numberOfTokens)
    {
        preSaleMintCounts[msg.sender] = preSaleMintCounts[msg.sender] + numberOfTokens;

        for (uint256 i = 0; i < numberOfTokens; i++) {
            _safeMint(msg.sender, nextTokenId());
        }

        emit MintPreSale(msg.sender, numberOfTokens);
    }

    /**
     * @dev reserve tokens for self
     */
    function reserveTokens(uint256 numberOfTokens)
        external
        nonReentrant
        onlyOwner
        canReserveTokens(numberOfTokens)
    {
        numReservedTokens += numberOfTokens;

        for (uint256 i = 0; i < numberOfTokens; i++) {
            _safeMint(msg.sender, nextTokenId());
        }

        emit ReserveTokens(numberOfTokens);
    }

    /**
     * @dev gift token directly to list of recipients
     */
    function giftTokens(address[] calldata addresses)
        external
        nonReentrant
        onlyOwner
        canReserveTokens(addresses.length)
        hasAddresses(addresses)
    {
        numReservedTokens += addresses.length;

        for (uint256 i = 0; i < addresses.length; i++) {
            _safeMint(addresses[i], nextTokenId());
        }

        emit GiftTokens(addresses);
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
    function contractURI() public view returns (string memory) {
        return collectionURI;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override
        isExistingToken(tokenId)
        returns (string memory)
    {
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
        isExistingToken(tokenId)
        returns (address receiver, uint256 royaltyAmount)
    {
        return (royaltyReceiverAddress, salePrice * ROYALTY_PERCENTAGE / 100);
    }

    /**
     * @dev support EIP-2981 interface for royalties
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
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

        emit SetSaleState(SaleState.PublicSale);
    }

    function setPreSaleActive() external onlyOwner {
        saleState = SaleState.PreSale;

        emit SetSaleState(SaleState.PreSale);
    }

    function setSaleInactive() external onlyOwner {
        saleState = SaleState.Inactive;

        emit SetSaleState(SaleState.Inactive);
    }

    /**
     * @dev used for allowlisting pre sale addresses
     */
    function setPreSaleListMerkleRoot(bytes32 merkleRoot) external onlyOwner {
        preSaleListMerkleRoot = merkleRoot;

        emit SetPreSaleMerkleRoot(merkleRoot);
    }

    /**
     * @dev used for art reveals
     */
    function setBaseURI(string memory newbaseURI) external onlyOwner {
        baseURI = newbaseURI;

        emit SetBaseURI(newbaseURI);
    }

    function setCollectionURI(string memory _collectionURI) external onlyOwner {
        collectionURI = _collectionURI;

        emit SetCollectionURI(_collectionURI);
    }
    
    function setProvenanceHash(string calldata _hash) public onlyOwner {
        provenanceHash = _hash;
    }

    function setRoyaltyReceiverAddress(address _royaltyReceiverAddress)
        external
        onlyOwner
    {
        royaltyReceiverAddress = _royaltyReceiverAddress;

        emit SetRoyaltyReceiver(_royaltyReceiverAddress);
    }

    function withdraw(address payable _dest) external onlyOwner {
        uint256 _balance = address(this).balance;
        _dest.sendValue(_balance);

        emit Withdraw(_dest);    
    }

    function withdrawToken(address _tokenAddress, address _dest) external onlyOwner {
        uint256 _balance = IERC20(_tokenAddress).balanceOf(address(this));
        SafeERC20.safeTransfer(IERC20(_tokenAddress), _dest, _balance);

        emit WithdrawToken(_tokenAddress, _dest);
    }

    /**
     * @dev enable contract to receive ethers in royalty
     */
    receive() external payable {}
}
