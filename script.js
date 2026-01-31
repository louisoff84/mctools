// Gestion des Favoris via LocalStorage
let favs = JSON.parse(localStorage.getItem('mctools_favs')) || [];

async function searchAPI(type) {
    const query = document.getElementById('search-input').value;
    const container = document.getElementById('results-container');
    if (!query) return;

    container.innerHTML = "<div class='loader'>Recherche en cours...</div>";

    try {
        // Filtre spécifique par type de projet (mod ou plugin)
        const response = await fetch(`https://api.modrinth.com/v2/search?query=${query}&facets=[["project_type:${type}"]]&limit=12`);
        const data = await response.json();

        const results = data.hits.map(h => ({
            id: h.project_id,
            name: h.title,
            desc: h.description,
            img: h.icon_url,
            link: `https://modrinth.com/project/${h.slug}`
        }));

        renderGrid(container, results, false);
    } catch (e) {
        container.innerHTML = "<p>Erreur lors de la récupération des données.</p>";
    }
}

function renderGrid(container, items, isFavGrid) {
    container.innerHTML = items.map(item => `
        <div class="card">
            <img src="${item.img || 'https://via.placeholder.com/48'}" alt="Icon">
            <h3>${item.name}</h3>
            <p>${item.desc ? item.desc.substring(0, 80) : 'Pas de description'}...</p>
            <div class="card-actions">
                <button class="btn-action" onclick="copyId('${item.id}')">🆔 ID</button>
                <a href="${item.link}" target="_blank" class="btn-action">🌐 VOIR</a>
                <button class="btn-action" onclick="${isFavGrid ? `removeFav('${item.id}')` : `addFav(${JSON.stringify(item).replace(/"/g, '&quot;')})`}">
                    ${isFavGrid ? '🗑️' : '⭐'}
                </button>
            </div>
        </div>
    `).join('');
}

function addFav(item) {
    if (!favs.some(f => f.id === item.id)) {
        favs.push(item);
        localStorage.setItem('mctools_favs', JSON.stringify(favs));
        alert("Ajouté aux favoris !");
    }
}

function removeFav(id) {
    favs = favs.filter(f => f.id !== id);
    localStorage.setItem('mctools_favs', JSON.stringify(favs));
    renderGrid(document.getElementById('favorites-container'), favs, true);
}

function toggleFavs() {
    const sec = document.getElementById('favorites-section');
    sec.classList.toggle('hidden');
    if (!sec.classList.contains('hidden')) renderGrid(document.getElementById('favorites-container'), favs, true);
}

function copyId(id) {
    navigator.clipboard.writeText(id).then(() => {
        const btn = event.target;
        btn.innerText = "COPIÉ !";
        setTimeout(() => btn.innerText = "🆔 ID", 1000);
    });
}
