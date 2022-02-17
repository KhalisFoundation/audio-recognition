import os
import util
import shutil
import random
import subprocess

TESTING_PERCENT = 0.1
RANDOM_SEED = 13
random.seed(RANDOM_SEED)

TESTING_DATASET_PATH = "testing_dataset"
TRAINING_DATASET_PATH = "dataset"

def create_test_split():

    if os.path.exists(TESTING_DATASET_PATH) == False:
        subprocess.run("mkdir {}".format(TESTING_DATASET_PATH), check=True, shell=True)

    for label in util.LABELS:
        test_per_label_folder_path = os.path.join(TESTING_DATASET_PATH, label)
        if os.path.exists(test_per_label_folder_path) == False:
            subprocess.run("mkdir {}".format(test_per_label_folder_path), check=True, shell=True)

        train_per_label_folder_path = os.path.join(TRAINING_DATASET_PATH, label)
        training_files = os.listdir(train_per_label_folder_path)
        number_of_files_to_sample = int(len(training_files) * 0.1)
        randomly_sampled_test_files = random.sample(training_files, number_of_files_to_sample)
        # print(label, randomly_sampled_test_files)

        for data_file in randomly_sampled_test_files:
            print("Moving {} from training to testing".format(data_file))
            shutil.move(os.path.join(train_per_label_folder_path, data_file), os.path.join(test_per_label_folder_path, data_file))

if __name__ == "__main__":
    create_test_split()
