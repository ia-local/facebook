/**
 * Fichier : linkedin.js
 * Version : 1.0 (B-QPV)
 * Rôle : Gère l'automatisation de la production et de la simulation de la publication LinkedIn.
 */
const fs = require('fs/promises');
const path = require('path');

const ARTICLE_TEMPLATE_PATH = path.join(__dirname, 'linkedin_article.json');
const DUMMY_PUBLICATION_LOG = path.join(__dirname, 'log_publications.txt');

/**
 * Lit le modèle JSON pour l'article LinkedIn.
 * @returns {Promise<object>} Le contenu de l'article en tant qu'objet JavaScript.
 */
async function readArticleTemplate() {
    try {
        const data = await fs.readFile(ARTICLE_TEMPLATE_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('❌ [LinkedIn.js] Erreur lors de la lecture du modèle JSON :', error.message);
        // Retourne une structure minimale en cas d'échec
        return { 
            headline: { title: "Erreur de chargement", hook: "Vérifiez linkedin_article.json" }, 
            content_sections: [],
            call_to_action: { prompt: "CONTACTEZ-MOI" },
            keywords_tags: []
        };
    }
}

/**
 * Formate le contenu structuré en un article LinkedIn aéré (Markdown).
 * @param {object} articleData - L'objet article lu depuis le JSON.
 * @returns {string} Le corps de l'article formaté.
 */
function formatLinkedInPost(articleData) {
    const { headline, content_sections, call_to_action, keywords_tags, local_image_path } = articleData;

    let post = '';
    
    // 1. Titre et Hook
    post += `\n### 👑 ${headline.title}\n\n`;
    post += `${headline.hook}\n\n`;
    post += `[Image Asset: ${local_image_path}]\n\n`; // Référence à l'image

    // 2. Corps de l'article (Sections)
    content_sections.forEach(section => {
        post += `--- \n### ⚙️ ${section.section_title}\n\n`;
        post += `${section.body}\n\n`;
    });

    // 3. Appel à l'Action (CTA)
    post += `\n***\n`;
    post += `🚀 **L'Appel à l'Action :** ${call_to_action.prompt}\n\n`;

    // 4. Hashtags
    post += keywords_tags.map(tag => `#${tag}`).join(' ');
    
    return post;
}

/**
 * Simule la publication et log l'action.
 * NOTE : Dans une implémentation réelle, c'est ici que l'API LinkedIn serait appelée.
 * @param {string} finalPost - Le contenu de l'article formaté.
 * @returns {Promise<void>}
 */
async function simulateLinkedInPublish(finalPost) {
    const logEntry = `[${new Date().toISOString()}] - PUBLICATION SIMULÉE - Focale: ${finalPost.substring(0, 50)}...\n`;
    
    // Log le résumé de la publication
    await fs.appendFile(DUMMY_PUBLICATION_LOG, logEntry);
    
    console.log(`\n✅ [LinkedIn.js] Publication simulée avec succès ! Log enregistré.`);
    console.log('--- APERÇU DU POST FINAL (Markdown) ---');
    console.log(finalPost);
    console.log('----------------------------------------');
}

/**
 * Fonction principale du module LinkedIn (point d'entrée pour le scheduler).
 */
async function runLinkedInAutomation() {
    const articleData = await readArticleTemplate();
    // Ici, vous pourriez appeler Groq pour RENSEIGNER les <PLACEHOLDERS>
    // const finalizedData = await groqFillTemplate(articleData); 
    
    const finalPost = formatLinkedInPost(articleData);
    await simulateLinkedInPublish(finalPost);
}

module.exports = {
    runLinkedInAutomation,
    // Exporter d'autres fonctions si elles sont nécessaires pour des tests unitaires
    formatLinkedInPost 
};