const searchBtn = document.getElementById('search-btn');
const searchInput = document.getElementById('search-input');
const resultsContainer = document.getElementById('results-container');
let projectVersions = [];

// Recherche
searchBtn.addEventListener('click', async () => {
    const q = searchInput.value;
    if(!q) return;
    resultsContainer.innerHTML = "Chargement...";

    const res = await fetch(`https://api.modrinth.com/v2/search?query=${q}&facets=[["project_type:mod"]]&limit=12`);
    const data = await res.json();
    
    resultsContainer.innerHTML = data.hits.map(h => `
        <div class="card">
            <img src="${h.icon_url || ''}">
            <h3>${h.title}</h3>
            <div class="card-actions">
                <button class="btn-action" onclick="navigator.clipboard.writeText('${h.project_id}')">🆔 ID</button>
                <button class="btn-action dl-btn" onclick="openDL('${h.project_id}', '${h.title}')">📥 DL</button>
                <a href="https://modrinth.com/project/${h.slug}" target="_blank" class="btn-action">🌐 VOIR</a>
            </div>
        </div>
    `).join('');
});

// Système de téléchargement
async function openDL(id, name) {
    document.getElementById('dl-modal').classList.remove('hidden');
    document.getElementById('modal-title').innerText = name;
    const res = await fetch(`https://api.modrinth.com/v2/project/${id}/version`);
    projectVersions = await res.json();
    renderVersions();
}

function renderVersions() {
    const mc = document.getElementById('f-mc').value;
    const loader = document.getElementById('f-loader').value;
    const list = document.getElementById('v-list');
    
    let filtered = projectVersions;
    if(mc) filtered = filtered.filter(v => v.game_versions.includes(mc));
    if(loader) filtered = filtered.filter(v => v.loaders.includes(loader));

    list.innerHTML = filtered.slice(0, 5).map(v => `
        <div class="version-item">
            <span>${v.version_number}</span>
            <button class="btn-action" onclick="window.open('${v.files[0].url}')">📥 JAR</button>
        </div>
    `).join('');
}

document.getElementById('close-modal').onclick = () => document.getElementById('dl-modal').classList.add('hidden');
document.getElementById('f-mc').onchange = renderVersions;
document.getElementById('f-loader').onchange = renderVersions;
