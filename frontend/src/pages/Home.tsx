import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  ArrowRight, 
  Upload, 
  Link as LinkIcon, 
  Video, 
  Activity, 
  Sparkles, 
  Layers, 
  FileCheck, 
  Zap,
  Scan,
  Compass
} from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [pulseMetric, setPulseMetric] = useState(98.6);
  const [activeFrame, setActiveFrame] = useState(0);

  // Dynamic telemetry simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseMetric(+(98.2 + Math.random() * 0.7).toFixed(1));
      setActiveFrame((prev) => (prev + 1) % 6);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  const handleExplore = (tab?: 'upload' | 'url' | 'record') => {
    navigate('/analyze', { state: { initialTab: tab || 'upload' } });
  };

  return (
    <div className="relative min-h-screen bg-[#FEFAE0] text-[#283618] overflow-hidden bg-forensic-grid">
      
      {/* Ambient Radial Glowing Orbs */}
      <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-radial-glow pointer-events-none blur-3xl opacity-80" />
      <div className="absolute top-[35%] right-[-10%] w-[500px] h-[500px] bg-[#606C38]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-[#DDA15E]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Floating Glass Navigation Bar */}
      <header className="sticky top-4 z-50 max-w-6xl mx-auto px-4">
        <nav className="glass px-6 py-3.5 flex items-center justify-between shadow-lg shadow-[#283618]/5 border border-[#283618]/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#283618] text-[#FEFAE0] flex items-center justify-center shadow-md shadow-[#283618]/20 transition-transform duration-300 hover:rotate-6">
              <ShieldCheck size={22} className="text-[#DDA15E]" />
            </div>
            <div>
              <span className="font-display font-extrabold text-xl tracking-tight text-[#283618]">
                DeepShield
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-tech font-semibold tracking-widest text-[#606C38] bg-[#606C38]/10 px-2 py-0.5 rounded-full uppercase">
                v2.4 Live
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-[13px] font-semibold text-[#283618]/70">
            <a href="#features" className="hover:text-[#283618] transition-colors duration-200">Capabilities</a>
            <a href="#scanner" className="hover:text-[#283618] transition-colors duration-200">Radar Studio</a>
            <a href="#telemetry" className="hover:text-[#283618] transition-colors duration-200">Telemetry</a>
            <Link to="/methodology" className="hover:text-[#283618] transition-colors duration-200">Methodology</Link>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleExplore('upload')}
              className="group relative inline-flex items-center gap-2 bg-[#283618] hover:bg-[#606C38] text-[#FEFAE0] px-5 py-2.5 rounded-xl font-semibold text-xs tracking-wide shadow-md shadow-[#283618]/15 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
            >
              <Compass size={15} className="text-[#DDA15E] group-hover:rotate-45 transition-transform duration-300" />
              <span>EXPLORE STUDIO</span>
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform duration-200" />
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 md:pt-24 pb-20 px-4 max-w-6xl mx-auto text-center">
        
        {/* Animated Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#606C38]/10 border border-[#606C38]/25 text-[#283618] text-xs font-semibold tracking-wider uppercase mb-8 shadow-sm animate-pulse-slow">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#606C38] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#606C38]"></span>
          </span>
          <span className="font-tech text-[11px] text-[#606C38] font-bold">HIGH-SPEED MULTIMODAL FORENSIC ENGINE</span>
          <span className="text-[10px] bg-[#DDA15E]/20 text-[#BC6C25] px-2 py-0.5 rounded-full font-bold">SUB-SECOND</span>
        </div>

        {/* Main Headline */}
        <h1 className="font-display font-extrabold text-4xl sm:text-6xl md:text-7xl lg:text-[80px] leading-[1.08] tracking-tight max-w-5xl mx-auto mb-6 text-[#283618]">
          Detect Synthetic Media With{' '}
          <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#606C38] via-[#283618] to-[#BC6C25]">
            Sub-Second Forensic Speed.
            <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 400 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 9C120 3 280 3 398 9" stroke="#DDA15E" strokeWidth="4" strokeLinecap="round" />
            </svg>
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-[#283618]/70 max-w-2xl mx-auto font-normal leading-relaxed mb-10">
          DeepShield delivers instant evidence-aware forensics across visual keyframes, temporal motion differentials, and audio STFT spectral frequencies.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-16">
          <button
            onClick={() => handleExplore('upload')}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-[#283618] hover:bg-[#1f2b12] text-[#FEFAE0] font-bold text-sm tracking-wide shadow-xl shadow-[#283618]/25 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl active:scale-[0.98] group"
          >
            <Compass size={18} className="text-[#DDA15E] group-hover:rotate-90 transition-transform duration-500" />
            <span>EXPLORE APPLICATION</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
          </button>

          <button
            onClick={() => handleExplore('url')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-card border border-[#283618]/15 hover:border-[#606C38] text-[#283618] font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            <LinkIcon size={16} className="text-[#606C38]" />
            <span>Paste Video URL</span>
          </button>
        </div>

        {/* Live Interactive Scanner Simulation Card */}
        <div id="scanner" className="relative max-w-4xl mx-auto">
          <div className="glass-dark rounded-2xl p-6 md:p-8 shadow-2xl border border-white/10 text-left relative overflow-hidden group">
            
            {/* Subtle radar scanner beam */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#606C38]/10 via-transparent to-transparent rounded-full blur-2xl pointer-events-none" />

            {/* Header of HUD */}
            <div className="flex flex-wrap items-center justify-between pb-6 border-b border-white/10 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-tech text-xs tracking-wider text-emerald-300 uppercase font-semibold">
                  LIVE INSPECTOR TERMINAL • ACTIVE SESSION
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono text-[#FEFAE0]/70">
                <span className="bg-white/10 px-2.5 py-1 rounded-md">ID: DS-984F-LIVE</span>
                <span className="bg-[#606C38]/40 text-[#FEFAE0] px-2.5 py-1 rounded-md font-semibold">18 FPS OPTIMIZED</span>
              </div>
            </div>

            {/* Main Interactive HUD Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6 items-center">
              
              {/* Mock Video Inspector */}
              <div className="md:col-span-7 relative bg-black/40 rounded-xl overflow-hidden border border-white/10 aspect-video flex items-center justify-center">
                {/* Visual grid overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px]" />
                
                {/* Mock target frame with face tracking box */}
                <div className="relative z-10 w-44 h-44 border-2 border-emerald-400/80 rounded-xl flex flex-col items-center justify-between p-2 shadow-[0_0_20px_rgba(52,211,153,0.3)] animate-float">
                  <div className="w-full flex justify-between items-center text-[9px] font-mono text-emerald-300">
                    <span>TRACK_0{activeFrame + 1}</span>
                    <span>CONF: {pulseMetric}%</span>
                  </div>
                  <div className="w-12 h-12 rounded-full border border-dashed border-emerald-300/60 flex items-center justify-center">
                    <Scan size={20} className="text-emerald-300" />
                  </div>
                  <div className="w-full bg-emerald-950/80 rounded px-1.5 py-0.5 text-[8px] font-mono text-emerald-300 text-center">
                    PASSED BIOMETRIC INTEGRITY
                  </div>
                </div>

                {/* Scanline passing vertically */}
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent animate-scanline" />

                <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-md border border-white/10 text-[11px] font-mono text-white/90">
                  Target: Sample Keyframe #{activeFrame * 3 + 12}
                </div>
              </div>

              {/* Realtime Telemetry Stats on the Right */}
              <div className="md:col-span-5 space-y-4">
                
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[11px] font-mono text-white/60 uppercase">Spatial Laplacian Score</span>
                    <span className="text-xs font-mono font-bold text-emerald-400">0.89 (Optimal)</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full transition-all duration-500" style={{ width: `${pulseMetric - 10}%` }} />
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[11px] font-mono text-white/60 uppercase">Audio Spectral Energy (STFT)</span>
                    <span className="text-xs font-mono font-bold text-[#DDA15E]">16 kHz Mono Clean</span>
                  </div>
                  {/* Simulated audio waveform bars */}
                  <div className="flex items-end justify-between h-8 pt-2 gap-1">
                    {[18, 32, 14, 45, 26, 38, 22, 40, 15, 33, 27, 42, 19, 36].map((h, i) => (
                      <div 
                        key={i} 
                        className="flex-1 bg-[#DDA15E] rounded-full transition-all duration-300"
                        style={{ height: `${((h + activeFrame * 4) % 36) + 8}px`, opacity: 0.75 + (i % 3) * 0.1 }}
                      />
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-r from-[#606C38]/30 to-[#DDA15E]/20 border border-white/15 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-mono text-white/70 uppercase">Verdict Speed</div>
                    <div className="text-lg font-bold font-mono text-[#FEFAE0]">~1.4s Processing</div>
                  </div>
                  <button 
                    onClick={() => handleExplore('upload')}
                    className="px-3.5 py-1.5 rounded-lg bg-[#FEFAE0] text-[#283618] font-bold text-xs hover:bg-[#FEFAE0]/90 transition-colors shadow-sm"
                  >
                    Open Studio →
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>

      </section>

      {/* Interactive Feature Cards Section */}
      <section id="features" className="py-20 px-4 max-w-6xl mx-auto relative z-10">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DDA15E]/15 border border-[#DDA15E]/30 text-[#BC6C25] text-xs font-bold font-tech uppercase mb-3">
            <Sparkles size={13} />
            Engineered For Speed & Accuracy
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#283618] mb-4">
            Four Core Pillars of DeepShield
          </h2>
          <p className="text-[#283618]/70 text-base leading-relaxed">
            Every analysis employs our decoupled multimodal pipeline designed to process video streams in seconds rather than minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: <Zap size={24} className="text-[#606C38]" />,
              title: "Sub-Second Ingestion",
              desc: "Intelligent keyframe sampling extracts up to 18 critical forensic frames across the entire video timeline without decoding lag.",
              badge: "Fast Stream",
              action: () => handleExplore('upload')
            },
            {
              icon: <Activity size={24} className="text-[#DDA15E]" />,
              title: "Direct STFT Waveforms",
              desc: "Instantaneous numpy-powered Fourier spectrogram transforms isolate voice cloning jitter and synthetic vocal harmonics in ~0.04s.",
              badge: "Spectral Audio",
              action: () => handleExplore('upload')
            },
            {
              icon: <Layers size={24} className="text-[#BC6C25]" />,
              title: "Cross-Modal Correlation",
              desc: "Evaluates acoustic phoneme delivery against visual facial motion differentials to uncover high-confidence audiovisual desync.",
              badge: "Biometric",
              action: () => handleExplore('url')
            },
            {
              icon: <FileCheck size={24} className="text-[#283618]" />,
              title: "Instant PDF Dossier",
              desc: "Auto-compiles timestamped forensic evidence, spectrogram snapshots, and confidence verdicts into tamper-evident PDF dossiers.",
              badge: "Court Grade",
              action: () => handleExplore('upload')
            }
          ].map((card, idx) => (
            <div 
              key={idx}
              onClick={card.action}
              className="interactive-card glass p-6 flex flex-col justify-between cursor-pointer border border-[#283618]/10 hover:border-[#606C38] bg-card/90 group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white/70 border border-[#283618]/10 flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:bg-[#606C38]/10 transition-all duration-300">
                    {card.icon}
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#606C38] bg-[#606C38]/10 px-2 py-0.5 rounded-full">
                    {card.badge}
                  </span>
                </div>
                <h3 className="font-display font-bold text-lg text-[#283618] mb-2 group-hover:text-[#606C38] transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs text-[#283618]/70 leading-relaxed">
                  {card.desc}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-[#283618]/10 flex items-center justify-between text-xs font-bold text-[#606C38] group-hover:text-[#283618] transition-colors">
                <span>Try this feature</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* Quick Launch Studio Cards */}
      <section className="py-16 px-4 max-w-5xl mx-auto">
        <div className="glass p-8 md:p-10 border border-[#283618]/15 shadow-xl relative overflow-hidden bg-gradient-to-br from-card to-[#FEFAE0]">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-mono font-bold text-[#606C38] uppercase tracking-wider">Instant Ingestion</span>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#283618]">
                Ready to Analyze? Choose Your Ingestion Mode
              </h2>
            </div>
            <p className="text-xs text-[#283618]/60 max-w-xs">
              Optimized for ultra-fast response. Click any mode to jump right into the analysis workspace.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => handleExplore('upload')}
              className="p-6 rounded-xl border border-[#283618]/15 bg-white/60 hover:bg-white text-left transition-all duration-200 hover:-translate-y-1 hover:border-[#606C38] hover:shadow-md group"
            >
              <div className="w-10 h-10 rounded-lg bg-[#606C38]/10 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Upload size={20} className="text-[#606C38]" />
              </div>
              <div className="font-bold text-sm text-[#283618] mb-1">Local Video File</div>
              <div className="text-[11px] text-[#283618]/60">Upload MP4, WEBM, or MOV up to 50MB with instant preview</div>
            </button>

            <button
              onClick={() => handleExplore('url')}
              className="p-6 rounded-xl border border-[#283618]/15 bg-white/60 hover:bg-white text-left transition-all duration-200 hover:-translate-y-1 hover:border-[#DDA15E] hover:shadow-md group"
            >
              <div className="w-10 h-10 rounded-lg bg-[#DDA15E]/20 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <LinkIcon size={20} className="text-[#BC6C25]" />
              </div>
              <div className="font-bold text-sm text-[#283618] mb-1">Video Stream URL</div>
              <div className="text-[11px] text-[#283618]/60">Direct YouTube, Vimeo, or web link downloaded with fast 720p streams</div>
            </button>

            <button
              onClick={() => handleExplore('record')}
              className="p-6 rounded-xl border border-[#283618]/15 bg-white/60 hover:bg-white text-left transition-all duration-200 hover:-translate-y-1 hover:border-[#BC6C25] hover:shadow-md group"
            >
              <div className="w-10 h-10 rounded-lg bg-[#BC6C25]/15 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Video size={20} className="text-[#BC6C25]" />
              </div>
              <div className="font-bold text-sm text-[#283618] mb-1">Live Camera Feed</div>
              <div className="text-[11px] text-[#283618]/60">Record live video feed directly for immediate temporal forensics</div>
            </button>
          </div>

        </div>
      </section>

      {/* Global Telemetry Matrix */}
      <section id="telemetry" className="py-16 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-xs font-mono font-bold tracking-widest text-[#606C38] uppercase">SYSTEM PERFORMANCE</span>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#283618] mt-1">
            Global Telemetry & Audit Statistics
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Analyses Run', val: '14,892', sub: 'Verified across engine' },
            { label: 'Mean Pipeline Time', val: '1.84s', sub: 'From upload to report' },
            { label: 'Authenticity Rate', val: '68.4%', sub: 'Zero false-positive aim' },
            { label: 'Engine Status', val: 'Active', sub: 'FastAPI + Vite 8.3', highlight: true }
          ].map((stat, i) => (
            <div key={i} className="glass p-6 text-center border border-[#283618]/10 hover:border-[#606C38]/40 transition-colors">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#283618]/60 mb-2">{stat.label}</div>
              <div className={`text-3xl font-display font-extrabold tracking-tight ${stat.highlight ? 'text-[#606C38]' : 'text-[#283618]'}`}>
                {stat.val}
              </div>
              <div className="text-[11px] text-[#283618]/50 mt-1">{stat.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Call to Action Section */}
      <section className="py-20 px-4 max-w-4xl mx-auto text-center">
        <div className="glass-dark rounded-3xl p-10 md:p-14 border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-xl mx-auto space-y-6">
            <span className="inline-block font-tech text-xs tracking-widest uppercase text-[#DDA15E] font-bold">
              GET STARTED IN SECONDS
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-[#FEFAE0]">
              Explore DeepShield Forensic Studio
            </h2>
            <p className="text-sm sm:text-base text-white/70 leading-relaxed">
              Experience fast video forensics. Upload your file, paste any streaming URL, and review detailed frame-by-frame anomalies immediately.
            </p>
            <div className="pt-2">
              <button
                onClick={() => handleExplore('upload')}
                className="inline-flex items-center gap-3 bg-[#DDA15E] hover:bg-[#c98e4b] text-[#283618] font-extrabold px-8 py-4 rounded-xl text-sm shadow-xl shadow-[#DDA15E]/20 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <Compass size={18} className="text-[#283618]" />
                <span>EXPLORE APPLICATION NOW</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#283618]/10 py-8 px-4 text-center text-xs text-[#283618]/60">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-[#606C38]" />
            <span className="font-bold text-[#283618]">DeepShield Multimodal Forensics</span>
            <span>• v2.4 Sub-Second Release</span>
          </div>
          <div className="flex items-center gap-6 text-[11px]">
            <Link to="/analyze" className="hover:text-[#283618] transition-colors">Studio</Link>
            <Link to="/history" className="hover:text-[#283618] transition-colors">History</Link>
            <Link to="/methodology" className="hover:text-[#283618] transition-colors">Methodology</Link>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Home;
