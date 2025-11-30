// modalDrone_camera.js (Module ES6)

const droneModal = document.getElementById('droneModal');
const showDroneBtn = document.getElementById('showDroneModalBtn');
const closeDroneBtn = droneModal ? droneModal.querySelector('.c-drone-close-btn') : null;

/**
 * 💡 Affiche le composant Modal Drone.
 */
export function showDroneModal() {
    if (!droneModal) return;
    droneModal.setAttribute('aria-hidden', 'false');
    droneModal.classList.add('is-active');
}

/**
 * 🔒 Masque le composant Modal Drone.
 */
export function hideDroneModal() {
    if (!droneModal) return;
    droneModal.setAttribute('aria-hidden', 'true');
    droneModal.classList.remove('is-active');
}

/**
 * 🛠️ Initialise les écouteurs.
 */
function initDroneModalListeners() {
    if (!droneModal) {
        console.warn("Composant Drone Modal: L'élément #droneModal est introuvable.");
        return;
    }
    
    // 1. Bouton d'ouverture
    if (showDroneBtn) {
        showDroneBtn.addEventListener('click', showDroneModal);
    }

    // 2. Bouton de fermeture interne
    if (closeDroneBtn) {
        closeDroneBtn.addEventListener('click', hideDroneModal);
    }

    // 3. Fermeture par touche ESCAPE
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && droneModal.classList.contains('is-active')) {
            hideDroneModal();
        }
    });
}

// Lancement de l'initialisation
document.addEventListener('DOMContentLoaded', initDroneModalListeners);