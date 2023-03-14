let response;
let apiRequest = new XMLHttpRequest();
apiRequest.open('GET', '/auth');
apiRequest.send();
apiRequest.onreadystatechange = () => {
    if (apiRequest.readyState == 4) {
        response = JSON.parse(apiRequest.response);
        sessionStorage.setItem('username', response.user.username);
        sessionStorage.setItem('currentGames', JSON.stringify(response.user.currentGames));
        sessionStorage.setItem('completedGames', JSON.stringify(response.user.completedGames));
        document.querySelector('#wins').textContent = `${response.user.wins}`;
        document.querySelector('#draws').textContent = `${response.user.draws}`;
        document.querySelector('#loses').textContent = `${response.user.loses}`;
        document.querySelector('#points').textContent = `${(3 * response.user.wins) + (response.user.draws)}`;
    }
}