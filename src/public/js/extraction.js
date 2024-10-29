document.getElementById('fetch-answers').addEventListener('click', () => {
    console.log('[LOG] Bouton "Extraire les bonnes réponses" cliqué');

    const apiUrl = document.getElementById('apiUrl').value.trim();
    if (!apiUrl) {
        console.warn('[WARN] URL API non fournie');
        showAlert('Veuillez entrer une URL valide', 'answers', 'danger');
        return;
    }

    console.log(`[LOG] URL API fournie : ${apiUrl}`);
    toggleLoading('fetch-answers', 'loading-spinner-answers', true);
    document.getElementById('correct-answers').textContent = 'Extraction en cours...';

    fetch('/extract-answers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ apiUrl })
    })
        .then(response => response.json())
        .then(data => {
            console.log('[LOG] Réponse reçue du serveur avec les réponses extraites');
            document.getElementById('correct-answers').innerHTML = data.answers;
            toggleLoading('fetch-answers', 'loading-spinner-answers', false);
        })
        .catch(error => {
            console.error('[ERROR] Erreur lors de l\'extraction :', error);
            showAlert('Erreur lors de l\'extraction des bonnes réponses.', 'answers', 'danger');
            toggleLoading('fetch-answers', 'loading-spinner-answers', false);
        });
});
