// calc.js

/**
 * Utilité : Formate un nombre de secondes en format Timecode (MM:SS.ms).
 * @param {number} totalSeconds - Le nombre total de secondes à formater.
 * @returns {string} Le timecode formaté.
 */
export function formatTimecode(totalSeconds) {
    if (isNaN(totalSeconds) || totalSeconds < 0) {
        return "00:00.00";
    }
    
    // Calcule les minutes, secondes et millisecondes
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    // Millisecondes sur deux chiffres (centièmes de seconde)
    const ms = Math.floor((totalSeconds - Math.floor(totalSeconds)) * 100); 

    // Formate les chiffres avec deux décimales (pad)
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');
    const formattedMs = String(ms).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}.${formattedMs}`;
}

// Logic embarquée (auto-initialisation) : Mise à jour du timecode dans le modal
document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('backgroundVideo');
    const timecodeDisplay = document.getElementById('timecodeDisplay');

    if (video && timecodeDisplay) {
        // Met à jour l'affichage du timecode à chaque rafraîchissement vidéo
        video.addEventListener('timeupdate', () => {
            const currentTime = video.currentTime;
            timecodeDisplay.textContent = `Timecode actuel: ${formatTimecode(currentTime)}`;
        });
    }
});