function showAlert(message, section, type) {
    console.log(`[LOG] Affichage de l'alerte: ${message}, Type: ${type}, Section: ${section}`);
    const alertDiv = document.getElementById(`alert-message-${section}`);
    alertDiv.className = `alert alert-${type} mt-3`;
    alertDiv.textContent = message;
    alertDiv.classList.remove('d-none');
}

function toggleLoading(buttonId, spinnerId, isLoading) {
    console.log(`[LOG] Bascule de chargement - Bouton: ${buttonId}, Spinner: ${spinnerId}, isLoading: ${isLoading}`);
    document.getElementById(buttonId).disabled = isLoading;
    document.getElementById(spinnerId).classList.toggle('d-none', !isLoading);
}