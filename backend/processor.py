import sys
import cv2
import sqlite3
from ultralytics import YOLO

# Menerima argumen dari app.py
video_id = sys.argv[1]
video_path = sys.argv[2]
db_path = 'instance/traffic_local.db' 

def update_task_status(status):
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    cur.execute("UPDATE video_task SET status = ? WHERE id = ?", (status, video_id))
    conn.commit()
    conn.close()

def save_log_to_db(v_class, direction):
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    cur.execute("INSERT INTO traffic_log (video_id, vehicle_class, direction, timestamp) VALUES (?, ?, ?, datetime('now'))", 
                (video_id, v_class, direction))
    conn.commit()
    conn.close()

def get_settings():
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    cur.execute("SELECT confidence, model_size FROM system_settings LIMIT 1")
    row = cur.fetchone()
    conn.close()
    if row:
        return row[0], row[1]
    return 0.4, 'yolov8n' # Fallback default

# Mulai Proses
update_task_status('processing')

# Mengambil pengaturan dari Database
user_confidence, user_model = get_settings()

# Memuat model berdasarkan pilihan user (tambahkan .pt otomatis)
print(f"Memuat model {user_model}.pt dengan confidence {user_confidence}...")
model = YOLO(f"{user_model}.pt")

cap = cv2.VideoCapture(video_path)

garis_y = 300       
offset = 15         
id_terhitung = set() 
riwayat_posisi_y = {}

while cap.isOpened():
    success, frame = cap.read()
    if not success:
        break

    frame = cv2.resize(frame, (854, 480))
    
    # Memasukkan nilai CONFIDENCE dari User
    results = model.track(frame, persist=True, conf=user_confidence, classes=[2, 3, 5, 7], verbose=False)

    if results[0].boxes.id is not None:
        boxes = results[0].boxes.xyxy.int().cpu().tolist()
        track_ids = results[0].boxes.id.int().cpu().tolist()
        class_ids = results[0].boxes.cls.int().cpu().tolist()

        for box, track_id, class_id in zip(boxes, track_ids, class_ids):
            x1, y1, x2, y2 = box
            class_name = model.names[class_id]
            pusat_y = int((y1 + y2) / 2)

            if track_id in riwayat_posisi_y:
                posisi_y_sebelumnya = riwayat_posisi_y[track_id]
                
                if (garis_y - offset) < pusat_y < (garis_y + offset):
                    if track_id not in id_terhitung:
                        id_terhitung.add(track_id)
                        
                        if pusat_y > posisi_y_sebelumnya:
                            save_log_to_db(class_name, "masuk")
                        else:
                            save_log_to_db(class_name, "keluar")

            riwayat_posisi_y[track_id] = pusat_y

update_task_status('completed')
cap.release()