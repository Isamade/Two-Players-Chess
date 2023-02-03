if (localStorage.getItem('previousGame')) {
    window.location.href = '/games/load-game';
}

const tbody = document.querySelector('#tbody');
const res = await fetch('/pages/highscores');    
const data = await res.json();

data.forEach((user) => {
    const row = document.createElement('tr');
    row.classList.add('priority-200')
    row.innerHTML = `
        <td>${user.username}</td>
        <td>${user.games}</td>
        <td>${user.points}</td>`;
    tbody.appendChild(row);
})