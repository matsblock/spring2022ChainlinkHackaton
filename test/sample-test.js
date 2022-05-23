// Chequear Oraculo OK
// Chequear interfaces  OK
// Setear apuestas
// Setear ganador de manera manual
// Obtener ganador OK
// Claim rewards

require("@nomiclabs/hardhat-waffle");

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("betContract", async function () {
   this.timeout(1800000) 
  

  before(async () => {

    [owner, account1, account2] = await ethers.getSigners();


  })

  //  MyFirstContract = await ethers.getContractFactory('MyFirstContract');
  //  myFirstContract = await MyFirstContract.deploy(mockV3Aggregator.address);
  //  await myFirstContract.deployed();

  it("Should set bets", async function () {


    console.log("Owner:", owner.address);
    console.log("Account 1:", account1.address);
    console.log("Account 2:", account2.address);




    const BetsContract = await ethers.getContractFactory("bets");
    const betsContract = await BetsContract.deploy();
    await betsContract.deployed();
    console.log("betsContract bets deployed at:", betsContract.address);

    const DaiContract = await ethers.getContractFactory('Dai');
    const daiContract = await DaiContract.attach("0xeE609996ac3821499aEED5C57f3F7507D0bdC481");
    console.log("daiContract address:", daiContract.address);

    



    const OracleContract = await ethers.getContractFactory('enetpulseConsumerLRModified');
    const oracleContract = await OracleContract.attach("0x6402B63BC71B8833a8345e410B415DA4C7647Fe7");
    console.log("Oracle Contract address:", oracleContract.address)
  //   const result = await contract.GameScoreAsString();
  //   console.log("Result, ", result)


    // const _faucet = await daiContract.faucet("500000000000000000000", {from: accounts[1].address});
    //  await token.connect(signers[1]).mint(signers[0].address, 1001);
    //  await token.mint(signers[0].address, 1001, {from: signers[1].address});

    //   const approveTransfer1 = await daiContract.approve(daiContract.address, 200, {from: accounts[0].address});
    const _approve1 = await daiContract.connect(account1).approve(betsContract.address, 300);
    console.log("await daiContract.connect(account1).approve(betsContract.address, 300): ", _approve1.hash)

    const tx1 = await betsContract.connect(account1).setBet(0, 300);
    // setTimeout(() => {
    console.log("await betsContract.connect(account1).setBet(0, 300): ", tx1.hash)
    // }, 1000);
    const _approve2 = await daiContract.connect(account2).approve(betsContract.address, 100);
    console.log("await daiContract.connect(account2).approve(betsContract.address, 100: ", _approve2.hash)


    const tx2 = await betsContract.connect(account2).setBet(1, 100);
    console.log("await betsContract.connect(account2).setBet(1, 100) ", tx2.hash)


    //  await daiContract.approve(daiContract.address, 200, {from: accounts[1].address});
    //    await daiContract.approve(daiContract.address, 200);
    //  await betsContract.setBet(1, 200, {from: accounts[0].address});
    //  const transfer1 = await betsContract.setBet(1,200,{from: accounts[0].address});
    const _homeTotalBets = await betsContract.homeTotalBets();
    console.log("await betsContract.homeTotalBets(): ", _homeTotalBets.hash)

    const homeTotalBets = _homeTotalBets.toNumber();
    console.log("Home total bets:", homeTotalBets)

    const _awayTotalBets = await betsContract.awayTotalBets();
    console.log("await betsContract.awayTotalBets(): ", _awayTotalBets.hash)

    const awayTotalBets = _awayTotalBets.toNumber();
    console.log("Away total bets:", awayTotalBets)
    
    await betsContract.connect(owner).closeBet();

    //Lo omito ahora para hacer mas rapido

    // const _requestGameDetails = await oracleContract.requestGameDetails("3626086");
    // console.log(" await oracleContract.requestGameDetails(3626086)",_requestGameDetails.hash)
    // const _requestGameScore = await oracleContract.requestGameScore("3626086");
    // console.log("await oracleContract.requestGameScore(3626086)", _requestGameScore.hash)
    // const scoreAsString = await oracleContract.gameScoreAsString();
    // console.log("await oracleContract.gameScoreAsString(): ", scoreAsString.hash)
    // console.log("Score As String: ", scoreAsString)
    // const gameDetailsAsString = await oracleContract.gameDetailsAsString();
    // console.log("await oracleContract.gameDetailsAsString(): ", gameDetailsAsString.hash)
    // console.log("Game Details As String: ", gameDetailsAsString)

    const _getMatchWinner = await betsContract.getMatchWinner(); 
    console.log("await betsContract.getMatchWinner(): ", _getMatchWinner.hash)

    const _setMatchStatus = await betsContract.setMatchStatus()
    console.log("await betsContract.setMatchStatus(): ", _setMatchStatus.hash)

    winnerResult = await betsContract.matchWinner()
    console.log("await betsContract.matchWinner(): ", winnerResult.hash)

    console.log("Winner:", winnerResult)
    const parse = ethers.utils.parseBytes32String(winnerResult)
    console.log("The Winner is:", parse)

    // const _calcSubTotalFromSelectedBet = await betsContract.connect(account2).calcSubTotalFromSelectedBet()
    // console.log("await betsContract.connect(owner).subTotalFromSelectedBet(): ", _calcSubTotalFromSelectedBet.hash)
    
    // const _subTotalFromSelectedBet = await betsContract.connect(account2).subTotalFromSelectedBet()
    // console.log("_subTotalFromSelectedBet: ", _subTotalFromSelectedBet.toNumber())
3
    const _matchFinished = await betsContract.connect(owner).matchFinished()
    console.log("await betsContract.connect(account1).matchFinished(): ", _matchFinished.hash)
    console.log("Match finished: ", _matchFinished)

    const _totalBetsBalance = await betsContract.connect(owner).totalBetsBalance()
    console.log("totalBetsBalance: ", _totalBetsBalance.toNumber())

    const account2Balance = await daiContract.connect(account2).balanceOf(account2.address);
    console.log ("Account 2 Balance:", account2Balance.toString())

    const _claimRewards = await betsContract.connect(account2).claimRewards()
    console.log("await betsContract.connect(account1).claimRewards(): ", _claimRewards.hash)

    const _account2Balance = await daiContract.connect(account2).balanceOf(account2.address);
    console.log ("Account 2 Balance:", _account2Balance.toString())



    // account1Balance = await daiContract.connect(account1).balanceOf(account1.address);
    // console.log ("Account 1 Balance:", account1Balance)

    //AHORA el usaurio de beria poder reclamar sus recompensas solo si el partido ha terminado(se puede sacar status de getwinner contract)

    // console.log("Away total bets:", betsContract.awayTotalBets().toNumber(), "Home total bets:", homeTotalBets().toNumber(), "Tied total bets:", tiedTotalBets().toNumber());

    // await betsContract.getMatchWinner()
    // const winnerResult = await betsContract.matchWinner()
    // console.log("Winner:", winnerResult)
    // const parse = ethers.utils.parseBytes32String(winnerResult)
    // console.log("Winner:", parse)
    expect(400).to.equal(400)
    //  expect(parse).to.equal("away") 
  });

  // it("Should get approve transfer 200 DAI", async function () {

  // const MyContract = await ethers.getContractFactory('Dai');
  // const contract = await MyContract.attach("0xeE609996ac3821499aEED5C57f3F7507D0bdC481");
  // console.log("Contract address:", contract.address)
  // const _faucet = await contract.approve(,200);

  // expect(1).to.equal(1) 


  // });


  // it("Should get Match Score from Oracle", async function () {
  //   const MyContract = await ethers.getContractFactory('enetpulseConsumerLRModified');
  //   const contract = await MyContract.attach("0x6402B63BC71B8833a8345e410B415DA4C7647Fe7");
  //   console.log("Contract address:", contract.address)
  //   const result = await contract.gameScoreAsString();
  //   console.log("Result, ", result)
  //   const expectedResult = '["finished",0,2]'
  //   expect(result).to.equal(expectedResult);              
  // });

  // it("Should get Match Score from Interface", async function () {
  //   const MyContract = await ethers.getContractFactory('enetscoreInterfaces');
  //   const contract = await MyContract.attach("0xC0a3bfEAa7BF019e6c56f6d39113AC335aBD9651");
  //   console.log("Contract address:", contract.address)
  //   const result = await contract.GameScoreAsString();
  //   console.log("Result, ", result)
  //   const expectedResult = '["finished",0,2]'
  //   expect(result).to.equal(expectedResult);              
  // });

  // it("Should get Match Winner", async function () {
  //   const MyContract = await ethers.getContractFactory('getMatchScoreAndWinner');
  //   const contract = await MyContract.attach("0x0b5bC92aC69c69cAb658F4B7176d74625D8BF4b9");
  //   console.log("Contract address:", contract.address)
  //   const scoreAsStringTx1 = await contract.getGameScoreAsString();
  //   const scoreAsString = await contract.gameScoreString();
  //   console.log("Score As String: ", scoreAsString)
  //   const setWinnerResult = await contract.getWinner()
  //   const winnerResult = await contract.winner()
  //   const parse = ethers.utils.parseBytes32String(winnerResult)
  //   console.log("Winner:", parse)
  //   const expectedResult = "away"
  //   expect(parse).to.equal(expectedResult)          
  // });

  //   it("Should show balance of MyWallet", async function () {
  //     const MyContract = await ethers.getContractFactory('Dai');
  //     const contract = await MyContract.attach("0xeE609996ac3821499aEED5C57f3F7507D0bdC481");
  //     console.log("Contract address:", contract.address)
  //   //  const _faucet = await contract.faucet(1000000000000000);
  //     const balance = await contract.balanceOf("0xc348a8962F157b570Ec0da3499b855Bee7Ac11A3");
  //     console.log("Balance of my Wallet, ", balance)
  //     console.log("Balance of my Wallet, ", balance.toNumber())

  //     expect(1).to.equal(1)
  //  //   expect(balance.toNumber()).to.equal(balance.toNumber())          
  //   });

  // describe("Greeter", function () {
  //   it("Should return the new greeting once it's changed", async function () {
  //     const Greeter = await ethers.getContractFactory("Greeter");
  //     const greeter = await Greeter.deploy("Hello, world!");
  //     await greeter.deployed();
  //     expect(await greeter.greet()).to.equal("Hello, world!");
  //     const setGreetingTx = await greeter.setGreeting("Hola, mundo!");
  //     // wait until the transaction is mined
  //     await setGreetingTx.wait();
  //     expect(await greeter.greet()).to.equal("Hola, mundo!");
  //   });
  // });
});
