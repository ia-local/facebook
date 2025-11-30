#!/usr/bin/env bash

# ╔═════════════════════════════════════════════════════════════╗
# ║ [⚙️ BUILD] Script d'Encodage Vidéo Multi-Format (CORRIGÉ)     ║
# ╚═════════════════════════════════════════════════════════════╝

# ---------------------------------------------------------------
# 1. PARAMÈTRES ET CONFIGURATION
# ---------------------------------------------------------------

# Vérification de FFmpeg (outil essentiel)
if ! command -v ffmpeg &> /dev/null; then
    echo "❌ Erreur : FFmpeg n'est pas installé. Veuillez l'installer pour exécuter ce script."
    exit 1
fi

# Utiliser le premier argument comme fichier d'entrée
# Usage: ./convert_video.sh data/code.mp4
INPUT_FILE="data/code.mp4" 
OUTPUT_DIR="output/video_output"
MAX_DURATION="00:00:15" # Durée maximale des vidéos courtes (ex: 15 secondes)
CRF_QUALITY=28          # Qualité standard pour le web.

echo "┌──────────────────────────────────────────────┐"
echo "│ Configuration : Source [${INPUT_FILE}] │"
echo "│ Configuration : Cible  [${OUTPUT_DIR}]       │"
echo "└──────────────────────────────────────────────┘"

# Création du répertoire de sortie
mkdir -p "${OUTPUT_DIR}"
echo "▶ Création du répertoire de sortie : ${OUTPUT_DIR}"

# Vérification de l'existence du fichier source
if [ ! -f "$INPUT_FILE" ]; then
    echo "❌ Erreur : Fichier source non trouvé. Utilisez : data/code.mp4"
    exit 1
fi

# ---------------------------------------------------------------
# 2. ENCODAGE ET CONVERSION DES FORMATS
# ---------------------------------------------------------------

# --- Tâche 1: Format 16:9 (Paysage, HD) ---
echo "║ Traitement : Format 16:9 (Landscape - 1920x1080) █"
ffmpeg -i "${INPUT_FILE}" -t "${MAX_DURATION}" \
       -vf "scale=1920:-2" \
       -c:v libx264 -crf ${CRF_QUALITY} -pix_fmt yuv420p \
       -an -y "${OUTPUT_DIR}/landscape_16-9.mp4"

echo "  Fichier créé: ${OUTPUT_DIR}/landscape_16-9.mp4"
echo "---" # Remplacement de TENSOR_RENDER_("·")

# --- Tâche 2: Format 9:16 (Portrait, Full Mobile) ---
echo "║ Traitement : Format 9:16 (Portrait - 1080x1920)  █+1"
# Le scale -2:1920 met à l'échelle pour une hauteur de 1920 et calcule la largeur. 
# Si la source est paysage, cela peut créer une vidéo très large.
# Pour une source portrait (comme phone.mp4), cela fonctionne très bien.
ffmpeg -i "${INPUT_FILE}" -t "${MAX_DURATION}" \
       -vf "scale=-2:1920" \
       -c:v libx264 -crf ${CRF_QUALITY} -pix_fmt yuv420p \
       -an -y "${OUTPUT_DIR}/portrait_9-16.mp4"

echo "  Fichier créé: ${OUTPUT_DIR}/portrait_9-16.mp4"
echo "---" # Remplacement de TENSOR_RENDER_("·")

# --- Tâche 3: Format 1:1 (Carré, Social Media) ---
echo "║ Traitement : Format 1:1 (Square - 1080x1080)     █+2"
# Coupe au carré (min(largeur, hauteur) pour garantir qu'il n'y ait pas de barres)
ffmpeg -i "${INPUT_FILE}" -t "${MAX_DURATION}" \
       -vf "crop=min(iw\,ih):min(iw\,ih)" \
       -c:v libx264 -crf ${CRF_QUALITY} -pix_fmt yuv420p \
       -an -y "${OUTPUT_DIR}/square_1-1.mp4"

echo "  Fichier créé: ${OUTPUT_DIR}/square_1-1.mp4"
echo "---" # Remplacement de TENSOR_RENDER_("·")

# ---------------------------------------------------------------
# 3. RAPPORT D'ACHÈVEMENT
# ---------------------------------------------------------------

echo "╔═════════════════════════════════════════════════════════════╗"
echo "║ ■ TERMINAL_DONE : Conversion Multi-Format Terminé.        ║"
echo "║ ▲ Fichiers générés dans le répertoire: ${OUTPUT_DIR}        ║"
echo "╚═════════════════════════════════════════════════════════════╝"