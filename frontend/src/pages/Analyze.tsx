import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Link as LinkIcon, Video, AlertCircle, FileVideo, Play } from 'lucide-react';
import classNames from 'classnames';

const Analyze = () => {
  const [activeTab, setActiveTab] = useState<'upload' | 'url' | 'record'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (selected.size > 50 * 1024 * 1024) { // 50MB limit for demo
        setError('File exceeds maximum size limit (50MB).');
        setFile(null);
        return;
      }
      setFile(selected);
      setError(null);
    }
  };

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progressText, setProgressText] = useState("ANALYZING...");

  useEffect(() => {
    let interval: any;
    if (isAnalyzing && activeTab === 'url') {
      const messages = [
        "Preparing video...",
        "Extracting metadata...",
        "Downloading...",
        "Preparing audio/video streams...",
        "Starting forensic analysis..."
      ];
      let i = 0;
      setProgressText(messages[0]);
      interval = setInterval(() => {
        i++;
        if (i < messages.length) {
          setProgressText(messages[i]);
        }
      }, 2500);
    } else if (isAnalyzing) {
      setProgressText("ANALYZING...");
    }
    return () => clearInterval(interval);
  }, [isAnalyzing, activeTab]);

  const handleStartAnalysis = async () => {
    setIsAnalyzing(true);
    setError(null);
    try {
      let res;
      if (activeTab === 'upload' && file) {
        const formData = new FormData();
        formData.append('file', file);
        res = await fetch('http://localhost:8000/api/analyze/upload', {
          method: 'POST',
          body: formData,
        });
      } else if (activeTab === 'url' && url) {
        res = await fetch('http://localhost:8000/api/analyze/url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url }),
        });
      } else {
        setError("Please select a file or enter a URL.");
        setIsAnalyzing(false);
        return;
      }
      
      if (!res.ok) {
        const errData = await res.json();
        if (errData.detail && errData.detail.error_code === 'FFMPEG_MISSING') {
            throw { custom: true, message: "URL PROCESSING FAILED\n\nThe video could not be prepared for analysis.\n\nReason:\n" + errData.detail.message + "\n\nAction:\nInstall/configure FFmpeg or upload the video file directly." };
        } else if (errData.detail && errData.detail.error_code === 'DOWNLOAD_FAILED') {
            throw { custom: true, message: errData.detail.message };
        }
        throw new Error(errData.detail || 'Analysis failed');
      }
      
      const data = await res.json();
      navigate(`/results/${data.id}`, { state: { resultData: data } });
    } catch (err: any) {
      if (err.custom) {
        setError(err.message);
      } else {
        setError(err.message || 'An error occurred during analysis.');
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Analyze Video</h1>
        <p className="text-muted-foreground">Select a video to begin forensic analysis.</p>
      </div>

      <div className="flex p-1 bg-secondary/30 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('upload')}
          className={classNames('flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all', {
            'bg-background shadow-sm text-foreground': activeTab === 'upload',
            'text-muted-foreground hover:text-foreground': activeTab !== 'upload',
          })}
        >
          <Upload size={16} /> Upload Video
        </button>
        <button
          onClick={() => setActiveTab('url')}
          className={classNames('flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all', {
            'bg-background shadow-sm text-foreground': activeTab === 'url',
            'text-muted-foreground hover:text-foreground': activeTab !== 'url',
          })}
        >
          <LinkIcon size={16} /> Paste URL
        </button>
        <button
          onClick={() => setActiveTab('record')}
          className={classNames('flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all', {
            'bg-background shadow-sm text-foreground': activeTab === 'record',
            'text-muted-foreground hover:text-foreground': activeTab !== 'record',
          })}
        >
          <Video size={16} /> Record Video
        </button>
      </div>

      <div className="glass-panel p-8 md:p-12 min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden group">
        
        {activeTab === 'upload' && !file && (
          <div className="text-center space-y-6 w-full relative z-10">
            <div className="mx-auto w-20 h-20 bg-[#606C38]/10 rounded-full flex items-center justify-center mb-6 transition-all duration-300">
              <Upload size={32} className="text-[#606C38] group-hover:-translate-y-1 transition-transform duration-300" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold tracking-tight">Drag and drop your video</h3>
              <p className="text-muted-foreground">or click to browse local files</p>
            </div>
            <div className="flex justify-center gap-2 text-xs font-mono text-muted-foreground uppercase tracking-widest mt-6">
              <span className="bg-white/5 px-2 py-1 rounded">MP4</span>
              <span className="bg-white/5 px-2 py-1 rounded">MOV</span>
              <span className="bg-white/5 px-2 py-1 rounded">AVI</span>
            </div>
            <input
              type="file"
              accept="video/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileChange}
            />
          </div>
        )}

        {activeTab === 'url' && (
          <div className="w-full max-w-xl space-y-6 relative z-10 animate-in fade-in zoom-in-95 duration-300">
            <div className="text-center space-y-2 mb-8">
              <h3 className="text-2xl font-bold tracking-tight">Analyze from URL</h3>
              <p className="text-muted-foreground">Provide a direct link to a public video file</p>
            </div>
            <div className="relative group/input">
              <div className="relative flex bg-background border border-border rounded-[12px] p-1 shadow-sm">
                <input
                  type="text"
                  placeholder="https://example.com/video.mp4"
                  className="flex-1 bg-transparent px-4 py-3 focus:outline-none text-foreground placeholder:text-muted-foreground/50 text-[14px]"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
                <button 
                  onClick={handleStartAnalysis}
                  disabled={isAnalyzing}
                  className="bg-[#606C38] text-[#FEFAE0] px-6 py-2 rounded-[8px] font-semibold text-[13px] hover:bg-[#283618] transition-colors disabled:opacity-75"
                >
                  {isAnalyzing ? 'PROCESSING...' : 'PROCESS & ANALYZE'}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'record' && (
          <div className="text-center space-y-6 relative z-10 animate-in fade-in zoom-in-95 duration-300">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full animate-pulse"></div>
              <Video size={56} className="relative text-red-400 mb-4" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold tracking-tight">Camera Access Required</h3>
              <p className="text-muted-foreground">Record a video directly for real-time forensics</p>
            </div>
            <button className="bg-white/10 hover:bg-white/20 border border-white/20 text-foreground px-8 py-3 rounded-xl font-bold tracking-wide transition-all mt-4">
              GRANT PERMISSION
            </button>
          </div>
        )}

        {file && (
          <div className="w-full relative z-10 animate-in fade-in zoom-in-95 duration-500">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-border/50 pb-6 mb-8 gap-4">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.2)]">
                  <FileVideo size={32} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-1">{file.name}</h3>
                  <p className="text-sm text-muted-foreground font-mono">{(file.size / (1024 * 1024)).toFixed(2)} MB • RAW UPLOAD</p>
                </div>
              </div>
              <button 
                onClick={() => setFile(null)}
                className="text-xs font-semibold tracking-wider uppercase text-muted-foreground hover:text-white bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg transition-colors"
              >
                Clear File
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {[
                { label: 'Duration', val: '00:34', icon: '⏱' },
                { label: 'Resolution', val: '1080p', icon: 'HD' },
                { label: 'Audio', val: 'Available', icon: '🔊', color: 'text-green-400' },
                { label: 'Frames', val: '1,024', icon: '🎞' },
              ].map((m, i) => (
                <div key={i} className="bg-black/20 backdrop-blur-sm p-5 rounded-xl border border-white/5 flex flex-col justify-between">
                  <div className="text-[10px] text-muted-foreground tracking-widest uppercase mb-2">{m.label}</div>
                  <div className={`font-bold font-mono text-lg ${m.color || 'text-foreground'}`}>{m.val}</div>
                </div>
              ))}
            </div>

            <button 
              onClick={handleStartAnalysis}
              disabled={isAnalyzing}
              className={`w-full relative overflow-hidden rounded-[12px] font-semibold tracking-wide text-[14px] transition-all duration-200 bg-[#606C38] text-[#FEFAE0] ${!isAnalyzing ? 'hover:bg-[#283618] hover:-translate-y-0.5' : 'opacity-70 cursor-not-allowed'}`}
            >
              <div className="relative px-8 py-4 flex items-center justify-center gap-2">
                {!isAnalyzing && <Play size={18} className="fill-[#FEFAE0]" />}
                {isAnalyzing ? progressText : "ANALYZE VIDEO"}
              </div>
            </button>
          </div>
        )}
      </div>
      
      {error && (
        <div className="bg-destructive/10 text-destructive border border-destructive/20 p-4 rounded-lg flex items-start gap-3 whitespace-pre-wrap">
          <AlertCircle size={20} className="mt-0.5 shrink-0" />
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default Analyze;
