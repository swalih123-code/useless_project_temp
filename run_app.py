"""
Parotta Layer Counter - Local Runner
Launches the FastAPI backend and Vite React frontend safely across Windows/macOS/Linux.
"""
import subprocess
import sys
import os
import time
import webbrowser

# Ensure console supports UTF-8 or safely handles encoding
if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(ROOT_DIR, "backend")
FRONTEND_DIR = os.path.join(ROOT_DIR, "frontend")
VENV_PYTHON = os.path.join(ROOT_DIR, ".venv", "Scripts", "python.exe")

def get_python_executable():
    if os.path.exists(VENV_PYTHON):
        return VENV_PYTHON
    return sys.executable

def get_npm_command():
    # Detect npm on Windows
    if os.name == "nt":
        # Check standard locations
        node_paths = [
            r"C:\Program Files\nodejs\npm.cmd",
            os.path.expandvars(r"%LOCALAPPDATA%\Microsoft\WinGet\Packages\OpenJS.NodeJS.LTS_Microsoft.Winget.Source_8wekyb3d8bbwe\npm.cmd"),
            "npm.cmd"
        ]
        for p in node_paths:
            if os.path.exists(p):
                return p
        return "npm.cmd"
    return "npm"

def main():
    print("=" * 60)
    print("  PAROTTA LAYER COUNTER - System Launcher")
    print("  Advanced AI technology for a problem nobody asked us to solve.")
    print("=" * 60)

    python_cmd = get_python_executable()
    npm_cmd = get_npm_command()

    # Ensure environment has node on PATH
    env = os.environ.copy()
    if os.name == "nt":
        extra_paths = [
            r"C:\Program Files\nodejs",
            os.path.expandvars(r"%APPDATA%\npm"),
            os.path.expandvars(r"%LOCALAPPDATA%\Microsoft\WindowsApps")
        ]
        env["PATH"] = ";".join(extra_paths) + ";" + env.get("PATH", "")

    # 1. Start Backend
    print("\n[1/2] Starting FastAPI Backend on http://127.0.0.1:8000 ...")
    backend_proc = subprocess.Popen(
        [python_cmd, "-m", "uvicorn", "backend.main:app", "--host", "127.0.0.1", "--port", "8000"],
        cwd=ROOT_DIR,
        env=env
    )

    # 2. Try starting Frontend Vite Dev Server
    print("[2/2] Starting React Frontend...")
    frontend_proc = None
    try:
        frontend_proc = subprocess.Popen(
            [npm_cmd, "run", "dev"],
            cwd=FRONTEND_DIR,
            env=env
        )
        time.sleep(2)
        target_url = "http://localhost:5173"
    except Exception as e:
        print(f"Note: Vite dev server could not be started directly ({e}).")
        print("Backend is serving the built React app directly on port 8000.")
        target_url = "http://localhost:8000"

    time.sleep(1)
    print(f"\n Parotta Layer Counter is LIVE!")
    print(f"   -> Web App: {target_url} (or http://localhost:8000)")
    print(f"   -> Swagger API Docs: http://localhost:8000/docs")
    print("\nPress Ctrl+C to terminate the servers.")

    try:
        webbrowser.open(target_url)
    except Exception:
        pass

    try:
        if frontend_proc:
            while backend_proc.poll() is None and frontend_proc.poll() is None:
                time.sleep(1)
        else:
            backend_proc.wait()
    except KeyboardInterrupt:
        print("\nShutting down Parotta servers...")
        if backend_proc:
            backend_proc.terminate()
        if frontend_proc:
            frontend_proc.terminate()

if __name__ == "__main__":
    main()
