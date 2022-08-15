const { expect } = require("chai");
const { ethers } = require("hardhat");
var Web3 = require("web3");

// "Web3.providers.givenProvider" will be set if in an Ethereum supported browser.
var web3 = new Web3(
  Web3.givenProvider || "ws://some.local-or-remote.node:8546"
);

describe("Presale States", function () {
  var nft;
  var owner, addr1, addr2;

  beforeEach(async function () {
    const NFT = await ethers.getContractFactory("MyNFT");
    nft = await NFT.deploy("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
    await nft.deployed();

    [owner, addr1, addr2] = await ethers.getSigners();

    const setPresaleActiveTx = await nft.setPreSaleActive();
    await setPresaleActiveTx.wait(); // wait until the transaction is mined
  });

  it("should revert claimlist when merkle root not set", async function () {
    await expect(
      nft.mintPreSale(
        1,
        ["0x9c39b56a71aedee8ec80f1e501e0e047d683b89cd554178b8af43574e1ebda82"],
        {
          value: web3.utils.toWei("0.01", "ether"),
        }
      )
    ).to.be.revertedWith("Address not in list");

    expect(await nft.balanceOf(owner.address)).to.equal(0);
  });
});

describe("Claimlist merkle tests", function () {
  var nft;
  var owner, addr1, addr2;

  beforeEach(async function () {
    const NFT = await ethers.getContractFactory("MyNFT");
    nft = await NFT.deploy("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
    await nft.deployed();

    [owner, addr1, addr2] = await ethers.getSigners();

    const setPresaleActiveTx = await nft.setPreSaleActive();
    await setPresaleActiveTx.wait(); // wait until the transaction is mined

    const setPreSaleListMerkleRootTx = await nft.setPreSaleListMerkleRoot(
      "0x55e8063f883b9381398d8fef6fbae371817e8e4808a33a4145b8e3cdd65e3926"
    );
    // this root is for the addresses
    /*
    [
      "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"
    ]
    */

    await setPreSaleListMerkleRootTx.wait();
  });

  it("should not allow claimlist mints when merkle root is invalid", async function () {
    await expect(
      nft
        .connect(addr1)
        .mintPreSale(
          1,
          [
            "0xbc4d3a93ded892ed8e707d440a5188e24517559f366fa238dcf90ed0dac9e6a3",
          ],
          {
            value: web3.utils.toWei("0.01", "ether"),
          }
        )
    ).to.be.revertedWith("Address not in list");
    expect(await nft.balanceOf(addr1.address)).to.equal(0);
  });

  it("should allow claimlist mints when merkle root is valid", async function () {
    const mint = await nft
      .connect(addr1)
      .mintPreSale(
        1,
        [
          "0xe9707d0e6171f728f7473c24cc0432a9b07eaaf1efed6a137a4a8c12c79552d9",
          "0x8a3552d60a98e0ade765adddad0a2e420ca9b1eef5f326ba7ab860bb4ea72c94",
        ],
        {
          value: web3.utils.toWei("0.01", "ether"),
        }
      );
    expect(mint.hash).to.not.be.NaN;
  });

  it("should revert claimlist mint when msg.sender does not match merkle root", async function () {
    await expect(
      nft
        .connect(addr2)
        .mintPreSale(
          1,
          [
            "0xe9707d0e6171f728f7473c24cc0432a9b07eaaf1efed6a137a4a8c12c79552d9",
            "0x8a3552d60a98e0ade765adddad0a2e420ca9b1eef5f326ba7ab860bb4ea72c94",
          ],
          {
            value: web3.utils.toWei("0.01", "ether"),
          }
        )
    ).to.be.revertedWith("Address not in list");
  });

  it("should not allow double claimlist mints when merkle root is valid", async function () {
    const mint = await nft
      .connect(addr1)
      .mintPreSale(
        3,
        [
          "0xe9707d0e6171f728f7473c24cc0432a9b07eaaf1efed6a137a4a8c12c79552d9",
          "0x8a3552d60a98e0ade765adddad0a2e420ca9b1eef5f326ba7ab860bb4ea72c94",
        ],
        {
          value: web3.utils.toWei("0.03", "ether"),
        }
      );
    expect(mint.hash).to.not.be.NaN;

    await expect(
      nft
        .connect(addr1)
        .mintPreSale(
          1,
          [
            "0xe9707d0e6171f728f7473c24cc0432a9b07eaaf1efed6a137a4a8c12c79552d9",
            "0x8a3552d60a98e0ade765adddad0a2e420ca9b1eef5f326ba7ab860bb4ea72c94",
          ],
          {
            value: web3.utils.toWei("0.01", "ether"),
          }
        )
    ).to.be.revertedWith("Exceeds pre sale mint max number");
  });

  it("should revert mint when eth price is incorrect", async function () {
    await expect(
      nft
        .connect(addr1)
        .mintPreSale(
          1,
          [
            "0xe9707d0e6171f728f7473c24cc0432a9b07eaaf1efed6a137a4a8c12c79552d9",
            "0x8a3552d60a98e0ade765adddad0a2e420ca9b1eef5f326ba7ab860bb4ea72c94",
          ],
          {
            value: web3.utils.toWei("0.05", "ether"),
          }
        )
    ).to.be.revertedWith("Incorrect ETH value sent");
  });

  it("should allow all claimlist holders to mint", async function () {
    await nft
      .connect(addr1)
      .mintPreSale(
        3,
        [
          "0xe9707d0e6171f728f7473c24cc0432a9b07eaaf1efed6a137a4a8c12c79552d9",
          "0x8a3552d60a98e0ade765adddad0a2e420ca9b1eef5f326ba7ab860bb4ea72c94",
        ],
        {
          value: web3.utils.toWei("0.03", "ether"),
        }
      );

    await nft
      .connect(addr2)
      .mintPreSale(
        3,
        ["0x070e8db97b197cc0e4a1790c5e6c3667bab32d733db7f815fbe84f5824c7168d"],
        {
          value: web3.utils.toWei("0.03", "ether"),
        }
      );

    await expect(
      nft
        .connect(addr1)
        .mintPreSale(
          1,
          [
            "0xe9707d0e6171f728f7473c24cc0432a9b07eaaf1efed6a137a4a8c12c79552d9",
            "0x8a3552d60a98e0ade765adddad0a2e420ca9b1eef5f326ba7ab860bb4ea72c94",
          ],
          {
            value: web3.utils.toWei("0.01", "ether"),
          }
        )
    ).to.be.revertedWith("Exceeds pre sale mint max number");

    await expect(
      nft
        .connect(addr2)
        .mintPreSale(
          1,
          [
            "0x070e8db97b197cc0e4a1790c5e6c3667bab32d733db7f815fbe84f5824c7168d",
          ],
          {
            value: web3.utils.toWei("0.01", "ether"),
          }
        )
    ).to.be.revertedWith("Exceeds pre sale mint max number");
  });
});

describe("Presale integration tests", function () {
  var nft;
  var owner, addr1, addr2, addr3, addr4;

  beforeEach(async function () {
    const NFT = await ethers.getContractFactory("MyNFT");
    nft = await NFT.deploy("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
    await nft.deployed();

    [owner, addr1, addr2, addr3, addr4] = await ethers.getSigners();

    const setPresaleActiveTx = await nft.setPreSaleActive();
    await setPresaleActiveTx.wait(); // wait until the transaction is mined

    const setPreSaleListMerkleRootTx = await nft.setPreSaleListMerkleRoot(
      "0x55e8063f883b9381398d8fef6fbae371817e8e4808a33a4145b8e3cdd65e3926"
    );
    /* claimlist
    [
      "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"
    ]
    */
    await setPreSaleListMerkleRootTx.wait();
  });

  it("should not allow presale mints when proofs are mixed up", async function () {
    // addr3 is in claimlist
    await expect(
      nft
        .connect(addr3)
        .mintPreSale(
          1,
          [
            "0xf4ca8532861558e29f9858a3804245bb30f0303cc71e4192e41546237b6ce58b",
          ],
          {
            value: web3.utils.toWei("0.01", "ether"),
          }
        )
    ).to.be.revertedWith("Address not in list");
    expect(await nft.balanceOf(addr3.address)).to.equal(0);
  });
});
