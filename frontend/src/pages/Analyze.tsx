import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Upload, 
  Link as LinkIcon, 
  Video, 
  AlertCircle, 
  FileVideo, 
  Zap, 
  Sparkles, 
  ShieldCheck, 
  RotateCw
} from 'lucide-react';
import classNames from 'classnames';

const Analyze = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'upload' | 'url' | 'record'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loadingSample, setLoadingSample] = useState(false);
  const navigate = useNavigate();

  // If navigated from landing page with a preselected tab
  useEffect(() => {
    if (location.state?.initialTab) {
      setActiveTab(location.state.initialTab);
    }
  }, [location.state]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (selected.size > 50 * 1024 * 1024) {
        setError('File exceeds maximum size limit (50MB).');
        setFile(null);
        return;
      }
      setFile(selected);
      setError(null);
    }
  };

  const handleLoadSample = async () => {
    setLoadingSample(true);
    setError(null);
    try {
      // First try fetching history to get an existing cached sample video
      const histRes = await fetch('http://localhost:8000/api/history');
      if (histRes.ok) {
        const historyData = await histRes.json();
        if (historyData.length > 0 && historyData[0].video_url) {
          const vRes = await fetch(`http://localhost:8000${historyData[0].video_url}`);
          if (vRes.ok) {
            const blob = await vRes.blob();
            const sampleFile = new File([blob], "deepshield_sample.mp4", { type: "video/mp4" });
            setFile(sampleFile);
            setLoadingSample(false);
            return;
          }
        }
      }
      
      // Fallback: set a sample URL
      setUrl('https://www.youtube.com/watch?v=jNQXAC9IVRw');
      setActiveTab('url');
    } catch {
      setUrl('https://www.youtube.com/watch?v=jNQXAC9IVRw');
      setActiveTab('url');
    } finally {
      setLoadingSample(false);
    }
  };

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progressStep, setProgressStep] = useState(0);

  const forensicSteps = [
    { label: "Stream Ingestion & Keyframe Sampling", detail: "Extracting 18 forensic frames with adaptive rate" },
    { label: "Spatial & Temporal Laplacian Forensics", detail: "Computing micro-motion vectors & pixel blur gradients" },
    { label: "STFT Audio Spectrogram Analysis", detail: "Generating 16kHz spectral energy & anomaly segments" },
    { label: "Cross-Modal Verdict Synthesis", detail: "Compiling forensic audit dossier & PDF report" }
  ];

  useEffect(() => {
    let interval: any;
    if (isAnalyzing) {
      setProgressStep(0);
      interval = setInterval(() => {
        setProgressStep(prev => (prev < forensicSteps.length - 1 ? prev + 1 : prev));
      }, 550);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

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
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#606C38]/10 text-[#606C38] text-[11px] font-tech font-bold uppercase tracking-wider mb-2">
            <Zap size={12} />
            Sub-Second Engine Active
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#283618]">Forensic Studio</h1>
          <p className="text-sm text-muted-foreground">Select a video source to begin multimodal deepfake detection.</p>
        </div>

        <button
          onClick={handleLoadSample}
          disabled={loadingSample || isAnalyzing}
          className="self-start sm:self-auto flex items-center gap-2 bg-[#DDA15E]/20 hover:bg-[#DDA15E]/30 text-[#BC6C25] border border-[#DDA15E]/40 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 hover:scale-[1.02] shadow-sm disabled:opacity-50"
        >
          {loadingSample ? <RotateCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
          <span>LOAD DEMO SAMPLE</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex p-1.5 bg-[#283618]/5 rounded-2xl w-fit border border-[#283618]/10">
        <button
          onClick={() => setActiveTab('upload')}
          className={classNames('flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200', {
            'bg-card shadow-sm text-[#283618]': activeTab === 'upload',
            'text-muted-foreground hover:text-[#283618]': activeTab !== 'upload',
          })}
        >
          <Upload size={15} /> Upload Video
        </button>
        <button
          onClick={() => setActiveTab('url')}
          className={classNames('flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200', {
            'bg-card shadow-sm text-[#283618]': activeTab === 'url',
            'text-muted-foreground hover:text-[#283618]': activeTab !== 'url',
          })}
        >
          <LinkIcon size={15} /> Paste URL
        </button>
        <button
          onClick={() => setActiveTab('record')}
          className={classNames('flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200', {
            'bg-card shadow-sm text-[#283618]': activeTab === 'record',
            'text-muted-foreground hover:text-[#283618]': activeTab !== 'record',
          })}
        >
          <Video size={15} /> Record Video
        </button>
      </div>

      {/* Main Forensic Working Area */}
      <div className="glass-panel p-8 md:p-12 min-h-[420px] flex flex-col items-center justify-center relative overflow-hidden group border border-[#283618]/15 shadow-md">
        
        {/* Animated Processing Overlay */}
        {isAnalyzing && (
          <div className="absolute inset-0 z-50 bg-[#FEFAE0]/95 backdrop-blur-md flex flex-col items-center justify-center p-8 animate-in fade-in duration-300">
            <div className="w-full max-w-md space-y-6 text-center">
              
              {/* Spinning Radar Ring */}
              <div className="relative mx-auto w-24 h-24">
                <div className="absolute inset-0 rounded-full border-4 border-[#606C38]/20" />
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#606C38] border-r-[#DDA15E] animate-spin" />
                <div className="absolute inset-3 rounded-full bg-[#606C38]/10 flex items-center justify-center">
                  <ShieldCheck size={32} className="text-[#606C38] animate-pulse" />
                </div>
              </div>

              <div>
                <span className="font-tech text-xs tracking-widest text-[#606C38] uppercase font-bold">
                  STEP {progressStep + 1} OF 4
                </span>
                <h3 className="font-display text-xl font-bold text-[#283618] mt-1">
                  {forensicSteps[progressStep].label}
                </h3>
                <p className="text-xs text-muted-foreground mt-1 font-mono">
                  {forensicSteps[progressStep].detail}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-[#283618]/10 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-[#606C38] to-[#DDA15E] h-full rounded-full transition-all duration-300"
                  style={{ width: `${(progressStep + 1) * 25}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-[10px] font-mono text-muted-foreground">
                <span>Fast Stream Pipeline</span>
                <span className="text-[#606C38] font-bold">ETA: ~1-2s</span>
              </div>

            </div>
          </div>
        )}

        {/* Upload Mode Initial Dropzone */}
        {activeTab === 'upload' && !file && (
          <div className="text-center space-y-6 w-full relative z-10">
            <div className="mx-auto w-20 h-20 bg-[#606C38]/10 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-105 group-hover:bg-[#606C38]/15 border border-[#606C38]/20 shadow-sm">
              <Upload size={32} className="text-[#606C38] group-hover:-translate-y-1 transition-transform duration-300" />
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-display font-bold tracking-tight text-[#283618]">
                Drag & Drop Video To Analyze
              </h3>
              <p className="text-sm text-muted-foreground">or click to browse local files (MP4, WEBM, MOV)</p>
            </div>
            <div className="flex justify-center gap-2 text-xs font-mono text-muted-foreground uppercase tracking-widest pt-2">
              <span className="bg-[#283618]/5 border border-[#283618]/10 px-3 py-1 rounded-md">MP4</span>
              <span className="bg-[#283618]/5 border border-[#283618]/10 px-3 py-1 rounded-md">WEBM</span>
              <span className="bg-[#283618]/5 border border-[#283618]/10 px-3 py-1 rounded-md">MOV</span>
              <span className="bg-[#606C38]/10 text-[#606C38] border border-[#606C38]/20 px-3 py-1 rounded-md font-bold">FAST PIPELINE</span>
            </div>
            <input
              type="file"
              accept="video/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileChange}
            />
          </div>
        )}

        {/* URL Mode */}
        {activeTab === 'url' && (
          <div className="w-full max-w-xl space-y-6 relative z-10 animate-in fade-in zoom-in-95 duration-300">
            <div className="text-center space-y-2 mb-6">
              <div className="inline-flex p-3 rounded-2xl bg-[#DDA15E]/15 border border-[#DDA15E]/30 mb-2">
                <LinkIcon size={24} className="text-[#BC6C25]" />
              </div>
              <h3 className="text-2xl font-display font-bold tracking-tight text-[#283618]">
                Analyze Video Stream From URL
              </h3>
              <p className="text-sm text-muted-foreground">
                Paste any YouTube, Vimeo, or direct public video link
              </p>
            </div>

            <div className="relative group/input">
              <div className="relative flex flex-col sm:flex-row bg-background border border-[#283618]/20 rounded-xl p-1.5 shadow-sm gap-2">
                <input
                  type="text"
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="flex-1 bg-transparent px-4 py-3 focus:outline-none text-[#283618] placeholder:text-muted-foreground/60 text-sm font-mono"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
                <button 
                  onClick={handleStartAnalysis}
                  disabled={isAnalyzing || !url}
                  className="bg-[#283618] text-[#FEFAE0] px-6 py-3 rounded-lg font-bold text-xs tracking-wider uppercase hover:bg-[#606C38] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
                >
                  <Zap size={14} className="text-[#DDA15E]" />
                  <span>PROCESS & ANALYZE</span>
                </button>
              </div>
            </div>

            {/* Quick Sample Presets */}
            <div className="pt-2 text-center">
              <span className="text-[11px] text-muted-foreground mr-2 font-mono">Quick test links:</span>
              <button
                type="button"
                onClick={() => setUrl('https://www.youtube.com/watch?v=jNQXAC9IVRw')}
                className="text-[11px] font-mono font-bold text-[#606C38] underline hover:text-[#283618] transition-colors"
              >
                Sample 19s Video (YouTube)
              </button>
            </div>
          </div>
        )}

        {/* Record Mode */}
        {activeTab === 'record' && (
          <div className="text-center space-y-6 relative z-10 animate-in fade-in zoom-in-95 duration-300">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full animate-pulse"></div>
              <div className="w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-2">
                <Video size={36} className="text-red-500" />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-display font-bold tracking-tight text-[#283618]">
                Real-Time Video Capture
              </h3>
              <p className="text-sm text-muted-foreground">Record a video directly with your camera for immediate analysis</p>
            </div>
            <button 
              onClick={handleLoadSample}
              className="bg-[#283618] hover:bg-[#606C38] text-[#FEFAE0] px-8 py-3 rounded-xl font-bold text-xs tracking-wide transition-all shadow-md mt-2 inline-flex items-center gap-2"
            >
              <Sparkles size={16} className="text-[#DDA15E]" />
              LOAD BENCHMARK SAMPLE INSTEAD
            </button>
          </div>
        )}

        {/* File Selected Preview State */}
        {activeTab === 'upload' && file && (
          <div className="w-full relative z-10 animate-in fade-in zoom-in-95 duration-300">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-[#283618]/15 pb-6 mb-6 gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[#606C38]/15 border border-[#606C38]/30 rounded-2xl flex items-center justify-center shadow-sm">
                  <FileVideo size={28} className="text-[#606C38]" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-[#283618] mb-0.5">{file.name}</h3>
                  <p className="text-xs text-muted-foreground font-mono">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB • READY FOR ANALYSIS
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setFile(null)}
                className="text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-[#283618] bg-[#283618]/5 hover:bg-[#283618]/10 px-4 py-2 rounded-lg transition-colors border border-[#283618]/10"
              >
                Change File
              </button>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              {[
                { label: 'Pipeline', val: 'Fast Decimation', icon: '⚡' },
                { label: 'Spectrogram', val: '16kHz STFT', icon: '🔊' },
                { label: 'Keyframes', val: '18 Samples', icon: '🎞' },
                { label: 'Estimated Time', val: '~1.8s', icon: '⏱', highlight: true },
              ].map((m, i) => (
                <div key={i} className="bg-white/70 p-4 rounded-xl border border-[#283618]/10 flex flex-col justify-between">
                  <div className="text-[10px] text-muted-foreground tracking-widest uppercase mb-1 font-mono">{m.label}</div>
                  <div className={`font-bold font-mono text-sm ${m.highlight ? 'text-[#606C38]' : 'text-[#283618]'}`}>
                    {m.val}
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={handleStartAnalysis}
              disabled={isAnalyzing}
              className="w-full relative overflow-hidden rounded-xl font-bold tracking-wider uppercase text-sm py-4 bg-[#283618] hover:bg-[#1f2b12] text-[#FEFAE0] shadow-lg shadow-[#283618]/20 transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-75 flex items-center justify-center gap-2 group"
            >
              <Zap size={18} className="text-[#DDA15E] group-hover:scale-110 transition-transform" />
              <span>START FORENSIC ANALYSIS</span>
            </button>
          </div>
        )}

      </div>
      
      {/* Error Notice */}
      {error && (
        <div className="bg-destructive/10 text-destructive border border-destructive/20 p-4 rounded-xl flex items-start gap-3 whitespace-pre-wrap animate-in fade-in duration-200">
          <AlertCircle size={20} className="mt-0.5 shrink-0" />
          <p className="text-xs font-mono">{error}</p>
        </div>
      )}

    </div>
  );
};

export default Analyze;
