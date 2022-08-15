const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");

describe("Withdraw", function () {
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

  it("should be able to withdraw tokens from contract as owner", async function () {
    const ownerBalance = await nft.provider.getBalance(owner.address);

    const tx = await addr1.sendTransaction({
      to: nft.address,
      value: ethers.utils.parseEther("1.0"),
    });
    await tx.wait();

    expect(await nft.provider.getBalance(nft.address)).to.equal(
      ethers.utils.parseEther("1.0")
    );

    const withdrawTx = await nft.connect(owner).withdraw(owner.address);
    await withdrawTx.wait();

    expect(await nft.provider.getBalance(nft.address)).to.equal(
      ethers.utils.parseEther("0")
    );

    const newOwnerBalance = await nft.provider.getBalance(owner.address);

    expect(newOwnerBalance.gt(ownerBalance));
  });

  it("should not be able to withdraw tokens from contract as non-owner", async function () {
    const tx = await addr1.sendTransaction({
      to: nft.address,
      value: ethers.utils.parseEther("1.0"),
    });
    await tx.wait();

    expect(await nft.provider.getBalance(nft.address)).to.equal(
      ethers.utils.parseEther("1.0")
    );

    await expect(nft.connect(addr2).withdraw(addr2.address)).to.be.revertedWith(
      "Ownable: caller is not the owner"
    );
  });

  it("should be able to withdraw ERC20 tokens from contract as owner", async function () {
    const Token = await ethers.getContractFactory("MockToken");

    const mockErc20Token = await Token.deploy();

    expect(await mockErc20Token.balanceOf(nft.address)).to.equal(0);
    await mockErc20Token.transfer(nft.address, 50);

    const ownerBalance = await mockErc20Token.balanceOf(owner.address);

    expect(await mockErc20Token.balanceOf(nft.address)).to.equal(50);

    const withdrawTx = await nft
      .connect(owner)
      .withdrawToken(mockErc20Token.address, owner.address);
    await withdrawTx.wait();

    expect(await mockErc20Token.balanceOf(nft.address)).to.equal(0);

    const newOwnerBalance = await mockErc20Token.balanceOf(owner.address);

    expect(newOwnerBalance.gt(ownerBalance));
  });

  it("should not be able to withdraw ERC20 tokens from contract as non-owner", async function () {
    const Token = await ethers.getContractFactory("MockToken");

    const mockErc20Token = await Token.deploy();

    expect(await mockErc20Token.balanceOf(nft.address)).to.equal(0);
    await mockErc20Token.transfer(nft.address, 50);

    expect(await mockErc20Token.balanceOf(nft.address)).to.equal(50);

    await expect(nft.connect(addr1).withdraw(addr1.address)).to.be.revertedWith(
      "Ownable: caller is not the owner"
    );
  });
});
