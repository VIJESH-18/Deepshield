import { Link } from 'react-router-dom';
import { PlaySquare, Upload, Link as LinkIcon, Video, Activity, ShieldCheck, AlertTriangle } from 'lucide-react';

const Home = () => {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-500 relative pb-20">
      
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-6 pt-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DDA15E]/10 border border-[#DDA15E]/30 text-[#DDA15E] text-[11px] font-semibold tracking-widest uppercase mb-4">
          <Activity size={12} />
          Core Engine v2.0 Live
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground pb-2">
          Multimodal Forensics <br />
          <span className="text-[#606C38]">Reimagined.</span>
        </h1>
        <p className="text-lg text-muted-foreground font-normal leading-relaxed max-w-2xl mx-auto">
          DeepShield analyzes visual, temporal, motion, and audio modalities to provide evidence-aware deepfake detection.
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-center gap-6 mt-12 relative z-10">
        <Link to="/analyze" className="group relative">
          <div className="relative bg-[#606C38] text-[#FEFAE0] flex items-center justify-center gap-3 px-8 py-3.5 rounded-[12px] font-semibold text-[14px] transition-all duration-200 hover:bg-[#283618] hover:shadow-md active:scale-[0.98]">
            <PlaySquare size={20} />
            START ANALYSIS
          </div>
        </Link>
      </div>
      
      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16">
        {[
          { icon: <Upload size={24} className="text-[#606C38] mb-4" />, title: "Upload Video", desc: "Drag & drop local files" },
          { icon: <LinkIcon size={24} className="text-[#DDA15E] mb-4" />, title: "Paste URL", desc: "Analyze direct links" },
          { icon: <Video size={24} className="text-[#BC6C25] mb-4" />, title: "Record Video", desc: "Capture live forensics" }
        ].map((feat, idx) => (
          <button key={idx} className="glass-panel group p-8 flex flex-col items-center text-center transition-all duration-200 hover:border-[#606C38]/40 hover:-translate-y-1 hover:shadow-md relative overflow-hidden bg-card">
            {feat.icon}
            <span className="font-semibold text-[16px] text-foreground">{feat.title}</span>
            <span className="text-[13px] text-muted-foreground mt-2">{feat.desc}</span>
          </button>
        ))}
      </div>

      {/* Stats Section */}
      <div className="mt-24 max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-[1px] flex-1 bg-border"></div>
          <h2 className="text-[12px] font-semibold tracking-widest uppercase text-muted-foreground flex items-center gap-2">
            <Activity className="text-[#606C38]" size={16} /> Global Telemetry
          </h2>
          <div className="h-[1px] flex-1 bg-border"></div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Analyses Run', val: '1,248', color: 'text-foreground' },
            { label: 'Likely Authentic', val: '842', color: 'text-[#606C38]', icon: <ShieldCheck size={16} /> },
            { label: 'Manipulated', val: '315', color: 'text-[#BC6C25]', icon: <AlertTriangle size={16} /> },
            { label: 'Insufficient Evidence', val: '91', color: 'text-[#DDA15E]' }
          ].map((stat, i) => (
            <div key={i} className="glass-panel p-6 relative group transition-colors hover:border-[#606C38]/30 bg-card">
              <div className="text-[11px] font-semibold tracking-wider text-muted-foreground mb-3 uppercase flex items-center gap-2">
                {stat.icon && <span className={stat.color}>{stat.icon}</span>}
                {stat.label}
              </div>
              <div className={`text-[28px] font-bold ${stat.color} tracking-tight`}>{stat.val}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
