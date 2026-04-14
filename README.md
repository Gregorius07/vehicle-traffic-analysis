# Traffic Analyzer (Vehicle Detection & Tracking System)

**Traffic Analyzer** is a real-time vehicle detection, tracking, and traffic flow analysis system powered by **YOLOv8** and **OpenCV**. It features a modern, real-time dashboard built with **SolidJS** and **TailwindCSS**.

This project classifies four types of vehicles (`car`, `motorcycle`, `bus`, `truck`), counts entry and exit directions based on an automated virtual line intersection, and stores processing histories inside a lightweight SQLite database.

---

## 📸 Features

- **High-Performance AI:** Utilizes YOLOv8 (nano/small/medium configurable) for fast object tracking.
- **Bi-Directional Counting:** Automatically detects `Entry` (Masuk) and `Exit` (Keluar) movements based on position vectors.
- **Premium Dashboard UI:** Dark-mode glassmorphism interface with Chart.js analytics.
- **Live Status Polling:** Upload a video and watch the server process it in the background while the UI listens for updates.
- **Detailed History Logging:** Full breakdown matrix of all previously mapped videos.

---

## 🛠️ Technology Stack

**Backend:**
- Python 3.x
- Flask / Flask-SQLAlchemy (SQLite)
- Ultralytics YOLOv8
- OpenCV (cv2)

**Frontend:**
- SolidJS
- TailwindCSS v4
- Chart.js (`solid-chartjs`)
- SweetAlert2

---

## 🚀 Installation & Usage

### 1. Backend Setup

Open a terminal and navigate to the `backend/` directory:

```bash
cd backend

# (Optional) Create a virtual environment
python -m venv venv
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate

# Install dependencies (assuming you have a requirements.txt, or install manually:)
pip install flask flask_sqlalchemy flask_cors ultralytics opencv-python

# Run the Flask Server
python app.py
```
> The API will start on `http://localhost:5000`.

### 2. Frontend Setup

Open a separate terminal and navigate to the `frontend/` directory:

```bash
cd frontend

# Install NodeJS dependencies
npm install
# or
pnpm install

# Start the Vite development server
npm run dev
```

> The Frontend Application will start on `http://localhost:3000`.

---

## ⚙️ Configuration (ML Tuning)
From the frontend **Settings** page, you can freely configure the Model variant:
- **`yolov8n.pt`**: Extremely fast. Good for daylight high-res stationary cameras.
- **`yolov8s.pt`**: Balanced approach.
- **`yolov8m.pt`**: Slower but highly accurate. Great for complex intersecting traffic.
  
You can also tweak the **Confidence Threshold** (e.g. from `0.4` to `0.6` to reduce false positives in dark lighting).

---
*Developed for advanced video tracking & Smart City traffic metric use cases.*
