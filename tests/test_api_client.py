import os
import sys
import unittest
import asyncio
import io
from fastapi import UploadFile

# Ensure root in path
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from backend.main import analyze_parotta, health_check, list_samples, root
from backend.utils.sample_data import SAMPLES_DIR, ensure_sample_images

class TestApiDirect(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        ensure_sample_images()

    def test_root_and_health(self):
        root_data = root()
        self.assertIn("Parotta Layer Counter", root_data["message"])

        health_data = health_check()
        self.assertEqual(health_data["status"], "online")

    def test_samples_list(self):
        samples = list_samples()
        self.assertIsInstance(samples, list)
        self.assertGreaterEqual(len(samples), 3)
        sample_ids = [s["id"] for s in samples]
        self.assertIn("sample_malabar_flaky", sample_ids)
        self.assertIn("sample_not_parotta", sample_ids)

    def test_analyze_valid_parotta_async(self):
        sample_path = os.path.join(SAMPLES_DIR, "sample_malabar_flaky.jpg")
        self.assertTrue(os.path.exists(sample_path))
        
        with open(sample_path, "rb") as f:
            content = f.read()

        file_obj = UploadFile(filename="sample_malabar_flaky.jpg", file=io.BytesIO(content))
        
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        response = loop.run_until_complete(analyze_parotta(file_obj))
        loop.close()

        self.assertTrue(response.is_parotta)
        self.assertGreaterEqual(response.estimated_layers, 7)
        self.assertGreaterEqual(response.confidence, 50)
        self.assertGreaterEqual(response.flakiness_score, 20)
        self.assertIsNotNone(response.annotated_image)
        self.assertTrue(response.annotated_image.startswith("data:image/jpeg;base64,"))
        self.assertIn(response.layer_density, ["Low", "Medium", "High", "Extreme"])

    def test_analyze_non_parotta_async(self):
        non_parotta_path = os.path.join(SAMPLES_DIR, "sample_not_parotta.jpg")
        self.assertTrue(os.path.exists(non_parotta_path))

        with open(non_parotta_path, "rb") as f:
            content = f.read()

        file_obj = UploadFile(filename="sample_not_parotta.jpg", file=io.BytesIO(content))

        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        response = loop.run_until_complete(analyze_parotta(file_obj))
        loop.close()

        self.assertFalse(response.is_parotta)
        self.assertEqual(response.estimated_layers, 0)
        self.assertIn("❌ This does not appear to be a parotta", response.error_message)
        self.assertEqual(response.verdict, "💀 Is this even a parotta?")

if __name__ == '__main__':
    unittest.main()
