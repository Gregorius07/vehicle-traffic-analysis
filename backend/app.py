import os
import subprocess
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///traffic_local.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# ==========================================
# 1. MODEL DATABASE
# ==========================================
class VideoTask(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(255), nullable=False)
    status = db.Column(db.String(50), default='pending') 
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    logs = db.relationship('TrafficLog', backref='video', lazy=True)

class TrafficLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    video_id = db.Column(db.Integer, db.ForeignKey('video_task.id'), nullable=False)
    vehicle_class = db.Column(db.String(50))
    direction = db.Column(db.String(50))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

# Tabel Baru: Menyimpan Konfigurasi YOLO
class SystemSettings(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    confidence = db.Column(db.Float, default=0.4)
    model_size = db.Column(db.String(50), default='yolov8n')

with app.app_context():
    db.create_all()
    # Buat pengaturan default jika database masih kosong
    if not SystemSettings.query.first():
        db.session.add(SystemSettings(confidence=0.4, model_size='yolov8n'))
        db.session.commit()

# ==========================================
# 2. ENDPOINT API UTAMA
# ==========================================
@app.route('/api/upload', methods=['POST'])
def upload_video():
    if 'video' not in request.files:
        return jsonify({"error": "Tidak ada file video"}), 400
    file = request.files['video']
    if file.filename == '':
        return jsonify({"error": "Nama file kosong"}), 400

    file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    file.save(file_path)

    new_task = VideoTask(filename=file.filename, status='pending')
    db.session.add(new_task)
    db.session.commit()

    subprocess.Popen(['python', 'processor.py', str(new_task.id), file_path])
    return jsonify({"message": "Video mulai diproses", "video_id": new_task.id}), 202

@app.route('/api/results/<int:video_id>', methods=['GET'])
def get_results(video_id):
    task = VideoTask.query.get_or_404(video_id)
    logs = TrafficLog.query.filter_by(video_id=video_id).all()
    
    stats = {
        "id": task.id, "filename": task.filename, "status": task.status,
        "data": {"masuk": {"car": 0, "motorcycle": 0, "bus": 0, "truck": 0}, "keluar": {"car": 0, "motorcycle": 0, "bus": 0, "truck": 0}}
    }
    for log in logs:
        stats["data"][log.direction][log.vehicle_class] += 1
    return jsonify(stats)

# ==========================================
# 3. ENDPOINT BARU: HISTORY & SETTINGS
# ==========================================
@app.route('/api/history', methods=['GET'])
def get_history():
    tasks = VideoTask.query.order_by(VideoTask.created_at.desc()).all()
    hasil = []
    for t in tasks:
        hasil.append({
            "id": t.id,
            "filename": t.filename,
            "status": t.status,
            "date": t.created_at.strftime("%b %d, %Y - %H:%M")
        })
    return jsonify(hasil)

@app.route('/api/settings', methods=['GET', 'POST'])
def handle_settings():
    setting = SystemSettings.query.first()
    
    if request.method == 'POST':
        data = request.json
        setting.confidence = float(data.get('confidence', 0.4))
        setting.model_size = data.get('model_size', 'yolov8n')
        db.session.commit()
        return jsonify({"message": "Pengaturan berhasil disimpan!"})
        
    return jsonify({
        "confidence": setting.confidence,
        "model_size": setting.model_size
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)