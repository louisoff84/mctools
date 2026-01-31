const GITHUB_API = "https://api.github.com/repos/louisoff84/mctools";

async function syncAndApplyTheme(themeName) {
    const bar = document.getElementById('progress-bar');
    const root = document.documentElement;
    const t = themes[themeName] || themes["Default"];

    if (bar) {
        bar.style.opacity = "1";
        bar.style.width = "20%";
    }

    try {
        // On vérifie le statut du repo GitHub avant d'appliquer
        const response = await fetch(GITHUB_API);
        if (!response.ok) throw new Error("GitHub Sync Failed");
        
        const data = await response.json();
        if (bar) bar.style.width = "60%";

        // Injection dynamique dans les variables du CSS
        root.style.setProperty('--bg', t.bg);
        root.style.setProperty('--card', t.card);
        root.style.setProperty('--accent', t.accent);
        root.style.setProperty('--border', t.border);

        // Mise à jour du stockage local
        localStorage.setItem('active_theme', themeName);

        if (bar) {
            bar.style.width = "100%";
            setTimeout(() => {
                bar.style.opacity = "0";
                setTimeout(() => bar.style.width = "0%", 400);
            }, 600);
        }
        
        console.log(`Sync réussie avec GitHub. Thème ${themeName} appliqué.`);
        return data; // Contient les infos du repo (last update, etc.)

    } catch (error) {
        if (bar) {
            bar.style.backgroundColor = "#ff4d4d"; // Rouge en cas d'erreur
            bar.style.width = "100%";
        }
        console.error("Erreur de synchronisation :", error);
    }
}

// Chargement initial
document.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem('active_theme') || 'Default';
    syncAndApplyTheme(saved);
});
