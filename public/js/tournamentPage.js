import { joinTournament, withdrawTournamentStake, withdrawTournamentPrize } from "./tournament.js";

export const loadJoinTournament = () => {
    let tournaments;
    let page = 1;

    const showTournaments = async() => {
        const res = await fetch(`/tournaments/join-tournament-data?page=${page}`);    
        const response = await res.json();
        tournaments = response.tournaments;
        document.querySelector('.row').innerHTML = `
        <div class="col-1-of-3">
        <div class="card">
            <div class="card__side card__side--front">
                 <div class="card__picture card__picture--0">
                     &nbsp;
                 </div>
                 <h4 class="card__heading">
                     <span class="card__heading-span card__heading-span--0">${(tournaments[0] && tournaments[0].name) || ' '}</span>
                 </h4>
                 <div class="card__details">
                     <ul>
                         <li>Duration: ${(tournaments[0] && tournaments[0].duration) || ' '} day(s)</li>
                         <li>${(tournaments[0] && tournaments[0].numberOfPlayers) || ' '} players</li>
                         <li>Stake: ${(tournaments[0] && tournaments[0].stake) || ' '} ETH</li>
                         <li>Difficulty: ${(tournaments[0] && tournaments[0].difficulty) || ' '}</li>
                         <li>Created: ${(tournaments[0] && tournaments[0].created) || ' '}</li>
                     </ul>
                 </div>
            </div>
            <div class="card__side card__side--back card__side--back-0">
                 <div class="card__cta">
                     <div class="card__price-box">
                         <p class="card__price-only">Only</p>
                         <p class="card__price-value">${(tournaments[0] && tournaments[0].stake) || ' '} ETH</p>
                     </div>
                     <a class="btn btn--white" id="one" href="#popup">Join!</a>
                 </div>
             </div>
        </div>
     </div>


     <div class="col-1-of-3">
         <div class="card">
             <div class="card__side card__side--front">
                 <div class="card__picture card__picture--00">
                     &nbsp;
                 </div>
                 <h4 class="card__heading">
                     <span class="card__heading-span card__heading-span--0">${(tournaments[1] && tournaments[1].name) || ' '}</span>
                 </h4>
                 <div class="card__details">
                     <ul>
                        <li>Duration: ${(tournaments[1] && tournaments[1].duration) || ' '} day(s)</li>
                        <li>${(tournaments[1] && tournaments[1].numberOfPlayers) || ' '} players</li>
                        <li>Stake: ${(tournaments[1] && tournaments[1].stake) || ' '} ETH</li>
                        <li>Difficulty: ${(tournaments[1] && tournaments[1].difficulty) || ' '}</li>
                        <li>Created: ${(tournaments[1] && tournaments[1].created) || ' '}</li>
                     </ul>
                 </div>

             </div>
             <div class="card__side card__side--back card__side--back-0">
                 <div class="card__cta">
                     <div class="card__price-box">
                         <p class="card__price-only">Only</p>
                         <p class="card__price-value">${(tournaments[1] && tournaments[1].stake) || ' '} ETH</p>
                     </div>
                     <a class="btn btn--white" id="two" href="#popup">Join!</a>
                 </div>
             </div>
         </div>
     </div>


     <div class="col-1-of-3">
         <div class="card">
             <div class="card__side card__side--front">
                 <div class="card__picture card__picture--000">
                     &nbsp;
                 </div>
                 <h4 class="card__heading">
                     <span class="card__heading-span card__heading-span--0">${(tournaments[2] && tournaments[2].name) || ' '}</span>
                 </h4>
                 <div class="card__details">
                     <ul>
                        <li>Duration: ${(tournaments[2] && tournaments[2].duration) || ' '} day(s)</li>
                        <li>${(tournaments[2] && tournaments[2].numberOfPlayers) || ' '} players</li>
                        <li>Stake: ${(tournaments[2] && tournaments[2].stake) || ' '} ETH</li>
                        <li>Difficulty: ${(tournaments[2] && tournaments[2].difficulty) || ' '}</li>
                        <li>Created: ${(tournaments[2] && tournaments[2].created) || ' '}</li>
                     </ul>
                 </div>

             </div>
             <div class="card__side card__side--back card__side--back-0">
                 <div class="card__cta">
                     <div class="card__price-box">
                         <p class="card__price-only">Only</p>
                         <p class="card__price-value">${(tournaments[2] && tournaments[2].stake) || ' '} ETH</p>
                     </div>
                     <a class="btn btn--white" id="three" href="#popup">Join!</a>
                 </div>
             </div>
         </div>
     </div>
        `;
        document.querySelector('#one').addEventListener('click', () => {
            tournaments[0] && joinTournament(tournaments[0]._id, tournaments[0].name, tournaments[0].stake);
        });
        document.querySelector('#two').addEventListener('click', () => {
            tournaments[1] && joinTournament(tournaments[1]._id, tournaments[1].name, tournaments[1].stake);
        });
        document.querySelector('#three').addEventListener('click', () => {
            tournaments[2] && joinTournament(tournaments[2]._id, tournaments[2].name, tournaments[2].stake);
        });
    }

    document.querySelector('#left').addEventListener('click', () => {
        if (page > 1) {
            page--;
            showTournaments();
        }
    });
    document.querySelector('#right').addEventListener('click', () => {
        if (tournaments.length === 3) {
            page++;
            showTournaments();
        }
    });

    showTournaments();
}

