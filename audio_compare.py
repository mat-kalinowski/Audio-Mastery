
# !!! INSTALL LAPACK AND OPENBLAS NEEDED FOR LIBROSA:
# brew install openblas lapack
import librosa

y, sr = librosa.load('wol_original.wav')
# 3. Run the default beat tracker
tempo, beat_frames = librosa.beat.beat_track(y=y, sr=sr)

print('Estimated tempo: {:.2f} beats per minute'.format(tempo))