const fs = require('fs');
const path = require('path');
const moment = require('moment');
const Tournament = require('../models/Tournament');
const { addTournament, setWinner, verifyTournamentPlayer } = require('../config/eth');
const { createTournamentGame } = require('./gameController');
const { addUserTournament } = require('./userController');

const createTournament = async (req, res) => {
    const { name, stake, duration, numberOfPlayers, difficulty } = req.body;
    if (!name || !stake || !duration || !numberOfPlayers || !difficulty){
        return res
            .status(400)
            .json({ message: 'Ensure all form fields are filled'});
    }

    try {
        let tournament = await Tournament.findOne({ name });

        if (tournament) {
            // check if tournament was added to contract
            // add if it was not
          return res
            .status(400)
            .json({ message: 'Tournament title already exists' });
        }

        tournament = new Tournament({ name, stake, duration, numberOfPlayers, difficulty});
        tournament
            .save()
            .then((tournament) => {
                addTournament(String(tournament._id), stake, duration, numberOfPlayers, updateContractStatus);
                res.redirect('/tournaments/join-tournament');
            })
            .catch(err => console.log(err));

    } catch (err) {
        console.error(err.message);
        return res
            .status(500)
            .json({message: 'Something went wrong'});
    }
}

const joinTournament = async (req, res) => {
    const { name, username, address } = req.body;
    if (!name || !username || !address){
        return res
            .status(400)
            .json({ message: 'Missing essential details'})
    }

    try {
        let tournament = await Tournament.findOne({ name });

        if (!tournament) {
            return res
                .status(400)
                .json({ message: 'No tournament by this title exists' });
        }
        /*function findPreviousRequest(request) {
            return request.username === username;
        }
        const previouslyJoined = tournament.joinTournamentRequest.find(findPreviousRequest);
        if (previouslyJoined) {
            return res.redirect('tournaments/join-tournament')
        }*/
        let previouslyJoined;
        tournament.joinTournamentRequest.some((request, idx) => {
            if (request.address === address) {
              tournament.joinTournamentRequest[idx] = { username, address };
              previouslyJoined = true;
              return true;
            }
        });
        if (!previouslyJoined) {
            //return res.status(200).json({message: 'All Good'});
            tournament.joinTournamentRequest.push({username, address});
        }
        tournament
            .save()
            .then((tournament) => {
                res.status(200).json({message: 'All Good'});
                //res.redirect('tournaments/join-tournament');
            })
            .catch(err => console.log(err));
    } catch (err) {
        console.error(err.message);
        return res
            .status(500)
            .json({message: 'Something went wrong. Try again'});
    }
}

const getTournament = async (req, res) => {
    const tournament = await Tournament.findOne({name: req.params.name});
    if (tournament) {
        return res.render('tournament', {tournament});
    }
    return res.status(500).send('No tournament to view here!');
}

const getTournamentData = async (req, res) => {
    try {
        const page = req.query.page;
        const isArchived = req.query.archive;
        const tournaments = await Tournament.find({ hasTournamentStarted: true, hasTournamentEnded: isArchived })
            .limit(3)
            .skip((page-1)*3)
            .exec();
        res.json({tournaments});
    } catch (err) {
        console.log(err);
    }
}

const getJoinTournamentData = async (req, res) => {
    try {
        const page = req.query.page;
        const tournaments = await Tournament.find({ hasTournamentStarted: false, addedToContract: true })
            .limit(3)
            .skip((page-1)*3)
            .exec();
        res.json({tournaments});
    } catch (err) {
        console.log(err);
    }
}

const getContract = async (req, res) => {
    try {
        const contractLocation = path.join(path.dirname(__filename), '../abis/Tournament.json')
        const rawdata = fs.readFileSync(contractLocation);
        const contract = JSON.parse(rawdata);
        res.json({'contract': contract});
    } catch (err) {
        console.log(err);
    }
}

const addPlayer = (req, res) => {
    try {
        const tournamentId = req.query.id;
        const address = req.query.account;
        verifyTournamentPlayer(tournamentId, address, updatePlayersList);
        res.send('Confirmation completed');
    } catch (err) {
        console.log(err);
    }
}

const updateTournament = async (name, player) => {
    const tournament = await Tournament.findOne({ name });
    if (!tournament) {
        return true;
    }
    tournament.nextRound.push(player);
    if (tournament.currentGames.length !== 1 && (tournament.nextRound.length === tournament.currentGames.length || tournament.nextRound.length === tournament.numberOfPlayers)) {
        const matches = matchGamePlayers(tournament.nextRound);
        tournament.currentGames = [];
        for (i = 0; i < matches.length; i++) {
            matches[i] = await createTournamentGame(matches[i], name);
            tournament.games.push(matches[i]);
            tournament.currentGames.push(matches[i].name);
        }
    }
    else if (tournament.currentGames.length === 1 && tournament.nextRound.length === 1) {
        tournament.hasTournamentEnded = true;
        tournament.winner = player;
        function findWinner(user) {
            return user.username === player;
        }
        const winner = tournament.players.find(findWinner);
        setWinner(String(tournament._id), winner.address);
    }
    tournament.save();
    return true;
}

const updateContractStatus = async(tournamentId) => {
    const created = String(moment().format('MMMM Do YYYY, h:mm:ss a'));
    Tournament.findByIdAndUpdate(tournamentId, {addedToContract: true, created}, (err) => {
        if (err) {
            console.log(err);
        }
    })
}

const updatePlayersList = async (tournamentId, playerAddress) => {
    let tournament = await Tournament.findById(tournamentId);
    if (!tournament){
        return true;
    }
    function findPreviousRequest(request) {
        return request.address === playerAddress;
    }
    if (tournament.players.find(findPreviousRequest)) {
        return true;
    }
    const tournamentRequest = tournament.joinTournamentRequest.find(findPreviousRequest);
    if (!tournamentRequest){
        return true;
    }
    tournament.players.push(tournamentRequest);
    if (tournament.players.length === tournament.numberOfPlayers) {
        tournament.hasTournamentStarted = true;
    }
    tournament
        .save()
        .then(tournament => {
            addUserTournament({
                name: tournament.name,
                id: tournamentId
            }, tournamentRequest.username);
            updateTournament(tournament.name, tournamentRequest.username);
        })
        .catch(err => console.log(err));
}

const matchGamePlayers = (nextRound) => {
    const matches = [];
    while(nextRound.length > 0) {
        let rand = Math.floor(Math.random() * nextRound.length);
        if (rand < nextRound.length) {
            const playerOne = nextRound[rand];
            nextRound[rand] = nextRound[nextRound.length-1];
            nextRound.pop();
            rand = Math.floor(Math.random() * nextRound.length);
            if (rand < nextRound.length) {
                const playerTwo = nextRound[rand];
                nextRound[rand] = nextRound[nextRound.length-1];
                nextRound.pop();
                matches.push({
                    name: '',
                    playerOne,
                    playerTwo
                });
            }
        }
        //const playerOne = nextRound.splice(rand, rand+1);
    }
    return matches;
}


module.exports = {
    createTournament,
    joinTournament,
    getTournament,
    getTournamentData,
    getJoinTournamentData,
    getContract,
    addPlayer,
    updateTournament
}