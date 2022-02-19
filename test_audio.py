from prepare_dataset import preprocess_single_file
import tensorflow as tf
import sys
import numpy as np

LABELS = [
    "niravair",
    "gurprasaadh",
    "satnaam",
    "nirabhau",
    "ikoankaar",
    "saibhan",
    "ajoonee",
    "karataapurakh",
    "akaalmoorat"
]

model = tf.keras.models.load_model('../model.h5')
def test_single_file(file_path, model):
    processed_audio = preprocess_single_file(file_path)
    
    output_vector = model.predict(processed_audio)
    predict_label_id = np.argmax(output_vector, axis=1)
    return LABELS[predict_label_id[0]], np.max(output_vector)

results = test_single_file(sys.argv[1], model)
print(results)
