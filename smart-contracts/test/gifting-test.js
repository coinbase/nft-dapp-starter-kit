const { expect } = require("chai");
const { ethers } = require("hardhat");
var Web3 = require('web3');

// "Web3.providers.givenProvider" will be set if in an Ethereum supported browser.
var web3 = new Web3(Web3.givenProvider || 'ws://some.local-or-remote.node:8546');

describe("Gifting", function () {
  var nft;
  var owner, addr1, addr2, addr3;

  beforeEach(async function () {
    const NFT = await ethers.getContractFactory("WoahNiceNFT");
    nft = await NFT.deploy("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
    await nft.deployed();

    [owner, addr1, addr2, addr3] = await ethers.getSigners();
  });

  it("should revert non owner attempt to gift", async function () {
    await expect(nft.connect(addr1).giftTokens(
      ["0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"])
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("should revert non owner attempt to reserve", async function () {
    await expect(nft.connect(addr1).reserveForGifting(18)
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("should allow owner attempt to gift directly to recipients", async function () {
    await nft.giftTokens(
      ["0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
        "0x90F79bf6EB2c4f870365E785982E1f101E93b906"]);
    expect(await nft.balanceOf(addr1.address)).to.equal(1);
    expect(await nft.balanceOf(addr2.address)).to.equal(1);
    expect(await nft.balanceOf(addr3.address)).to.equal(1);
  });

  it("should allow owner to reserve", async function () {
    await nft.reserveForGifting(18);
    expect(await nft.balanceOf(owner.address)).to.equal(18);
  });

  it("should not allow owner to reserve more than max reserve supply", async function () {
    await expect(nft.reserveForGifting(201)
    ).to.be.revertedWith("Insufficient token reserve");
    expect(await nft.balanceOf(owner.address)).to.equal(0);
  });

  it("should allow owner to gift directly to same recipients multiple times", async function () {
    await nft.giftTokens(
      ["0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
        "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
        "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
        "0x90F79bf6EB2c4f870365E785982E1f101E93b906"]);
    expect(await nft.balanceOf(addr1.address)).to.equal(5);
    expect(await nft.balanceOf(addr2.address)).to.equal(2);
    expect(await nft.balanceOf(addr3.address)).to.equal(2);
  });
});

describe("Gifting Claimlist", function () {
  var nft;
  var owner, addr1, addr2;

  beforeEach(async function () {
    const NFT = await ethers.getContractFactory("WoahNiceNFT");
    nft = await NFT.deploy("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
    await nft.deployed();

    [owner, addr1, addr2] = await ethers.getSigners();

    const setReserveListMerkleRootTx = await nft.setReserveListMerkleRoot("0x55e8063f883b9381398d8fef6fbae371817e8e4808a33a4145b8e3cdd65e3926");
    // this root is for the addresses
    /*
    [
      "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"
    ]
    */

    await setReserveListMerkleRootTx.wait();
  });

  it("should revert reserve mints when merkle root is valid and payment supplied", async function () {
    await expect(nft.connect(addr1).claim(
      ["0xe9707d0e6171f728f7473c24cc0432a9b07eaaf1efed6a137a4a8c12c79552d9", "0x8a3552d60a98e0ade765adddad0a2e420ca9b1eef5f326ba7ab860bb4ea72c94"], {
      value: web3.utils.toWei('0.02', "ether"),
    })).to.be.reverted;
    expect(await nft.balanceOf(addr1.address)).to.equal(0);
  });

  it("should allow reserve mints when merkle root is valid", async function () {
    await nft.connect(addr1).claim(
      ["0xe9707d0e6171f728f7473c24cc0432a9b07eaaf1efed6a137a4a8c12c79552d9", "0x8a3552d60a98e0ade765adddad0a2e420ca9b1eef5f326ba7ab860bb4ea72c94"]);
    expect(await nft.balanceOf(addr1.address)).to.equal(1);
  });
});