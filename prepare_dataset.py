import json
import librosa
import numpy as np
import os
import soundfile as sf
import subprocess

from os import path

DATASET_PATH = "dataset"
JSON_PATH = "data.json"
SAMPLES_TO_CONSIDER = 22050 # 1 sec. of audio



def add_white_noise(signal, noise_percentage_factor):
    noise = np.random.normal(0, signal.std(), signal.size)
    augmented_signal = signal + noise * noise_percentage_factor
    return augmented_signal


def time_stretch(signal, min_factor=0.8, max_factor=1.2):
    """Time stretching implemented with librosa:
    https://librosa.org/doc/main/generated/librosa.effects.pitch_shift.html?highlight=pitch%20shift#librosa.effects.pitch_shift
    """
    time_stretch_rate = np.random.uniform(min_factor, max_factor)
    return librosa.effects.time_stretch(signal, time_stretch_rate)


def pitch_scale(signal, sr, min_factor=2, max_factor=3):
    """Pitch scaling implemented with librosa:
    https://librosa.org/doc/main/generated/librosa.effects.pitch_shift.html?highlight=pitch%20shift#librosa.effects.pitch_shift
    """
    num_semitones = np.random.uniform(min_factor, max_factor)
    return librosa.effects.pitch_shift(signal, sr, num_semitones)


def random_gain(signal, min_factor=0.1, max_factor=1.2):
    gain_rate = np.random.uniform(min_factor, max_factor)
    augmented_signal = signal * gain_rate
    return augmented_signal


def invert_polarity(signal):
    return signal * -1


def augment_dataset(dataset_path):
    # loop through all sub-dirs
    count = 0
    for i, (dirpath, dirnames, filenames) in enumerate(os.walk(dataset_path)):

        # ensure we're at sub-folder level
        if dirpath is not dataset_path:

            # save label (i.e., sub-folder name) in the mapping
            label = dirpath.split("/")[-1]
            print(f"Convert to wav: {label}")

            new_filenames = []

            # If not wav, rename - replace spaces, - with _
            # Convert to wav
            for f in filenames:
                if not f[0] == '.':
                    name , extension = path.splitext(f)

                    if extension != '.wav':
                        original_file = os.path.join(dirpath, f)

                        name = name.replace(" ", "_")
                        name = name.replace("-", "_")
                        name = name.replace("(", "_")
                        name = name.replace(")", "_")

                        new_name = f"{name}{extension}"
                        renamed_file = os.path.join(dirpath, new_name)
                        os.rename(original_file, renamed_file)

                        output_file = os.path.join(dirpath, f"{name}.wav")

                        ffmpeg_cmd = f"ffmpeg -hide_banner -loglevel panic -i {renamed_file} -y {output_file}"

                        subprocess.run(ffmpeg_cmd, check=True, shell=True)

                        os.remove(renamed_file)

                    new_filenames.append(f"{name}.wav")

            # Augment original set
            print(f"Augmenting: {label}\n")
            for f in new_filenames:
                count = count + 1
                name , extension = path.splitext(f)
                original_file = os.path.join(dirpath, f)
                signal, sr = librosa.load(original_file)

                white_noise_signal = add_white_noise(signal, 0.05)
                white_noise_file = os.path.join(dirpath, f"{name}_white_noise.wav")
                sf.write(white_noise_file, white_noise_signal, sr)

                time_stretch_signal = time_stretch(signal)
                time_stretch_file = os.path.join(dirpath, f"{name}_time_stretch.wav")
                sf.write(time_stretch_file, time_stretch_signal, sr)

                pitch_scale_signal = pitch_scale(signal, sr)
                pitch_scale_file = os.path.join(dirpath, f"{name}_pitch_scale.wav")
                sf.write(pitch_scale_file, pitch_scale_signal, sr)

                invert_polarity_signal = invert_polarity(signal)
                invert_polarity_file = os.path.join(dirpath, f"{name}_invert_polarity.wav")
                sf.write(invert_polarity_file, invert_polarity_signal, sr)

                random_gain_signal = random_gain(signal)
                random_gain_file = os.path.join(dirpath, f"{name}_random_gain.wav")
                sf.write(random_gain_file, random_gain_signal, sr)


    print(f"Original files: {count}")
    print(f"Augmented files: {5 * count}")
    print(f"Total files: {6 * count}")


def preprocess_dataset(dataset_path, json_path, num_mfcc=13, n_fft=2048, hop_length=512):
    """Extracts MFCCs from music dataset and saves them into a json file.

    :param dataset_path (str): Path to dataset
    :param json_path (str): Path to json file used to save MFCCs
    :param num_mfcc (int): Number of coefficients to extract
    :param n_fft (int): Interval we consider to apply FFT. Measured in # of samples
    :param hop_length (int): Sliding window for FFT. Measured in # of samples
    :return:
    """

    # dictionary where we'll store mapping, labels, MFCCs and filenames
    data = {
        "mapping": [],
        "labels": [],
        "MFCCs": [],
        "files": []
    }

    count = 0
    # loop through all sub-dirs
    for i, (dirpath, dirnames, filenames) in enumerate(os.walk(dataset_path)):

        # ensure we're at sub-folder level
        if dirpath is not dataset_path:

            # save label (i.e., sub-folder name) in the mapping
            label = dirpath.split("/")[-1]
            data["mapping"].append(label)
            print("\nProcessing: '{}'".format(label))

            # process all audio files in sub-dir and store MFCCs
            for f in filenames:
                if not f[0] == '.':
                    file_path = os.path.join(dirpath, f)

                    # load audio file and slice it to ensure length consistency among different files
                    signal, sample_rate = librosa.load(file_path)

                    # drop audio files with less than pre-decided number of samples
                    if len(signal) >= SAMPLES_TO_CONSIDER:

                        # ensure consistency of the length of the signal
                        signal = signal[:SAMPLES_TO_CONSIDER]

                        # extract MFCCs
                        MFCCs = librosa.feature.mfcc(signal, sample_rate, n_mfcc=num_mfcc, n_fft=n_fft,
                                                    hop_length=hop_length)

                        # store data for analysed track
                        data["MFCCs"].append(MFCCs.T.tolist())
                        data["labels"].append(i-1)
                        data["files"].append(file_path)
                        # print("{}: {}".format(file_path, i-1))
                        count = count + 1

            print(f"Training samples: {count}")

    # save data in json file
    with open(json_path, "w") as fp:
        json.dump(data, fp, indent=4)


if __name__ == "__main__":
    augment_dataset(DATASET_PATH)
    preprocess_dataset(DATASET_PATH, JSON_PATH)