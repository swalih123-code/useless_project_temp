import cv2
import numpy as np
from PIL import Image, ImageOps
import io
from typing import Optional, Tuple

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}

def is_allowed_file(filename: str) -> bool:
    if "." not in filename:
        return False
    ext = "." + filename.rsplit(".", 1)[1].lower()
    return ext in ALLOWED_EXTENSIONS

def load_image_from_bytes(file_bytes: bytes) -> Optional[np.ndarray]:
    """
    Decodes an image byte stream into a standard OpenCV BGR numpy array,
    handling EXIF rotation tags automatically so smartphone photos don't rotate sideways.
    """
    try:
        pil_image = Image.open(io.BytesIO(file_bytes))
        # Handle EXIF orientation
        pil_image = ImageOps.exif_transpose(pil_image)
        
        # Convert to RGB if needed
        if pil_image.mode != "RGB":
            pil_image = pil_image.convert("RGB")
            
        rgb_arr = np.array(pil_image)
        # Convert RGB to BGR for OpenCV
        bgr_arr = cv2.cvtColor(rgb_arr, cv2.COLOR_RGB2BGR)
        return bgr_arr
    except Exception as e:
        # Fallback to cv2.imdecode
        nparr = np.frombuffer(file_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        return img

def resize_for_analysis(image_bgr: np.ndarray, max_dimension: int = 1000) -> Tuple[np.ndarray, float]:
    """
    Resizes image proportionally if it exceeds max_dimension for efficient CV processing.
    Returns (resized_image, scale_factor).
    """
    h, w = image_bgr.shape[:2]
    max_side = max(h, w)
    if max_side <= max_dimension:
        return image_bgr, 1.0
        
    scale = max_dimension / float(max_side)
    new_w = int(w * scale)
    new_h = int(h * scale)
    resized = cv2.resize(image_bgr, (new_w, new_h), interpolation=cv2.INTER_AREA)
    return resized, scale
