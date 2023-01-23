
# !!! INSTALL LAPACK AND OPENBLAS NEEDED FOR LIBROSA:
# brew install openblas lapack
import librosa

y_ref, sr_ref = librosa.load('wol_original.wav')
y_comp, sr_comp = librosa.stft('wol_9db_q1_boost.wav')

# 3. Run the default beat tracker
# tempo, beat_frames = librosa.beat.beat_track(y=y, sr=sr)

# print('Estimated tempo: {:.2f} beats per minute'.format(tempo))

S_ref = librosa.stft(y=y_ref)
S_comp = librosa.stft(y=y_comp)
print(S_ref)
print(S_comp)

# calculate Mean Squared Error for both matrices
