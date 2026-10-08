import { Search, Filter, Trash2, ShieldCheck, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const History = () => {
  const [history, setHistory] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8000/api/history')
      .then(res => res.json())
      .then(data => setHistory(data.reverse()))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold mb-2">Analysis History</h1>
          <p className="text-muted-foreground">Review previously analyzed videos and their forensic reports.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input type="text" placeholder="Search..." className="pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm" />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-secondary/30 border border-border rounded-lg text-sm font-medium hover:bg-secondary/50">
            <Filter size={16} /> Filter
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-secondary/20 border-b border-border">
            <tr>
              <th className="px-6 py-4 font-medium text-muted-foreground">Video</th>
              <th className="px-6 py-4 font-medium text-muted-foreground">Date</th>
              <th className="px-6 py-4 font-medium text-muted-foreground">Verdict</th>
              <th className="px-6 py-4 font-medium text-muted-foreground">Confidence</th>
              <th className="px-6 py-4 font-medium text-muted-foreground">Evidence</th>
              <th className="px-6 py-4 font-medium text-muted-foreground text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {history.map((item) => (
              <tr key={item.id} className="hover:bg-secondary/10 transition-colors group cursor-pointer" onClick={() => navigate(`/results/${item.id}`, { state: { resultData: item } })}>
                <td className="px-6 py-4">
                  <div className="block">
                    <div className="font-medium text-foreground">{item.source || item.video_url.split('/').pop()}</div>
                    <div className="text-xs text-muted-foreground">{item.duration}s</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-muted-foreground">{item.date}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {item.verdict === 'LIKELY AUTHENTIC' && <ShieldCheck size={16} className="text-green-500" />}
                    {item.verdict.includes('AI-GENERATED') && <AlertTriangle size={16} className="text-destructive" />}
                    <span className="font-medium">{item.verdict}</span>
                  </div>
                </td>
                <td className="px-6 py-4 font-mono">{item.confidence}%</td>
                <td className="px-6 py-4">{item.confidence > 70 ? 'High' : 'Low'}</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default History;
