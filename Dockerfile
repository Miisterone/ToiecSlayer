# Utiliser une image de base Node.js basée sur Debian Bullseye
FROM node:16-bullseye

# Installer Python 3.9, pip et ffmpeg
RUN apt-get update && \
    apt-get install -y python3 python3-distutils python3-pip ffmpeg

# Installer une version compatible de NumPy
RUN pip3 install "numpy<2"

# Installer PyTorch (compatible CPU)
RUN pip3 install torch==1.10.1+cpu torchvision==0.11.2+cpu torchaudio==0.10.1+cpu -f https://download.pytorch.org/whl/torch_stable.html

# Installer Whisper et ses dépendances
RUN pip3 install -U openai-whisper tiktoken

# Définir le répertoire de travail
WORKDIR /app

# Copier le fichier server.js dans /app
COPY src/server.js /app/server.js

# Copier le fichier transcribe.py dans /app
COPY transcribe.py /app/transcribe.py

# Copier le fichier package.json et installer les dépendances Node.js
COPY package.json /app/package.json
RUN npm install

# Copier le dossier public contenant extraction.html et transcription.html dans /app/public
COPY src/public /app/public

# Exposer le port utilisé par le serveur Node.js
EXPOSE 3000

# Définir la commande de démarrage du serveur
CMD ["node", "server.js"]