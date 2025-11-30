document.addEventListener('DOMContentLoaded', () => {
    const PORT_PRODUIT = 'http://localhost:5001';
    
    // --- Éléments du DOM ---
    const titleElement = document.getElementById('article-title');
    const mediaContainer = document.getElementById('mediaPreview'); // Renommé
    const resultatsTopic = document.getElementById('resultatsTopic');
    const statusElement = document.getElementById('generation-status');
    const consoleLog = document.getElementById('console-log');
    const customPromptArea = document.getElementById('custom-prompt');
    const currentMediaTypeSpan = document.getElementById('current-media-type');
    const mediaTypeStatusSpan = document.getElementById('media-type-status');

    // --- Boutons de contrôle ---
    const btnRegenTitle = document.getElementById('btn-regenerate-title');
    const btnRegenMedia = document.getElementById('btn-regenerate-media'); // Nouveau
    const btnRegenContent = document.getElementById('btn-regenerate-content');
    const btnSaveContent = document.getElementById('btn-save-content');
    const btnGenerateCustom = document.getElementById('btn-generate-custom');
    const mediaTypeButtons = document.querySelectorAll('.media-type-btn');

    // --- Variables d'État Global ---
    let currentTopic = null; // Utilisé par le menu de gauche
    let currentMediaType = 'image'; // 'image' ou 'video'

    // ... (Fonctions utilitaires log, setStatus, toggleControls inchangées) ...

    // Fonction log simplifiée pour cet extrait
    const log = (message, type = 'INFO') => {
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
    
    // --- Fonctions de Génération Adaptées ---
    
    // Détermine la source du prompt (Menu ou Input Manuel)
    const getSourceTopic = () => {
        const customPrompt = customPromptArea.value.trim();
        if (customPrompt.length > 0) {
            // Si l'utilisateur a saisi un prompt, utilisez-le comme "topic" ad-hoc.
            return customPrompt; 
        }
        return currentTopic; // Sinon, utilisez la thématique sélectionnée.
    };

    // 1. Génération du titre
    const generateTitle = async (source) => {
        titleElement.innerHTML = 'Chargement du titre...';
        log(`Génération du titre à partir de: "${source.substring(0, 30)}..."`, 'API_CALL');
        // Utilise l'endpoint existant
        try {
            const response = await fetch(`${PORT_PRODUIT}/title?topic=${encodeURIComponent(source)}`);
            if (!response.ok) throw new Error(await response.text());
            const title = await response.text();
            titleElement.innerHTML = title;
            log('Titre généré avec succès.', 'SUCCESS');
        } catch (error) {
            log(`Erreur lors de la génération du titre: ${error.message}`, 'ERROR');
            titleElement.innerHTML = `Erreur de titre : ${error.message}`;
        }
    };

    // 2. Génération de Média (Image ou Vidéo)
    const generateMedia = async (source, type) => {
        mediaContainer.innerHTML = `<p>Chargement de ${type} en cours...</p>`;
        log(`Génération de ${type} pour: "${source.substring(0, 30)}..."`, 'API_CALL');
        
        try {
            let response;
            if (type === 'image') {
                response = await fetch(`${PORT_PRODUIT}/image?topic=${encodeURIComponent(source)}`);
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error);
                }
                const imageData = await response.json();
                const imageElement = document.createElement('img');
                imageElement.src = `data:image/webp;base64,${imageData.image}`;
                imageElement.alt = `Image illustrant le thème ${source}`;
                mediaContainer.innerHTML = '';
                mediaContainer.appendChild(imageElement);
                log('Image générée (Base64) avec succès.', 'SUCCESS');
            
            } else if (type === 'video') {
                // ATTENTION: La route /generate_video est bloquante, ceci est pour le POC.
                mediaContainer.innerHTML = `<p><i class="fas fa-spinner fa-spin"></i> Génération Vidéo AGI en cours... (Cela peut prendre plusieurs minutes)</p>`;
                log(`Lancement de l'opération VEO. Ceci peut bloquer le serveur pour 1-2 minutes.`, 'WARN');
                
                response = await fetch(`${PORT_PRODUIT}/generate_video?topic=${encodeURIComponent(source)}`);
                
                const result = await response.json();
                
                if (!response.ok) {
                    throw new Error(result.error || 'Erreur inconnue de génération vidéo.');
                }
                
                // Si succès, afficher le lien ou le statut
                mediaContainer.innerHTML = `<p>✅ Vidéo Sauvegardée !</p><p>Fichier: <strong>${result.filename}</strong></p><p>Voir les logs console pour les étapes.</p>`;
                log(`Vidéo générée. Fichier(s) sauvegardé(s): ${result.filename}`, 'SUCCESS');

            }
            
        } catch (error) {
            log(`Erreur lors de la génération de ${type}: ${error.message}`, 'ERROR');
            mediaContainer.innerHTML = `<p>💥 Erreur lors de la génération de ${type}: ${error.message}</p>`;
        }
    };

    // 3. Génération du contenu
    const generateContent = async (source) => {
        resultatsTopic.innerHTML = 'Chargement de l\'article...';
        log(`Génération du contenu pour: "${source.substring(0, 30)}..."`, 'API_CALL');
        try {
            const response = await fetch(`${PORT_PRODUIT}/content?topic=${encodeURIComponent(source)}`);
            if (!response.ok) throw new Error(await response.text());
            const content = await response.text();
            resultatsTopic.innerHTML = content;
            log('Contenu de l\'article généré avec succès.', 'SUCCESS');
        } catch (error) {
            log(`Erreur lors de la génération du contenu: ${error.message}`, 'ERROR');
            resultatsTopic.innerHTML = `Une erreur est survenue : ${error.message}`;
        }
    };
    
    // 4. Sauvegarde (Utilise le currentTopic ou le prompt comme "Topic ID" pour le nom de fichier)
    const saveContent = async () => {
        const source = getSourceTopic();
        if (!source) {
            alert('Sélectionnez un thème ou entrez un prompt d\'abord.');
            return;
        }

        const imageElement = mediaContainer.querySelector('img');
        const content = resultatsTopic.innerHTML;
        const title = titleElement.textContent;

        // Seule la sauvegarde d'image est supportée par /save, les vidéos sont déjà sur disque.
        if (currentMediaType === 'image' && (!imageElement || !content || !title)) {
            alert('Titre, image ou contenu manquant avant l\'enregistrement.');
            return;
        }
        
        let imageData = null;
        if (currentMediaType === 'image' && imageElement) {
             imageData = imageElement.src.split(',')[1];
        } else if (currentMediaType === 'video') {
             // Si c'est une vidéo, nous enregistrons le contenu sans la base64 de l'image.
             // Le serveur devra ajuster l'enregistrement si l'imageData est nulle.
             log('Sauvegarde de l\'article (Le média vidéo est déjà sur disque).', 'ACTION');
        }

        try {
            const response = await fetch(`${PORT_PRODUIT}/save`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    title, 
                    // Pour la sauvegarde, on utilise le prompt/topic comme identifiant
                    topic: source.substring(0, 50), 
                    imageData: imageData || 'NO_IMAGE', // Envoi de 'NO_IMAGE' si c'est une vidéo
                    content 
                }),
            });
            if (response.ok) {
                alert('Contenu enregistré avec succès !');
                log('Article enregistré dans /output/', 'SUCCESS');
            } else {
                const errorText = await response.text();
                alert(`Erreur lors de l'enregistrement : ${errorText}`);
                log(`Erreur d'enregistrement: ${errorText}`, 'ERROR');
            }
        } catch (error) {
            console.error('Erreur :', error);
            alert('Erreur lors de l\'enregistrement du contenu.');
            log(`Erreur réseau lors de l'enregistrement: ${error.message}`, 'ERROR');
        }
    };


    // --- Gestionnaires d'Événements ---

    // 1. Clic sur le menu de Thème
    document.querySelectorAll('.theme-link').forEach(link => {
        link.addEventListener('click', async (event) => {
            event.preventDefault();
            currentTopic = link.dataset.topic;
            customPromptArea.value = ''; // Effacer le prompt manuel
            log(`Thème sélectionné : ${currentTopic}. Début de la génération.`, 'ACTION');
            
            document.querySelectorAll('.theme-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Lancement de la génération complète
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

    // 2. Choix du type de Média (Image/Vidéo)
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

    // 3. Bouton "Générer à partir du Prompt"
    btnGenerateCustom.addEventListener('click', async () => {
        const source = getSourceTopic();
        if (!source) {
            log('Veuillez entrer un prompt avant de générer.', 'WARN');
            alert('Veuillez entrer un prompt avant de générer.');
            return;
        }
        currentTopic = null; // Désactiver la sélection du menu
        log(`Génération manuelle lancée à partir du prompt.`, 'ACTION');

        toggleControls(false); 
        setStatus('Génération manuelle en cours...', 'working');
        await generateTitle(source);
        await generateMedia(source, currentMediaType);
        await generateContent(source);
        setStatus('Prêt pour la révision et l\'enregistrement', 'success');
        toggleControls(true);
    });

    // 4. Gestionnaires de Régénération
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
    log("Dashboard initialisé. Média par défaut: Image.", 'INFO');
});