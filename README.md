<img width="1280" height="640" alt="git (1)" src="https://github.com/user-attachments/assets/8920b256-2ba8-4988-b824-5351134eb4bd" />

# Parotta Layer Counter 🫓 🎯

> **"Advanced AI technology for a problem nobody asked us to solve."**

A funny, charmingly over-engineered, yet functionally legitimate computer-vision application that estimates the number of concentric spiral dough layers in a Kerala-style Malabar Parotta from an uploaded photograph.

---

## Basic Details
### Team Name: Maida & Ghee Vision Labs

### Team Members
- Team Lead: AI Culinary Researcher - Kerala Institute of Unnecessary Algorithms
- Member 2: Computer Vision Griddle Specialist - Thattukada Labs
- Member 3: Salna Retention Architect - Autonomous Dough Tribunal

### Project Description
Parotta Layer Counter uses classical computer vision (CLAHE enhancement, bilateral edge-preserving filtering, radial gradient ray-casting, and surface Laplacian variance analysis) to inspect photographs of Kerala parottas, quantify visible dough laminations, calculate flakiness and circularity, and issue an official Council Certificate of Dough Lamination.

### The Problem (that doesn't exist)
For decades, diners across South India have sat in thattukadas and restaurants, staring intently at their Kerala parottas, paralyzed by uncertainty: *“Did the chef pleat this into 12 layers or 22 layers? Is this flaky enough to achieve maximum Salna absorption efficiency?”* Diners had no scientific way to audit parotta lamination before taking the first bite.

### The Solution (that nobody asked for)
We built an end-to-end full-stack AI research-grade tool that takes any photo of a parotta, performs multi-angle radial intensity ray-casting from core to rim, extracts ridge frequencies, grades flakiness via second-order Laplacian derivatives, flags non-parotta imposters (like cats, laptops, or dosas) with humorous error diagnostics, and generates an official council report and interactive split-slider layer overlay!

---

## Technical Details

### Technologies/Components Used
For Software:
- **Languages:** Python 3.11, JavaScript (ES6+ React 18)
- **Frameworks:** FastAPI (Backend), Vite + React 18 (Frontend), Tailwind CSS
- **Libraries:** OpenCV (`opencv-python-headless`), NumPy, Pillow, Pydantic v2, Lucide React, Canvas Confetti
- **Tools:** Uvicorn ASGI server, Node.js / NPM, Git

---

## Features

- 📸 **Image Upload & Drag-and-Drop:** Instant upload with preview and EXIF auto-rotation.
- 🫓 **Parotta Detection & Anti-Counterfeit Protocol:** Verifies golden-brown toasted maida color profile in HSV space and geometric compactness. Humorous rejection protocol if someone tries uploading a laptop, bicycle, or cat (`❌ This does not appear to be a parotta. Please upload a valid parotta.`).
- 🔬 **Computer Vision Layer Extraction:**
  - CLAHE (Contrast Limited Adaptive Histogram Equalization) to accentuate shadow creases.
  - Multi-angle radial scan lines (24 rays at 15° increments) sampling gradient zero-crossings.
  - Statistical filtering to estimate representative spiral dough layers.
- 📊 **Comprehensive Metrics Dashboard:**
  - Animated Layer Counter (`18 LAYERS`)
  - Circular SVG Confidence Meter (`82%`)
  - Flakiness Score (`91/100`) via Laplacian surface variance
  - Layer Density (`High`)
  - Circularity Percentage (`87%`)
  - Overall Parotta Quality Index (`94/100`)
- 🏆 **Council Verdict System:**
  - `90–100`: "🏆 Legendary Parotta. This deserves respect."
  - `75–89`: "🔥 Excellent parotta. Strong layer game."
  - `50–74`: "👍 Acceptable. Could use more layers."
  - `25–49`: "😐 This parotta needs emotional support."
  - `0–24`: "💀 Is this even a parotta?"
- 👁️ **Visual Analysis Inspector:**
  - Interactive Before/After Split Comparison Slider
  - Side-by-Side Mode
  - Detected Layers HUD Overlay with concentric ring highlights
  - High-contrast Canny/Sobel Edge Map
  - Texture & Flakiness Thermal Heatmap
- 📜 **Official Council Certificate & Pairing:** Printable certificate with Salna absorption capacity, acoustic clap reverberation (dB), and prescribed curry pairing (e.g. Kerala Beef Roast).
- 🧪 **Pre-Calibrated Test Samples:** 4 built-in 1-click test subjects (Malabar Grandmaster, Thattukada Coin, Sad Flat Disc, and Non-Parotta Control) to test immediately without searching for photos.

---

## Implementation

### Architecture Diagram

