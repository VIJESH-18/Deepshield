import os
import sys
from pipeline import analyze_video_pipeline

def main():
    video_path = os.path.join(os.path.dirname(__file__), "no_audio.mp4")
    if not os.path.exists(video_path):
        print("Video not found.")
        sys.exit(1)
        
    print("Running analysis on:", video_path)
    result = analyze_video_pipeline(video_path, source_url="local_test")
    print("Done. PDF should be at:", result.get("pdf_url"))

if __name__ == "__main__":
    main()
