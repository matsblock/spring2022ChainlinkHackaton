require("@nomiclabs/hardhat-waffle");

const { expect } = require("chai");
const { ethers } = require("hardhat");

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe("Super Bet Contract Testing", function () {
  this.timeout(1800000);

  let owner;
  let account1;
  let account2;
  let superBetContract;
  let daiContract;

  before(async function () {
    [owner, account1, account2] = await ethers.getSigners();
    console.log("Owner:", owner.address);
    console.log("Account 1:", account1.address);
    console.log("Account 2:", account2.address);

    const DaiContract = await ethers.getContractFactory('Dai');
    daiContract = DaiContract.attach("0xeE609996ac3821499aEED5C57f3F7507D0bdC481");

    const SuperBetContract = await hre.ethers.getContractFactory("superBetContract");
    superBetContract = await SuperBetContract.deploy(3626086);
    await superBetContract.deployed();
    console.log("Deployed to:", superBetContract.address);
    await hre.run("fund-link", { contract: superBetContract.address, linkaddress: "0xa36085F69e2889c224210F603D836748e7dC0088" })

  });

  describe("Account 2 must claim correct rewards", function () {
    it("Should set the right owner", async function () {
      expect(await superBetContract.owner()).to.equal(owner.address);
    });

    it("Set Bets", async function () {
      await daiContract.connect(account1).approve(superBetContract.address, 100000000000000000000n);
      await superBetContract.connect(account1).setBet(0, 100000000000000000000n);
      await sleep(5000);
      await daiContract.connect(account2).approve(superBetContract.address, 100000000000000000000n);
      await superBetContract.connect(account2).setBet(1, 100000000000000000000n);
      await superBetContract.connect(owner).closeBet();
      const _totalBetsBalance = await superBetContract.connect(owner).totalBetsBalance()
      expect(ethers.utils.formatEther(_totalBetsBalance)).to.equal("200.0");
    });

    it("Get Winner as Away (1)", async function () {
      await superBetContract.requestGameDetails();
      await superBetContract.requestGameScore();
      await sleep(30000); //Must wait that oracle use fullfill scoreAsString function 
      await superBetContract.gameScoreAsString();
      await superBetContract.gameDetailsAsString();
      await superBetContract.getWinner()
      expect(await superBetContract.winner()).to.equal(1);
    });

    it("Account 2 must claim rewards", async function () {

      const account2BalanceBefore = await daiContract.connect(account2).balanceOf(account2.address);
      const _account2BalanceBefore = ethers.utils.formatEther(account2BalanceBefore);
      await superBetContract.connect(account2).claimRewards()
      await sleep(10000);
      const account2BalanceAfter = await daiContract.connect(account2).balanceOf(account2.address);
      const _account2BalanceAfter = ethers.utils.formatEther(account2BalanceAfter);
      expect(_account2BalanceAfter-_account2BalanceBefore).to.equal(200)
    });
  });

});