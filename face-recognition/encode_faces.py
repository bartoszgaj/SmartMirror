# USAGE
# python3 encode_faces.py --dataset dataset

# import all needed packages
from imutils import paths
import numpy as np
import argparse
import json
import cv2
import os

# create the argument parser and parse the arguments
ap = argparse.ArgumentParser()
ap.add_argument("-d", "--dataset", required=True,
                help="path to input directory of images of faces")
ap.add_argument("-e", "--encodings", required=False,
                help="path to serialized db of facial encodings")
ap.add_argument("-n", "--names", required=False,
                help="path to names dictionary")
args = vars(ap.parse_args())

encodings_path = args["encodings"] or "trainer.yml"
names_path = args["names"] or "names.json"

# create LBPH face recognizer instance
recognizer = cv2.face.LBPHFaceRecognizer_create()

# collect paths to images in our dataset
imagePaths = list(paths.list_images(args["dataset"]))

# initialize lists of faces and their ids and id<->name dictionary
names = {}
faces = []
ids = []

# loop over the image paths
for (i, imagePath) in enumerate(imagePaths):
    # extract the person name from the image path (name of directory)
    print("[INFO] processing image {}/{}".format(i + 1, len(imagePaths)))
    name = imagePath.split(os.path.sep)[-2]
    # get id of user based on id<->name dictionary
    if name in names.values():
        id = list(names.keys())[list(names.values()).index(name)]
    else:
        id = len(names) + 1
        names[id] = name

    # load image and convert it to Gray
    image = cv2.imread(imagePath)
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    faces.append(np.array(gray_image, 'uint8'))
    ids.append(id)

# training and saving face recognizer
print("[INFO] training recognizer...")
recognizer.train(faces, np.array(ids))

print("[INFO] saving recognizer...")
recognizer.save(encodings_path)

# save names dictionary to .json file
with open(names_path, 'w') as file:
    json.dump(names, file)

print("\n[INFO] {0} faces trained. Exiting Program".format(len(names)))
