const tbody = document.querySelector('#tbody');
const loading = document.querySelector('.loader');

let limit = 5;
let page = 0;

async function getEntries() {
    const res = await fetch(`/pages/highscores?_limit=${limit}&_page=${page}`);   
    const data = await res.json();
  
    return data;
}

async function showEntries() {
    const entries = await getEntries();
  
    entries.forEach((user, index) => {
        const row = document.createElement('tr');
        row.classList.add('priority-200');
        console.log(page, index);
        row.innerHTML = `
            <td>${(page * limit) + (index + 1)}</td>
            <td>${user.username}</td>
            <td>${user.games}</td>
            <td>${user.points}</td>`;
        tbody.appendChild(row);
    });
}

function showLoading() {
    loading.classList.add('show');
  
    setTimeout(() => {
      loading.classList.remove('show');
  
      setTimeout(() => {
        page++;
        showEntries();
      }, 300);
    }, 1000);
}

showEntries();

window.addEventListener('scroll', () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  console.log('scrollTop', scrollTop);
  console.log('scrollHeight', scrollHeight);
  console.log('clientHeight', clientHeight);

  if (scrollTop + clientHeight >= scrollHeight) {
    showLoading();
  }
});