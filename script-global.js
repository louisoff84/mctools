const GITHUB_API = "https://api.github.com/repos/louisoff84/mctools";

// Définition des thèmes partagée
const themes = {
    "Default": { bg: "#0d1117", card: "#161b22", accent: "#00ff88", border: "#30363d" },
    "Ocean": { bg: "#001219", card: "#005f73", accent: "#9ad1d4", border: "#0a9396" },
    "Cyber": { bg: "#050505", card: "#111", accent: "#00fbff", border: "#333" },
    "Sakura": { bg: "#1a0a14", card: "#2d1424", accent: "#ffb3d9", border: "#4d1e3d" },
    "Hacker": { bg: "#000000", card: "#000", accent: "#00ff41", border: "#003b00" },
    "Vampire": { bg: "#000000", card: "#0f0f0f", accent: "#9d0208", border: "#370617" }
    // Ajoute tes autres thèmes ici sur le même modèle
};

// Appliquer le thème et mettre à jour l'UI
function applyTheme(name) {
    const t = themes[name] || themes["Default"];
    const root = document.documentElement;
    
    root.style.setProperty('--bg', t.bg);
    root.style.setProperty('--card', t.card);
    root.style.setProperty('--accent', t.accent);
    root.style.setProperty('--border', t.border);
    
    localStorage.setItem('mctools_theme_name', name);
    triggerProgressBar();
}

// Barre de progression GitHub
async function triggerProgressBar() {
    const bar = document.getElementById('progress-bar');
    if (!bar) return;

    bar.style.width = "30%";
    try {
        await fetch(GITHUB_API); // Appel API réel
        bar.style.width = "100%";
        setTimeout(() => bar.style.width = "0%", 500);
    } catch (e) {
        bar.style.backgroundColor = "red";
        setTimeout(() => bar.style.width = "0%", 500);
    }
}

// Au chargement de n'importe quelle page
document.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem('mctools_theme_name') || 'Default';
    applyTheme(saved);
});
