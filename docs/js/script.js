// script.js (Module Principal d'Initialisation)

// 1. Importation des fonctions exportées
import { formatTimecode } from './calc.js';
import { showModal, hideModal } from './modalSystem.js';
import { nextSlide, prevSlide, loadSlide } from './sliderVideo.js'; 


document.addEventListener('DOMContentLoaded', () => {
    console.log("✅ Application principale démarrée.");

    // =======================================================
    // ⚙️ Logique d'Application Générale
    // =======================================================

    // Exemple 1 : Initialisation de la vidéo sur un index spécifique si besoin
    // loadSlide(1); // Charge directement le deuxième slide au démarrage (index 1)

    // Exemple 2 : Déclenchement d'une action du slider via un autre élément
    const iaFeedContainer = document.querySelector('.c-ia-feed-container');

    if (iaFeedContainer) {
        iaFeedContainer.addEventListener('dblclick', () => {
            console.log("Double-clic détecté : Passage au slide suivant.");
            nextSlide();
        });
    }

    // Exemple 3 : Utilisation de la fonction formatTimecode
    const startupTime = 480.75; // 8 minutes et 0.75 secondes
    console.log(`Dernier Timecode de session: ${formatTimecode(startupTime)}`); 

    // =======================================================
    // ⚠️ Solution pour l'avertissement #modalSystem introuvable
    // =======================================================
    // Si l'avertissement persiste, cela signifie que modalSystem.js
    // s'exécute AVANT que le DOM ait chargé #modalSystem.
    // L'utilisation de document.addEventListener('DOMContentLoaded', ...) dans
    // modalSystem.js devrait suffire, mais assurez-vous que :
    // 1. Votre balise <div id="modalSystem" ...> est bien présente dans le HTML.
    // 2. Tous les scripts sont bien placés à la fin du <body>.

    console.log("Application prête à interagir avec les modules Slider et Modal.");
    
});