```
+-------------------------------------------------------------+
|                      React Frontend                         |
|   (Vite + Tailwind CSS + Interactive Split Slider + HUD)    |
+------------------------------+------------------------------+
                               |
                        POST /analyze (Image File)
                               |
                               v
+-------------------------------------------------------------+
|                     FastAPI Backend                         |
|                                                             |
|  1. Image Decode & EXIF Transpose                           |
|  2. Parotta Validation (HSV Palette & Circularity)          |
|     ├── If Non-Parotta ──> ❌ Rejection Response            |
|     └── If Valid Parotta ──> Layer Pipeline:                |
|           • CLAHE Contrast Enhancement                      |
|           • Bilateral Edge-Preserving Smoothing             |
|           • 24-Ray Radial Gradient Peak Detection           |
|           • Laplacian Surface Flakiness Variance            |
|           • Visual Overlay Rendering (Base64 JPEG)          |
+-------------------------------------------------------------+
```

---

## Installation & Run Guide

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### Quick Start (All-in-One Runner)

#### Option 1: Using the Python Unified Launcher
```bash
# 1. Install backend requirements
python -m pip install -r backend/requirements.txt

# 2. Install frontend dependencies
cd frontend
npm install
cd ..

# 3. Launch both backend & frontend concurrently
python run_app.py
```

#### Option 2: Windows Batch Script
Simply double-click `start.bat` or run:
```cmd
start.bat
```

---

### Manual Step-by-Step Setup

#### 1. Backend Setup
```bash
# Create and activate virtual environment
python -m venv .venv
# On Windows:
.\.venv\Scripts\activate
# On macOS/Linux:
# source .venv/bin/activate

# Install dependencies
pip install -r backend/requirements.txt

# Run FastAPI backend
uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```
The backend will be live at `http://127.0.0.1:8000` (API Docs at `http://127.0.0.1:8000/docs`).

#### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The React frontend will be live at `http://localhost:5173`.

---

## API Documentation

### `POST /analyze`
Accepts a multipart file upload (`file: UploadFile`) with image data (`image/jpeg`, `image/png`, etc.).

**Success Response (200 OK - Valid Parotta):**
```json
{
  "is_parotta": true,
  "estimated_layers": 18,
  "confidence": 82,
  "flakiness_score": 91,
  "layer_density": "High",
  "circularity": 87,
  "quality_score": 94,
  "verdict": "🏆 Legendary Parotta. This deserves respect.",
  "annotated_image": "data:image/jpeg;base64,...",
  "edge_image": "data:image/jpeg;base64,...",
  "heatmap_image": "data:image/jpeg;base64,...",
  "humorous_notes": [
    "Lamination Coefficient: 29.12 ψ (Golden Dough Ratio).",
    "Salna Retention Capacity: Estimated at 88% gravy absorption efficiency.",
    "Estimated Hand-Clap Crispiness: 92 dB acoustic reverberation."
  ],
  "suggested_accompaniment": "Kerala Beef Roast with fried coconut slivers"
}
```

**Non-Parotta Rejection Response (200 OK):**
```json
{
  "is_parotta": false,
  "estimated_layers": 0,
  "confidence": 8,
  "flakiness_score": 0,
  "layer_density": "None",
  "circularity": 0,
  "quality_score": 0,
  "verdict": "💀 Is this even a parotta?",
  "error_message": "❌ This does not appear to be a parotta. Please upload a valid parotta.",
  "humorous_notes": [
    "Rejected by the Kerala Parotta Regulatory Authority.",
    "Diagnostic remarks: Insufficient golden/toasted Maida pigment detected. Excessive cybernetic/blue spectrum detected.",
    "Please present an authentic circular maida disc for official audit."
  ]
}
```

### `GET /samples`
Returns metadata and URLs for pre-loaded test specimens.

### `GET /health`
Returns system status:
```json
{
  "status": "online",
  "council_status": "Hungry",
  "current_craving": "Porotta and Beef Fry"
}
```

---

## Automated Tests

Run the test suite to verify the computer-vision algorithms, layer counts, and edge cases:
```bash
python -m unittest tests/test_analysis.py
```

---

## Disclaimer
*The Parotta Layer Counter is an experimental computer-vision approximation. Layer counting is mathematically non-deterministic when dealing with aggressively hand-clapped parottas. Please consume all analyzed specimens promptly with hot gravy.*

---
Made with ❤️ at TinkerHub Useless Projects 

![Static Badge](https://img.shields.io/badge/TinkerHub-24?color=%23000000&link=https%3A%2F%2Fwww.tinkerhub.org%2F)
![Static Badge](https://img.shields.io/badge/UselessProjects--26-26?link=https%3A%2F%2Ftinkerhub.org%2Fevents%2F1M8ORET9A1%2Fuseless-projects-3.0)
