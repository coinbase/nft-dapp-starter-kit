const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");
var Web3 = require("web3");

// "Web3.providers.givenProvider" will be set if in an Ethereum supported browser.
var web3 = new Web3(
  Web3.givenProvider || "ws://some.local-or-remote.node:8546"
);

describe("Basic Sale States", function () {
  var nft;
  var owner, addr1, addr2;
  var provider;

  beforeEach(async function () {
    const NFT = await ethers.getContractFactory("MyNFT");
    nft = await NFT.deploy("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
    await nft.deployed();

    provider = ethers.getDefaultProvider();

    [owner, addr1, addr2] = await ethers.getSigners();
  });

  it("should revert when are sales not open", async function () {
    await expect(nft.mintPublicSale(1)).to.be.revertedWith(
      "Public sale is not open"
    );
    await expect(
      nft.mintPreSale(1, [
        "0x990412edd2f88e7bf0b547c8773ee6e6356c96c3329535a4b07e04b1cc4dcae7",
        "0x2e05dfce34d55cd308a7031e1d6a4a56594bc07b63d19f2e2dbb08b4e825b6c6",
        "0xf8306eb10e0e2dff836a215abecbeee639f873c77ab6a5ce04b7766ca127b202",
        "0xe47d95a65f195092652a3a4c17528a220a42ee4d8828ce0121af9ed4977333b6",
        "0xa92b1393c04a88c19fc7dbecb2c3edf4efee8db903cf52adb76ad7816f53378b",
        "0x42b166ce7eeefe6dabae5595bed0850ce0caeb80e8e827a164e112a2498bd465",
      ])
    ).to.be.revertedWith("Pre sale is not open");
  });

  it("should mint public when public sale open", async function () {
    const setPublicSaleActiveTx = await nft.setPublicSaleActive();
    await setPublicSaleActiveTx.wait(); // wait until the transaction is mined

    const mint = await nft.mintPublicSale(1, {
      value: web3.utils.toWei("0.02", "ether"),
    });
    expect(mint.hash).to.not.be.NaN;
    expect(await nft.balanceOf(owner.address)).to.equal(1);
  });

  it("should be able to mint 5 tokens when public sale open", async function () {
    const setPublicSaleActiveTx = await nft.setPublicSaleActive();
    await setPublicSaleActiveTx.wait(); // wait until the transaction is mined

    const mint = await nft.mintPublicSale(5, {
      value: web3.utils.toWei("0.1", "ether"),
    });
    expect(mint.hash).to.not.be.NaN;
    expect(await nft.balanceOf(owner.address)).to.equal(5);
  });

  it("should revert when attempt to mint with wrong ETH amount", async function () {
    const setPublicSaleActiveTx = await nft.setPublicSaleActive();
    await setPublicSaleActiveTx.wait(); // wait until the transaction is mined

    await expect(
      nft.mintPublicSale(5, {
        value: web3.utils.toWei("0.02", "ether"),
      })
    ).to.be.revertedWith("Incorrect ETH value sent");

    expect(await nft.balanceOf(owner.address)).to.equal(0);
  });

  it("should not be able mint public when public sale is closed", async function () {
    const setPublicSaleActiveTx = await nft.setPublicSaleActive();
    await setPublicSaleActiveTx.wait(); // wait until the transaction is mined

    const mint = await nft.mintPublicSale(1, {
      value: web3.utils.toWei("0.02", "ether"),
    });
    expect(mint.hash).to.not.be.NaN;
    expect(await nft.balanceOf(owner.address)).to.equal(1);

    const setSaleInactiveTx = await nft.setSaleInactive();
    await setSaleInactiveTx.wait(); // wait until the transaction is mined

    await expect(
      nft.mintPublicSale(1, {
        value: web3.utils.toWei("0.02", "ether"),
      })
    ).to.be.revertedWith("Public sale is not open");
  });
});
