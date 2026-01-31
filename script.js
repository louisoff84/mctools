let favorites = JSON.parse(localStorage.getItem('toolsmc_favs')) || [];

function updateFavUI() {
    document.getElementById('fav-count').innerText = favorites.length;
}

async function unifiedSearch() {
    const query = document.getElementById('search-input').value;
    const platform = document.getElementById('platform-select').value;
    const container = document.getElementById('results-container');

    if (!query) return;
    container.innerHTML = "<p>Recherche en cours sur " + platform + "...</p>";

    try {
        let results = [];
        if (platform === 'modrinth') {
            const res = await fetch(`https://api.modrinth.com/v2/search?query=${query}&limit=12`);
            const data = await res.json();
            results = data.hits.map(h => ({
                id: h.project_id, name: h.title, desc: h.description, img: h.icon_url, link: `https://modrinth.com/project/${h.slug}`
            }));
        } else {
            const res = await fetch(`https://hangar.papermc.io/api/v1/projects?q=${query}&limit=12`);
            const data = await res.json();
            results = data.result.map(p => ({
                id: p.name, name: p.name, desc: p.description, img: p.avatarUrl, link: `https://hangar.papermc.io/${p.namespace.owner}/${p.name}`
            }));
        }
        render(container, results, false);
    } catch (e) {
        container.innerHTML = "<p>Erreur lors de la récupération des données.</p>";
    }
}

function render(container, items, isFavGrid) {
    container.innerHTML = items.map(item => `
        <div class="card">
            <img src="${item.img || 'https://via.placeholder.com/50'}" loading="lazy">
            <h3>${item.name}</h3>
            <p>${item.desc ? item.desc.substring(0, 80) : 'Aucune description...'}...</p>
            <div class="card-actions">
                <button class="btn-action" onclick="copyId('${item.id}')">🆔 ID</button>
                <a href="${item.link}" target="_blank" class="btn-action">🌐 Voir</a>
                <button class="btn-action" onclick="${isFavGrid ? `removeFav('${item.id}')` : `addFav(${JSON.stringify(item).replace(/"/g, '&quot;')})`}">
                    ${isFavGrid ? '🗑️' : '⭐'}
                </button>
            </div>
        </div>
    `).join('');
}

function addFav(item) {
    if (!favorites.some(f => f.id === item.id)) {
        favorites.push(item);
        syncFavs();
        alert("Ajouté aux favoris !");
    }
}

function removeFav(id) {
    favorites = favorites.filter(f => f.id !== id);
    syncFavs();
    render(document.getElementById('favorites-container'), favorites, true);
}

function syncFavs() {
    localStorage.setItem('toolsmc_favs', JSON.stringify(favorites));
    updateFavUI();
}

function copyId(id) {
    navigator.clipboard.writeText(id).then(() => alert("ID Copié : " + id));
}

function toggleFavorites() {
    const sec = document.getElementById('favorites-section');
    sec.classList.toggle('hidden');
    if (!sec.classList.contains('hidden')) {
        render(document.getElementById('favorites-container'), favorites, true);
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', updateFavUI);
