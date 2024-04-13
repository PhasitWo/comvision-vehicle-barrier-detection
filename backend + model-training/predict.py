from ultralytics import YOLO
from ultralytics.utils.plotting import Annotator
import cv2
from fastapi import FastAPI, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import uvicorn
import os
import json

app = FastAPI()


class Req(BaseModel):
    fileList: list[str]

@app.get("/alive")
async def alive():
    return JSONResponse(content={"message": 1}, status_code=status.HTTP_200_OK)


@app.post("/predict")
async def post(request: Req):
    try:
        result_file_list = predict(request.fileList)
    except:
        return JSONResponse(content={"result":"error"},status_code=status.HTTP_404_NOT_FOUND)
    return JSONResponse(
        content={"result": result_file_list}, status_code=status.HTTP_201_CREATED
    )


def predict(file_list):
    vehicle_conf = 0.4
    barrier_conf = 0.4
    try:
        with open("predict-config.json", "r") as openfile:
            data = json.load(openfile)
            vehicle_conf = data["model_vehicle"]["conf"]
            barrier_conf = data["model_barrier"]["conf"]
            print(f"run with vehicle_conf = {vehicle_conf}, barrier_conf = {barrier_conf}")
    except:
        print("Error occur -> run with default conf 0.4")
    try:
        result_file_list = []
        for index, file_path in enumerate(file_list):

            model_vehicle = YOLO("yolov8l.pt")
            model_barrier = YOLO("best.pt")
            img = cv2.imread(file_path)

            results_vehicle = model_vehicle.predict(
                img, conf=vehicle_conf, classes=[1, 2, 3, 5, 7]
            )
            results_barrier = model_barrier.predict(img, conf=barrier_conf)

            annotator = Annotator(img, line_width=5)

            for r in results_vehicle:
                boxes = r.boxes
                for box in boxes:
                    b = box.xyxy[0]
                    annotator.box_label(b, color=(0, 0, 255))

            for r in results_barrier:
                boxes = r.boxes
                for box in boxes:
                    b = box.xyxy[0]
                    annotator.box_label(b, color=(0, 0, 255))

            img = annotator.result()
            name = f"result{index}.jpg"
            cv2.imwrite(name, img)
            result_file_list.append(os.path.abspath(name))
    except:
        raise Exception("some problem while predicting")
    return result_file_list

if __name__ == "__main__":
    # ["TestCases/Test01.jpeg", "TestCases/Test02.jpeg"]
    uvicorn.run("predict:app", host="0.0.0.0", port=8000)
