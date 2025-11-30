// sliderVideo.js

// 1. Définition des données (comme vu dans videos.json)
const VIDEO_SLIDES = [
    {
        "id": 1,
        "url": "data/video/background_1.mp4", // REMPLACER PAR VOS VRAIES URLS
        "type": "video/mp4",
        "caption": "Aube sur les montagnes : Calme et inspiration.",
        "media_type": "video"
    },
    {
        "id": 2,
        "url": "video/background_2.mp4", 
        "type": "data/video/mp4",
        "caption": "Flux urbain nocturne : L'énergie de la ville.",
        "media_type": "video"
    },
    {
        "id": 3,
        "url": "video/background_3.mp4", 
        "type": "data/video/mp4",
        "caption": "Vagues de l'océan : Concentration et sérénité.",
        "media_type": "video"
    }
];

// 2. Initialisation des variables
const videoElement = document.getElementById('backgroundVideo');
const captionElement = document.getElementById('slideCaption');
const prevBtn = document.getElementById('prevSlideBtn');
const nextBtn = document.getElementById('nextSlideBtn');

let currentIndex = 0; // Le slide actuellement affiché
let isTransitioning = false; // Flag pour éviter les clics multiples rapides

/**
 * Charge et affiche un slide vidéo spécifique.
 * @param {number} index L'index du slide à charger.
 */
function loadSlide(index) {
    if (isTransitioning) return;
    isTransitioning = true;
    
    const slide = VIDEO_SLIDES[index];

    // 1. Transition visuelle (opacité)
    videoElement.style.opacity = 0;
    
    // Attendre la fin de la transition d'opacité (0.5s définie dans le CSS)
    setTimeout(() => {
        // 2. Mise à jour de la source vidéo
        // On vérifie s'il y a déjà une balise <source>, sinon on l'ajoute
        let source = videoElement.querySelector('source');
        if (!source) {
            source = document.createElement('source');
            videoElement.appendChild(source);
        }
        
        source.src = slide.url;
        source.type = slide.type;
        
        // 3. Rechargement de la vidéo et lecture
        videoElement.load();
        videoElement.play().catch(error => {
            console.warn("La lecture auto a été bloquée (navigateur) :", error);
            // Afficher un bouton de lecture si l'autoplay échoue
        });

        // 4. Mise à jour de la légende
        captionElement.textContent = slide.caption;

        // 5. Rendre la vidéo visible
        videoElement.style.opacity = 1;
        isTransitioning = false;
        
    }, 500); // Correspond à la durée de transition CSS (0.5s)
}

/**
 * Passe au slide suivant avec boucle infinie.
 */
function nextSlide() {
    // Calcul de l'index suivant avec l'opérateur modulo (%) pour la boucle infinie
    currentIndex = (currentIndex + 1) % VIDEO_SLIDES.length;
    loadSlide(currentIndex);
}

/**
 * Passe au slide précédent avec boucle infinie.
 */
function prevSlide() {
    // Calcul de l'index précédent, en s'assurant qu'il reste positif
    currentIndex = (currentIndex - 1 + VIDEO_SLIDES.length) % VIDEO_SLIDES.length;
    loadSlide(currentIndex);
}

// 3. Événements de Navigation
document.addEventListener('DOMContentLoaded', () => {
    if (VIDEO_SLIDES.length > 0) {
        // Charger le premier slide au démarrage
        loadSlide(currentIndex); 
    }

    // Écouteurs pour les boutons
    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
    }
});