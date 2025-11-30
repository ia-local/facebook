// docs/facebook.js
// Logique du dashboard pour la plateforme FACEBOOK
document.addEventListener('DOMContentLoaded', () => {
    
    // =========================================================================
    // I. CONFIGURATION DE LA PLATEFORME
    // =========================================================================
    const PLATFORM = 'facebook'; 
    const API_BASE = `/${PLATFORM}`; // Utilise le préfixe /facebook
    
    // --- Éléments du DOM ---
    const titleElement = document.getElementById('article-title');
    const mediaContainer = document.getElementById('mediaPreview'); 
    const resultatsTopic = document.getElementById('resultatsTopic');
    const statusElement = document.getElementById('generation-status');
    const consoleLog = document.getElementById('console-log');
    const customPromptArea = document.getElementById('custom-prompt');
    const currentMediaTypeSpan = document.getElementById('current-media-type');
    const mediaTypeStatusSpan = document.getElementById('media-type-status');

    // --- Boutons de contrôle ---
    const btnRegenTitle = document.getElementById('btn-regenerate-title');
    const btnRegenMedia = document.getElementById('btn-regenerate-media'); 
    const btnRegenContent = document.getElementById('btn-regenerate-content');
    const btnSaveContent = document.getElementById('btn-save-content');
    const btnGenerateCustom = document.getElementById('btn-generate-custom');
    const mediaTypeButtons = document.querySelectorAll('.media-type-btn');

    // --- Variables d'État Global ---
    let currentTopic = null; // Utilisé par le menu de gauche
    let currentMediaType = 'image'; // 'image' ou 'video'
    
    // --- Fonctions utilitaires (log, setStatus, toggleControls) ---
    const log = (message, type = 'INFO') => {
        // [Logique de log inchangée]
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = `<span class="log-${type.toLowerCase()}" style="font-weight:bold;">[${timestamp}][${type}]</span> ${message}\n`;
        consoleLog.innerHTML = logEntry + consoleLog.innerHTML;
        const lines = consoleLog.innerHTML.split('\n').filter(line => line.trim() !== '');
        if (lines.length > 20) {
            consoleLog.innerHTML = lines.slice(0, 20).join('\n');
        }
    };
    
    const setStatus = (status, className = 'idle') => {
        statusElement.textContent = status;
        statusElement.className = `status-${className}`;
    };

    const toggleControls = (enabled) => {
        btnRegenTitle.disabled = !enabled;
        btnRegenMedia.disabled = !enabled;
        btnRegenContent.disabled = !enabled;
        btnSaveContent.disabled = !enabled;
    };
    
    // --- Logique de Génération Adaptée ---
    
    const getSourceTopic = () => {
        const customPrompt = customPromptArea.value.trim();
        if (customPrompt.length > 0) {
            return customPrompt; 
        }
        return currentTopic; 
    };

    // 1. Génération du titre (ciblant /facebook/title)
    const generateTitle = async (source) => {
        titleElement.innerHTML = 'Chargement du titre...';
        log(`Génération du titre [${PLATFORM}] à partir de: "${source.substring(0, 30)}..."`, 'API_CALL');
        try {
            const response = await fetch(`${API_BASE}/title?topic=${encodeURIComponent(source)}`);
            if (!response.ok) throw new Error(await response.text());
            const title = await response.text();
            titleElement.innerHTML = title;
            log('Titre généré avec succès.', 'SUCCESS');
        } catch (error) {
            log(`Erreur lors de la génération du titre: ${error.message}`, 'ERROR');
            titleElement.innerHTML = `Erreur de titre : ${error.message}`;
        }
    };

    // 2. Génération de Média (ciblant /facebook/image ou /facebook/generate_video)
    const generateMedia = async (source, type) => {
        mediaContainer.innerHTML = `<p>Chargement de ${type} en cours...</p>`;
        log(`Génération de ${type} [${PLATFORM}] pour: "${source.substring(0, 30)}..."`, 'API_CALL');
        
        try {
            let url = (type === 'image') ? `${API_BASE}/image?topic=` : `${API_BASE}/generate_video?topic=`;
            let response;
            
            if (type === 'video') {
                mediaContainer.innerHTML = `<p><i class="fas fa-spinner fa-spin"></i> Génération Vidéo AGI en cours... (LONG)</p>`;
                log(`Lancement de l'opération VEO. Ceci peut bloquer le serveur.`, 'WARN');
            }

            response = await fetch(`${url}${encodeURIComponent(source)}`);
                
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Erreur inconnue de génération média.');
            }
            
            const result = await response.json();
            
            if (type === 'image') {
                const imageElement = document.createElement('img');
                imageElement.src = `data:image/webp;base64,${result.image}`;
                imageElement.alt = `Image illustrant le thème ${source}`;
                mediaContainer.innerHTML = '';
                mediaContainer.appendChild(imageElement);
                log('Image générée (Base64) avec succès.', 'SUCCESS');
            } else { // type === 'video'
                mediaContainer.innerHTML = `<p>✅ Vidéo Sauvegardée !</p><p>Fichier: <strong>/generated_assets/${result.filename.split(';')[0]}</strong></p>`;
                log(`Vidéo générée. Fichier(s) sauvegardé(s): ${result.filename}`, 'SUCCESS');
            }

        } catch (error) {
            log(`Erreur lors de la génération de ${type}: ${error.message}`, 'ERROR');
            mediaContainer.innerHTML = `<p>💥 Erreur lors de la génération de ${type}: ${error.message}</p>`;
        }
    };

    // 3. Génération du contenu (ciblant /facebook/content)
    const generateContent = async (source) => {
        resultatsTopic.innerHTML = 'Chargement de l\'article...';
        log(`Génération du contenu [${PLATFORM}] pour: "${source.substring(0, 30)}..."`, 'API_CALL');
        try {
            const response = await fetch(`${API_BASE}/content?topic=${encodeURIComponent(source)}`);
            if (!response.ok) throw new Error(await response.text());
            const content = await response.text();
            resultatsTopic.innerHTML = content;
            log('Contenu de l\'article généré avec succès.', 'SUCCESS');
        } catch (error) {
            log(`Erreur lors de la génération du contenu: ${error.message}`, 'ERROR');
            resultatsTopic.innerHTML = `Une erreur est survenue : ${error.message}`;
        }
    };
    
    // 4. Sauvegarde (Le topic doit être préfixé par la plateforme)
    const saveContent = async () => {
        const source = getSourceTopic();
        if (!source) {
            alert('Sélectionnez un thème ou entrez un prompt d\'abord.');
            return;
        }

        const imageElement = mediaContainer.querySelector('img');
        const content = resultatsTopic.innerHTML;
        const title = titleElement.textContent;
        
        let imageData = null;
        if (currentMediaType === 'image' && imageElement) {
             imageData = imageElement.src.split(',')[1];
        } else if (currentMediaType === 'video') {
             imageData = 'NO_IMAGE';
             log('Sauvegarde de l\'article (Le média vidéo est déjà sur disque).', 'ACTION');
        }

        try {
            // Le topic est préfixé pour l'archivage: ex. 'facebook_AGI_topic'
            const prefixedTopic = `${PLATFORM}_${source.substring(0, 50).replace(/[^a-zA-Z0-9_]/g, '')}`; 

            const response = await fetch(`/save`, { // Utilise la route /save globale
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    title, 
                    topic: prefixedTopic, // Envoi du topic préfixé
                    imageData: imageData, 
                    content 
                }),
            });
            if (response.ok) {
                alert(`Contenu [${PLATFORM}] enregistré avec succès !`);
                log(`Article [${PLATFORM}] enregistré dans /output/ avec topic: ${prefixedTopic}`, 'SUCCESS');
            } else {
                const errorText = await response.text();
                alert(`Erreur lors de l'enregistrement : ${errorText}`);
                log(`Erreur d'enregistrement: ${errorText}`, 'ERROR');
            }
        } catch (error) {
            console.error('Erreur :', error);
            alert('Erreur lors de l\'enregistrement du contenu.');
            log(`Erreur réseau lors de l\'enregistrement: ${error.message}`, 'ERROR');
        }
    };


    // --- Gestionnaires d'Événements (Logique identique à dashboard.js) ---
    
    // 1. Clic sur le menu de Thème (inchangé)
    document.querySelectorAll('.theme-link').forEach(link => {
        link.addEventListener('click', async (event) => {
            event.preventDefault();
            currentTopic = link.dataset.topic;
            customPromptArea.value = ''; 
            
            document.querySelectorAll('.theme-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            const source = getSourceTopic();
            if (source) {
                toggleControls(false); 
                setStatus('Génération en cours...', 'working');
                await generateTitle(source);
                await generateMedia(source, currentMediaType);
                await generateContent(source);
                setStatus('Prêt pour la révision et l\'enregistrement', 'success');
                toggleControls(true); 
            }
        });
    });

    // 2. Choix du type de Média (Image/Vidéo) (inchangé)
    mediaTypeButtons.forEach(button => {
        button.addEventListener('click', () => {
            currentMediaType = button.dataset.media;
            currentMediaTypeSpan.textContent = currentMediaType.charAt(0).toUpperCase() + currentMediaType.slice(1);
            mediaTypeStatusSpan.innerHTML = `(Média: **${currentMediaType}**)`;
            
            mediaTypeButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            log(`Type de média défini sur : ${currentMediaType}`, 'CONFIG');
        });
    });

    // 3. Bouton "Générer à partir du Prompt" (inchangé)
    btnGenerateCustom.addEventListener('click', async () => {
        const source = getSourceTopic();
        if (!source) {
            log('Veuillez entrer un prompt avant de générer.', 'WARN');
            alert('Veuillez entrer un prompt avant de générer.');
            return;
        }
        currentTopic = null; 
        log(`Génération manuelle lancée [${PLATFORM}] à partir du prompt.`, 'ACTION');

        toggleControls(false); 
        setStatus('Génération manuelle en cours...', 'working');
        await generateTitle(source);
        await generateMedia(source, currentMediaType);
        await generateContent(source);
        setStatus('Prêt pour la révision et l\'enregistrement', 'success');
        toggleControls(true);
    });

    // 4. Gestionnaires de Régénération (inchangé)
    btnRegenTitle.onclick = () => {
        const source = getSourceTopic();
        if (source) generateTitle(source); else log('Source non définie.', 'WARN');
    };
    btnRegenMedia.onclick = () => {
        const source = getSourceTopic();
        if (source) generateMedia(source, currentMediaType); else log('Source non définie.', 'WARN');
    };
    btnRegenContent.onclick = () => {
        const source = getSourceTopic();
        if (source) generateContent(source); else log('Source non définie.', 'WARN');
    };
    btnSaveContent.onclick = saveContent;

    // Initialisation
    log(`Dashboard [${PLATFORM.toUpperCase()}] initialisé. Média par défaut: Image.`, 'INFO');
});