from roboflow import Roboflow

rf = Roboflow(api_key="wBzmhu8RAmuhs2HubK5z")
project = rf.workspace("jiraphatthanasuttiwat").project("barrier_detection-5mhjn")
version = project.version(4)
dataset = version.download("yolov8")
