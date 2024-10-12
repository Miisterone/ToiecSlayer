# transcribe.py

import sys
import whisper

def transcribe(audio_file):
    model = whisper.load_model("base")  # Choisissez le modèle approprié ('tiny', 'base', 'small', 'medium', 'large')
    result = model.transcribe(audio_file)
    print(result["text"])

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Utilisation : python transcribe.py <fichier_audio>")
    else:
        transcribe(sys.argv[1])
