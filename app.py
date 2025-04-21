from flask import Flask, render_template, request, send_file, make_response
from music21 import stream, note, chord, clef, midi, metadata
import tempfile
import os
import pickle
import numpy as np
from tensorflow.keras.models import load_model

app = Flask(__name__)

# === Load model and encoders ===
model_path = "model/model_ki_mkc.h5"
note_encoder_path = "model/note_encoder.pkl"
chord_encoder_path = "model/chord_encoder.pkl"

model = load_model(model_path)
with open(note_encoder_path, "rb") as f:
    note_encoder = pickle.load(f)
with open(chord_encoder_path, "rb") as f:
    chord_encoder = pickle.load(f)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/generate", methods=["POST"])
def generate():
    data = request.get_json()
    melody_input = data.get("melody", "")
    melody_notes = melody_input.strip().split()

    while len(melody_notes) % 4 != 0:
        melody_notes.append("C4")

    melody_chunks = [melody_notes[i:i+4] for i in range(0, len(melody_notes), 4)]
    predicted_chords = []

    for chunk in melody_chunks:
        try:
            encoded = note_encoder.transform(chunk).reshape(1, -1)
            pred = model.predict(encoded)
            class_index = pred.argmax()
            if class_index < len(chord_encoder.classes_):
                predicted_chord = chord_encoder.inverse_transform([class_index])[0]
            else:
                predicted_chord = "C Major (C E G)"
        except Exception:
            predicted_chord = "C Major (C E G)"
        predicted_chords.append(predicted_chord)

    score = stream.Score()
    score.metadata = metadata.Metadata()
    score.metadata.title = "AI Generated Music"
    score.metadata.composer = "Aryan and Abdul's LSTM"

    melody_part = stream.Part()
    melody_part.append(clef.TrebleClef())
    for pitch in melody_notes:
        melody_part.append(note.Note(pitch, quarterLength=1.0))

    bass_part = stream.Part()
    bass_part.append(clef.BassClef())
    for chord_str in predicted_chords:
        chord_notes = chord_str.split("(")[-1].replace(")", "").split()
        chord_notes = [note.Note(n) for n in chord_notes]
        for n in chord_notes:
            n.octave = 3
        c = chord.Chord(chord_notes)
        c.quarterLength = 4.0
        bass_part.append(c)

    score.insert(0, melody_part)
    score.insert(0, bass_part)

    with tempfile.NamedTemporaryFile(delete=False, suffix=".mid") as tmp:
        mf = midi.translate.streamToMidiFile(score)
        mf.open(tmp.name, 'wb')
        mf.write()
        mf.close()
        response = make_response(send_file(tmp.name, as_attachment=True, download_name="melody.mid"))
        response.headers["X-Chords"] = ", ".join(predicted_chords)
        return response

# === For Render.com ===
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=False, host="0.0.0.0", port=port)
