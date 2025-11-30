// modalOrdinateur.js (Module ES6 Corrigé)

// Déclarer les variables en haut, mais NE PAS les initialiser avec document.getElementById ici
let pcModal;
let showPcBtn;
let closePcBtn;

/**
 * 💡 Affiche le composant Modal Ordinateur.
 */
export function showPCModal() {
    // Les fonctions exportées doivent vérifier si les éléments sont initialisés
    if (!pcModal) return; 
    pcModal.setAttribute('aria-hidden', 'false');
    pcModal.classList.add('is-active');
}

/**
 * 🔒 Masque le composant Modal Ordinateur.
 */
export function hidePCModal() {
    if (!pcModal) return;
    pcModal.setAttribute('aria-hidden', 'true');
    pcModal.classList.remove('is-active');
}

/**
 * 🛠️ Initialise les écouteurs.
 */
function initPCModalListeners() {
    // CORRECTION CRITIQUE : Initialiser les variables DANS le DOMContentLoaded
    pcModal = document.getElementById('pcModal');
    showPcBtn = document.getElementById('showPCModalBtn');
    closePcBtn = pcModal ? pcModal.querySelector('.c-pc-close-btn') : null;
    
    if (!pcModal) {
        console.warn("Composant PC Modal: L'élément #pcModal est introuvable. (Vérifiez votre HTML)");
        return;
    }
    
    // 1. Bouton d'ouverture
    if (showPcBtn) {
        // La fonction showPCModal est maintenant appelée après que showPcBtn a été trouvé
        showPcBtn.addEventListener('click', showPCModal);
    }

    // 2. Bouton de fermeture interne
    if (closePcBtn) {
        closePcBtn.addEventListener('click', hidePCModal);
    }

    // 3. Fermeture par touche ESCAPE
    document.addEventListener('keydown', (e) => {
        // pcModal est maintenant garanti d'être non-null ici (grâce à la vérification ci-dessus)
        if (e.key === 'Escape' && pcModal.classList.contains('is-active')) {
            hidePCModal();
        }
    });
}

// Lancement de l'initialisation (qui attend le chargement complet du DOM)
document.addEventListener('DOMContentLoaded', initPCModalListeners);