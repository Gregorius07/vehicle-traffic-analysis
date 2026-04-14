import cv2
import numpy as np
from collections import defaultdict
from ultralytics import YOLO

print("Memuat model YOLOv8...")
model = YOLO('yolov8n.pt')

video_path = "..\\videos\\13763890_3840_2160_25fps.mp4" 
cap = cv2.VideoCapture(video_path)

# Variabel klasifikasi dan penentuan arah
garis_y = 300       
offset = 15         

statistik_masuk = {'car': 0, 'motorcycle': 0, 'bus': 0, 'truck': 0}
statistik_keluar = {'car': 0, 'motorcycle': 0, 'bus': 0, 'truck': 0}

id_terhitung = set() 
riwayat_posisi_y = {}

# Variabel jejak kendaraan dan heatmap
# Format riwayat_jejak: { track_id: [(x1, y1), (x2, y2), ...] }
riwayat_jejak = defaultdict(lambda: [])
heatmap_canvas = None 

while cap.isOpened():
    success, frame = cap.read()
    if not success:
        print("Video selesai diputar.")
        break

    frame = cv2.resize(frame, (854, 480))
    
    # Inisialisasi kanvas heatmap pada frame pertama
    if heatmap_canvas is None:
        heatmap_canvas = np.zeros_like(frame, dtype=np.uint8)

    # Jalankan pelacakan objek dengan YOLOv8
    results = model.track(frame, persist=True, conf=0.4, classes=[2, 3, 5, 7], verbose=False)
    
    # Gambar garis batas virtual
    cv2.line(frame, (0, garis_y), (854, garis_y), (255, 0, 0), 2)

    if results[0].boxes.id is not None:
        boxes = results[0].boxes.xyxy.int().cpu().tolist()
        track_ids = results[0].boxes.id.int().cpu().tolist()
        class_ids = results[0].boxes.cls.int().cpu().tolist()

        for box, track_id, class_id in zip(boxes, track_ids, class_ids):
            x1, y1, x2, y2 = box
            class_name = model.names[class_id]
            pusat_x = int((x1 + x2) / 2)
            pusat_y = int((y1 + y2) / 2)

            # Gambar bounding box dan label kendaraan
            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
            cv2.putText(frame, f"{class_name} #{track_id}", (x1, max(15, y1 - 10)), 
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

            # Simpan posisi saat ini ke riwayat jejak (maksimal 30 frame)
            riwayat_jejak[track_id].append((pusat_x, pusat_y))
            if len(riwayat_jejak[track_id]) > 30:
                riwayat_jejak[track_id].pop(0)

            # Gambar jejak aktif (ekor kuning)
            titik_ekor = np.array(riwayat_jejak[track_id], dtype=np.int32).reshape((-1, 1, 2))
            cv2.polylines(frame, [titik_ekor], isClosed=False, color=(0, 255, 255), thickness=2)

            # Gambar heatmap permanen (garis merah transparan)
            if len(riwayat_jejak[track_id]) >= 2:
                titik_sebelumnya = riwayat_jejak[track_id][-2]
                titik_sekarang = riwayat_jejak[track_id][-1]
                cv2.line(heatmap_canvas, titik_sebelumnya, titik_sekarang, (0, 0, 200), 2)

            # Logika penghitungan dan penentuan arah
            if track_id in riwayat_posisi_y:
                posisi_y_sebelumnya = riwayat_posisi_y[track_id]
                
                # Cek jika kendaraan melewati zona batas
                if (garis_y - offset) < pusat_y < (garis_y + offset):
                    if track_id not in id_terhitung:
                        id_terhitung.add(track_id)
                        
                        # Tentukan arah berdasarkan perubahan posisi Y
                        if pusat_y > posisi_y_sebelumnya:
                            statistik_masuk[class_name] += 1
                        else:
                            statistik_keluar[class_name] += 1
                            
                        # Beri indikator visual saat garis terlewati
                        cv2.line(frame, (0, garis_y), (854, garis_y), (0, 255, 0), 5)

            # Perbarui riwayat posisi Y untuk frame berikutnya
            riwayat_posisi_y[track_id] = pusat_y

    # Gabungkan kanvas heatmap dengan frame asli (opacity 50%)
    frame = cv2.addWeighted(frame, 1.0, heatmap_canvas, 0.5, 0)

    # Tampilkan overlay statistik (HUD)
    cv2.rectangle(frame, (10, 10), (300, 160), (0, 0, 0), -1) 
    cv2.putText(frame, "KENDARAAN MASUK (Bawah)", (20, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 255), 2)
    cv2.putText(frame, f"Mobil:{statistik_masuk['car']} Motor:{statistik_masuk['motorcycle']} Bus:{statistik_masuk['bus']} Truk:{statistik_masuk['truck']}", (20, 50), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)
    cv2.putText(frame, "KENDARAAN KELUAR (Atas)", (20, 100), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 255), 2)
    cv2.putText(frame, f"Mobil:{statistik_keluar['car']} Motor:{statistik_keluar['motorcycle']} Bus:{statistik_keluar['bus']} Truk:{statistik_keluar['truck']}", (20, 120), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)

    cv2.imshow("Dashboard: Trajectory & Classification", frame)
    
    if cv2.waitKey(30) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()