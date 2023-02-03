const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require('web3');
const config = require('config');
const tournamentJSON = require('../abis/Tournament.json');

const mnemonic = config.get("MNEMONIC");
const infura = config.get("INFURA_URI");

let web3;
let accounts;
let networkId;
let tournamentContract;

const getWeb3 = () => {
    //const provider = new Web3.providers.HttpProvider("http://127.0.0.1:7545");
    const provider = new HDWalletProvider({
        mnemonic: mnemonic,
        providerOrUrl: infura,
        addressIndex: 0
    });
    web3 = new Web3(provider);
}

const connectContract = async() => {
    getWeb3();
    accounts = await web3.eth.getAccounts();
    networkId = await web3.eth.net.getId();
    tournamentContract = new web3.eth.Contract(
        tournamentJSON.abi,
        tournamentJSON.networks[networkId] && tournamentJSON.networks[networkId].address,
    );
    console.log('Contract connected');
    /*    tournamentContract.events.addedTournament({}).on('data', function(event){
        updateContractStatus(event.returnValues.tournament);
    });
    tournamentContract.events.joinedTournament({}).on('data', function(event){
        updatePlayersList(event.returnValues.tournament, event.returnValues.player);
    });*/
}


const addTournament = async(tournament, stake, duration, numberOfPlayers, updateContractStatus) => {
    try{
        const stakeToWei = web3.utils.toWei(`${stake}`,"ether");
        const receipt = await tournamentContract.methods.addTournament(tournament, stakeToWei, (duration*24*60*60), numberOfPlayers).send({from: accounts[0], gas: 2000000});
        if (receipt.status) {
            updateContractStatus(tournament);
        }
    }
    catch (err){
        console.log(err);
    }
}

const setWinner = async(tournament, winner) => {
    try{
        const receipt = await tournamentContract.methods.setWinner(tournament, winner).send({from: accounts[0]});
    }
    catch (err){
        console.log(err);
    }
}


const verifyTournamentPlayer = (tournament, address, updatePlayersList) => {
    // isPlayer._method.constant;
    tournamentContract.methods.isTournamentPlayer(tournament, address).call({from: accounts[0]}, function(error, result){
        if (error) {
            console.log(error);
        }
        if (result) {
            updatePlayersList(tournament, address);
        }
    });
    return true;
}

module.exports = {
    connectContract,
    addTournament,
    setWinner,
    verifyTournamentPlayer
};