export const loadTournaments = (archive) => {
    let tournaments;
    let page = 1;

    const showTournaments = async() => {
        const res = await fetch(`/tournaments/data?page=${page}&archive=${archive}`);    
        const response = await res.json();
        tournaments = response.tournaments;
        document.querySelector('.row').innerHTML = `
        <div class="col-1-of-3">
        <div class="card">
            <div class="card__side card__side--front">
                 <div class="card__picture card__picture--0">
                     &nbsp;
                 </div>
                 <h4 class="card__heading">
                     <span class="card__heading-span card__heading-span--0">${(tournaments[0] && tournaments[0].name) || ' '}</span>
                 </h4>
                 <div class="card__details">
                     <ul>
                         <li>Duration: ${(tournaments[0] && tournaments[0].duration) || ' '} day(s)</li>
                         <li>${(tournaments[0] && tournaments[0].numberOfPlayers) || ' '} players</li>
                         <li>Stake: ${(tournaments[0] && tournaments[0].stake) || ' '} ETH</li>
                         <li>Difficulty: ${(tournaments[0] && tournaments[0].difficulty) || ' '}</li>
                         <li>Created: ${(tournaments[0] && tournaments[0].created) || ' '}</li>
                     </ul>
                 </div>
            </div>
            <div class="card__side card__side--back card__side--back-0">
                 <div class="card__cta">
                     <div class="card__price-box">
                         <p class="card__price-only">Only</p>
                         <p class="card__price-value">${(tournaments[0] && tournaments[0].stake) || ' '} ETH</p>
                     </div>
                     <a class="btn btn--white" id="one" href="/tournaments/tournament/${tournaments[0] && tournaments[0].name}">View</a>
                 </div>
             </div>
        </div>
     </div>


     <div class="col-1-of-3">
         <div class="card">
             <div class="card__side card__side--front">
                 <div class="card__picture card__picture--00">
                     &nbsp;
                 </div>
                 <h4 class="card__heading">
                     <span class="card__heading-span card__heading-span--0">${(tournaments[1] && tournaments[1].name) || ' '}</span>
                 </h4>
                 <div class="card__details">
                     <ul>
                        <li>Duration: ${(tournaments[1] && tournaments[1].duration) || ' '} day(s)</li>
                        <li>${(tournaments[1] && tournaments[1].numberOfPlayers) || ' '} players</li>
                        <li>Stake: ${(tournaments[1] && tournaments[1].stake) || ' '} ETH</li>
                        <li>Difficulty: ${(tournaments[1] && tournaments[1].difficulty) || ' '}</li>
                        <li>Created: ${(tournaments[1] && tournaments[1].created) || ' '}</li>
                     </ul>
                 </div>

             </div>
             <div class="card__side card__side--back card__side--back-0">
                 <div class="card__cta">
                     <div class="card__price-box">
                         <p class="card__price-only">Only</p>
                         <p class="card__price-value">${(tournaments[1] && tournaments[1].stake) || ' '} ETH</p>
                     </div>
                     <a class="btn btn--white" id="two" href="/tournaments/tournament/${tournaments[1] && tournaments[1].name}">View</a>
                 </div>
             </div>
         </div>
     </div>


     <div class="col-1-of-3">
         <div class="card">
             <div class="card__side card__side--front">
                 <div class="card__picture card__picture--000">
                     &nbsp;
                 </div>
                 <h4 class="card__heading">
                     <span class="card__heading-span card__heading-span--0">${(tournaments[2] && tournaments[2].name) || ' '}</span>
                 </h4>
                 <div class="card__details">
                     <ul>
                        <li>Duration: ${(tournaments[2] && tournaments[2].duration) || ' '} day(s)</li>
                        <li>${(tournaments[2] && tournaments[2].numberOfPlayers) || ' '} players</li>
                        <li>Stake: ${(tournaments[2] && tournaments[2].stake) || ' '} ETH</li>
                        <li>Difficulty: ${(tournaments[2] && tournaments[2].difficulty) || ' '}</li>
                        <li>Created: ${(tournaments[2] && tournaments[2].created) || ' '}</li>
                     </ul>
                 </div>

             </div>
             <div class="card__side card__side--back card__side--back-0">
                 <div class="card__cta">
                     <div class="card__price-box">
                         <p class="card__price-only">Only</p>
                         <p class="card__price-value">${(tournaments[2] && tournaments[2].stake) || ' '} ETH</p>
                     </div>
                     <a class="btn btn--white" id="three" href="/tournaments/tournament/${tournaments[2] && tournaments[2].name}">View</a>
                 </div>
             </div>
         </div>
     </div>
        `;
    }

    document.querySelector('#left').addEventListener('click', () => {
        if (page > 1) {
            page--;
            showTournaments();
        }
    });
    document.querySelector('#right').addEventListener('click', () => {
        if (tournaments.length === 3) {
            page++;
            showTournaments();
        }
    });

    showTournaments();
}

