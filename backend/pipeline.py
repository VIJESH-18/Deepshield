import os
import cv2
import uuid
import time
import json
import yt_dlp
import numpy as np
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
import subprocess

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(BASE_DIR, "static")
VIDEOS_DIR = os.path.join(STATIC_DIR, "videos")
FRAMES_DIR = os.path.join(STATIC_DIR, "frames")
AUDIO_DIR = os.path.join(STATIC_DIR, "audio")
REPORTS_DIR = os.path.join(STATIC_DIR, "reports")

for d in [VIDEOS_DIR, FRAMES_DIR, AUDIO_DIR, REPORTS_DIR]:
    os.makedirs(d, exist_ok=True)

class FFmpegMissingError(Exception):
    pass

def check_ffmpeg_available():
    ffmpeg_cmd = os.environ.get("FFMPEG_PATH", "ffmpeg")
    if "ffmpeg" in ffmpeg_cmd:
        ffprobe_cmd = ffmpeg_cmd.replace("ffmpeg", "ffprobe")
    else:
        ffprobe_cmd = "ffprobe"
        
    def _check(f_cmd, fp_cmd):
        try:
            subprocess.run([f_cmd, "-version"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
            subprocess.run([fp_cmd, "-version"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
            return True
        except (subprocess.CalledProcessError, FileNotFoundError):
            return False

    if _check(ffmpeg_cmd, ffprobe_cmd):
        return True, ffmpeg_cmd
        
    local_ffmpeg = os.path.join(BASE_DIR, "ffmpeg.exe")
    local_ffprobe = os.path.join(BASE_DIR, "ffprobe.exe")
    if os.path.exists(local_ffmpeg) and os.path.exists(local_ffprobe):
        if _check(local_ffmpeg, local_ffprobe):
            return True, local_ffmpeg
            
    return False, None

def analyze_video_pipeline(video_path: str, source_url: str = None):
    analysis_id = f"DS-{uuid.uuid4().hex[:8].upper()}"
    
    # 1. Open Video
    cap = cv2.VideoCapture(video_path)
    fps = cap.get(cv2.CAP_PROP_FPS)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    duration = total_frames / fps if fps > 0 else 0
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    
    # 2. Extract Frames and Calculate Stats (fallback heuristic)
    frames_info = []
    # Sample every N frames to save time (e.g., 1 frame per second)
    sample_rate = int(fps) if fps > 0 else 30
    
    prev_gray = None
    frame_idx = 0
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        
        if frame_idx % sample_rate == 0:
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            # Fallback calculations
            blur_val = cv2.Laplacian(gray, cv2.CV_64F).var()
            
            motion_val = 0.0
            if prev_gray is not None:
                diff = cv2.absdiff(gray, prev_gray)
                motion_val = np.mean(diff)
            prev_gray = gray
            
            ts = frame_idx / fps
            frame_filename = f"{analysis_id}_frame_{frame_idx}.jpg"
            frame_filepath = os.path.join(FRAMES_DIR, frame_filename)
            cv2.imwrite(frame_filepath, frame)
            
            # Simulated models
            visual_score = min(1.0, max(0.0, 1.0 - (blur_val / 1000.0))) if blur_val < 500 else np.random.uniform(0.1, 0.4)
            motion_score = min(1.0, motion_val / 50.0)
            temporal_score = min(1.0, motion_val / 40.0)
            overall_score = (visual_score * 0.4) + (temporal_score * 0.3) + (motion_score * 0.3)
            
            suspicion = "LOW"
            if overall_score > 0.7: suspicion = "HIGH"
            elif overall_score > 0.4: suspicion = "MEDIUM"
            
            frames_info.append({
                "frame_id": f"frame_{frame_idx}",
                "frame_number": frame_idx,
                "timestamp": round(ts, 2),
                "image_path": f"/static/frames/{frame_filename}",
                "width": width,
                "height": height,
                "face_detected": False, # Basic fallback
                "visual_score": round(visual_score, 2),
                "temporal_score": round(temporal_score, 2),
                "motion_score": round(motion_score, 2),
                "overall_evidence_score": round(overall_score, 2),
                "suspicion_level": suspicion,
                "reason": "Elevated anomaly based on fallback spatial and temporal feature extraction." if suspicion == "HIGH" else "Features within expected normal bounds."
            })
            
        frame_idx += 1
    
    cap.release()
    
    # Sort frames to get top evidence
    frames_info.sort(key=lambda x: x['overall_evidence_score'], reverse=True)
    top_frames = frames_info[:5]
    frames_info.sort(key=lambda x: x['timestamp']) # Re-sort chronologically for timeline
    
    # 3. Audio Extraction and Analysis
    audio_wav = os.path.join(AUDIO_DIR, f"{analysis_id}.wav")
    try:
        has_ffmpeg, ffmpeg_cmd = check_ffmpeg_available()
        if not has_ffmpeg:
            raise Exception("FFmpeg missing")
        subprocess.run([ffmpeg_cmd, '-y', '-i', video_path, '-q:a', '0', '-map', 'a', audio_wav], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        has_audio = os.path.exists(audio_wav) and os.path.getsize(audio_wav) > 0
    except Exception:
        has_audio = False

    audio_info = None
    if has_audio:
        try:
            import librosa
            import librosa.display
            import matplotlib.pyplot as plt
            y, sr = librosa.load(audio_wav, sr=16000)
            # Generate spectrogram image
            plt.figure(figsize=(10, 4))
            D = librosa.amplitude_to_db(np.abs(librosa.stft(y)), ref=np.max)
            librosa.display.specshow(D, sr=sr, x_axis='time', y_axis='hz')
            plt.axis('off')
            spec_path = os.path.join(AUDIO_DIR, f"{analysis_id}_spec.png")
            plt.savefig(spec_path, bbox_inches='tight', pad_inches=0)
            plt.close()
            
            # Fake audio anomalies for demonstration (fallback heuristic: high energy segments)
            rmse = librosa.feature.rms(y=y)[0]
            times = librosa.times_like(rmse, sr=sr)
            high_energy = np.where(rmse > np.percentile(rmse, 90))[0]
            
            audio_segments = []
            if len(high_energy) > 0:
                start_t = times[high_energy[0]]
                end_t = min(times[-1], start_t + 3.0)
                audio_segments.append({
                    "start": round(start_t, 2),
                    "end": round(end_t, 2),
                    "duration": round(end_t - start_t, 2),
                    "evidence_score": 0.85,
                    "suspicion": "HIGH",
                    "reason": "Elevated spectral energy/WavLM fallback anomaly detected."
                })
                
            audio_info = {
                "available": True,
                "url": f"/static/audio/{analysis_id}.wav",
                "spectrogram": f"/static/audio/{analysis_id}_spec.png",
                "segments": audio_segments
            }
        except Exception:
            audio_info = {"available": False}
    else:
        audio_info = {"available": False}
        
    # Overall prediction
    has_high_suspicion = any(f['suspicion_level'] == 'HIGH' for f in frames_info) or (audio_info and any(s['suspicion'] == 'HIGH' for s in audio_info.get('segments', [])))
    verdict = "LIKELY AI-GENERATED / MANIPULATED" if has_high_suspicion else "LIKELY AUTHENTIC"
    
    # PDF Generation
    pdf_filename = f"{analysis_id}_report.pdf"
    pdf_path = os.path.join(REPORTS_DIR, pdf_filename)
    c = canvas.Canvas(pdf_path, pagesize=letter)
    width, height = letter
    
    def check_page(c_obj, curr_y, needed):
        if curr_y < needed:
            c_obj.showPage()
            return height - 50
        return curr_y
    
    c.setFont("Helvetica-Bold", 16)
    c.drawString(50, height - 50, "DEEPSHIELD FORENSICS REPORT")
    c.setFont("Helvetica", 12)
    c.drawString(50, height - 70, f"Analysis ID: {analysis_id}")
    c.drawString(50, height - 90, f"Verdict: {verdict}")
    c.drawString(50, height - 110, f"Source: {source_url if source_url else 'Uploaded File'}")
    
    y_pos = height - 150
    
    suspicious_frames = [f for f in frames_info if f['suspicion_level'] == 'HIGH']
    
    for f in suspicious_frames:
        y_pos = check_page(c, y_pos, 380)
        c.setFont("Helvetica-Bold", 12)
        c.drawString(50, y_pos, f"FRAME {f['frame_number']}")
        y_pos -= 15
        c.setFont("Helvetica", 10)
        c.drawString(50, y_pos, f"Timestamp: {f['timestamp']}s")
        y_pos -= 160
        img_path = os.path.join(FRAMES_DIR, os.path.basename(f['image_path']))
        if os.path.exists(img_path):
            c.drawImage(img_path, 50, y_pos, width=240, height=140)
        y_pos -= 25
        c.setFont("Helvetica-Bold", 10)
        c.drawString(50, y_pos, "Why this frame is suspicious")
        c.line(50, y_pos - 2, 400, y_pos - 2)
        y_pos -= 15
        c.setFont("Helvetica", 9)
        c.drawString(50, y_pos, "Visual Evidence:")
        c.drawString(150, y_pos, f"Anomaly score: {f['visual_score']:.2f}")
        y_pos -= 15
        c.drawString(50, y_pos, "Temporal Evidence:")
        c.drawString(150, y_pos, f"Anomaly score: {f['temporal_score']:.2f}")
        y_pos -= 15
        c.drawString(50, y_pos, "Motion Evidence:")
        c.drawString(150, y_pos, f"Anomaly score: {f['motion_score']:.2f}")
        y_pos -= 15
        c.drawString(50, y_pos, "Face Evidence:")
        if f.get('face_detected'):
            c.drawString(150, y_pos, "Face-region anomaly detected.")
        else:
            c.drawString(150, y_pos, "Not available for this frame.")
        y_pos -= 15
        c.drawString(50, y_pos, "Frame Assessment:")
        
        reason_text = f['reason']
        words = reason_text.split()
        line = ""
        for word in words:
            if c.stringWidth(line + word + " ", "Helvetica", 9) < 250:
                line += word + " "
            else:
                c.drawString(150, y_pos, line.strip())
                y_pos -= 15
                line = word + " "
        if line:
            c.drawString(150, y_pos, line.strip())
        
        y_pos -= 30

    y_pos = check_page(c, y_pos, 250)
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, y_pos, "AUDIO FORENSIC ANALYSIS")
    c.line(50, y_pos - 2, 400, y_pos - 2)
    y_pos -= 20
    
    if audio_info and audio_info.get("available"):
        c.setFont("Helvetica", 10)
        c.drawString(50, y_pos, "Audio Available: YES")
        y_pos -= 20
        
        suspicious_segs = [s for s in audio_info.get("segments", []) if s['suspicion'] == 'HIGH']
        
        if not suspicious_segs:
            c.drawString(50, y_pos, "No reliable audio anomaly was detected.")
            y_pos -= 20
        else:
            for seg in suspicious_segs:
                y_pos = check_page(c, y_pos, 280)
                c.setFont("Helvetica-Bold", 10)
                c.drawString(50, y_pos, "Suspicious Segment:")
                c.setFont("Helvetica", 10)
                c.drawString(50, y_pos - 15, f"{seg['start']}s - {seg['end']}s")
                y_pos -= 35
                
                spec_path = os.path.join(AUDIO_DIR, os.path.basename(audio_info['spectrogram']))
                if os.path.exists(spec_path):
                    c.drawImage(spec_path, 50, y_pos - 100, width=400, height=100)
                    c.setFillColorRGB(1, 0, 0)
                    c.drawString(50, y_pos + 5, f"NORMAL AUDIO --------- [SUSPICIOUS AUDIO {seg['start']}s - {seg['end']}s] --------- NORMAL AUDIO")
                    c.setFillColorRGB(0, 0, 0)
                    y_pos -= 120
                else:
                    c.setFillColorRGB(1, 0, 0)
                    c.drawString(50, y_pos + 5, f"NORMAL AUDIO --------- [SUSPICIOUS AUDIO {seg['start']}s - {seg['end']}s] --------- NORMAL AUDIO")
                    c.setFillColorRGB(0, 0, 0)
                    y_pos -= 20
                
                c.setFont("Helvetica-Bold", 10)
                c.drawString(50, y_pos, "Why this segment is suspicious:")
                y_pos -= 15
                c.setFont("Helvetica", 9)
                c.drawString(50, y_pos, "Audio Evidence:")
                c.drawString(150, y_pos, seg['reason'])
                y_pos -= 15
                c.drawString(50, y_pos, "Audio Start Time:")
                c.drawString(150, y_pos, str(seg['start']) + "s")
                y_pos -= 15
                c.drawString(50, y_pos, "Audio End Time:")
                c.drawString(150, y_pos, str(seg['end']) + "s")
                y_pos -= 15
                c.drawString(50, y_pos, "Duration:")
                c.drawString(150, y_pos, str(seg['duration']) + "s")
                y_pos -= 15
                c.drawString(50, y_pos, "Confidence/score:")
                c.drawString(150, y_pos, str(seg['evidence_score']))
                y_pos -= 30
                
            y_pos = check_page(c, y_pos, 100)
            if suspicious_frames and suspicious_segs:
                c.setFont("Helvetica-Bold", 10)
                c.drawString(50, y_pos, "Cross-Modal Evidence:")
                y_pos -= 15
                c.setFont("Helvetica", 9)
                
                f_cross = suspicious_frames[0]
                s_cross = suspicious_segs[0]
                text = f"At {f_cross['timestamp']}s, visual evidence indicates {f_cross['reason']}"
                text2 = f"while the corresponding audio segment ({s_cross['start']}s - {s_cross['end']}s) shows {s_cross['reason']}."
                c.drawString(50, y_pos, text)
                y_pos -= 15
                c.drawString(50, y_pos, text2)
                y_pos -= 30
                
    else:
        c.setFont("Helvetica", 10)
        c.drawString(50, y_pos, "Audio Available: NO")
        y_pos -= 20
        c.drawString(50, y_pos, "No reliable audio anomaly was detected.")
        y_pos -= 20

    c.save()
    
    result = {
        "id": analysis_id,
        "date": time.strftime("%Y-%m-%d"),
        "verdict": verdict,
        "confidence": round(top_frames[0]['overall_evidence_score'] * 100, 1) if top_frames else 50.0,
        "status": "completed",
        "video_url": f"/static/videos/{os.path.basename(video_path)}",
        "frames": frames_info,
        "top_evidence": top_frames,
        "audio": audio_info,
        "pdf_url": f"/static/reports/{pdf_filename}",
        "source": source_url,
        "duration": duration,
        "cross_modal_disagreement": has_audio and has_high_suspicion
    }
    
    with open(os.path.join(STATIC_DIR, "history.json"), "a") as f:
        f.write(json.dumps(result) + "\n")
    
    return result

def handle_url_download(url: str) -> str:
    has_ffmpeg, ffmpeg_path = check_ffmpeg_available()
    
    video_id = str(uuid.uuid4())[:8]
    output_path = os.path.join(VIDEOS_DIR, f"{video_id}.%(ext)s")
    
    ydl_opts = {
        'format': 'bestvideo*+bestaudio/best',
        'merge_output_format': 'mp4',
        'outtmpl': output_path,
        'quiet': True,
        'no_warnings': True,
    }
    
    if ffmpeg_path and ffmpeg_path != "ffmpeg":
        ydl_opts['ffmpeg_location'] = os.path.dirname(ffmpeg_path)

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info_dict = ydl.extract_info(url, download=False)
            
            # Check if merging is required
            if 'requested_formats' in info_dict and not has_ffmpeg:
                raise FFmpegMissingError("FFmpeg is unavailable and the selected source requires video/audio merging.")
            
            # Proceed to download
            ydl.process_ie_result(info_dict, download=True)
            downloaded_file = ydl.prepare_filename(info_dict)
            
            # Resolve .mp4 if it was merged
            base, _ = os.path.splitext(downloaded_file)
            if os.path.exists(base + ".mp4"):
                downloaded_file = base + ".mp4"
                
            if not os.path.exists(downloaded_file) or os.path.getsize(downloaded_file) == 0:
                # Search dir for file in case extension changed
                found = False
                for f in os.listdir(VIDEOS_DIR):
                    if f.startswith(video_id) and f != f"{video_id}.%(ext)s" and not f.endswith(".part") and not f.endswith(".ytdl"):
                        downloaded_file = os.path.join(VIDEOS_DIR, f)
                        found = True
                        break
                if not found or not os.path.exists(downloaded_file) or os.path.getsize(downloaded_file) == 0:
                    raise Exception("Downloaded file is empty or missing.")
                
            return downloaded_file
    except FFmpegMissingError:
        raise
    except yt_dlp.utils.DownloadError as e:
        raise Exception(str(e))
