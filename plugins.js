const searchBtn = document.getElementById('search-btn');
const resultsContainer = document.getElementById('results-container');

searchBtn.addEventListener('click', async () => {
    const q = document.getElementById('search-input').value;
    if(!q) return;
    resultsContainer.innerHTML = "Recherche plugins...";

    const res = await fetch(`https://hangar.papermc.io/api/v1/projects?q=${q}&limit=12`);
    const data = await res.json();
    
    resultsContainer.innerHTML = data.result.map(p => `
        <div class="card">
            <img src="${p.avatarUrl || ''}">
            <h3>${p.name}</h3>
            <div class="card-actions">
                <button class="btn-action" onclick="navigator.clipboard.writeText('${p.name}')">🆔 ID</button>
                <a href="https://hangar.papermc.io/${p.namespace.owner}/${p.name}" target="_blank" class="btn-action">🌐 VOIR / DL</a>
            </div>
        </div>
    `).join('');
});
