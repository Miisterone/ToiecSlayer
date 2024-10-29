const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const path = require('path');

const axios = require('axios');
const fs = require('fs');
const { exec } = require('child_process');

// Middleware
app.use(cors());
app.use(express.json());

const log = (message) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
};

// Servir les fichiers statiques depuis le dossier public
app.use(express.static(path.join(__dirname, 'public')));

// Redirection vers la page extraction par défaut
app.get('/', (req, res) => {
  log('Redirection vers la page d\'extraction.');
  res.redirect('/extraction');
});

// Route pour la page de transcription
app.get('/transcription', (req, res) => {
  log('Demande de la page de transcription.');
  res.sendFile(path.join(__dirname, 'public', 'transcription.html'));
});

// Route pour la page d'extraction des réponses
app.get('/extraction', (req, res) => {
  log('Demande de la page d\'extraction.');
  res.sendFile(path.join(__dirname, 'public', 'extraction.html'));
});

// Route pour la transcription d'un fichier audio
app.post('/transcribe', async (req, res) => {
  let audioUrl = '';

  req.on('data', (data) => {
    audioUrl += data;
  });

  req.on('end', async () => {
    audioUrl = decodeURIComponent(audioUrl);

    if (!audioUrl) {
      log('URL du fichier audio non fournie.');
      return res.status(400).send('URL du fichier audio non fournie.');
    }

    const audioPath = 'audio_input.mp3';
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');

    try {
      log(`Téléchargement du fichier audio depuis l'URL : ${audioUrl}`);
      const response = await axios({
        method: 'get',
        url: audioUrl,
        responseType: 'stream',
      });

      const writer = fs.createWriteStream(audioPath);
      response.data.pipe(writer);

      writer.on('finish', () => {
        log('Fichier audio téléchargé avec succès. Démarrage de la transcription.');
        exec(`python3 /app/transcribe.py ${audioPath}`, (error, stdout, stderr) => {
          fs.unlink(audioPath, (err) => {
            if (err) {
              log(`Erreur lors de la suppression du fichier audio : ${err.message}`);
            } else {
              log('Fichier audio supprimé après transcription.');
            }
          });

          if (error) {
            log(`Erreur lors de l'exécution du script Python : ${error.message}`);
            return res.status(500).send('Erreur lors de la transcription.');
          }

          log('Transcription terminée avec succès.');
          log(`Transcription : ${stdout.trim()}`);
          res.send(stdout.trim());
        });
      });

      writer.on('error', (err) => {
        log(`Erreur lors de l'écriture du fichier audio : ${err.message}`);
        res.status(500).send('Erreur lors du téléchargement du fichier audio.');
      });
    } catch (error) {
      log(`Erreur lors du téléchargement du fichier audio : ${error.message}`);
      res.status(500).send('Erreur lors du téléchargement du fichier audio.');
    }
  });
});

// Démarrage du serveur
app.listen(port, () => {
  log(`Serveur en cours d'exécution sur http://127.0.0.1:${port}`);
});
