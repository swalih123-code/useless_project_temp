import os
import sys
import unittest
import numpy as np
import cv2

# Ensure project root is in sys.path
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from backend.image_processing.detector import detect_parotta
from backend.image_processing.layer_counter import count_parotta_layers
from backend.image_processing.visualizer import generate_visual_overlays
from backend.utils.sample_data import create_synthetic_parotta, create_non_parotta_image

class TestParottaLayerCounter(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Generate test fixtures
        cls.parotta_path = create_synthetic_parotta("test_fixture_parotta.jpg", layers=20, flakiness=0.85)
        cls.non_parotta_path = create_non_parotta_image("test_fixture_non_parotta.jpg")

    def test_parotta_detection_positive(self):
        """Authentic golden parotta fixture should be classified as valid parotta."""
        img = cv2.imread(self.parotta_path)
        self.assertIsNotNone(img, "Failed to load parotta fixture")
        
        is_parotta, info = detect_parotta(img)
        self.assertTrue(is_parotta, f"Valid parotta falsely rejected! Reasons: {info.get('reasons')}")
        self.assertGreater(info["circularity"], 40)
        self.assertGreater(info["detection_confidence"], 50)

    def test_non_parotta_rejection(self):
        """Cybernetic/blue non-food image should be rejected with is_parotta = False."""
        img = cv2.imread(self.non_parotta_path)
        self.assertIsNotNone(img, "Failed to load non-parotta fixture")
        
        is_parotta, info = detect_parotta(img)
        self.assertFalse(is_parotta, "Non-parotta control was falsely accepted as parotta!")
        self.assertIn("reasons", info)

    def test_layer_counter_algorithm(self):
        """Layer counter should produce reasonable layer estimate, flakiness, and quality score."""
        img = cv2.imread(self.parotta_path)
        is_parotta, info = detect_parotta(img)
        
        results = count_parotta_layers(img, info)
        self.assertTrue(results["is_parotta"])
        self.assertGreaterEqual(results["estimated_layers"], 7)
        self.assertLessEqual(results["estimated_layers"], 36)
        self.assertIn(results["layer_density"], ["Low", "Medium", "High", "Extreme"])
        self.assertGreaterEqual(results["confidence"], 50)
        self.assertGreaterEqual(results["flakiness_score"], 20)
        self.assertGreaterEqual(results["quality_score"], 20)
        self.assertTrue(any(sym in results["verdict"] for sym in ["🏆", "🔥", "👍", "😐", "💀"]))

    def test_visual_overlays_generation(self):
        """Visualizer should generate base64 data URLs for annotated, edge, and heatmap views."""
        img = cv2.imread(self.parotta_path)
        is_parotta, info = detect_parotta(img)
        results = count_parotta_layers(img, info)
        
        overlays = generate_visual_overlays(img, results)
        self.assertIn("annotated_image", overlays)
        self.assertIn("edge_image", overlays)
        self.assertIn("heatmap_image", overlays)
        self.assertTrue(overlays["annotated_image"].startswith("data:image/jpeg;base64,"))
        self.assertTrue(overlays["edge_image"].startswith("data:image/jpeg;base64,"))
        self.assertTrue(overlays["heatmap_image"].startswith("data:image/jpeg;base64,"))

if __name__ == '__main__':
    unittest.main()
