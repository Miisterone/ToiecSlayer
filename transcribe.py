import os
os.environ["PATH"] += os.pathsep + r'C:\ffmpeg\bin'
import whisper
import sys

def transcribe(audio_file):
    # Check if the file exists
    if not os.path.exists(audio_file):
        print(f"Error: File {audio_file} does not exist.")
        return

    model = whisper.load_model("tiny")  # Load the appropriate model
    result = model.transcribe(audio_file)
    print(result["text"])

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python transcribe.py <audio_file>")
    else:
        transcribe(sys.argv[1])
