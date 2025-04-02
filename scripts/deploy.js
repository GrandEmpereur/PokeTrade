const hre = require("hardhat");

async function main() {
  const PaymentNFT = await hre.ethers.getContractFactory("PaymentNFT");
  const paymentNFT = await PaymentNFT.deploy();
  await paymentNFT.deployed();

  console.log("PaymentNFT deployed to:", paymentNFT.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});