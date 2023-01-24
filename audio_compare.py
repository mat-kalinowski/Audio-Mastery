
# !!! INSTALL LAPACK AND OPENBLAS NEEDED FOR LIBROSA:
# brew install openblas lapack
import librosa
import numpy as np

y_ref, sr_ref = librosa.load('wol_original.wav')
y_comp, sr_comp = librosa.load('wol_original.wav')

# 3. Run the default beat tracker
# tempo, beat_frames = librosa.beat.beat_track(y=y, sr=sr)

# print('Estimated tempo: {:.2f} beats per minute'.format(tempo))

# get rid of phase, reduce complex numbers to natural numbers
# https://stackoverflow.com/questions/61600977/can-someone-help-me-understand-the-np-abs-conversion-for-stft-in-librosa
S_ref = np.abs(librosa.stft(y=y_ref))
S_comp = np.abs(librosa.stft(y=y_comp))

# calculate Mean Squared Error for both matrices
print(S_ref)
MSE = np.square(np.subtract(S_ref,S_comp)).mean()

print(MSE)