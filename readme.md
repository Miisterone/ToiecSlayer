# Application de Transcription et d'Analyse d'Image

## Description
Cette application est une interface web permettant de transcrire des fichiers audio et d'analyser des images. Elle est construite en utilisant un serveur Node.js pour gérer les requêtes de transcription et d'analyse d'image, en s'appuyant sur des modèles de traitement du langage naturel et d'analyse d'image.

## Fonctionnalités
- **Transcription Audio** : Fournissez une URL d'un fichier audio, et l'application retournera la transcription de l'audio.
- **Analyse d'Image** : Fournissez une URL d'une image, et l'application retournera une description de l'image.

## Technologies Utilisées
- **Frontend** : HTML, CSS, Bootstrap 4, JavaScript
- **Backend** : Node.js, Flask (Python)
- **API** : Utilisation de la bibliothèque Whisper pour la transcription audio et BLIP pour l'analyse d'image.

## Prérequis
- **Node.js** version 12 ou supérieure
- **Python** 3.6 ou supérieure
- **Flask** et **transformers** pour l'analyse d'image
- **Bootstrap** pour la mise en forme de l'interface utilisateur

## Installation
1. Clonez ce repository :
   ```bash
   git clone <URL-du-repository>
   ```
2. Installez les dépendances Node.js :
   ```bash
   cd <nom-du-repository>
   npm install
   ```
3. Installez les dépendances Python :
   ```bash
   pip install flask transformers pillow requests
   ```

## Lancer l'Application
1. Démarrez le serveur Flask pour l'analyse d'image :
   ```bash
   python image_analyzer.py
   ```
2. Démarrez le serveur Node.js :
   ```bash
   node server.js
   ```
3. Ouvrez votre navigateur et accédez à :
   ```
   http://localhost:3000
   ```

## Utilisation
1. **Transcription Audio**
   - Entrez l'URL de l'audio (par exemple : [Exemple Audio](https://www.lms.7speaking.com/apiws/toeic/support/1-3.mp3)).
   - Cliquez sur "Démarrer la transcription" pour recevoir la transcription.

2. **Analyse d'Image**
   - Entrez l'URL de l'image (par exemple : [Exemple Image](https://www.lms.7speaking.com/apiws/toeic/support/1-3.jpg)).
   - Cliquez sur "Analyser l'image" pour recevoir une description de l'image.

## Exemple d'URLs
- **Audio Exemple** : [https://www.lms.7speaking.com/apiws/toeic/support/1-3.mp3](https://www.lms.7speaking.com/apiws/toeic/support/1-3.mp3)
- **Image Exemple** : [https://www.lms.7speaking.com/apiws/toeic/support/1-3.jpg](https://www.lms.7speaking.com/apiws/toeic/support/1-3.jpg)

## Structure du Projet
- **client.html** : Interface utilisateur principale.
- **server.js** : Serveur Node.js pour gérer les requêtes HTTP.
- **image_analyzer.py** : Script Flask pour l'analyse d'image utilisant BLIP.
- **transcribe.py** : Script Python pour la transcription audio utilisant Whisper.
## Auteurs
- **Pader Joris** - Développeur
