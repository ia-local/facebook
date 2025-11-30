// sliderVideo.js

// 1. Définition des données du Carrousel
// sliderVideo.js (CHEMINS CORRIGÉS)
const VIDEO_SLIDES = [
    {
        "id": 1,
        "url": "data/video/drone_1.mp4", 
        "type": "video/mp4", // Le type MIME doit être "video/mp4", pas le chemin du dossier
        "caption": "Aube sur les montagnes : Calme et inspiration.",
        "media_type": "video"
    },
    {
        "id": 2,
        "url": "data/video/drone_2.mp4", // CORRIGÉ
        "type": "video/mp4", // CORRIGÉ
        "caption": "Flux urbain nocturne : L'énergie de la ville.",
        "media_type": "video"
    },
    {
        "id": 3,
        "url": "data/video/drone_3.mp4", // CORRIGÉ
        "type": "video/mp4", // CORRIGÉ
        "caption": "Vagues de l'océan : Concentration et sérénité.",
        "media_type": "video"
    }
];

// 2. Initialisation des variables globales
const videoElement = document.getElementById('backgroundVideo');
const captionElement = document.getElementById('slideCaption');
const prevBtn = document.getElementById('prevSlideBtn');
const nextBtn = document.getElementById('nextSlideBtn');

let currentIndex = 0; // Le slide actuellement affiché
let isTransitioning = false; // Verrou pour éviter les enchaînements rapides

/**
 * Charge et affiche un slide vidéo spécifique.
 * Gère la transition d'opacité et le rechargement de la vidéo.
 * @param {number} index L'index du slide à charger.
 */
export function loadSlide(index) {
    // 0. Sécurité et Gestion du Verrou
    if (isTransitioning || VIDEO_SLIDES.length === 0) return;
    isTransitioning = true;
    
    // S'assurer que l'index est valide même s'il vient d'un appel externe
    index = (index % VIDEO_SLIDES.length + VIDEO_SLIDES.length) % VIDEO_SLIDES.length;
    currentIndex = index;

    const slide = VIDEO_SLIDES[index];

    // 1. Transition visuelle : Masquer la vidéo
    videoElement.style.opacity = 0;
    
    // Attendre la fin de la transition d'opacité (0.5s définie dans le CSS)
    setTimeout(() => {
        // 2. Mise à jour de la source vidéo
        videoElement.src = slide.url; // Simplification en utilisant l'attribut src directement
        
        // 3. Rechargement et Lecture
        videoElement.load();
        videoElement.play().catch(error => {
            console.warn(`Lecture auto bloquée pour la vidéo ID ${slide.id}.`, error);
        });

        // 4. Mise à jour de la légende
        captionElement.textContent = slide.caption;

        // 5. Afficher la vidéo
        videoElement.style.opacity = 1;
        isTransitioning = false;
        
    }, 500); // Correspond à la durée de transition CSS
}

/**
 * Passe au slide suivant avec boucle infinie (infinite loop).
 */
export function nextSlide() {
    // Calcul de l'index suivant avec l'opérateur modulo (%)
    const nextIndex = (currentIndex + 1) % VIDEO_SLIDES.length;
    loadSlide(nextIndex);
}

/**
 * Passe au slide précédent avec boucle infinie.
 */
export function prevSlide() {
    // Calcul de l'index précédent, s'assurant qu'il ne devient pas négatif
    const prevIndex = (currentIndex - 1 + VIDEO_SLIDES.length) % VIDEO_SLIDES.length;
    loadSlide(prevIndex);
}


// 3. Initialisation et Événements
document.addEventListener('DOMContentLoaded', () => {
    if (VIDEO_SLIDES.length > 0) {
        // Charger le premier slide au démarrage
        loadSlide(currentIndex); 
    }

    // Écouteurs pour les boutons de pagination
    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
    }
});