document.getElementById('start-transcription').addEventListener('click', () => {
    const audioUrl = document.getElementById('audioUrl').value.trim();
    console.log('[LOG] Démarrage de la transcription'); // Log début de transcription

    if (!audioUrl) {
        console.warn('[WARN] Aucune URL audio fournie');
        return showAlert('Veuillez entrer une URL audio valide', 'transcription', 'danger');
    }

    toggleLoading('start-transcription', 'loading-spinner-transcription', true);
    document.getElementById('transcription').textContent = 'Transcription en cours...';
    console.log(`[LOG] URL audio fournie : ${audioUrl}`);

    fetch('/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: encodeURIComponent(audioUrl)
    })
        .then(response => {
            console.log('[LOG] Réponse reçue du serveur');
            return response.text();
        })
        .then(text => {
            console.log('[LOG] Transcription terminée avec succès');
            document.getElementById('transcription').textContent = text;
            toggleLoading('start-transcription', 'loading-spinner-transcription', false);
        })
        .catch(error => {
            console.error('[ERROR] Erreur lors de la transcription :', error);
            showAlert('Erreur lors de la transcription.', 'transcription', 'danger');
            toggleLoading('start-transcription', 'loading-spinner-transcription', false);
        });
});
