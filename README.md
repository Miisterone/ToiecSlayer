
# Transcription et Extraction de Réponses TOEIC

Ce projet est une application web permettant de transcrire des fichiers audio et d'extraire les bonnes réponses d'un test TOEIC. Il utilise Node.js avec Express pour gérer le serveur et interagir avec un script Python pour la transcription audio.

## Fonctionnalités

- **Transcription Audio** : Saisissez l'URL d'un fichier audio et obtenez une transcription du fichier.
- **Extraction des Bonnes Réponses** : Saisissez l'URL d'une API TOEIC et extrayez automatiquement les bonnes réponses des questions.
- **Barre de Navigation** : Naviguez facilement entre la page de transcription et celle d'extraction des réponses.

## Structure du projet

```
transcription-serveur/
│
├── src/
│   ├── public/
│   │   ├── css/
│   │   │   └── styles.css
│   │   ├── extraction.html
│   │   └── transcription.html
│   └── server.js
├── transcribe.py
├── package.json
└── README.md
```

## Installation

1. Clonez ce dépôt :
   ```bash
   git clone https://github.com/votre-repo.git
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Démarrez le serveur :
   ```bash
   node src/server.js
   ```

4. Accédez à l'application via [http://localhost:3000](http://localhost:3000).

## Utilisation

- **Transcription** : Allez sur la page `Transcription` via la barre de navigation, entrez l'URL d'un fichier audio et cliquez sur "Démarrer la transcription".
- **Extraction des réponses** : Allez sur la page `Extraction des réponses`, entrez l'URL d'une API TOEIC et cliquez sur "Extraire les bonnes réponses".
