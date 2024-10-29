document.getElementById('start-transcription').addEventListener('click', () => {
    console.log('[LOG] Bouton "Démarrer la transcription" cliqué');

    const audioUrl = document.getElementById('audioUrl').value.trim();
    if (!audioUrl) {
        console.warn('[WARN] Aucune URL audio fournie');
        showAlert('Veuillez entrer une URL audio valide', 'transcription', 'danger');
        return;
    }

    toggleLoading('start-transcription', 'loading-spinner-transcription', true);
    document.getElementById('transcription').textContent = 'Transcription en cours...';
    console.log(`[LOG] URL audio fournie : ${audioUrl}`);

    fetch('/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: encodeURIComponent(audioUrl)
    })
        .then(response => response.text())
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

// Fonctionnalité du bouton "Copier"
document.getElementById('copy-button').addEventListener('click', () => {
    const transcriptionText = document.getElementById('transcription').textContent;

    if (transcriptionText) {
        navigator.clipboard.writeText(transcriptionText)
            .then(() => {
                console.log('[LOG] Texte copié dans le presse-papiers');
                alert('Texte copié dans le presse-papiers !');
            })
            .catch(err => {
                console.error('[ERROR] Erreur lors de la copie :', err);
                alert('Échec de la copie du texte.');
            });
    } else {
        console.warn('[WARN] Aucune transcription à copier');
        alert('Aucune transcription à copier.');
    }
});
