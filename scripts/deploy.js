
const hre = require("hardhat");

async function main() {
  

  // const Contract = await hre.ethers.getContractFactory("Dai");
  // const contract = await Contract.deploy();
  // await contract.deployed();
  // console.log("Greeter deployed to:", contract.address);

     const Contract = await hre.ethers.getContractFactory("superBetContract");
     const contract = await Contract.deploy(3626086);
     await contract.deployed();
     console.log("deployed to:", contract.address);
     await hre.run("fund-link", { contract: contract.address, linkaddress: "0xa36085F69e2889c224210F603D836748e7dC0088" })

}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
