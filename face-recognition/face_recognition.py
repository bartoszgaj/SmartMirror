# USAGE
# python3 face_recognition.py

# import all needed packages
from imutils.video import VideoStream
import argparse
import requests
import time
import json
import cv2

# create the argument parser and parse the arguments
ap = argparse.ArgumentParser()
ap.add_argument("-c", "--cascade", required=False,
                help="path to face cascade")
ap.add_argument("-e", "--encodings", required=False,
                help="path to serialized db of facial encodings")
ap.add_argument("-n", "--names", required=False,
                help="path to names dictionary")
ap.add_argument("-conf", "--confidence", required=False,
                help="path to names dictionary")
args = vars(ap.parse_args())

cascade_path = args["cascade"] or "haarcascade_frontalface_default.xml"
encodings_path = args["encodings"] or "trainer.yml"
names_path = args["names"] or "names.json"
confidence_limit = args["confidence"] or 60

# load OpenCV's Haar cascade for face detection
face_detector = cv2.CascadeClassifier(cascade_path)

# create LBPH face recognizer instance and load encodings
recognizer = cv2.face.LBPHFaceRecognizer_create()
recognizer.read(encodings_path)

URL = "http://localhost:8080/recognition"
headers = {'Content-Type': 'application/json'}

# read names dictionary from .json file
with open(names_path) as file:
    names = json.loads(file.read())

# initialize the video stream, allow the camera sensor to warm up,
print("[INFO] starting video stream...")
vs = VideoStream(src=0).start()
# vs = VideoStream(usePiCamera=True).start()
time.sleep(2.0)

# loop over the frames from the video stream
while True:
    # read current frame
    frame = vs.read()
    frame_view = frame.copy()

    # convert frame to gray scale
    gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    # detect faces in the grayscale frame
    faces = face_detector.detectMultiScale(
        gray_frame, scaleFactor=1.1,
        minNeighbors=5, minSize=(30, 30))
    # iterate over detected faces
    recognized_faces = {"names": []}
    for (x, y, w, h) in faces:
        # recognise face
        id_predicted, conf = recognizer.predict(gray_frame[y:y + h, x:x + w])
        # check if confidence is below given tolerance limit
        if conf < confidence_limit:
            name = names[str(id_predicted)]
        else:
            name = "Unknown"
        recognized_faces["names"].append(name)

        # draw face bounding-box on frame with predicted name
        cv2.rectangle(frame_view, (x, y), (x + w, y + h), (0, 255, 0), 2)
        cv2.putText(frame_view, name + str(conf), (x, y), cv2.FONT_HERSHEY_SIMPLEX, 0.75, (0, 255, 0), 2)
    try:
        # send request to backend server with all faces recognized
        r = requests.post(url=URL, headers=headers, data=json.dumps(recognized_faces))
    except:
        print("[ERR] exception when sending request")

    # show the output frame
    cv2.imshow("Frame", frame_view)
    key = cv2.waitKey(1) & 0xFF

    # if the `q` key was pressed stop detecting
    if key == ord("q"):
        print("[INFO] process stopped by user")
        break

# cleanup
cv2.destroyAllWindows()
vs.stop()
