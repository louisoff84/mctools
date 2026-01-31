const GITHUB_API = "https://api.github.com/repos/louisoff84/mctools";

const themes = {
    "Default": { bg: "#0d1117", card: "#161b22", accent: "#00ff88", border: "#30363d" },
    "Ocean": { bg: "#001219", card: "#005f73", accent: "#9ad1d4", border: "#0a9396" },
    "Crimson": { bg: "#1a0000", card: "#2d0000", accent: "#ff4d4d", border: "#4d0000" },
    "Gold": { bg: "#1a1a00", card: "#2b2b00", accent: "#ffcc00", border: "#444400" },
    "Purple": { bg: "#12001a", card: "#1e002d", accent: "#bf00ff", border: "#3c005a" },
    "Cyber": { bg: "#050505", card: "#111", accent: "#00fbff", border: "#333" },
    "Forest": { bg: "#0a1a0a", card: "#142d14", accent: "#4dff4d", border: "#1e3d1e" },
    "Sakura": { bg: "#1a0a14", card: "#2d1424", accent: "#ffb3d9", border: "#4d1e3d" },
    "Bumblebee": { bg: "#000000", card: "#111", accent: "#ffee00", border: "#333" },
    "Midnight": { bg: "#000814", card: "#001d3d", accent: "#ffc300", border: "#003566" },
    "Vampire": { bg: "#000000", card: "#0f0f0f", accent: "#9d0208", border: "#370617" },
    "Nordic": { bg: "#2e3440", card: "#3b4252", accent: "#88c0d0", border: "#4c566a" },
    "Toxic": { bg: "#0b1400", card: "#152400", accent: "#ccff00", border: "#2d4d00" },
    "Retro": { bg: "#2b2d42", card: "#8d99ae", accent: "#ef233c", border: "#edf2f4" },
    "Space": { bg: "#0b0e14", card: "#151921", accent: "#7d5fff", border: "#2f3542" },
    "Hacker": { bg: "#000000", card: "#000", accent: "#00ff41", border: "#003b00" },
    "Ghost": { bg: "#ffffff", card: "#f0f0f0", accent: "#222", border: "#ccc" },
    "Royal": { bg: "#1a1300", card: "#2d2100", accent: "#d4af37", border: "#5a4300" },
    "Deep-Sea": { bg: "#01012b", card: "#02024d", accent: "#00d4ff", border: "#03038a" },
    "Lava": { bg: "#120000", card: "#300000", accent: "#ff4500", border: "#600000" }
};

// --- GESTION THEMES ---
function applyTheme(name) {
    const t = themes[name];
    const root = document.documentElement;
    root.style.setProperty('--bg', t.bg);
    root.style.setProperty('--card', t.card);
    root.style.setProperty('--accent', t.accent);
    root.style.setProperty('--border', t.border);
    localStorage.setItem('mctools_theme_name', name);
    showProgress();
}

function initThemes() {
    const list = document.getElementById('admin-theme-list');
    Object.keys(themes).forEach(name => {
        const btn = document.createElement('button');
        btn.className = "btn-admin-theme";
        btn.innerText = name;
        btn.onclick = () => applyTheme(name);
        list.appendChild(btn);
    });
}

// --- GITHUB BARRE DE CHARGEMENT ---
async function refreshRepoData() {
    const bar = document.getElementById('progress-bar');
    bar.style.width = "30%";
    
    try {
        const res = await fetch(GITHUB_API);
        const data = await res.json();
        
        bar.style.width = "70%";
        
        document.getElementById('repo-stars').innerText = data.stargazers_count;
        document.getElementById('repo-forks').innerText = data.forks_count;
        document.getElementById('repo-last-push').innerText = new Date(data.pushed_at).toLocaleDateString();
        document.getElementById('repo-status').innerText = "Online";
        
        bar.style.width = "100%";
        setTimeout(() => bar.style.width = "0%", 800);
    } catch (e) {
        document.getElementById('repo-status').innerText = "Error";
        document.getElementById('repo-status').style.color = "red";
    }
}

function showProgress() {
    const bar = document.getElementById('progress-bar');
    bar.style.width = "100%";
    setTimeout(() => bar.style.width = "0%", 400);
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    initThemes();
    refreshRepoData();
    const saved = localStorage.getItem('mctools_theme_name') || 'Default';
    applyTheme(saved);
});
