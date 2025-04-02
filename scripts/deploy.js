const hre = require("hardhat");

async function main() {
  const PaymentNFT = await hre.ethers.getContractFactory("PaymentNFT");
  const paymentNFT = await PaymentNFT.deploy();

  await paymentNFT.waitForDeployment();
  const deployedAddress = await paymentNFT.getAddress();
  console.log("PaymentNFT deployed to:", deployedAddress);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
