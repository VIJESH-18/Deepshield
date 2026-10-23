import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Download, 
  ExternalLink, 
  ShieldCheck, 
  AlertTriangle, 
  Search, 
  Calendar, 
  Clock, 
  Eye, 
  RotateCw,
  FileCheck,
  PlaySquare
} from 'lucide-react';

interface ReportItem {
  id: string;
  date: string;
  verdict: string;
  confidence: number;
  pdf_url: string;
  video_url: string;
  duration?: number;
  source?: string | null;
  [key: string]: any;
}

const Reports = () => {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVerdict, setFilterVerdict] = useState<'all' | 'manipulated' | 'authentic'>('all');
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchReports = () => {
    setLoading(true);
    fetch('http://localhost:8000/api/history')
      .then(res => res.json())
      .then((data: ReportItem[]) => {
        setReports(data.reverse());
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch reports history:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const filteredReports = reports.filter(item => {
    const isManipulated = item.verdict.includes('AI-GENERATED') || item.verdict.includes('MANIPULATED');
    if (filterVerdict === 'manipulated' && !isManipulated) return false;
    if (filterVerdict === 'authentic' && isManipulated) return false;

    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const sourceName = item.source || item.video_url.split('/').pop() || '';
    return (
      item.id.toLowerCase().includes(term) ||
      item.verdict.toLowerCase().includes(term) ||
      sourceName.toLowerCase().includes(term) ||
      item.date.includes(term)
    );
  });

  const totalReports = reports.length;
  const manipulatedCount = reports.filter(r => r.verdict.includes('AI-GENERATED') || r.verdict.includes('MANIPULATED')).length;
  const authenticCount = reports.filter(r => r.verdict.includes('AUTHENTIC')).length;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#606C38]/10 text-[#606C38] text-[11px] font-tech font-bold uppercase tracking-wider mb-2">
            <FileCheck size={13} />
            Forensic Intelligence Dossiers
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#283618]">Forensic Reports</h1>
          <p className="text-sm text-muted-foreground">
            Access, preview, and download official PDF forensic reports generated for every analyzed video.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchReports}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border text-xs font-bold text-[#283618] hover:bg-[#283618]/5 transition-colors shadow-sm"
          >
            <RotateCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => navigate('/analyze')}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#283618] hover:bg-[#606C38] text-[#FEFAE0] text-xs font-bold transition-all shadow-md"
          >
            <PlaySquare size={14} className="text-[#DDA15E]" />
            <span>New Analysis</span>
          </button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass p-5 flex items-center justify-between border border-[#283618]/10">
          <div>
            <div className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider">Total Reports</div>
            <div className="text-3xl font-display font-extrabold text-[#283618] mt-1">{totalReports}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#283618]/5 flex items-center justify-center text-[#283618]">
            <FileText size={24} />
          </div>
        </div>

        <div className="glass p-5 flex items-center justify-between border border-[#283618]/10">
          <div>
            <div className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider">Manipulated / Deepfakes</div>
            <div className="text-3xl font-display font-extrabold text-[#BC6C25] mt-1">{manipulatedCount}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#BC6C25]/10 flex items-center justify-center text-[#BC6C25]">
            <AlertTriangle size={24} />
          </div>
        </div>

        <div className="glass p-5 flex items-center justify-between border border-[#283618]/10">
          <div>
            <div className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider">Verified Authentic</div>
            <div className="text-3xl font-display font-extrabold text-[#606C38] mt-1">{authenticCount}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#606C38]/10 flex items-center justify-center text-[#606C38]">
            <ShieldCheck size={24} />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <input
            type="text"
            placeholder="Search by ID, video name, or verdict..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl text-xs font-mono placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-[#606C38]"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-[#283618]/5 rounded-xl border border-border self-start sm:self-auto">
          <button
            onClick={() => setFilterVerdict('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterVerdict === 'all' ? 'bg-card text-[#283618] shadow-sm' : 'text-muted-foreground hover:text-[#283618]'
            }`}
          >
            All ({totalReports})
          </button>
          <button
            onClick={() => setFilterVerdict('manipulated')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterVerdict === 'manipulated' ? 'bg-[#BC6C25] text-[#FEFAE0] shadow-sm' : 'text-muted-foreground hover:text-[#283618]'
            }`}
          >
            Manipulated ({manipulatedCount})
          </button>
          <button
            onClick={() => setFilterVerdict('authentic')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterVerdict === 'authentic' ? 'bg-[#606C38] text-[#FEFAE0] shadow-sm' : 'text-muted-foreground hover:text-[#283618]'
            }`}
          >
            Authentic ({authenticCount})
          </button>
        </div>
      </div>

      {/* Reports List */}
      {loading ? (
        <div className="glass p-16 text-center text-muted-foreground flex flex-col items-center justify-center space-y-3">
          <RotateCw size={28} className="animate-spin text-[#606C38]" />
          <p className="text-sm font-medium">Loading forensic reports dossiers...</p>
        </div>
      ) : filteredReports.length === 0 ? (
        <div className="glass p-16 text-center space-y-4 border border-[#283618]/10">
          <div className="w-16 h-16 rounded-2xl bg-[#606C38]/10 text-[#606C38] flex items-center justify-center mx-auto">
            <FileText size={32} />
          </div>
          <div className="space-y-1">
            <h3 className="font-display font-bold text-lg text-[#283618]">No Forensic Reports Found</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              {searchTerm || filterVerdict !== 'all' 
                ? 'No reports match your current search criteria. Try resetting the filters.' 
                : 'Run an analysis on any video to automatically generate tamper-evident PDF dossiers.'}
            </p>
          </div>
          <div>
            <button
              onClick={() => navigate('/analyze')}
              className="px-6 py-2.5 rounded-xl bg-[#283618] text-[#FEFAE0] text-xs font-bold hover:bg-[#606C38] transition-colors shadow-md"
            >
              Analyze Your First Video
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReports.map((item) => {
            const isManipulated = item.verdict.includes('AI-GENERATED') || item.verdict.includes('MANIPULATED');
            const pdfFullUrl = `http://localhost:8000${item.pdf_url}`;
            const videoFilename = item.source || item.video_url.split('/').pop() || 'Uploaded Video';

            return (
              <div 
                key={item.id} 
                className="glass p-6 border border-[#283618]/10 hover:border-[#606C38]/40 transition-all duration-200 rounded-2xl shadow-sm hover:shadow-md"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  
                  {/* Left: ID & Video details */}
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                      isManipulated ? 'bg-[#BC6C25]/15 text-[#BC6C25]' : 'bg-[#606C38]/15 text-[#606C38]'
                    }`}>
                      <FileText size={24} />
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono font-bold text-xs bg-[#283618]/5 text-[#283618] px-2.5 py-0.5 rounded-md">
                          {item.id}
                        </span>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold ${
                          isManipulated 
                            ? 'bg-[#BC6C25]/15 text-[#BC6C25] border border-[#BC6C25]/25' 
                            : 'bg-[#606C38]/15 text-[#606C38] border border-[#606C38]/25'
                        }`}>
                          {isManipulated ? <AlertTriangle size={12} /> : <ShieldCheck size={12} />}
                          {item.verdict}
                        </span>
                      </div>

                      <h3 className="font-display font-bold text-base text-[#283618] pt-1">
                        {videoFilename}
                      </h3>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground font-mono pt-1">
                        <span className="flex items-center gap-1">
                          <Calendar size={13} /> {item.date}
                        </span>
                        {item.duration && (
                          <span className="flex items-center gap-1">
                            <Clock size={13} /> {Math.round(item.duration)}s duration
                          </span>
                        )}
                        <span className="font-bold text-[#283618]">
                          Evidence Confidence: {item.confidence}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-center">
                    
                    {/* Preview inside modal */}
                    <button
                      onClick={() => setSelectedPdf(pdfFullUrl)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-card border border-border text-xs font-bold text-[#283618] hover:bg-[#283618]/5 transition-colors shadow-sm"
                    >
                      <Eye size={14} className="text-[#606C38]" />
                      <span>Preview PDF</span>
                    </button>

                    {/* Open in new tab */}
                    <a
                      href={pdfFullUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-card border border-border text-xs font-bold text-[#283618] hover:bg-[#283618]/5 transition-colors shadow-sm"
                    >
                      <ExternalLink size={14} />
                      <span>Open Tab</span>
                    </a>

                    {/* Download directly */}
                    <a
                      href={pdfFullUrl}
                      download={`${item.id}_report.pdf`}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#283618] hover:bg-[#606C38] text-[#FEFAE0] text-xs font-bold transition-all shadow-md"
                    >
                      <Download size={14} className="text-[#DDA15E]" />
                      <span>Download PDF</span>
                    </a>

                    {/* Jump to results view */}
                    <button
                      onClick={() => navigate(`/results/${item.id}`, { state: { resultData: item } })}
                      className="px-3 py-2 text-xs font-bold text-muted-foreground hover:text-[#283618] transition-colors"
                    >
                      Evidence Lab →
                    </button>

                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Embedded PDF Preview Modal */}
      {selectedPdf && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-5xl h-[85vh] rounded-2xl border border-border flex flex-col overflow-hidden shadow-2xl">
            
            <div className="flex items-center justify-between p-4 border-b border-border bg-[#283618] text-[#FEFAE0]">
              <div className="flex items-center gap-2">
                <FileCheck size={18} className="text-[#DDA15E]" />
                <span className="font-bold text-sm">DeepShield Forensic Dossier Preview</span>
              </div>
              <div className="flex items-center gap-3">
                <a 
                  href={selectedPdf} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-[#FEFAE0]/80 hover:text-[#FEFAE0] underline"
                >
                  Open in New Tab
                </a>
                <button
                  onClick={() => setSelectedPdf(null)}
                  className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold transition-colors"
                >
                  Close ✕
                </button>
              </div>
            </div>

            <div className="flex-1 bg-neutral-900">
              <iframe
                src={selectedPdf}
                className="w-full h-full border-0"
                title="Forensic PDF Report"
              />
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Reports;
