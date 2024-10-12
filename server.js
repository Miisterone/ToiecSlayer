const express = require('express');
const app = express();
const port = 3000;

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

app.use(express.static(__dirname));

app.use(express.json());

// Route pour servir client.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client.html'));
});

app.post('/transcribe', async (req, res) => {
  let audioUrl = '';

  req.on('data', (data) => {
    audioUrl += data;
  });

  req.on('end', async () => {
    audioUrl = decodeURIComponent(audioUrl);

    if (!audioUrl) {
      return res.status(400).send('URL du fichier audio non fournie.');
    }

    try {
      // Télécharger le fichier audio
      const response = await axios({
        method: 'get',
        url: audioUrl,
        responseType: 'stream',
      });

      const audioPath = 'audio_input.mp3'; // Changez le nom si nécessaire
      const writer = fs.createWriteStream(audioPath);

      response.data.pipe(writer);

      writer.on('finish', () => {
        // Appeler le script Python
        exec(`python transcribe.py ${audioPath}`, (error, stdout, stderr) => {
          fs.unlinkSync(audioPath); // Supprimer le fichier audio

          if (error) {
            console.error(`Erreur lors de l'exécution du script Python : ${error.message}`);
            return res.status(500).send('Erreur lors de la transcription.');
          }
          if (stderr) {
            console.error(`Erreur du script Python : ${stderr}`);
          }

          res.send(stdout); // Envoyer la transcription au client
        });
      });

      writer.on('error', (err) => {
        console.error('Erreur lors de l\'écriture du fichier audio :', err);
        res.status(500).send('Erreur lors du téléchargement du fichier audio.');
      });
    } catch (error) {
      console.error('Erreur lors du téléchargement du fichier audio :', error);
      res.status(500).send('Erreur lors du téléchargement du fichier audio.');
    }
  });
});

app.post('/analyze-image', async (req, res) => {
  let imageUrl = req.body.image_url;

  if (!imageUrl) {
    return res.status(400).json({ error: 'URL de l\'image non fournie.' });
  }

  try {
    // Appeler le serveur Flask pour l'analyse de l'image
    const response = await axios.post('http://127.0.0.1:5000/analyze', { image_url: imageUrl });
    res.json(response.data);
  } catch (error) {
    console.error('Erreur lors de l\'analyse de l\'image :', error);
    res.status(500).json({ error: 'Erreur lors de l\'analyse de l\'image.' });
  }
});

// Démarrer le serveur Node.js
app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur le port ${port}, http://127.0.0.1:3000`);
});
