import sys
import whisper
import os
from whisper.utils import get_writer

transcriptionId = sys.argv[1]

dirname = os.getcwd()
audio_path = f"{dirname}/src/audios/{transcriptionId}.wav"
transcription_path = f"{dirname}/src/whisper/transcriptions"

model = whisper.load_model("small")
result = model.transcribe(audio_path, language="pt", fp16=False, verbose=True, patience=2, beam_size=5)

vtt_writer = get_writer("vtt", transcription_path)
vtt_writer(result, '550e8400-e29b-41d4-a716-446655440000.wav')

# srt_writer = get_writer("srt", "whisper/transcriptions/")
# srt_writer(result, '550e8400-e29b-41d4-a716-446655440000.wav')