Blog AGI

## Présentation du projet
Le Blog AGI est une application web dynamique qui permet de générer des articles de blog complets, incluant des titres percutants, des images pertinentes et du contenu rédigé, sur une variété de thématiques. L'objectif principal est de démontrer la puissance de l'Intelligence Générative dans la création de contenu multimédia et de disposer d'une interface utilisateur simple pour gérer et visualiser ces créations.

L'application est divisée en deux sections principales :

Générateur d'articles : Permet à l'utilisateur de choisir une thématique et de générer un article complet, ainsi que de régénérer chaque composant individuellement (titre, image, contenu).

Galerie d'articles : Affiche tous les articles enregistrés sous forme de cartes cliquables. Chaque article peut être consulté en détail dans une fenêtre modale.

Fonctionnalités Clés
Génération de contenu intelligent : Utilise les modèles de langage de Groq pour générer des titres concis et des articles de blog pertinents.

Génération d'images : Intègre les capacités de Google Gemini pour créer des images uniques qui illustrent parfaitement le thème de l'article.

Interface utilisateur réactive : Une interface moderne et épurée construite avec HTML, CSS et JavaScript vanilla.

Stockage persistant : Les articles générés sont enregistrés au format Markdown (.md) et les images au format WebP (.webp) dans le dossier output.

Documentation de l'API : Un point de terminaison Swagger/OpenAPI (/api-docs) est disponible pour documenter toutes les routes du serveur, facilitant la compréhension et la maintenance de l'API.

Technologies Utilisées
Serveur : Node.js avec le framework Express.js.

IA :

Groq SDK : pour la génération de texte (titres et articles).

Google Gemini : pour la génération d'images.

Front-end : HTML5, CSS3, JavaScript (Vanilla).

Utilitaires :

dotenv : Gestion des variables d'environnement.

sharp : Traitement des images.

swagger-ui-express : Interface graphique pour la documentation de l'API.

yamljs : Lecture du fichier de spécification OpenAPI.

Démarrage Rapide
Suivez ces étapes pour installer et lancer l'application en local.

Prérequis
Node.js (version 14 ou supérieure) installé.

Clés d'API pour Groq et Google Gemini.

1. Cloner le dépôt et installer les dépendances
Bash

git clone <URL_DU_DÉPÔT_GIT>
cd <NOM_DU_DOSSIER>
npm install
2. Configuration des clés d'API
Créez un fichier .env à la racine de votre projet avec le contenu suivant, en remplaçant les placeholders par vos clés d'API respectives :

GROQ_API_KEY="votre_clé_groq"
GEMINI_API_KEY="votre_clé_gemini"
3. Lancer le serveur
Bash

node srv.js
Le serveur sera lancé et accessible à l'adresse suivante : http://localhost:5007.

4. Accès à l'application
Page du Générateur : http://localhost:5007

Galerie d'articles : http://localhost:5007/blog.html

Documentation de l'API : http://localhost:5007/api-docs

Structure des fichiers
```
.
├── api-docs/
│   └── swagger.yaml          # Spécification de l'API
├── output/                   # Contient les articles et images sauvegardés
├── public/
│   ├── blog.html             # Page de la galerie
│   ├── blog.js               # Script de la galerie
│   ├── btn-blog.js           # Script du générateur
│   ├── index.html            # Page du générateur
│   └── style.css             # Styles de l'application
├── .env                      # Variables d'environnement
├── package.json              # Dépendances du projet
└── srv.js                    # Fichier principal du serveur
```
Contribution

N'hésitez pas à proposer des améliorations ou des corrections via des pull requests !