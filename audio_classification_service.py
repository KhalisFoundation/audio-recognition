import librosa
import tensorflow as tf
import numpy as np
import os

from util import LABELS

SAVED_MODEL_PATH = "model.h5"
SAMPLES_TO_CONSIDER = 22050

class _Audio_Classification_Service:
    """Singleton class for keyword spotting inference with trained models.

    :param model: Trained model
    """

    model = None

    _instance = None


    def predict(self, file_path):
        """

        :param file_path (str): Path to audio file to predict
        :return predicted_keyword (str): Keyword predicted by the model
        """

        # extract MFCC
        MFCCs = self.preprocess(file_path)

        # we need a 4-dim array to feed to the model for prediction: (# samples, # time steps, # coefficients, 1)
        MFCCs = MFCCs[np.newaxis, ..., np.newaxis]

        # get the predicted label
        predictions = self.model.predict(MFCCs)
       	predicted_index = np.argmax(predictions)
        predicted_keyword = LABELS[predicted_index]
        return predicted_keyword


    def preprocess(self, file_path, num_mfcc=13, n_fft=2048, hop_length=512):
        """Extract MFCCs from audio file.

        :param file_path (str): Path of audio file
        :param num_mfcc (int): # of coefficients to extract
        :param n_fft (int): Interval we consider to apply STFT. Measured in # of samples
        :param hop_length (int): Sliding window for STFT. Measured in # of samples

        :return MFCCs (ndarray): 2-dim array with MFCC data of shape (# time steps, # coefficients)
        """

        # load audio file
        signal, sample_rate = librosa.load(file_path)

        if len(signal) >= SAMPLES_TO_CONSIDER:
            # ensure consistency of the length of the signal
            signal = signal[:SAMPLES_TO_CONSIDER]

            # extract MFCCs
            MFCCs = librosa.feature.mfcc(signal, sample_rate, n_mfcc=num_mfcc, n_fft=n_fft,
                                         hop_length=hop_length)
        return MFCCs.T


def Audio_Classification_Service():
    """Factory function for Audio_Classification_Service class.

    :return _Audio_Classification_Service._instance (_Audio_Classification_Service):
    """

    # ensure an instance is created only the first time the factory function is called
    if _Audio_Classification_Service._instance is None:
        _Audio_Classification_Service._instance = _Audio_Classification_Service()
        _Audio_Classification_Service.model = tf.keras.models.load_model(SAVED_MODEL_PATH)
    return _Audio_Classification_Service._instance




if __name__ == "__main__":
    # create 2 instances of the service
    acs = Audio_Classification_Service()
    acs1 = Audio_Classification_Service()

    # check that different instances of service point back to the same object (singleton)
    assert acs is acs1

    # make a prediction
    print("Running Inference")
    for f in os.listdir('test'):
        input_file = os.path.join('test',f)
        keyword = acs.predict(input_file)
        print(f"Input: {input_file} Prediction: {keyword}")
