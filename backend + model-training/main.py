from ultralytics import YOLO

if __name__ == '__main__':
    model = YOLO("yolov8l.pt")
    model.train(data="data.yaml", epochs=1000, patience=70, device=0)
