/**
 * daily.js
 * Script d'automatisation quotidienne de la génération et de l'enregistrement d'articles LinkedIn.
 * Exécuté via Node.js (nécessite 'node-fetch' installé: npm install node-fetch)
 */
const fetch = require('node-fetch'); 

// TENSOR_CONSTANTS_("■□▲▼▶◀◆●")
const API_BASE = 'http://localhost:5007'; 
const MAX_POSTS_PER_DAY = 1;

// Liste des thèmes à cycler pour l'automatisation
const THEME_LIST = [
    "AGI_1_Linkedin_-icon-réseau_social_professionnel", 
    "AGI_1_Linkedin_-icon-kit_model",
    "AGI_1_Linkedin_-icon-article_model",
    "AGI_1_Linkedin_-icon-article__CV numérique",
    "AGI_1_Linkedin_-icon-article__lettre_de_motivation"
];

let lastTopicIndex = -1; // Index pour le cycle

// Fonction pour sélectionner le thème suivant de manière cyclique
const getNextTopic = () => {
    lastTopicIndex = (lastTopicIndex + 1) % THEME_LIST.length;
    return THEME_LIST[lastTopicIndex];
};

const runDailyGeneration = async () => {
    console.log("╔════════════════════════════════════════════╗");
    console.log("║ 📅 Démarrage du Workflow Quotidien AGI 🚀  ║");
    console.log(`║ ⏰ Timestamp: ${new Date().toISOString()} ║`);
    console.log("╚════════════════════════════════════════════╝");

    for (let i = 0; i < MAX_POSTS_PER_DAY; i++) {
        const topic = getNextTopic();
        let title, base64Image, content;

        console.log(`\n▶ Tâche #${i + 1}: Génération pour le thème **${topic}**`);

        try {
            // ÉTAPE 1: Générer le Titre (Endpoint: /title)
            process.stdout.write("  ░ 1/4 - Titre...");
            const titleResponse = await fetch(`${API_BASE}/title?topic=${topic}`);
            if (!titleResponse.ok) throw new Error(`Erreur Titre: ${await titleResponse.text()}`);
            title = await titleResponse.text();
            console.log(`✅ OK. Titre: ${title.trim().replace(/\n/g, '')}`);

            // ÉTAPE 2: Générer l'Image (Endpoint: /image)
            process.stdout.write("  ▒ 2/4 - Image...");
            const imageResponse = await fetch(`${API_BASE}/image?topic=${topic}`);
            if (!imageResponse.ok) throw new Error(`Erreur Image: ${JSON.stringify(await imageResponse.json())}`);
            const imageData = await imageResponse.json(); 
            base64Image = imageData.image; 
            console.log(`✅ OK. Image (Base64) de taille: ${Math.round(base64Image.length / 1024)} KB`);

            // ÉTAPE 3: Générer le Contenu (Endpoint: /content)
            process.stdout.write("  ▓ 3/4 - Contenu...");
            const contentResponse = await fetch(`${API_BASE}/content?topic=${topic}`);
            if (!contentResponse.ok) throw new Error(`Erreur Contenu: ${await contentResponse.text()}`);
            content = await contentResponse.text();
            console.log(`✅ OK. Contenu généré (Taille: ${content.length} octets)`);

            // ÉTAPE 4: Enregistrer l'Article (Endpoint: /save)
            process.stdout.write("  █ 4/4 - Enregistrement...");
            const saveResponse = await fetch(`${API_BASE}/save`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    title, 
                    topic, 
                    imageData: base64Image, 
                    content 
                }),
            });

            if (saveResponse.ok) {
                console.log(`\n🎉 SUCCÈS: Article enregistré dans /output/ !`);
                // Placeholder pour la prochaine étape: Publication LinkedIn
                console.log(`\n... L'article est prêt pour la publication (à intégrer ici).`);
            } else {
                throw new Error(`Erreur Enregistrement: ${await saveResponse.text()}`);
            }

        } catch (error) {
            console.error(`\n\n❌ ÉCHEC CRITIQUE de la génération quotidienne pour ${topic}:`);
            console.error(`> ${error.message}`);
        }
    }
    console.log("\n╚════════════════════════════════════════════╝");
    console.log("║ 🟢 Fin du Cycle Quotidien. Serveur toujours actif. ║");
    console.log("╚════════════════════════════════════════════╝");
};

runDailyGeneration();