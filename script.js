let favs = JSON.parse(localStorage.getItem('mctools_favs')) || [];
let currentProjectVersions = [];

// 1. Détecter le type (Mod ou Plugin) selon l'URL
const getPageType = () => window.location.pathname.includes('plugins') ? 'plugin' : 'mod';

// 2. Recherche API Modrinth
async function executeSearch() {
    const query = document.getElementById('search-input').value;
    const container = document.getElementById('results-container');
    if(!query) return;

    container.innerHTML = "<p style='grid-column:1/-1; text-align:center;'>Recherche en cours...</p>";

    try {
        const type = getPageType();
        const res = await fetch(`https://api.modrinth.com/v2/search?query=${query}&facets=[["project_type:${type}"]]&limit=12`);
        const data = await res.json();
        
        const results = data.hits.map(h => ({
            id: h.project_id,
            name: h.title,
            desc: h.description,
            img: h.icon_url,
            link: `https://modrinth.com/project/${h.slug}`
        }));
        
        renderGrid(container, results, false);
    } catch (e) { container.innerHTML = "<p>Erreur API.</p>"; }
}

// 3. Gestion du Téléchargement avec Choix de Version
async function openDLModal(id, name) {
    const modal = document.getElementById('dl-modal');
    const list = document.getElementById('versions-list');
    document.getElementById('modal-title').innerText = name;
    modal.classList.remove('hidden');
    list.innerHTML = "Chargement des versions...";

    try {
        const res = await fetch(`https://api.modrinth.com/v2/project/${id}/version`);
        currentProjectVersions = await res.json();
        displayVersions();
    } catch (e) { list.innerHTML = "Erreur de chargement."; }
}

function displayVersions() {
    const mcV = document.getElementById('filter-mc').value;
    const loadV = document.getElementById('filter-loader').value;
    const list = document.getElementById('versions-list');
    
    let filtered = currentProjectVersions;
    if(mcV) filtered = filtered.filter(v => v.game_versions.includes(mcV));
    if(loadV) filtered = filtered.filter(v => v.loaders.includes(loadV));

    list.innerHTML = filtered.length ? "" : "Aucune version compatible.";
    filtered.slice(0, 6).forEach(v => {
        list.innerHTML += `
            <div class="version-item">
                <div>
                    <div style="font-weight:bold; font-size:0.9rem">${v.version_number}</div>
                    <div style="margin-top:4px">${v.loaders.map(l => `<span class="version-tag">${l}</span>`).join('')}</div>
                </div>
                <button onclick="window.open('${v.files[0].url}')" class="btn-action btn-dl" style="padding:5px 10px">📥 JAR</button>
            </div>
        `;
    });
}

// 4. Affichage des cartes
function renderGrid(container, items, isFav) {
    container.innerHTML = items.map(item => `
        <div class="card">
            <img src="${item.img || 'https://via.placeholder.com/50'}" alt="icon">
            <h3>${item.name}</h3>
            <p>${item.desc ? item.desc.substring(0, 70) : '...'}...</p>
            <div class="card-actions">
                <button class="btn-action" onclick="copyId('${item.id}')">🆔 ID</button>
                <button class="btn-action btn-dl" onclick="openDLModal('${item.id}', '${item.name.replace(/'/g, "\\'")}')">📥 DL</button>
                <a href="${item.link}" target="_blank" class="btn-action">🌐 VOIR</a>
                <button class="btn-action" onclick="${isFav ? `delFav('${item.id}')` : `addFav(${JSON.stringify(item).replace(/"/g, '&quot;')})`}">
                    ${isFav ? '🗑️' : '⭐'}
                </button>
            </div>
        </div>
    `).join('');
}

// 5. Utilitaires (Favoris, Copie ID)
function addFav(item) {
    if(!favs.some(f => f.id === item.id)) { favs.push(item); save(); alert("Ajouté !"); }
}
function delFav(id) {
    favs = favs.filter(f => f.id !== id); save();
    renderGrid(document.getElementById('favorites-container'), favs, true);
}
function save() { 
    localStorage.setItem('mctools_favs', JSON.stringify(favs)); 
    document.getElementById('fav-count').innerText = favs.length;
}
function copyId(id) { navigator.clipboard.writeText(id); alert("ID Copié !"); }
function toggleFavs() {
    const s = document.getElementById('favorites-section');
    s.classList.toggle('hidden');
    if(!s.classList.contains('hidden')) renderGrid(document.getElementById('favorites-container'), favs, true);
}
function closeModal() { document.getElementById('dl-modal').classList.add('hidden'); }

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('fav-count').innerText = favs.length;
});
