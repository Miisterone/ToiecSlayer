import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import requests
import io
import base64

app = Flask(__name__)
CORS(app)
cache = {}
TEMP_DIR = "temp_images"

# Créer le répertoire temporaire s'il n'existe pas
if not os.path.exists(TEMP_DIR):
    os.makedirs(TEMP_DIR)


@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    image_url = data.get('image_url', None)

    if image_url in cache:
        print("Image trouvée dans le cache.")
        return jsonify({'analysis': cache[image_url]})

    if image_url is None:
        return jsonify({'error': 'No image URL received'}), 400

    image_filename = os.path.join(TEMP_DIR, "temp_image.png")  # Définir image_filename ici pour éviter les erreurs

    try:
        # Téléchargement de l'image
        print("Téléchargement de l'image...")
        response = requests.get(image_url)
        response.raise_for_status()

        # Conversion de .jpg en .png et redimensionnement
        image = Image.open(io.BytesIO(response.content)).convert("RGB")

        # Utiliser LANCZOS pour le redimensionnement
        optimized_size = (672, 672)  # Ajustez selon vos besoins
        image = image.resize(optimized_size, Image.LANCZOS)

        # Sauvegarder en tant que .png
        image.save(image_filename, format="PNG")
        print(f"Image téléchargée, convertie en PNG, et enregistrée en tant que {image_filename}.")

        # Encodage de l'image en Base64
        print("Encodage de l'image en Base64...")
        with open(image_filename, "rb") as image_file:
            encoded_image = base64.b64encode(image_file.read()).decode('utf-8')
        print("Encodage terminé.")

        # Envoi à l'API Ollama
        print("Envoi de l'image à l'API Ollama...")
        payload = {
            "model": "llava:7b",
            "prompt": "Décrivez l'image.",
            "images": [encoded_image]
        }
        ollama_response = requests.post(
            "http://localhost:11434/api/generate",
            json=payload,
            timeout=30
        )

        print("Réponse brute de l'API Ollama :", ollama_response.text)  # Afficher la réponse brute

        try:
            ollama_response.raise_for_status()  # Vérifie les erreurs HTTP
            ollama_data = ollama_response.json()
            print("Réponse analysée en JSON :", ollama_data)  # Vérifie que le JSON est correct
        except requests.exceptions.HTTPError as e:
            print("Erreur HTTP lors de l'appel à l'API Ollama :", e)
            return jsonify({'error': 'Erreur lors de la communication avec l\'API Ollama.'}), 500
        except ValueError:
            print("Erreur : La réponse n'est pas en format JSON.")
            return jsonify({'error': 'La réponse de l\'API n\'est pas en format JSON valide.'}), 500

        # Ajouter au cache et retourner le résultat
        analysis = ollama_data.get('text', 'No description returned')
        cache[image_url] = analysis

        return jsonify({'analysis': analysis})

    except requests.exceptions.RequestException as e:
        print("Erreur de requête réseau :", e)
        return jsonify({'error': 'Erreur de téléchargement d\'image'}), 500
    except IOError as e:
        print("Erreur lors du traitement de l'image :", e)
        return jsonify({'error': 'Erreur de traitement de l\'image'}), 500
    except Exception as e:
        print("Erreur générale :", e)
        return jsonify({'error': 'Erreur interne du serveur'}), 500
    finally:
        # Supprimer le fichier temporaire seulement s'il existe
        if os.path.exists(image_filename):
            os.remove(image_filename)
            print(f"Fichier temporaire {image_filename} supprimé.")


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
