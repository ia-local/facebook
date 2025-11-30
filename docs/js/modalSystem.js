// modalSystem.js (Version Corrigée - Recherche d'éléments déplacée)

let modal;
let showButton;
let closeButton;

/**
 * 💡 Affiche le composant Modal.
 */
export function showModal() {
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('is-active');
    document.body.classList.add('modal-open'); 
    modal.focus();
}

/**
 * 🔒 Masque le composant Modal.
 */
export function hideModal() {
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'true');
    modal.classList.remove('is-active'); 
    document.body.classList.remove('modal-open');
    if (showButton) {
        showButton.focus();
    }
}

/**
 * 🛠️ Initialise tous les écouteurs d'événements pour le modal.
 */
function initModalListeners() {
    // NOUVEAU : La recherche des éléments se fait ICI, APRÈS DOMContentLoaded
    modal = document.getElementById('modalSystem');
    showButton = document.getElementById('showModalBtn');
    
    if (!modal) {
        console.warn("Composant Modal: L'élément #modalSystem est introuvable. Veuillez vérifier votre HTML.");
        return;
    }
    
    // On peut maintenant chercher le bouton de fermeture car 'modal' existe
    closeButton = modal.querySelector('.c-modal-close-btn');

    // 1. Bouton d'ouverture
    if (showButton) {
        showButton.addEventListener('click', showModal);
    }

    // 2. Bouton de fermeture interne
    if (closeButton) {
        closeButton.addEventListener('click', hideModal);
    }

    // 3. Fermeture par clic en dehors du contenu (overlay)
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            hideModal();
        }
    });

    // 4. Fermeture par touche ESCAPE (Globale)
    document.addEventListener('keydown', (e) => {
        const isModalVisible = modal.getAttribute('aria-hidden') === 'false';
        
        if (e.key === 'Escape' && isModalVisible) {
            hideModal();
        }
    });
}

// Lancement de l'initialisation
document.addEventListener('DOMContentLoaded', initModalListeners);