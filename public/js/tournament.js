const getWeb3 = () =>
  new Promise((resolve, reject) => {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    (async () => {
      // Modern dapp browsers...
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
          // Request account access if needed
          await window.ethereum.enable();
          // Acccounts now exposed
          resolve(web3);
        } catch (error) {
          reject(error);
        }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        // Use Mist/MetaMask's provider.
        const web3 = window.web3;
        console.log("Injected web3 detected.");
        resolve(web3);
      }
      // Fallback to localhost; use dev console port by default...
      else {
        const provider = new Web3.providers.HttpProvider(
          "http://127.0.0.1:8545"
        );
        const web3 = new Web3(provider);
        console.log("No web3 instance injected, using Local web3.");
        resolve(web3);
      }
    })();
});

const payTournamentStake = async(web3, account, id, stake) => {
  //const web3 = await getWeb3();
  //const accounts = await web3.eth.getAccounts();
  if (!web3) {
    web3 = await getWeb3();
    const accounts = await web3.eth.getAccounts();
    account = accounts[0];
  }
  const networkId = await web3.eth.net.getId();
  const res = await fetch('/tournaments/contract');
  const response = await res.json();
  const tournamentJSON = response.contract;
  if (tournamentJSON) {
    const tournamentContract = new web3.eth.Contract(
      tournamentJSON.abi,
      tournamentJSON.networks[networkId] && tournamentJSON.networks[networkId].address,
    );
    const receipt = await tournamentContract.methods
      .joinTournament(id)
      .send({ from: account, value: web3.utils.toWei(`${stake}`, "ether") });
    if (receipt) {
      await fetch(`/tournaments/addPlayer?id=${id}&account=${account}`);
      window.location.href = '/tournaments/my-tournaments';
    }
  }
}

export const joinTournament = async(id, name, stake) => {
    const username = sessionStorage.getItem('username');
    const web3 = await getWeb3();
    const accounts = await web3.eth.getAccounts();
    if (accounts[0]) {
        const xhttp = new XMLHttpRequest();
        xhttp.open('POST', '/tournaments/join-tournament', true);
        xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
              //window.location.href = '/tournaments/join-tournament#popup';
              const join = document.querySelector('#join');
              const confirm = document.querySelector('#confirm');
              join.addEventListener('click', () => {
                //localStorage.setItem('paymentAttempt', JSON.stringify({name:this.name, clientId: this.id}));
                payTournamentStake(web3, accounts[0], id, stake);
              });
              confirm.addEventListener('click', async() => {
                await fetch(`/tournaments/addPlayer?id=${id}&account=${accounts[0]}`);
                window.location.href = '/tournaments/my-tournaments';
              });
              join.classList.remove('hidden');
              confirm.classList.remove('hidden');
            }
        }
        xhttp.send(`name=${name}&username=${username}&address=${accounts[0]}`);
    }
}

export const withdrawTournamentStake = async(name) => {
    const web3 = await getWeb3();
    const accounts = await web3.eth.getAccounts();
    const networkId = await web3.eth.net.getId();
    const res = await fetch('/tournaments/contract');
    const response = await res.json();
    const tournamentJSON = response.contract;
    const tournamentContract = new web3.eth.Contract(
        tournamentJSON.abi,
        tournamentJSON.networks[networkId] && tournamentJSON.networks[networkId].address,
    );
    await tournamentContract.methods
        .withdrawStake(name)
        .send({from: accounts[0]});
}

export const withdrawTournamentPrize = async(name) => {
    const web3 = await getWeb3();
    const accounts = await web3.eth.getAccounts();
    const networkId = await web3.eth.net.getId();
    const res = await fetch('/tournaments/contract');
    const response = await res.json();
    const tournamentJSON = response.contract;
    const tournamentContract = new web3.eth.Contract(
        tournamentJSON.abi,
        tournamentJSON.networks[networkId] && tournamentJSON.networks[networkId].address,
    );
    await tournamentContract.methods
        .withdrawPrize(name)
        .send({from: accounts[0]});
}