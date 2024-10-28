const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const path = require('path');

const axios = require('axios');
const fs = require('fs');
const { exec } = require('child_process');

app.use(cors());
app.use(express.static(__dirname));
app.use(express.json());

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

    const audioPath = 'audio_input.mp3';
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');

    try {
      const response = await axios({
        method: 'get',
        url: audioUrl,
        responseType: 'stream',
      });

      const writer = fs.createWriteStream(audioPath);
      response.data.pipe(writer);

      writer.on('finish', () => {
        exec(`python transcribe.py ${audioPath}`, (error, stdout, stderr) => {
          fs.unlink(audioPath, (err) => {
            if (err) console.error(`Erreur lors de la suppression du fichier audio : ${err.message}`);
          });

          if (error) {
            console.error(`Erreur lors de l'exécution du script Python : ${error.message}`);
            return res.status(500).send('Erreur lors de la transcription.');
          }
          res.send(stdout.trim());
        });
      });

      writer.on('error', (err) => {
        console.error(`Erreur lors de l'écriture du fichier audio : ${err.message}`);
        res.status(500).send('Erreur lors du téléchargement du fichier audio.');
        writer.end();
      });
    } catch (error) {
      console.error(`Erreur lors du téléchargement du fichier audio : ${error.message}`);
      res.status(500).send('Erreur lors du téléchargement du fichier audio.');
    }
  });
});

app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur http://127.0.0.1:${port}`);
});
