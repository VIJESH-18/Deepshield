from fastapi import FastAPI, UploadFile, File, Form, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import uuid
import os
import shutil
import json
from pipeline import analyze_video_pipeline, handle_url_download, FFmpegMissingError, VIDEOS_DIR, STATIC_DIR

app = FastAPI(title="DeepShield API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

class URLRequest(BaseModel):
    url: str

@app.get("/")
def read_root():
    return {"status": "DeepShield API is running", "models_loaded": ["VideoMAE (Unavailable)", "WavLM (Unavailable)", "Fallback Edge/Motion (Active)"]}

@app.post("/api/analyze/upload")
async def analyze_video_upload(file: UploadFile = File(...)):
    try:
        video_id = str(uuid.uuid4())[:8]
        ext = file.filename.split('.')[-1] if '.' in file.filename else 'mp4'
        video_path = os.path.join(VIDEOS_DIR, f"{video_id}.{ext}")
        
        with open(video_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        result = analyze_video_pipeline(video_path, source_url=None)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/analyze/url")
async def analyze_video_url(req: URLRequest):
    try:
        video_path = handle_url_download(req.url)
        result = analyze_video_pipeline(video_path, source_url=req.url)
        return result
    except FFmpegMissingError as e:
        raise HTTPException(status_code=400, detail={
            "success": False,
            "stage": "download",
            "error_code": "FFMPEG_MISSING",
            "message": str(e)
        })
    except Exception as e:
        raise HTTPException(status_code=400, detail={
            "success": False,
            "stage": "download",
            "error_code": "DOWNLOAD_FAILED",
            "message": f"Unable to retrieve this video from the supplied URL. {str(e)}"
        })

@app.get("/api/health")
def health_check():
    return {"status": "ok"}

@app.get("/api/history")
def get_history():
    history_file = os.path.join(STATIC_DIR, "history.json")
    if not os.path.exists(history_file):
        return []
    
    history = []
    with open(history_file, "r") as f:
        for line in f:
            if line.strip():
                history.append(json.loads(line))
    return history
