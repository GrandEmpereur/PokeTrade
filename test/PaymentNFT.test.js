const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PaymentNFT", function () {
  let paymentNFT, owner, user;

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();
    const PaymentNFT = await ethers.getContractFactory("PaymentNFT");
    paymentNFT = await PaymentNFT.deploy();
    await paymentNFT.waitForDeployment();    
  });

  it("should mint an NFT upon payment", async function () {
    const initialTokenId = await paymentNFT.tokenIdCounter();
    const payAmount = ethers.parseEther("0.1");

    await paymentNFT.connect(user).payAndMint({ value: payAmount });
    const newOwner = await paymentNFT.ownerOf(initialTokenId);
    expect(newOwner).to.equal(user.address);

    const updatedTokenId = await paymentNFT.tokenIdCounter();
    expect(updatedTokenId).to.equal(initialTokenId + 1n);
  });

  it("should revert if no Ether is sent", async function () {
    await expect(
      paymentNFT.connect(user).payAndMint()
    ).to.be.revertedWith("Must send some ether");
  });

  it("should let the owner withdraw funds (simplified)", async function () {
    const payAmount = ethers.parseEther("0.1");

    await paymentNFT.connect(user).payAndMint({ value: payAmount });
    const contractBalanceBefore = await ethers.provider.getBalance(paymentNFT.target);
    expect(contractBalanceBefore).to.equal(payAmount);

    const ownerBalanceBefore = await ethers.provider.getBalance(owner.address);

    await paymentNFT.connect(owner).withdraw();

    const contractBalanceAfter = await ethers.provider.getBalance(paymentNFT.target);
    expect(contractBalanceAfter).to.equal(0n);

    const ownerBalanceAfter = await ethers.provider.getBalance(owner.address);

    expect(ownerBalanceAfter).to.be.gt(ownerBalanceBefore);
  });
});
