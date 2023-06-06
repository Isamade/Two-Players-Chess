import { createRequire } from "module";
const require = createRequire(import.meta.url);
import HDWalletProvider from "@truffle/hdwallet-provider";
import Web3 from 'web3';
//import { abi, networks } from '../abis/Tournament.json';
const { abi, networks } = require('../abis/Tournament.json');


let provider;
if (process.env.NODE_ENV === 'production') {
    provider = new HDWalletProvider({
        mnemonic: process.env.MNEMONIC,
        providerOrUrl: process.env.INFURA_URI,
        addressIndex: 0
    });
}
else if (process.env.NODE_ENV === 'development') {
    provider = new Web3.providers.HttpProvider(process.env.ETH_URI);
}

let web3;
let accounts;
let networkId;
let tournamentContract;

const connectContract = async() => {
    web3 = new Web3(provider);
    accounts = await web3.eth.getAccounts();
    networkId = await web3.eth.net.getId();
    tournamentContract = new web3.eth.Contract(
        abi,
        networks[networkId] && networks[networkId].address,
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

export {
    connectContract,
    addTournament,
    setWinner,
    verifyTournamentPlayer
};