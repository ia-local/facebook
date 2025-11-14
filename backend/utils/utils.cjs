// backend/utils/utils.js (Version CommonJS)
// Fonctions utilitaires pour la manipulation de fichiers binaires et les téléchargements.

const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');

// Détermination du chemin absolu du répertoire.
// En CommonJS, __dirname et __filename sont définis.
const projectRoot = path.resolve(__dirname,  '..', 'data'); // Adapter pour atteindre la racine du projet

/**
 * Sauvegarde un buffer de données binaires dans un fichier local.
 * [Fonction saveBinaryFile inchangée dans sa logique]
 */
async function saveBinaryFile(filename, buffer) {
  const outputDir = path.join(projectRoot, 'generated_assets');
  
  await fs.mkdir(outputDir, { recursive: true });
  
  const fullPath = path.join(outputDir, filename);
  
  await fs.writeFile(fullPath, buffer);
  console.log(`💾 Fichier sauvegardé : ${fullPath}`);
  return filename; 
}

/**
 * Détermine l'extension de fichier à partir du type MIME.
 * [Fonction getFileExtension inchangée dans sa logique]
 */
function getFileExtension(mimeType) {
  const parts = mimeType.split('/');
  return parts.length > 1 ? parts[1].toLowerCase().replace('video/', '') : 'bin';
}

/**
 * Télécharge et sauvegarde une vidéo générée par l'API GenAI.
 * [Fonction downloadAndSaveVideo inchangée dans sa logique]
 */
async function downloadAndSaveVideo(video, index, apiKey) {
  const videoUri = video?.video?.uri; 
  
  if (!videoUri) {
    console.warn(`⚠️ Téléchargement ignoré pour l'index ${index} : URI de vidéo manquante.`);
    console.warn(`[DEBUG] Objet asset vidéo reçu (Max 200 chars): ${JSON.stringify(video).substring(0, 200)}...`); 
    return null; 
  }
  
  try {
    const mimeType = video.mimeType || 'video/mp4';
    const fileExtension = getFileExtension(mimeType);
    const fileName = `generated_video_${Date.now()}_${index}.${fileExtension}`;
    
    const downloadUrl = `${videoUri}&key=${apiKey}`; 

    console.log(`⬇️ Démarrage du téléchargement de la vidéo ${index} (${fileName}) depuis ${downloadUrl.substring(0, 80)}...`);
    
    const response = await axios({
      method: 'GET',
      url: downloadUrl,
      responseType: 'arraybuffer',
      headers: {}, 
    });

    const buffer = Buffer.from(response.data);
    const savedFileName = await saveBinaryFile(fileName, buffer);
    
    console.log(`✅ Vidéo ${index} téléchargée et sauvegardée.`);
    return savedFileName; 
    
  } catch (error) {
    console.error(`💥 Échec du téléchargement de la vidéo ${index} (URL de base: ${videoUri}):`, error.message);
    return null; 
  }
}

module.exports = {
    saveBinaryFile,
    getFileExtension,
    downloadAndSaveVideo
};