export const loadMyTournaments = async() => {
    const username = sessionStorage.getItem('username');
    const res = await fetch(`/tournaments/my-tournaments-data?username=${username}`);
    const response = await res.json();
    const tournaments = response.tournaments;
    const section = document.querySelector('.section-games');
    if (tournaments.length === 0){
        window.location.href = '/tournaments';
    }
    tournaments.forEach((tournament, idx) => {
        const tournamentItem = document.createElement('div');
        tournamentItem.classList.add('row');
        tournamentItem.innerHTML = `
          <div class="story">
              <div class="story__text">
                  <h3 class="heading-tertiary2 u-margin-bottom-small">${tournament.name}</h3>
              </div>
              <div class="form__group">
                <a class="btn btn--green margin-right" href="/tournaments/tournament/${tournament.name}">View Tournament</a>
                <button class="btn btn--green margin-right stake" data-position="${idx}">Withdraw Stake</button>
                <button class="btn btn--green margin-right prize" data-position="${idx}">Withdraw Prize</button>
              </div>
          </div>
        `;
    
        section.appendChild(tournamentItem);
    });
    document.querySelectorAll('.stake').forEach((item) => {
        item.addEventListener('click', () => {
            const index = +item.dataset.position;
            withdrawTournamentStake(tournaments[index].id);
        })
    });
    document.querySelectorAll('.prize').forEach((item) => {
        item.addEventListener('click', () => {
            const index = +item.dataset.position;
            withdrawTournamentPrize(tournaments[index].id);
        })
    });
}

/*const loadFixtures = () => {
    const res = await fetch(`/tournaments/tournaments-data?name=${name}`);
    const tournaments = await res.json();
    tournaments.forEach((tournament, idx) => {});
}*/