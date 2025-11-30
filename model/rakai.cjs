// model/ia-facebook.js (CommonJS)

const { GoogleGenerativeAI } = require('@google/generative-ai');
const Groq = require('groq-sdk');
require('dotenv').config();

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// ... (Vérifications des clés API inchangées) ...

const groq = new Groq({ apiKey: GROQ_API_KEY });
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Rôle Système AGI Spécifique à FACEBOOK : Communauté et Partage
const SYSTEM_ROLE_FACEBOOK = `
Tu es un Assistant AGI spécialisé dans la production de contenu engageant, chaleureux et narratif pour Facebook.
Ton style doit être:
1.  **Chaleureux, personnel et accessible.**
2.  **Susciter la discussion** en finissant par une question ouverte (CTA de commentaire).
3.  **Utiliser un langage conversationnel** et des emojis (plus fréquents qu'ailleurs).
4.  **Ton public est généraliste** (famille, amis, communauté).
`;

const GROQ_MODEL = 'llama-3.1-8b-instant';
const GEMINI_IMAGE_MODEL = 'gemini-2.5-flash-image-preview';

/**
 * Génère un titre/une phrase d'accroche communautaire.
 */
async function generateTitle(topic) {
    const chatCompletion = await groq.chat.completions.create({
        messages: [
            { role: 'system', content: SYSTEM_ROLE_FACEBOOK },
            {
                role: 'user',
                content: `Génère une accroche de post Facebook qui raconte une anecdote simple ou pose une question directe sur le thème : ${topic}. Fais moins de 50 mots.`,
            },
        ],
        model: GROQ_MODEL,
    });
    return chatCompletion.choices[0].message.content;
}

/**
 * Rédige le contenu de l'article au format Paragraphes simples.
 */
async function generateContent(topic) {
    const chatCompletion = await groq.chat.completions.create({
        messages: [
            { role: 'system', content: SYSTEM_ROLE_FACEBOOK },
            {
                role: 'user',
                content: `Rédige un post Facebook sur le thème ${topic}. Utilise des paragraphes courts et aérés. Termine par une question pour encourager les commentaires. Fournis uniquement le texte au format HTML (balises <p>).`,
            },
        ],
        model: GROQ_MODEL,
    });
    return chatCompletion.choices[0].message.content;
}

/**
 * Fonction utilitaire pour générer la description de l'image (Prompt pour l'IA Image).
 */
async function generateImageDescription(topic) {
    const chatCompletion = await groq.chat.completions.create({
        messages: [
            { role: 'system', content: SYSTEM_ROLE_FACEBOOK.replace("AGI spécialisé dans la production de contenu engageant...", "Créateur de Prompt Visuel, axé sur les émotions, la simplicité et les scènes de la vie courante.") },
            {
                role: 'user',
                content: `Décris une image simple et émotionnelle qui illustre le thème suivant : ${topic}. Le style doit être amical et accessible au grand public Facebook.`,
            },
        ],
        model: GROQ_MODEL,
    });
    return chatCompletion.choices[0].message.content;
}

/**
 * Génère l'image et retourne son contenu en Base64.
 * [utilise la même dépendance générique que LinkedIn]
 */
async function generateImage(topic) {
    const imageDescription = await generateImageDescription(topic);
    // ... (Logique d'appel à Gemini pour l'image - inchangée) ...
    // NOTE: Pour la simplicité, les fonctions génériques (generateImage, generateVideo)
    // seraient idéalement externalisées dans un module /model/media-core.js.
    // Ici, nous laissons la fonction complète pour l'isolement du rôle.
    const model = genAI.getGenerativeModel({
        model: GEMINI_IMAGE_MODEL,
        generationConfig: { responseModalities: ['Text', 'Image'] },
    });
    const response = await model.generateContent(imageDescription);
    // ... (Parsing Base64) ...
    if (response?.response?.candidates?.length > 0) {
        for (const part of response.response.candidates[0].content.parts) {
            if (part.inlineData) return { image: part.inlineData.data };
        }
    }
    throw new Error('Image non trouvée dans la réponse Gemini.');
}

/**
 * Fonction utilitaire pour générer le prompt de la vidéo (Text-to-Video).
 */
async function generateVideoPrompt(topic) {
    const chatCompletion = await groq.chat.completions.create({
        messages: [
            { role: 'system', content: SYSTEM_ROLE_FACEBOOK.replace("AGI spécialisé dans la production de contenu engageant...", "Scénariste IA pour des vidéos de 10 secondes, axées sur l'émotion et l'humour.") },
            {
                role: 'user',
                content: `Génère un prompt vidéo de 10 secondes qui montre une situation du quotidien liée à ${topic}. Le ton doit être léger, axé sur la réaction ou l'émotion.`,
            },
        ],
        model: GROQ_MODEL,
    });
    return chatCompletion.choices[0].message.content;
}

module.exports = {
    generateTitle,
    generateContent,
    generateImage,
    generateVideoPrompt, 
    SYSTEM_ROLE_FACEBOOK
};