import os
import io
from fastapi import FastAPI, File, UploadFile, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse, FileResponse

from backend.models.schemas import ParottaAnalysisResponse
from backend.image_processing.detector import detect_parotta
from backend.image_processing.layer_counter import count_parotta_layers
from backend.image_processing.visualizer import generate_visual_overlays
from backend.utils.helpers import load_image_from_bytes, resize_for_analysis, is_allowed_file
from backend.utils.sample_data import ensure_sample_images, get_sample_metadata, SAMPLES_DIR

app = FastAPI(
    title="Parotta Layer Counter API",
    description="Advanced, highly unnecessary AI computer vision system for Kerala Parotta lamination quantification.",
    version="1.0.0"
)

# Enable CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure sample images are generated on startup
ensure_sample_images()

# Serve static sample images
app.mount("/static", StaticFiles(directory=os.path.join(os.path.dirname(__file__), "static")), name="static")

FRONTEND_DIST = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend", "dist")
if os.path.exists(FRONTEND_DIST):
    assets_dir = os.path.join(FRONTEND_DIST, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="frontend_assets")

@app.get("/")
def index_or_root():
    """Serves the React frontend if built, or API info."""
    index_html = os.path.join(FRONTEND_DIST, "index.html")
    if os.path.exists(index_html):
        return FileResponse(index_html)
    return {
        "message": "Welcome to the Parotta Layer Counter API",
        "tagline": "Advanced AI technology for a problem nobody asked us to solve.",
        "docs_url": "/docs",
        "endpoints": ["/analyze", "/samples", "/health"]
    }

@app.get("/api")
def root():
    return {
        "message": "Welcome to the Parotta Layer Counter API",
        "tagline": "Advanced AI technology for a problem nobody asked us to solve.",
        "docs_url": "/docs",
        "endpoints": ["/analyze", "/samples", "/health"]
    }

@app.get("/health")
def health_check():
    return {
        "status": "online",
        "council_status": "Hungry",
        "current_craving": "Porotta and Beef Fry"
    }

@app.get("/samples")
def list_samples():
    """Returns list of pre-configured test subjects."""
    samples = get_sample_metadata()
    # Add full sample URL
    for s in samples:
        s["image_url"] = f"/static/samples/{s['filename']}"
    return samples

@app.post("/analyze", response_model=ParottaAnalysisResponse)
async def analyze_parotta(file: UploadFile = File(...)):
    """
    Analyzes an uploaded image:
    1. Validates whether the image depicts a parotta.
    2. Employs computer vision to estimate visible dough layer boundaries.
    3. Calculates confidence, flakiness, circularity, and quality score.
    4. Generates visual overlay maps (annotated layers, edges, flakiness heatmap).
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="Uploaded file missing filename.")
        
    if not is_allowed_file(file.filename):
        raise HTTPException(
            status_code=400,
            detail="Unsupported format. Please upload JPG, JPEG, PNG, or WEBP image."
        )
        
    try:
        content = await file.read()
        if len(content) == 0:
            raise HTTPException(status_code=400, detail="Empty file uploaded.")
            
        # Decode image
        image_bgr = load_image_from_bytes(content)
        if image_bgr is None:
            raise HTTPException(status_code=422, detail="Failed to decode optical image data.")
            
        # Standardize size for consistent edge gradients
        resized_bgr, _ = resize_for_analysis(image_bgr, max_dimension=900)
        
        # Step 1: Detect Parotta
        is_parotta, detection_info = detect_parotta(resized_bgr)
        
        if not is_parotta:
            # Humorous rejection response
            reasons = detection_info.get("reasons", ["Optical signature does not match layered Maida."])
            reason_text = " ".join(reasons)
            
            return ParottaAnalysisResponse(
                is_parotta=False,
                estimated_layers=0,
                confidence=int(detection_info.get("detection_confidence", 8)),
                flakiness_score=0,
                layer_density="None",
                circularity=int(detection_info.get("circularity", 0)),
                quality_score=0,
                verdict="💀 Is this even a parotta?",
                error_message="❌ This does not appear to be a parotta. Please upload a valid parotta.",
                humorous_notes=[
                    "Rejected by the Kerala Parotta Regulatory Authority.",
                    f"Diagnostic remarks: {reason_text}",
                    "Please present an authentic circular maida disc for official audit."
                ],
                suggested_accompaniment="None (Food not found)"
            )
            
        # Step 2: Layer & Flakiness Detection
        results = count_parotta_layers(resized_bgr, detection_info)
        
        # Step 3: Visual Overlays
        visual_maps = generate_visual_overlays(resized_bgr, results)
        
        return ParottaAnalysisResponse(
            is_parotta=True,
            estimated_layers=results["estimated_layers"],
            confidence=results["confidence"],
            flakiness_score=results["flakiness_score"],
            layer_density=results["layer_density"],
            circularity=results["circularity"],
            quality_score=results["quality_score"],
            verdict=results["verdict"],
            annotated_image=visual_maps["annotated_image"],
            edge_image=visual_maps["edge_image"],
            heatmap_image=visual_maps["heatmap_image"],
            scientific_metrics=results["scientific_metrics"],
            humorous_notes=results["humorous_notes"],
            suggested_accompaniment=results["suggested_accompaniment"]
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Parotta processing anomaly: {str(e)}"
        )
