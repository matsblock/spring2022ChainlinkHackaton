//SPDX-License-Identifier: Unlicense

pragma solidity 0.8.9;

//First, send link to the contract. 0.1 LINK fee
/**
 * Supported `leagueId`
 * --------------------
 * 873678 - EPL
 * 874017 - Ligue 1
 * 874068 - Liga
 * 874287 - Serie A
 * 874006 - Bundesliga

 Example request Schedule

 Ligue 1: 874017
 date: 2022-03-06
 gamesID: [3626086,3626088,3626090,3626091,3626093,3626094,3626095]
 */
 
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";

contract enetpulseConsumerLRModified is ChainlinkClient {
    using Chainlink for Chainlink.Request;

    /* ========== CONSUMER STATE VARIABLES ========== */

    // Schedule
    bytes public schedule;
    string public scheduleAsString;

    // Game Details
    bytes public gameDetails;
    string public gameDetailsAsString;

    // Game Score
    bytes public gameScore;
    string public gameScoreAsString;

    // Maps <RequestId, Result>
    mapping(bytes32 => bytes) public requestIdData;
    mapping(bytes32 => string) public requestIdDataAsString;

    /* ========== CONSTRUCTOR ========== */

      constructor () {
        address _link;
        address _oracle;
        _link = 0xa36085F69e2889c224210F603D836748e7dC0088;
        _oracle = 0xfF07C97631Ff3bAb5e5e5660Cdf47AdEd8D4d4Fd;
        setChainlinkToken(_link);
        setChainlinkOracle(_oracle);
    }

    function requestSchedule( 
        uint256 _leagueId,
        string memory _date
    ) public {

        bytes32 _jobId = 0x6533386464626433333132343466333239366665373561653565636165306132;
        uint256 _payment = 100000000000000000;

        Chainlink.Request memory req = buildChainlinkRequest(_jobId, address(this), this.fulfillSchedule.selector);

        req.add("endpoint", "schedule");
        req.addUint("leagueId", _leagueId);
        req.add("date", _date);

        sendChainlinkRequest(req, _payment);
    }

    function requestGameDetails(
        uint256 _gameId
    ) public {
        bytes32 _jobId = 0x3435656538643863393665643461633062353538616138383933393465646239;
        uint256 _payment = 100000000000000000;
        Chainlink.Request memory req = buildChainlinkRequest(_jobId, address(this), this.fulfillGameDetails.selector);

        req.add("endpoint", "game-details");
        req.addUint("gameId", _gameId);
        req.add("as_large_response", "true");

        sendChainlinkRequest(req, _payment);
    }

    function requestGameScore(
        uint256 _gameId
    ) public {
        bytes32 _jobId = 0x3761316164653537633035663439663162643563323532343161636462313037;
        uint256 _payment = 100000000000000000;
        Chainlink.Request memory req = buildChainlinkRequest(_jobId, address(this), this.fulfillGameScore.selector);

        req.add("endpoint", "game-score");
        req.addUint("gameId", _gameId);
        req.add("as_large_response", "true");

        sendChainlinkRequest(req, _payment);
    }

    function fulfillSchedule(bytes32 _requestId, bytes memory _schedule) public recordChainlinkFulfillment(_requestId) {
        schedule = _schedule;
        scheduleAsString = string(_schedule);

        requestIdData[_requestId] = schedule;
        requestIdDataAsString[_requestId] = scheduleAsString;
    }

    function fulfillGameDetails(bytes32 _requestId, bytes memory _gameDetails)
        public
        recordChainlinkFulfillment(_requestId)
    {
        gameDetails = _gameDetails;
        gameDetailsAsString = string(_gameDetails);

        requestIdData[_requestId] = gameDetails;
        requestIdDataAsString[_requestId] = gameDetailsAsString;
    }

    function fulfillGameScore(bytes32 _requestId, bytes memory _gameScore)
        public
        recordChainlinkFulfillment(_requestId)
    {
        gameScore = _gameScore;
        gameScoreAsString = string(_gameScore);

        requestIdData[_requestId] = gameScore;
        requestIdDataAsString[_requestId] = gameScoreAsString;
    }

    function getOracleAddress() external view returns (address) {
        return chainlinkOracleAddress();
    }

    function setOracle(address _oracle) external {
        setChainlinkOracle(_oracle);
    }

    function withdrawLink() public {
        LinkTokenInterface linkToken = LinkTokenInterface(chainlinkTokenAddress());
        require(linkToken.transfer(msg.sender, linkToken.balanceOf(address(this))), "Unable to transfer");
    }
}
