let favorites = JSON.parse(localStorage.getItem('toolsmc_favs')) || [];

async function searchAPI(type) {
    const query = document.getElementById('search-input').value;
    const container = document.getElementById('results-container');
    if (!query) return;

    container.innerHTML = "<p>Recherche en cours...</p>";

    try {
        // Recherche sur Modrinth avec filtre de type
        const res = await fetch(`https://api.modrinth.com/v2/search?query=${query}&facets=[["project_type:${type}"]]&limit=12`);
        const data = await res.json();

        const results = data.hits.map(h => ({
            id: h.project_id,
            name: h.title,
            desc: h.description,
            img: h.icon_url,
            link: `https://modrinth.com/project/${h.slug}`
        }));

        render(container, results);
    } catch (e) {
        container.innerHTML = "<p>Erreur lors de la liaison API Modrinth.</p>";
    }
}

function render(container, items) {
    container.innerHTML = items.map(item => `
        <div class="card">
            <img src="${item.img || 'https://via.placeholder.com/48'}" loading="lazy">
            <h3>${item.name}</h3>
            <p>${item.desc ? item.desc.substring(0, 70) : '...'}...</p>
            <div class="card-actions">
                <button class="btn-action" onclick="copyId('${item.id}')">🆔 ID</button>
                <a href="${item.link}" target="_blank" class="btn-action">🌐 VOIR</a>
                <button class="btn-action" onclick="addFav(${JSON.stringify(item).replace(/"/g, '&quot;')})">⭐</button>
            </div>
        </div>
    `).join('');
}

function copyId(id) {
    navigator.clipboard.writeText(id).then(() => alert("ID Copié !"));
}

function addFav(item) {
    if (!favorites.some(f => f.id === item.id)) {
        favorites.push(item);
        localStorage.setItem('toolsmc_favs', JSON.stringify(favorites));
        alert("Ajouté aux favoris !");
    }
}
