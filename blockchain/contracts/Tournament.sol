// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "./Owned.sol";

contract Tournament is Owned{

    struct tournamentData {
        address winner;
        uint stake;
        uint balance;
        uint createdAt;
        uint duration;
    }

    mapping(string => bool) public isTournament;
    mapping(string => mapping(address => bool)) public isTournamentPlayer;
    mapping(string => tournamentData) public tournaments;
    mapping(string => uint) public remainingSlots;

    event addedTournament(string indexed tournament);

    modifier onlyWinner(string calldata tournament) {
        require(
            msg.sender == tournaments[tournament].winner,
            'You are not the winner'
        );
        _;
    }

    modifier timeElapsed(string calldata tournament) {
        require(
            isTournamentPlayer[tournament][msg.sender]
            && tournaments[tournament].winner == address(0)
            && block.timestamp > tournaments[tournament].createdAt + tournaments[tournament].duration,
            'Can not withdraw stake'
        );
        _;
    }

    modifier canJoin(string calldata tournament) {
        require(
            msg.value >= tournaments[tournament].stake
            && isTournament[tournament]
            && !isTournamentPlayer[tournament][msg.sender],
            'Can not join tournament'
        );
        _;
    }

    function addTournament(string calldata tournament, uint stake, uint duration, uint numberOfPlayers) external onlyOwner returns(bool){
        tournamentData memory newTournament = tournamentData({
            winner: address(0),
            stake: stake,
            balance: 0,
            createdAt: block.timestamp,
            duration: duration
        });
        tournaments[tournament] = newTournament;
        isTournament[tournament] = true;
        remainingSlots[tournament] = numberOfPlayers;

        emit addedTournament(tournament);
        return true;
    }

    function joinTournament(string calldata tournament) external payable canJoin(tournament) returns(bool) {
        uint slots = remainingSlots[tournament];
        require(slots > 0, 'Tournament has complete players');
        remainingSlots[tournament] = slots - 1;
        isTournamentPlayer[tournament][msg.sender] = true;
        tournaments[tournament].balance = tournaments[tournament].balance + (msg.value/10 * 9);
        payable(Owned.owner).transfer(msg.value/10);

        return true;
    }

    function setWinner(string calldata tournament, address winner) external onlyOwner {
        tournaments[tournament].winner = winner;
    }

    function withdrawStake(string calldata tournament) external timeElapsed(tournament) returns(bool) {
        uint stake = (tournaments[tournament].stake/10 * 9);
        uint balance = tournaments[tournament].balance;
        require(balance >= stake, 'Not enough funds in tournament wallet');
        tournaments[tournament].balance = balance - stake;
        payable(msg.sender).transfer(stake);
        return true;
    }

    function withdrawPrize(string calldata tournament) external onlyWinner(tournament) returns(bool) {
        uint balance = tournaments[tournament].balance;
        tournaments[tournament].balance = 0;
        payable(msg.sender).transfer(balance);
        return true;
    }
    
}