# USAGE
# python3 build_face_dataset.py --identifier "Identifier"

# import all needed packages
from imutils.video import VideoStream
from builtins import len
import argparse
import time
import cv2
import os


def put_text_center(message):
    text_size = cv2.getTextSize(message, cv2.FONT_HERSHEY_SIMPLEX, 1, 2)[0]
    textX = int((frame.shape[1] - text_size[0]) / 2)
    textY = int((frame.shape[0] + text_size[1]) / 2)
    cv2.putText(frame, message, (textX, textY), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)


def yes_or_no(question):
    yes = {'yes', 'y', ''}
    no = {'no', 'n'}

    choice = str(input(question + ' (y/n): ')).lower().strip()
    if choice in yes:
        return True
    elif choice in no:
        return False
    else:
        return yes_or_no("Please respond with 'yes' or 'no'")


# create the argument parser and parse the arguments
ap = argparse.ArgumentParser()
ap.add_argument("-i", "--identifier", required=True,
                help="identifier of user")
ap.add_argument("-c", "--cascade", required=False,
                help="path to face cascade")
ap.add_argument("-n", "--number", required=False,
                help="number of images to collect")
args = vars(ap.parse_args())

cascade_path = args["cascade"] or "haarcascade_frontalface_default.xml"
number = args["number"] or 15

# create directory for data
dir_path = os.path.sep.join(["dataset", args["identifier"]])
if not os.path.exists(dir_path):
    os.makedirs(dir_path)
else:
    if yes_or_no("Dataset with given ID already exists. Would you like to override it?"):
        # delete existing data
        filelist = [f for f in os.listdir(dir_path) if f.endswith(".png")]
        for f in filelist:
            os.remove(os.path.join(dir_path, f))
        print("[INFO] overriding data with ID {}".format(args["identifier"]))
    else:
        print("Exiting script. Use another ID")
        exit()

# load OpenCV's Haar cascade for face detection
face_detector = cv2.CascadeClassifier(cascade_path)

# initialize the video stream, allow the camera sensor to warm up,
print("[INFO] Starting video stream...")
vs = VideoStream(src=0).start()
# vs = VideoStream(usePiCamera=True).start()
time.sleep(2.0)
total = 0

# loop over the frames from the video stream until there is enough data
while total < number:
    # read current frame
    frame = vs.read()
    key = cv2.waitKey(1) & 0xFF
    # convert frame to gray scale
    gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    # detect faces in the grayscale frame
    faces = face_detector.detectMultiScale(
        gray_frame, scaleFactor=1.1,
        minNeighbors=5, minSize=(30, 30))

    if len(faces) > 1:
        put_text_center("Error: Multiple faces detected")
    elif len(faces) == 0:
        put_text_center("Error: No faces detected")
    else:
        (x, y, w, h) = faces[0]

        # if the `s` key was pressed, write face to disk
        if key == ord("s"):
            crop_frame = frame[y:y + h, x:x + w]
            path = os.path.sep.join([dir_path, "{}.png".format(str(total).zfill(5))])
            if cv2.imwrite(path, crop_frame):
                total += 1
                print("[INFO] saved photo {}".format(total))
            else:
                print("[ERR] could not save image")

        # draw face bounding-box on frame
        cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)

    # show the output frame
    cv2.imshow("Frame", frame)

    # if the `q` key was pressed stop collecting data
    if key == ord("q"):
        break

# cleanup
print("[INFO] {} face images stored".format(total))
print("[INFO] cleaning up...")
cv2.destroyAllWindows()
vs.stop()
