import cv2
import numpy as np
from typing import Dict, Any, List, Tuple

def count_parotta_layers(image_bgr: np.ndarray, detection_info: Dict[str, Any]) -> Dict[str, Any]:
    """
    Analyzes an uploaded parotta image using computer vision:
    1. Preprocessing: CLAHE contrast enhancement & bilateral smoothing.
    2. Boundary segmentation & center of mass determination.
    3. Multi-angle radial gradient scan lines to count layer ridges.
    4. Surface texture / Laplacian variance calculation for Flakiness.
    5. Scoring & humorous verdict calculation.
    """
    h, w = image_bgr.shape[:2]
    gray = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2GRAY)
    
    # 1. CLAHE (Adaptive Histogram Equalization) to reveal folded layer shadows
    clahe = cv2.createCLAHE(clipLimit=3.5, tileGridSize=(8, 8))
    enhanced_gray = clahe.apply(gray)
    
    # Bilateral filter to smooth dough texture while preserving sharp layer step-edges
    filtered = cv2.bilateralFilter(enhanced_gray, d=9, sigmaColor=75, sigmaSpace=75)
    
    # 2. Extract contour mask and centroid
    contour = detection_info.get("largest_contour")
    if contour is None:
        # Fallback to otsu thresholding to find main dough contour
        _, thresh = cv2.threshold(filtered, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        cnts, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        contour = max(cnts, key=cv2.contourArea) if cnts else None

    if contour is not None and cv2.contourArea(contour) > 500:
        M = cv2.moments(contour)
        if M["m00"] != 0:
            cx = int(M["m10"] / M["m00"])
            cy = int(M["m01"] / M["m00"])
        else:
            cx, cy = w // 2, h // 2
        (center_x, center_y), radius = cv2.minEnclosingCircle(contour)
        radius = float(radius)
    else:
        cx, cy = w // 2, h // 2
        radius = float(min(w, h) * 0.42)

    # 3. Dynamic Edge Detection (Sobel & Canny)
    otsu_val, _ = cv2.threshold(filtered, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    lower_canny = int(max(10, 0.5 * otsu_val))
    upper_canny = int(min(255, 1.4 * otsu_val))
    edges = cv2.Canny(filtered, lower_canny, upper_canny)
    
    # Gradient magnitude
    sobelx = cv2.Sobel(filtered, cv2.CV_64F, 1, 0, ksize=3)
    sobely = cv2.Sobel(filtered, cv2.CV_64F, 0, 1, ksize=3)
    grad_mag = np.sqrt(sobelx**2 + sobely**2)
    grad_mag_norm = cv2.normalize(grad_mag, None, 0, 255, cv2.NORM_MINMAX, dtype=cv2.CV_8U)
    
    # 4. Multi-Angle Radial Scan to count concentric & spiral layers
    # Kerala parottas are coiled, so counting ridge peaks from center to rim gives the layer count
    num_rays = 24
    layer_counts_per_ray = []
    radial_scan_data = []
    
    effective_radius = max(20.0, radius * 0.90)
    
    for i in range(num_rays):
        angle = (2 * np.pi / num_rays) * i
        # Sample points along ray from 10% radius to 95% radius
        num_samples = int(effective_radius * 0.85)
        if num_samples < 15:
            num_samples = 15
            
        r_start = 0.12 * effective_radius
        r_end = effective_radius
        
        sample_rs = np.linspace(r_start, r_end, num_samples)
        ray_intensities = []
        ray_coords = []
        
        for r in sample_rs:
            px = int(cx + r * np.cos(angle))
            py = int(cy + r * np.sin(angle))
            
            if 0 <= px < w and 0 <= py < h:
                # Weighted blend of gradient magnitude and inverse intensity
                val = float(grad_mag_norm[py, px]) * 0.65 + float(255 - filtered[py, px]) * 0.35
                ray_intensities.append(val)
                ray_coords.append((px, py))
        
        if len(ray_intensities) > 10:
            # Detect peaks along ray intensity curve
            intensities_arr = np.array(ray_intensities)
            # Smooth 1D signal
            kernel_size = 5
            smoothed = np.convolve(intensities_arr, np.ones(kernel_size)/kernel_size, mode='same')
            
            # Simple peak detection with prominence check
            peaks = []
            threshold = np.mean(smoothed) + 0.35 * np.std(smoothed)
            
            for idx in range(1, len(smoothed) - 1):
                if smoothed[idx] > smoothed[idx - 1] and smoothed[idx] > smoothed[idx + 1] and smoothed[idx] > threshold:
                    # Check separation from last detected peak
                    if not peaks or (idx - peaks[-1]) >= 3:
                        peaks.append(idx)
            
            peak_points = [ray_coords[p] for p in peaks if p < len(ray_coords)]
            layer_counts_per_ray.append(len(peaks))
            radial_scan_data.append({
                "angle": angle,
                "end_point": (int(cx + r_end * np.cos(angle)), int(cy + r_end * np.sin(angle))),
                "peaks": peak_points
            })

    # Statistical aggregation of layer count
    if layer_counts_per_ray:
        # Filter lower/upper extremes to reduce noise
        trimmed = np.percentile(layer_counts_per_ray, [20, 80])
        valid_counts = [c for c in layer_counts_per_ray if trimmed[0] <= c <= trimmed[1]]
        if not valid_counts:
            valid_counts = layer_counts_per_ray
        
        raw_layers = int(np.round(np.mean(valid_counts)))
        # Authentic Kerala parottas span 8 to ~32 layers; clamp naturally
        estimated_layers = int(np.clip(raw_layers, 7, 36))
    else:
        estimated_layers = 16

    # 5. Flakiness Score (Laplacian texture variance within the parotta)
    mask = detection_info.get("contour_mask")
    if mask is None:
        mask = np.ones((h, w), dtype=np.uint8) * 255
        
    laplacian = cv2.Laplacian(filtered, cv2.CV_64F)
    laplacian_vals = laplacian[mask > 0]
    raw_flakiness = float(np.var(laplacian_vals)) if len(laplacian_vals) > 0 else 50.0
    
    # Scale flakiness variance (typically 20-600) to 0-100 score
    flakiness_score = int(np.clip((np.log1p(raw_flakiness) / np.log1p(600)) * 100, 20, 99))
    
    # 6. Circularity Score
    circularity = int(detection_info.get("circularity", 82))
    circularity = int(np.clip(circularity, 15, 98))
    
    # 7. Layer Density
    if estimated_layers < 12:
        layer_density = "Low"
    elif estimated_layers <= 16:
        layer_density = "Medium"
    elif estimated_layers <= 24:
        layer_density = "High"
    else:
        layer_density = "Extreme"
        
    # 8. Confidence percentage
    # Higher if radial scans are consistent and circularity is good
    std_dev = float(np.std(layer_counts_per_ray)) if layer_counts_per_ray else 4.0
    consistency_bonus = max(0, int(30 - std_dev * 5))
    confidence = int(np.clip(60 + consistency_bonus + (detection_info.get("detection_confidence", 80) * 0.15), 52, 96))
    
    # 9. Overall Quality Score
    # Balanced combination of flakiness (35%), layer count tier (35%), circularity (20%), and consistency (10%)
    layer_norm = min(100, int((estimated_layers / 28.0) * 100))
    quality_score = int(np.clip(
        0.35 * layer_norm +
        0.35 * flakiness_score +
        0.18 * circularity +
        0.12 * confidence,
        10, 99
    ))
    
    # 10. Verdict System (Strictly adhering to prompt specifications)
    if quality_score >= 90:
        verdict = "🏆 Legendary Parotta. This deserves respect."
    elif quality_score >= 75:
        verdict = "🔥 Excellent parotta. Strong layer game."
    elif quality_score >= 50:
        verdict = "👍 Acceptable. Could use more layers."
    elif quality_score >= 25:
        verdict = "😐 This parotta needs emotional support."
    else:
        verdict = "💀 Is this even a parotta?"
        
    # Pseudoscientific commentary
    accompaniments = [
        "Kerala Beef Roast with fried coconut slivers",
        "Spicy Malabar Chicken Varutharacha Curry",
        "Classic Street-Style Thattukada Salna",
        "Mutton Pepper Fry with curry leaves",
        "Vegetable Kurma (Parotta Council approved)"
    ]
    suggested_pairing = accompaniments[quality_score % len(accompaniments)]
    
    humorous_notes = [
        f"Lamination Coefficient: {round(estimated_layers * 1.618, 2)} ψ (Golden Dough Ratio).",
        f"Salna Retention Capacity: Estimated at {int(quality_score * 0.94)}% gravy absorption efficiency.",
        f"Estimated Hand-Clap Crispiness: {int(flakiness_score * 0.88 + 12)} dB acoustic reverberation."
    ]
    
    return {
        "is_parotta": True,
        "estimated_layers": estimated_layers,
        "confidence": confidence,
        "flakiness_score": flakiness_score,
        "layer_density": layer_density,
        "circularity": circularity,
        "quality_score": quality_score,
        "verdict": verdict,
        "center": (cx, cy),
        "radius": radius,
        "radial_scans": radial_scan_data,
        "edges": edges,
        "grad_mag": grad_mag_norm,
        "filtered": filtered,
        "scientific_metrics": {
            "radial_scan_samples": len(layer_counts_per_ray),
            "layer_variance_sigma": round(std_dev, 2),
            "maida_surface_energy": round(raw_flakiness, 2),
            "spiral_coiling_index": round(estimated_layers / (radius / 50.0 + 1.0), 2)
        },
        "humorous_notes": humorous_notes,
        "suggested_accompaniment": suggested_pairing
    }
