import cv2
import numpy as np
import os
import base64
from typing import List, Dict

SAMPLES_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static", "samples")

def create_synthetic_parotta(
    filename: str,
    layers: int = 18,
    flakiness: float = 0.8,
    radius: int = 240,
    img_size: int = 600,
    toast_intensity: float = 0.6
) -> str:
    """Generates a realistic synthetic Kerala parotta image with visible spiral layers and tawa toasted spots."""
    os.makedirs(SAMPLES_DIR, exist_ok=True)
    file_path = os.path.join(SAMPLES_DIR, filename)
    if os.path.exists(file_path):
        return file_path

    img = np.ones((img_size, img_size, 3), dtype=np.uint8)
    # Warm banana leaf / stainless steel plate background (subtle warm dark slate)
    img[:] = (35, 40, 48)

    cx, cy = img_size // 2, img_size // 2

    # Draw Parotta Base Dough (Warm Golden Cream/Maida, BGR: (155, 215, 245))
    base_color = np.array([160, 218, 245], dtype=np.float32)
    
    # Generate polar coordinates for spiral layered effect
    y, x = np.ogrid[:img_size, :img_size]
    r = np.sqrt((x - cx)**2 + (y - cy)**2)
    theta = np.arctan2(y - cy, x - cx)

    # Dough mask with slight organic wobble
    wobble = 1.0 + 0.03 * np.sin(5 * theta) + 0.02 * np.cos(7 * theta)
    dough_mask = r <= (radius * wobble)

    parotta_layer = np.zeros((img_size, img_size, 3), dtype=np.float32)
    
    # Base radial shading
    radial_falloff = np.clip(1.0 - (r / (radius * 1.1)) * 0.18, 0.7, 1.0)
    for c in range(3):
        parotta_layer[:, :, c] = base_color[c] * radial_falloff

    # Spiral Layer Folds: A Archimedean spiral plus concentric wave
    spiral_freq = float(layers) / float(radius)
    spiral_phase = r * spiral_freq * 2 * np.pi + theta * 1.5
    layer_shadows = np.sin(spiral_phase) ** 3
    
    # Apply layer shadows (darker golden-brown crease lines)
    crease_strength = 35.0 * flakiness
    for c in range(3):
        # Blue channel drops more on browned creases
        drop = crease_strength * (1.2 if c == 0 else 0.7)
        parotta_layer[:, :, c] -= np.clip(layer_shadows * drop, -15, 60)

    # Toasted Brown Griddle Spots (Charred tawa patches typical of Kerala Porotta)
    np.random.seed(42 if "authentic" in filename else 101)
    num_spots = int(35 * toast_intensity)
    spot_overlay = np.zeros((img_size, img_size), dtype=np.float32)
    
    for _ in range(num_spots):
        sx = int(cx + np.random.uniform(-0.75 * radius, 0.75 * radius))
        sy = int(cy + np.random.uniform(-0.75 * radius, 0.75 * radius))
        if np.hypot(sx - cx, sy - cy) < (radius * 0.85):
            s_rad = np.random.randint(6, 26)
            s_intensity = np.random.uniform(0.4, 0.95)
            cv2.circle(spot_overlay, (sx, sy), s_rad, s_intensity, -1)

    spot_overlay = cv2.GaussianBlur(spot_overlay, (19, 19), 0)
    # Blend toast spots (rich dark roasted brown: BGR (20, 75, 140))
    for c in range(3):
        parotta_layer[:, :, c] = parotta_layer[:, :, c] * (1.0 - spot_overlay * 0.55)

    # High frequency dough texture (flaky maida micro-crust)
    noise = np.random.normal(0, 7.0 * flakiness, (img_size, img_size))
    for c in range(3):
        parotta_layer[:, :, c] += noise

    parotta_layer = np.clip(parotta_layer, 0, 255).astype(np.uint8)

    # Feather dough edges
    mask_uint8 = (dough_mask * 255).astype(np.uint8)
    mask_blurred = cv2.GaussianBlur(mask_uint8, (9, 9), 0).astype(np.float32) / 255.0

    for c in range(3):
        img[:, :, c] = (parotta_layer[:, :, c] * mask_blurred + img[:, :, c] * (1.0 - mask_blurred)).astype(np.uint8)

    cv2.imwrite(file_path, img)
    return file_path

def create_non_parotta_image(filename: str = "sample_not_parotta.jpg") -> str:
    """Generates a non-parotta control test image (blue digital keyboard/device) to trigger ❌ parotta rejection."""
    os.makedirs(SAMPLES_DIR, exist_ok=True)
    file_path = os.path.join(SAMPLES_DIR, filename)
    if os.path.exists(file_path):
        return file_path

    img = np.zeros((600, 600, 3), dtype=np.uint8)
    # Deep cyan / blue cybernetic background
    img[:] = (120, 60, 20)
    
    # Draw geometric circuit lines
    for i in range(15):
        y = i * 40
        cv2.line(img, (0, y), (600, y), (180, 100, 40), 2)
        x = i * 40
        cv2.line(img, (x, 0), (x, 600), (180, 100, 40), 2)
        
    cv2.putText(img, "SUSPECTED LAPTOP / CAT", (80, 300), cv2.FONT_HERSHEY_SIMPLEX, 1.0, (255, 255, 255), 2)
    cv2.putText(img, "NOT A MALABAR PAROTTA", (95, 345), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 120, 255), 2)
    
    cv2.imwrite(file_path, img)
    return file_path

def ensure_sample_images():
    """Generates all built-in test samples if they don't already exist."""
    create_synthetic_parotta("sample_malabar_flaky.jpg", layers=22, flakiness=0.9, radius=240, toast_intensity=0.7)
    create_synthetic_parotta("sample_coin_parotta.jpg", layers=14, flakiness=0.6, radius=180, toast_intensity=0.85)
    create_synthetic_parotta("sample_flat_bread.jpg", layers=5, flakiness=0.2, radius=220, toast_intensity=0.3)
    create_non_parotta_image("sample_not_parotta.jpg")

def get_sample_metadata() -> List[Dict[str, str]]:
    ensure_sample_images()
    return [
        {
            "id": "sample_malabar_flaky",
            "name": "👑 Malabar Flaky Grandmaster",
            "description": "Authentic Kerala layered parotta with intense spiral coiling and crisp lamination.",
            "category": "Parotta",
            "filename": "sample_malabar_flaky.jpg",
            "expected_layers": "20-24 Layers"
        },
        {
            "id": "sample_coin_parotta",
            "name": "🪙 Thattukada Coin Parotta",
            "description": "Street-style golden mini-disc with deep roasted griddle spots.",
            "category": "Parotta",
            "filename": "sample_coin_parotta.jpg",
            "expected_layers": "12-16 Layers"
        },
        {
            "id": "sample_flat_bread",
            "name": "😐 Sad Flat Dough Disc",
            "description": "Under-fluffed, unlayered dough requiring urgent emotional and culinary support.",
            "category": "Parotta",
            "filename": "sample_flat_bread.jpg",
            "expected_layers": "4-8 Layers"
        },
        {
            "id": "sample_not_parotta",
            "name": "🐱 Control: Definitely Not A Parotta",
            "description": "Test subject designed to trigger the Parotta Council rejection protocol.",
            "category": "Non-Parotta",
            "filename": "sample_not_parotta.jpg",
            "expected_layers": "0 Layers (Rejection Test)"
        }
    ]
