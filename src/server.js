const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios');
const fs = require('fs');
const { exec } = require('child_process');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const log = (message) => {
  console.log(`[${new Date().toISOString()}] ${message}`);
};

// Routes principales
app.get('/', (req, res) => redirectToPage(res, 'extraction'));
app.get('/transcription', (req, res) => servePage(res, 'transcription.html'));
app.get('/extraction', (req, res) => servePage(res, 'extraction.html'));

// Route pour la transcription d'un fichier audio
app.post('/transcribe', async (req, res) => {
  let audioUrl = '';
  req.on('data', data => { audioUrl += data; });
  req.on('end', () => processTranscriptionRequest(res, audioUrl));
});

function processTranscriptionRequest(res, audioUrl) {
  const audioPath = 'audio_input.mp3';
  if (!audioUrl) {
    log('Audio URL not provided');
    return res.status(400).send('URL du fichier audio non fournie.');
  }

  log(`Processing transcription request with URL: ${audioUrl}`);
  downloadFile(audioUrl, audioPath)
      .then(() => {
        log(`File downloaded successfully to ${audioPath}`);
        return executeTranscription(res, audioPath);
      })
      .catch(error => handleError(res, 'Erreur lors du téléchargement du fichier audio', error));
}

function downloadFile(url, path) {
  return new Promise((resolve, reject) => {
    try {
      const decodedUrl = decodeURIComponent(url); // Décoder l'URL
      log(`Downloading file from URL: ${decodedUrl}`);

      axios({
        method: 'get',
        url: decodedUrl,
        responseType: 'stream'
      }).then(response => {
        const writer = fs.createWriteStream(path);
        response.data.pipe(writer);

        writer.on('finish', () => {
          log('File writing completed.');
          resolve();
        });
        writer.on('error', (error) => {
          log(`File writing error: ${error.message}`);
          reject(error);
        });
      }).catch(error => {
        log(`Error in Axios request: ${error.message}`);
        reject(error);
      });
    } catch (error) {
      log(`URL decoding or download initiation error: ${error.message}`);
      reject(error);
    }
  });
}

function executeTranscription(res, filePath) {
  log(`Starting transcription with file: ${filePath}`);
  exec(`python3 /app/transcribe.py ${filePath}`, (error, stdout, stderr) => {
    fs.unlink(filePath, err => {
      if (err) {
        log(`Error deleting file after transcription: ${err.message}`);
      } else {
        log('File deleted successfully after transcription.');
      }
    });

    if (error) {
      log(`Error during transcription process: ${error.message}`);
      return handleError(res, 'Erreur lors de la transcription', error);
    }

    log(`Transcription completed successfully. Result: ${stdout.trim()}`);
    res.send(stdout.trim());
  });
}

// Route pour extraire les réponses
app.post('/extract-answers', async (req, res) => {
  const apiUrl = req.body.apiUrl;

  if (!apiUrl) {
    log('[WARN] URL API non fournie pour l\'extraction des réponses');
    return res.status(400).send('URL API manquante');
  }

  log(`[LOG] Extraction des réponses avec l'URL : ${apiUrl}`);

  try {
    const response = await axios.get(apiUrl);
    log('[LOG] Réponse reçue de l\'API pour l\'extraction des réponses');

    const answers = extractCorrectAnswers(response.data.payload.data);
    log('[LOG] Réponses extraites avec succès');

    res.send({ answers });
  } catch (error) {
    log(`[ERROR] Erreur lors de la récupération des réponses : ${error.message}`);
    res.status(500).send('Erreur lors de l\'extraction des réponses');
  }
});

function extractCorrectAnswers(data) {
  if (!data || data.length === 0) {
    log('[WARN] Aucune donnée trouvée pour les réponses');
    return 'Aucune donnée trouvée.';
  }

  let answers = '';
  let questionCounter = 1;

  data.forEach(section => {
    section.questions.forEach(question => {
      const correctAnswer = question.answerOptions.answer[0].display;
      const questionTitle = question.title && question.title !== "Question"
          ? question.title
          : `Question ${questionCounter}`;
      answers += `${questionTitle}: ${correctAnswer}<br>`;
      questionCounter++;
    });
  });

  log(`[LOG] Réponses formatées : ${answers}`);
  return answers || 'Aucune réponse correcte trouvée.';
}

function servePage(res, page) {
  log(`Serve page request: ${page}`);
  res.sendFile(path.join(__dirname, 'public', page));
}

function redirectToPage(res, page) {
  log(`Redirecting to page: ${page}`);
  res.redirect(`/${page}`);
}

function handleError(res, message, error) {
  log(`${message}: ${error.message}`);
  res.status(500).send(message);
}

app.listen(port, () => log(`Serveur actif sur http://127.0.0.1:${port}`));