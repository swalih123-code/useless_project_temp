import cv2
import numpy as np
import base64
from typing import Dict, Any, Tuple

def encode_image_to_base64(image_bgr: np.ndarray, quality: int = 88) -> str:
    """Encodes an OpenCV image to a base64 JPEG data URL."""
    encode_params = [int(cv2.IMWRITE_JPEG_QUALITY), quality]
    success, buffer = cv2.imencode('.jpg', image_bgr, encode_params)
    if not success:
        return ""
    b64_str = base64.b64encode(buffer).decode('utf-8')
    return f"data:image/jpeg;base64,{b64_str}"

def generate_visual_overlays(image_bgr: np.ndarray, analysis_results: Dict[str, Any]) -> Dict[str, str]:
    """
    Generates rich visual annotations highlighting detected layers, edges, and flakiness heatmap.
    
    Returns:
        {
            "annotated_image": base64 string,
            "edge_image": base64 string,
            "heatmap_image": base64 string
        }
    """
    h, w = image_bgr.shape[:2]
    cx, cy = analysis_results.get("center", (w // 2, h // 2))
    radius = analysis_results.get("radius", min(w, h) * 0.4)
    radial_scans = analysis_results.get("radial_scans", [])
    edges = analysis_results.get("edges")
    layers = analysis_results.get("estimated_layers", 18)
    density = analysis_results.get("layer_density", "High")
    
    # --- 1. Annotated Layer Image ---
    annotated = image_bgr.copy()
    overlay = image_bgr.copy()
    
    # Outer parotta halo / boundary ring (Golden Yellow #F59E0B -> BGR: 11, 158, 245)
    cv2.circle(overlay, (cx, cy), int(radius), (11, 158, 245), 3, cv2.LINE_AA)
    
    # Draw faint radial scan guides
    for scan in radial_scans:
        ex, ey = scan["end_point"]
        cv2.line(overlay, (cx, cy), (ex, ey), (40, 90, 160), 1, cv2.LINE_AA)
        
    # Draw concentric layer rings through detected peaks to show the spiral laminations
    # Collect peak radiuses
    peak_radii = []
    for scan in radial_scans:
        for (px, py) in scan["peaks"]:
            dist = np.hypot(px - cx, py - cy)
            peak_radii.append(dist)
            # Draw individual peak marker (emerald green with glow)
            cv2.circle(overlay, (px, py), 3, (110, 230, 40), -1, cv2.LINE_AA)
            cv2.circle(overlay, (px, py), 5, (220, 255, 120), 1, cv2.LINE_AA)
            
    # Group peak radiuses to draw smooth detected layer contours
    if peak_radii:
        hist, bin_edges = np.histogram(peak_radii, bins=min(layers, 24))
        for b in range(len(hist)):
            if hist[b] >= 3:
                r_ring = int((bin_edges[b] + bin_edges[b + 1]) / 2.0)
                # Gradient color from deep amber (center) to electric lime/gold (outer)
                t = float(b) / max(1, len(hist) - 1)
                col = (
                    int(20 + 180 * t),     # B
                    int(140 + 100 * (1-t)),# G
                    int(240 - 40 * t)      # R
                )
                cv2.circle(overlay, (cx, cy), r_ring, col, 2, cv2.LINE_AA)

    # Center target reticle
    cv2.drawMarker(overlay, (cx, cy), (0, 215, 255), cv2.MARKER_CROSS, 24, 2, cv2.LINE_AA)
    cv2.circle(overlay, (cx, cy), 8, (0, 215, 255), 2, cv2.LINE_AA)

    # Alpha blend overlay for smooth glowing aesthetics
    alpha = 0.68
    cv2.addWeighted(overlay, alpha, annotated, 1.0 - alpha, 0, annotated)
    
    # Add high-tech HUD overlay pill at the bottom
    hud_bg = annotated.copy()
    hud_h = 44
    cv2.rectangle(hud_bg, (16, h - hud_h - 16), (w - 16, h - 16), (20, 20, 20), cv2.FILLED)
    cv2.addWeighted(hud_bg, 0.85, annotated, 0.15, 0, annotated)
    cv2.rectangle(annotated, (16, h - hud_h - 16), (w - 16, h - 16), (11, 158, 245), 1, cv2.LINE_AA)
    
    hud_text = f"PAROTTA CV CORE // DETECTED: {layers} LAYERS // DENSITY: {density.upper()} // FLAKINESS: {analysis_results.get('flakiness_score', 80)}%"
    font_scale = max(0.42, min(0.65, w / 900.0))
    cv2.putText(annotated, hud_text, (28, h - 28), cv2.FONT_HERSHEY_SIMPLEX, font_scale, (245, 245, 245), 1, cv2.LINE_AA)
    
    # --- 2. Edge Map (Layer Ridges) ---
    if edges is not None:
        # Create golden neon edge visualization
        edge_bgr = np.zeros((h, w, 3), dtype=np.uint8)
        # Dilate slightly for punchy visibility
        edge_dilated = cv2.dilate(edges, np.ones((3, 3), np.uint8), iterations=1)
        
        # Color edges with warm golden hue (BGR: 30, 180, 255)
        edge_bgr[edge_dilated > 0] = [30, 185, 255]
        # Inner sharp core
        edge_bgr[edges > 0] = [200, 250, 255]
        
        # Blend lightly with darkened original image for context
        darkened_orig = (image_bgr.astype(np.float32) * 0.25).astype(np.uint8)
        edge_visual = cv2.add(darkened_orig, edge_bgr)
    else:
        edge_visual = annotated.copy()

    # --- 3. Heatmap Image (Flakiness & Texture Density) ---
    gray = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2GRAY)
    laplacian = cv2.Laplacian(gray, cv2.CV_64F)
    lap_abs = np.uint8(np.clip(np.abs(laplacian) * 2.5, 0, 255))
    lap_blur = cv2.GaussianBlur(lap_abs, (15, 15), 0)
    
    # Colormap: COLORMAP_INFERNO or COLORMAP_TURBO
    heatmap = cv2.applyColorMap(lap_blur, cv2.COLORMAP_INFERNO)
    
    # Mask outside parotta circle to keep background clean
    mask_circle = np.zeros((h, w), dtype=np.uint8)
    cv2.circle(mask_circle, (cx, cy), int(radius * 1.05), 255, -1)
    
    heatmap_masked = np.zeros_like(image_bgr)
    heatmap_masked[mask_circle > 0] = heatmap[mask_circle > 0]
    
    # Blend with original
    heatmap_visual = image_bgr.copy()
    cv2.addWeighted(heatmap_masked, 0.65, heatmap_visual, 0.35, 0, heatmap_visual)
    
    return {
        "annotated_image": encode_image_to_base64(annotated),
        "edge_image": encode_image_to_base64(edge_visual),
        "heatmap_image": encode_image_to_base64(heatmap_visual)
    }
