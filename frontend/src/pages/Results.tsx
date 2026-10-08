import { useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { AlertTriangle, ShieldCheck, Activity, Download, PlayCircle, Eye, Volume2, Move, Clock, Layers } from 'lucide-react';

const Results = () => {
  const location = useLocation();
  const data = location.state?.resultData || null;

  const [activeTab, setActiveTab] = useState<'overview' | 'evidence-lab' | 'audio' | 'cross-modal'>('overview');
  const [selectedFrameIdx, setSelectedFrameIdx] = useState<number>(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  if (!data) return <div className="text-center py-20 text-muted-foreground">No analysis data found. Please run an analysis first.</div>;

  const { verdict, confidence, video_url, frames, top_evidence, audio, pdf_url, duration, cross_modal_disagreement, id } = data;
  const isManipulated = verdict.includes('AI-GENERATED') || verdict.includes('MANIPULATED');

  // Calculate averages for the overview
  const avgVisual = frames.length > 0 ? (frames.reduce((acc: number, f: any) => acc + f.visual_score, 0) / frames.length) * 100 : 0;
  const avgTemporal = frames.length > 0 ? (frames.reduce((acc: number, f: any) => acc + f.temporal_score, 0) / frames.length) * 100 : 0;
  const avgMotion = frames.length > 0 ? (frames.reduce((acc: number, f: any) => acc + f.motion_score, 0) / frames.length) * 100 : 0;
  const audioScore = audio?.segments?.length > 0 ? audio.segments[0].evidence_score * 100 : 0;

  const evidenceData = [
    { name: 'Visual Evidence (Fallback)', value: Math.round(avgVisual), icon: <Eye size={18} />, desc: 'Spatial anomalies / Blur' },
    { name: 'Temporal Evidence', value: Math.round(avgTemporal), icon: <Clock size={18} />, desc: 'Frame sequence differences' },
    { name: 'Motion Evidence', value: Math.round(avgMotion), icon: <Move size={18} />, desc: 'Optical flow / differences' },
  ];
  if (audio?.available) {
    evidenceData.push({ name: 'Audio Evidence', value: Math.round(audioScore), icon: <Volume2 size={18} />, desc: 'High energy / spectral anomalies' });
  }

  const handleFrameClick = (timestamp: number, idx: number) => {
    setSelectedFrameIdx(idx);
    setActiveTab('evidence-lab');
    if (videoRef.current) {
      videoRef.current.currentTime = timestamp;
      videoRef.current.play().catch(() => {});
    }
  };

  const handleAudioSegmentClick = (start: number, end: number) => {
    setActiveTab('audio');
    if (audioRef.current) {
      audioRef.current.currentTime = start;
      audioRef.current.play();
      setTimeout(() => {
        if (audioRef.current) audioRef.current.pause();
      }, (end - start) * 1000);
    }
    if (videoRef.current) {
      videoRef.current.currentTime = start;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="text-sm text-muted-foreground font-mono mb-1">ANALYSIS ID: {id}</div>
          <h1 className="text-3xl font-bold tracking-tight">Forensic Results</h1>
          <p className="text-muted-foreground">Analyzed Video • {duration ? `${Math.round(duration)}s` : 'Unknown duration'}</p>
        </div>
        <div className="flex gap-2">
          <a href={`http://localhost:8000${pdf_url}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90">
            <Download size={16} /> PDF Report
          </a>
        </div>
      </div>

      <div className={`p-8 rounded-[16px] border ${isManipulated ? 'bg-[#BC6C25]/10 border-[#BC6C25]/20' : 'bg-[#606C38]/10 border-[#606C38]/20'}`}>
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className={`p-6 rounded-full ${isManipulated ? 'bg-[#BC6C25]/10 text-[#BC6C25]' : 'bg-[#606C38]/10 text-[#606C38]'}`}>
            {isManipulated ? <AlertTriangle size={64} /> : <ShieldCheck size={64} />}
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="text-sm font-semibold tracking-[0.1em] uppercase mb-2 text-muted-foreground">Final Verdict</div>
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 tracking-tight ${isManipulated ? 'text-[#BC6C25]' : 'text-[#606C38]'}`}>
              {verdict}
            </h2>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <div className="glass-panel px-6 py-3 bg-card border-border">
                <div className="text-[11px] text-muted-foreground uppercase tracking-widest mb-1 font-semibold">Max Evidence Score</div>
                <div className="font-mono text-2xl font-bold">{confidence}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex border-b border-border overflow-x-auto hide-scrollbar">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'evidence-lab', label: 'Evidence Lab' },
          { id: 'audio', label: 'Audio Forensics' },
          { id: 'cross-modal', label: 'Cross-Modal' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in">
            <div className="md:col-span-2 space-y-6">
              
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4">Why this result?</h3>
                <p className="text-muted-foreground mb-6">
                  {isManipulated ? "The system detected elevated anomaly evidence in several segments based on visual, motion, and/or temporal fallbacks." : "The available evidence supports the video being authentic, with features within expected bounds."}
                </p>

                <div className="space-y-4">
                  {evidenceData.map((evidence, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded bg-secondary/50 flex items-center justify-center text-muted-foreground">
                        {evidence.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium">{evidence.name}</span>
                          <span className="font-mono">{evidence.value}%</span>
                        </div>
                        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${evidence.value > 70 ? 'bg-destructive' : evidence.value > 40 ? 'bg-yellow-500' : 'bg-green-500'}`} 
                            style={{ width: `${evidence.value}%` }} 
                          />
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">{evidence.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Activity size={20} className="text-primary" /> Suspicious Events Timeline
                </h3>
                
                <div className="relative pt-8 pb-4 h-24">
                  <div className="absolute top-10 left-0 w-full h-1 bg-secondary rounded" />
                  
                  {top_evidence.map((marker: any, i: number) => {
                    const pos = duration > 0 ? (marker.timestamp / duration) * 100 : 0;
                    return (
                    <div key={i} className="absolute top-10 -translate-y-1/2 flex flex-col items-center group cursor-pointer" style={{ left: `${pos}%` }} onClick={() => handleFrameClick(marker.timestamp, frames.findIndex((f: any) => f.frame_number === marker.frame_number))}>
                      <div className={`w-3 h-3 rounded-full ${marker.suspicion_level === 'HIGH' ? 'bg-destructive' : 'bg-yellow-500'} ring-4 ring-background z-10 transition-transform group-hover:scale-150`} />
                      <div className="absolute -top-8 bg-popover text-popover-foreground text-xs px-2 py-1 rounded border border-border whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                        Frame {marker.frame_number} ({marker.suspicion_level})
                      </div>
                      <div className="absolute top-4 text-xs font-mono text-muted-foreground">
                        {marker.timestamp}s
                      </div>
                    </div>
                  )})}
                </div>
              </div>

            </div>

            <div className="space-y-6">
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-bold mb-4">Available Modalities</h3>
                <ul className="space-y-3">
                  <li className="flex justify-between items-center text-sm">
                    <span>Visual (Fallback)</span>
                    <ShieldCheck size={16} className="text-green-500" />
                  </li>
                  <li className="flex justify-between items-center text-sm">
                    <span>Temporal (Fallback)</span>
                    <ShieldCheck size={16} className="text-green-500" />
                  </li>
                  <li className="flex justify-between items-center text-sm">
                    <span>Motion (Fallback)</span>
                    <ShieldCheck size={16} className="text-green-500" />
                  </li>
                  <li className={`flex justify-between items-center text-sm ${!audio?.available ? 'opacity-50' : ''}`}>
                    <span>Audio</span>
                    {audio?.available ? <ShieldCheck size={16} className="text-green-500" /> : <span className="text-xs uppercase bg-secondary px-2 py-0.5 rounded">Unavailable</span>}
                  </li>
                  <li className="flex justify-between items-center text-sm opacity-50">
                    <span>Advanced ML Models</span>
                    <span className="text-xs uppercase bg-secondary px-2 py-0.5 rounded">MODEL UNAVAILABLE</span>
                  </li>
                </ul>
              </div>
              <div className="bg-card border border-border rounded-xl p-4">
                  <video ref={videoRef} src={`http://localhost:8000${video_url}`} controls className="w-full rounded-lg" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'evidence-lab' && (
          <div className="animate-in fade-in space-y-6">
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">Evidence Lab</h3>
              <p className="text-sm text-muted-foreground mb-6">Inspect actual extracted frames and evidence.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* Previous Frame */}
                <div className="space-y-2">
                  <div className="text-xs text-center text-muted-foreground">PREVIOUS</div>
                  <div className="aspect-video bg-black rounded-lg border border-border flex items-center justify-center relative overflow-hidden">
                    {selectedFrameIdx > 0 ? (
                      <>
                        <img src={`http://localhost:8000${frames[selectedFrameIdx-1].image_path}`} className="w-full h-full object-cover opacity-60" />
                        <span className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 text-xs font-mono">{frames[selectedFrameIdx-1].timestamp}s</span>
                      </>
                    ) : (
                      <span className="text-muted-foreground text-sm font-mono opacity-50">N/A</span>
                    )}
                  </div>
                </div>
                {/* Current Frame */}
                <div className="space-y-2 transform scale-105 z-10 shadow-2xl">
                  <div className={`text-xs text-center font-bold ${frames[selectedFrameIdx]?.suspicion_level === 'HIGH' ? 'text-destructive' : 'text-primary'}`}>CURRENT FRAME {frames[selectedFrameIdx]?.frame_number}</div>
                  <div className={`aspect-video bg-black rounded-lg border-2 ${frames[selectedFrameIdx]?.suspicion_level === 'HIGH' ? 'border-destructive' : 'border-primary'} flex items-center justify-center relative overflow-hidden`}>
                     {frames[selectedFrameIdx] && (
                        <>
                          <img src={`http://localhost:8000${frames[selectedFrameIdx].image_path}`} className="w-full h-full object-cover" />
                          <span className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 text-xs font-mono">{frames[selectedFrameIdx].timestamp}s</span>
                        </>
                     )}
                  </div>
                </div>
                {/* Next Frame */}
                <div className="space-y-2">
                  <div className="text-xs text-center text-muted-foreground">NEXT</div>
                  <div className="aspect-video bg-black rounded-lg border border-border flex items-center justify-center relative overflow-hidden">
                    {selectedFrameIdx < frames.length - 1 ? (
                      <>
                        <img src={`http://localhost:8000${frames[selectedFrameIdx+1].image_path}`} className="w-full h-full object-cover opacity-60" />
                        <span className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 text-xs font-mono">{frames[selectedFrameIdx+1].timestamp}s</span>
                      </>
                    ) : (
                      <span className="text-muted-foreground text-sm font-mono opacity-50">N/A</span>
                    )}
                  </div>
                </div>
              </div>

              {frames[selectedFrameIdx] && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-secondary/20 p-4 rounded-xl border border-border/50">
                  <div>
                    <h4 className="font-semibold text-sm mb-3">Frame Evidence ({frames[selectedFrameIdx].timestamp}s)</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex justify-between"><span className="text-muted-foreground">Visual (Fallback):</span> <span className="font-medium">{Math.round(frames[selectedFrameIdx].visual_score * 100)}%</span></li>
                      <li className="flex justify-between"><span className="text-muted-foreground">Temporal (Fallback):</span> <span className="font-medium">{Math.round(frames[selectedFrameIdx].temporal_score * 100)}%</span></li>
                      <li className="flex justify-between"><span className="text-muted-foreground">Motion (Fallback):</span> <span>{Math.round(frames[selectedFrameIdx].motion_score * 100)}%</span></li>
                      <li className="flex justify-between"><span className="text-muted-foreground">Overall Evidence:</span> <span className={frames[selectedFrameIdx].suspicion_level === 'HIGH' ? 'text-destructive font-bold' : ''}>{Math.round(frames[selectedFrameIdx].overall_evidence_score * 100)}% ({frames[selectedFrameIdx].suspicion_level})</span></li>
                      <li className="flex justify-between"><span className="text-muted-foreground">Explanation:</span> <span>{frames[selectedFrameIdx].reason}</span></li>
                    </ul>
                  </div>
                  <div className="flex flex-col gap-2">
                     <h4 className="font-semibold text-sm mb-1">Top Suspicious Frames</h4>
                     <div className="h-40 overflow-y-auto space-y-2 pr-2">
                        {top_evidence.map((f: any, i: number) => (
                          <div key={i} onClick={() => handleFrameClick(f.timestamp, frames.findIndex((fr:any) => fr.frame_number === f.frame_number))} className="p-2 border border-border/50 rounded cursor-pointer hover:bg-secondary/50 flex justify-between items-center">
                            <span className="text-sm font-mono">Frame {f.frame_number} ({f.timestamp}s)</span>
                            <span className={`text-xs ${f.suspicion_level === 'HIGH' ? 'text-destructive' : 'text-yellow-500'}`}>{f.suspicion_level}</span>
                          </div>
                        ))}
                     </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'audio' && (
          <div className="animate-in fade-in space-y-6">
            <div className="bg-card border border-border rounded-xl p-6">
              {!audio?.available ? (
                <div className="text-center p-10">
                  <h3 className="text-xl font-bold mb-2">Audio Forensics Unavailable</h3>
                  <p className="text-muted-foreground">Audio analysis was not performed because this video contains no usable audio stream.</p>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-xl font-bold">Audio Forensics</h3>
                      <p className="text-sm text-muted-foreground">Spectrogram analysis and fallback high-energy anomaly detection.</p>
                    </div>
                  </div>
                  
                  <audio ref={audioRef} src={`http://localhost:8000${audio.url}`} controls className="w-full mb-6" />

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs mb-1 font-mono text-muted-foreground">
                        <span>Spectrogram Visualization</span>
                      </div>
                      <div className="w-full bg-black border border-border rounded-lg relative overflow-hidden">
                        <img src={`http://localhost:8000${audio.spectrogram}`} className="w-full h-auto object-cover" />
                      </div>
                    </div>

                    {audio.segments?.map((seg: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center bg-secondary/30 p-4 rounded-xl border border-border">
                        <div>
                          <h4 className="font-semibold text-sm">Suspicious Segment</h4>
                          <p className="text-xs text-muted-foreground font-mono">{seg.start}s → {seg.end}s (Duration: {seg.duration}s)</p>
                          <p className="text-xs mt-1 text-destructive">{seg.reason}</p>
                        </div>
                        <button onClick={() => handleAudioSegmentClick(seg.start, seg.end)} className="bg-foreground text-background px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 hover:bg-foreground/90 transition-colors">
                          <PlayCircle size={16} /> PLAY SEGMENT
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {activeTab === 'cross-modal' && (
          <div className="animate-in fade-in">
             <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-xl font-bold mb-6">Cross-Modal Consistency Matrix</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <p className="text-sm text-muted-foreground mb-6">
                    Analysis of how available modalities agree or disagree across the video timeline.
                  </p>
                  <div className="space-y-6">
                    {evidenceData.map((ev, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="font-medium">{ev.name}</span>
                          <span className="font-mono">{ev.value}%</span>
                        </div>
                        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${ev.value > 70 ? 'bg-destructive' : 'bg-primary'}`} style={{ width: `${ev.value}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-secondary/20 p-6 rounded-xl border border-border flex flex-col justify-center items-center text-center">
                  <div className="w-24 h-24 rounded-full border-4 border-primary flex items-center justify-center mb-4 bg-primary/10">
                    <Layers size={40} className="text-primary" />
                  </div>
                  <h4 className="font-bold text-lg mb-2">Cross-Modal Analysis</h4>
                  <p className="text-sm text-muted-foreground">
                    {cross_modal_disagreement ? "The available evidence streams show partial disagreement, indicating potential anomalies across modalities." : "The modalities appear consistent within expected bounds."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;
