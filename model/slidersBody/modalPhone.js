// modalPhone.js (Module ES6 pour les doubles modales de téléphone)

/**
 * 💡 Ouvre une modale de téléphone spécifique.
 * @param {string} modalId L'ID de la modale à ouvrir (ex: 'phoneModal1').
 */
export const openPhoneModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (modal) {
        // Ferme toute autre modale si nécessaire (optionnel pour les modales exclusives)
        // document.querySelectorAll('.c-phone-modal[aria-hidden="false"]').forEach(m => m.setAttribute('aria-hidden', 'true'));
        
        modal.setAttribute('aria-hidden', 'false');
    }
};

/**
 * 🔒 Ferme une modale de téléphone spécifique.
 * @param {string} modalId L'ID de la modale à fermer.
 */
export const closePhoneModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.setAttribute('aria-hidden', 'true');
    }
};

/**
 * 🛠️ Initialise les écouteurs pour les deux systèmes de modales.
 */
function initDualModalListeners() {
    
    const phones = [
        { id: 'phoneModal1', btnId: 'showPhone1Btn' },
        { id: 'phoneModal2', btnId: 'showPhone2Btn' }
    ];

    // 1. Écouteurs d'ouverture (Boutons de déclenchement)
    phones.forEach(phone => {
        const openBtn = document.getElementById(phone.btnId);
        if (openBtn) {
            openBtn.addEventListener('click', () => openPhoneModal(phone.id));
        }
    });

    // 2. Écouteurs de fermeture (Bouton 'x' interne)
    document.querySelectorAll('.c-phone-modal .c-modal-close-btn').forEach(closeBtn => {
        // Récupère l'ID cible soit du data-target, soit du parent le plus proche
        const targetModalId = closeBtn.closest('.c-phone-modal').id;
        closeBtn.addEventListener('click', () => closePhoneModal(targetModalId));
    });

    // 3. Fermeture par clic sur le fond (overlay du téléphone)
    document.querySelectorAll('.c-phone-modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closePhoneModal(modal.id);
            }
        });
    });

    // 4. Fermeture par touche ESCAPE
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Fermer la première modale visible trouvée (pour prioriser)
            const visibleModal = document.querySelector('.c-phone-modal[aria-hidden="false"]');
            if (visibleModal) {
                closePhoneModal(visibleModal.id);
            }
        }
    });
}

// Lancement de l'initialisation dès que le DOM est prêt
document.addEventListener('DOMContentLoaded', initDualModalListeners);