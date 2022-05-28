//  SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./Dai.sol";
import "./enetscoreInterfaces.sol";
import "./getMatchScoreAndWinner.sol";

contract bets {
    address public owner;
    address tokenAddress = 0xeE609996ac3821499aEED5C57f3F7507D0bdC481;
    //    Dai DaiContract = Dai(tokenAddress);

    //     address enetScoreInterfacesAddress = 0xC0a3bfEAa7BF019e6c56f6d39113AC335aBD9651;
    //     enetscoreInterfaces enetscoreInterfacesContract  = enetscoreInterfaces(enetScoreInterfacesAddress);
    address getMatchScoreAndWinnerAddress =
        0x0b5bC92aC69c69cAb658F4B7176d74625D8BF4b9;
    getMatchScoreAndWinner getMatchScoreAndWinnerContract =
        getMatchScoreAndWinner(getMatchScoreAndWinnerAddress);

    bytes32 public matchWinner;
    bytes32 public _home = "home";
    bytes32 public _away = "away";
    bytes32 public _tied = "tied";

    enum betOption {
        home,
        away,
        tied
    }
    //     enum winnerResultEnum {Home, Away, Tied}
    struct bet {
        betOption option;
        uint256 amount;
    }
    mapping(address => bet) public betBalances;
    uint256 public awayTotalBets;
    uint256 public homeTotalBets;
    uint256 public tiedTotalBets;
    uint256 public totalBetsBalance;

    bool public betOpen = true;

    uint256 public subTotalFromSelectedBet;

    //     bet public winner;
    //     string public gameDetailsString;
    //     string public gameScoreString;

    //     winnerResultEnum public matchWinner;
    bool public matchFinished = false;

    //     string public quiengano;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "only owner");
        _;
    }

    function setBet(betOption _bet, uint256 _amount) public {
        require(betOpen == true);
        betBalances[msg.sender].amount += _amount;
        betBalances[msg.sender].option = _bet;
        totalBetsBalance += _amount;
        if (_bet == betOption.home) {
            homeTotalBets += _amount;
            IERC20(tokenAddress).transferFrom(
                msg.sender,
                address(this),
                _amount
            );
        }
        if (_bet == betOption.away) {
            awayTotalBets += _amount;
            IERC20(tokenAddress).transferFrom(
                msg.sender,
                address(this),
                _amount
            );
        }
        if (_bet == betOption.tied) {
            tiedTotalBets += _amount;
            IERC20(tokenAddress).transferFrom(
                msg.sender,
                address(this),
                _amount
            );
        }
    }

    function calcSubTotalFromSelectedBet() public {
        subTotalFromSelectedBet = 333;
    }

    function claimRewards() public {
        // require(matchFinished == true, "matchFinished !=true ");
        uint256 rewards;
        rewards =100;

        if (
            matchWinner == _home &&
            betBalances[msg.sender].option == betOption.home
        ) {
            subTotalFromSelectedBet = homeTotalBets;
        }
        if (
            matchWinner == _away &&
            betBalances[msg.sender].option == betOption.away
        ) {
            subTotalFromSelectedBet = awayTotalBets;
        }
        if (
            matchWinner == _tied &&
            betBalances[msg.sender].option == betOption.tied
        ) {
            subTotalFromSelectedBet = tiedTotalBets;
        }

        rewards =
            (totalBetsBalance * betBalances[msg.sender].amount * 100) /
            subTotalFromSelectedBet;
            
       IERC20(tokenAddress).transfer(msg.sender, rewards / 100);
    }

    function closeBet() public {
        betOpen = false;
    }

    function setMatchStatus() public {
        matchFinished = true;
    }

    //     function withdrawBetRewards(
    //         uint amount)
    //         public {
    //         IERC20(tokenAddress).transfer(msg.sender, amount);
    //     }

    //     function setWinner(winnerResultEnum _winner) public {
    //         winner.option = _winner;
    //     }

    //     // function setScore() public {
    //     //     getMatchScoreAndWinnerContract.getGameScoreAsString();
    //     // }

    function getMatchWinner() public {
        matchWinner = getMatchScoreAndWinnerContract.getWinner();
    }

    //     function getWinnerPrint() public {
    //         if (matchWinner == winnerResultEnum.Home) {
    //             quiengano = "gano el local";
    //         } else if (matchWinner == winnerResultEnum.Away) {
    //             quiengano = "gano el visitante";
    //         } else if (matchWinner == winnerResultEnum.Tied) {
    //             quiengano = "empate";
    //         }
    //     }

    //     function getMatchStatus() public {
    //             matchStatus = getMatchScoreAndWinnerContract.status();
    //     }

    //     function getGameDetailsAsString() public {
    //          gameDetailsString = enetscoreInterfacesContract.gameDetailsAsString();
    //     }

    //     function getGameScoreAsString() public {
    //           gameScoreString = enetscoreInterfacesContract.GameScoreAsString();
    //     }
}
