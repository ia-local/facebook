// backend/video_generator.js (Version CommonJS)
// ------------------------------------------------------------
// Description: Module principal de génération et de gestion des vidéos (asynchrone).

// Import des dépendances en CommonJS
const { GoogleGenAI, PersonGeneration } = require('@google/genai');
const { downloadAndSaveVideo } = require('./utils/utils.cjs');
const util = require('util');

const sleep = util.promisify(setTimeout);

/**
 * Lance la génération d'une vidéo, attend la fin de l'opération, puis la télécharge.
 * [Fonction generateVideo inchangée dans sa logique]
 */
async function generateVideo(prompt) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Clé API Gemini non définie.");
  }
  
  // Correction: Utiliser GoogleGenAI après l'import si elle est bien exportée comme telle.
  // Si le SDK n'exporte pas 'GoogleGenAI' directement via require, il faudra l'adapter.
  // Je garde le require pour le moment et assume que la variable 'ai' est l'instance correcte.
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }); 
  const model = 'veo-2.0-generate-001';
  const apiKey = process.env.GEMINI_API_KEY;
  let summaryContent = [];
  let savedFileNames = []; 

  // ... (Logique de la fonction generateVideo inchangée) ...

    try {
        // 1. Soumission de l'opération de génération
        let operation = await ai.models.generateVideos({
          model: model,
          prompt: prompt,
          config: {
            numberOfVideos: 1,
            aspectRatio: '16:9',
            durationSeconds: 8,
            personGeneration: PersonGeneration.ALLOW_ALL,
          },
        });

        console.log(`⏳ Opération démarrée. Nom de l'opération: ${operation.name}`);
        
        // 2. Boucle de Polling
        while (!operation.done) {
          console.log(`Video ${operation.name} en cours de génération. Vérification dans 10 secondes...`);
          await sleep(10000); 
          
          operation = await ai.operations.getVideosOperation({
            operation: operation,
          });

          if (operation.error) {
            throw new Error(`Erreur API pendant la génération: ${operation.error.message}`);
          }
        }

        // 3. Traitement des résultats
        const generatedVideos = operation.response?.generatedVideos;
        
        if (!generatedVideos || generatedVideos.length === 0) {
          const errorMessage = operation.response?.error?.message || "La génération s'est terminée, mais aucune vidéo n'a été trouvée.";
          throw new Error(errorMessage);
        }

        summaryContent.push(`✅ Génération terminée! ${generatedVideos.length} vidéo(s) générée(s).`);

        // 4. Téléchargement des vidéos
        for (const [i, videoAsset] of generatedVideos.entries()) {
          const savedFileName = await downloadAndSaveVideo(videoAsset, i, apiKey);
          
          if (savedFileName) {
            summaryContent.push(`[Vidéo ${i + 1}] Téléchargée: ${savedFileName}`);
            savedFileNames.push(savedFileName);
          } else {
            summaryContent.push(`[Vidéo ${i + 1}] ⚠️ Échec du téléchargement: URI manquante ou non-téléchargeable.`);
          }
        }
        
        if (savedFileNames.length === 0) {
            if (summaryContent.length === 1) { 
                summaryContent.push("Aucun fichier vidéo n'a pu être sauvegardé sur le disque.");
            }
        }

        return {
            content: summaryContent.join('\n'),
            filename: savedFileNames.length > 0 ? savedFileNames.join('; ') : "N/A"
        };

    } catch (error) {
        console.error("💥 Erreur lors de la génération de la vidéo:", error.message);
        throw error;
    } 
}

module.exports = {
    generateVideo
};