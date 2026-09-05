import cv2
import numpy as np
from typing import Tuple, Dict, Any, Optional

def detect_parotta(image_bgr: np.ndarray) -> Tuple[bool, Dict[str, Any]]:
    """
    Evaluates whether the uploaded image appears to contain a Kerala-style parotta.
    
    Checks:
    1. Color palette in HSV space (warm toasted wheat, golden-brown, ghee-glazed dough).
    2. Contour geometry (circularity, convexity, aspect ratio, area coverage).
    3. Texture entropy (surface variance indicating spiral lamination and toasted spots).
    
    Returns:
        (is_parotta: bool, details: dict)
    """
    h, w = image_bgr.shape[:2]
    total_pixels = h * w
    
    # 1. Color Check in HSV
    hsv = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2HSV)
    
    # Range for baked/cooked dough, wheat, golden brown, Maida crust
    # Hue: 8 to 36 (warm yellow/brown/orange), Sat: 15 to 225, Val: 45 to 255
    lower_dough = np.array([5, 15, 40], dtype=np.uint8)
    upper_dough = np.array([40, 230, 255], dtype=np.uint8)
    
    dough_mask = cv2.inRange(hsv, lower_dough, upper_dough)
    dough_pixel_ratio = np.count_nonzero(dough_mask) / float(total_pixels)
    
    # Check for non-dough unnatural colors (e.g. neon greens, strong blues, dark cool grays)
    lower_blue = np.array([90, 50, 50], dtype=np.uint8)
    upper_blue = np.array([135, 255, 255], dtype=np.uint8)
    blue_ratio = np.count_nonzero(cv2.inRange(hsv, lower_blue, upper_blue)) / float(total_pixels)
    
    # Morphological clean up on dough mask
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 9))
    cleaned_mask = cv2.morphologyEx(dough_mask, cv2.MORPH_CLOSE, kernel, iterations=2)
    cleaned_mask = cv2.morphologyEx(cleaned_mask, cv2.MORPH_OPEN, kernel, iterations=1)
    
    # Find contours
    contours, _ = cv2.findContours(cleaned_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    if not contours:
        return False, {
            "reason": "No dough-like organic contours detected in the optical sensor array.",
            "parotta_confidence": 3,
            "color_match": round(dough_pixel_ratio * 100, 1)
        }
    
    # Find primary contour
    largest_contour = max(contours, key=cv2.contourArea)
    area = cv2.contourArea(largest_contour)
    area_ratio = area / float(total_pixels)
    perimeter = cv2.arcLength(largest_contour, True)
    
    if perimeter == 0:
        return False, {
            "reason": "Object boundary perimeter collapsed to zero. Physics engine error.",
            "parotta_confidence": 2
        }
    
    # Circularity: 4 * pi * Area / Perimeter^2 (1.0 = perfect circle)
    circularity_val = (4 * np.pi * area) / (perimeter * perimeter)
    circularity_pct = min(100, max(0, int(circularity_val * 100)))
    
    # Bounding box & aspect ratio
    x, y, bw, bh = cv2.boundingRect(largest_contour)
    aspect_ratio = float(bw) / float(bh) if bh > 0 else 0
    
    # Edge density inside contour (checking for flaky spiral lines)
    gray = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2GRAY)
    contour_mask = np.zeros((h, w), dtype=np.uint8)
    cv2.drawContours(contour_mask, [largest_contour], -1, 255, thickness=cv2.FILLED)
    
    laplacian = cv2.Laplacian(gray, cv2.CV_64F)
    laplacian_masked = laplacian[contour_mask > 0]
    texture_variance = float(np.var(laplacian_masked)) if len(laplacian_masked) > 0 else 0.0
    
    # Decision heuristics:
    # 1. Dough color should cover a decent portion or largest contour should have good dough color
    # 2. Area should be at least ~4% of the image (not a tiny crumb)
    # 3. Aspect ratio between 0.45 and 2.2 (parottas can be viewed at slight angle)
    # 4. Blue/cool ratio should not overpower dough
    
    is_valid = True
    reasons = []
    
    if dough_pixel_ratio < 0.08 and area_ratio < 0.06:
        is_valid = False
        reasons.append("Insufficient golden/toasted Maida pigment detected.")
        
    if blue_ratio > 0.45 and dough_pixel_ratio < 0.20:
        is_valid = False
        reasons.append("Excessive cybernetic/blue spectrum detected. Parottas are rarely cyan.")
        
    if area_ratio < 0.03:
        is_valid = False
        reasons.append("Candidate object is too microscopic to verify flaky lamination.")
        
    if aspect_ratio < 0.35 or aspect_ratio > 2.8:
        is_valid = False
        reasons.append("Aspect ratio indicates a baguette or noodle rather than a circular parotta.")
        
    if texture_variance < 15.0 and area_ratio > 0.1:
        # Extremely smooth surface, like a blank wall, plain paper or plastic plate
        is_valid = False
        reasons.append("Zero surface topography. Resembles blank cardstock rather than crispy dough.")
        
    # Calculate detection confidence
    score_components = [
        min(1.0, dough_pixel_ratio * 3.5),
        min(1.0, area_ratio * 3.0),
        max(0.0, 1.0 - abs(aspect_ratio - 1.0)),
        min(1.0, circularity_pct / 65.0),
        min(1.0, texture_variance / 250.0)
    ]
    detection_confidence = int(np.clip(np.mean(score_components) * 100, 5, 98))
    
    # If confidence is below threshold, reject
    if detection_confidence < 38:
        is_valid = False
        
    return is_valid, {
        "detection_confidence": detection_confidence,
        "dough_ratio": round(dough_pixel_ratio * 100, 1),
        "circularity": circularity_pct,
        "aspect_ratio": round(aspect_ratio, 2),
        "texture_variance": round(texture_variance, 1),
        "largest_contour": largest_contour,
        "contour_mask": contour_mask,
        "reasons": reasons
    }
