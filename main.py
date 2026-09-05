"""
Root entrypoint for FastAPI CLI, Uvicorn, and cloud deployment platforms.
Exports the FastAPI `app` instance from `backend.main`.
"""
import os
import sys

# Ensure current workspace root is in sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from backend.main import app

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
