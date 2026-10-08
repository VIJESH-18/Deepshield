const Methodology = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-2">Model & Methodology</h1>
        <p className="text-muted-foreground">A modality-aware, evidence-oriented multimodal forensic architecture.</p>
      </div>
      
      <div className="prose prose-invert max-w-none">
        <p>
          DeepShield is designed to provide a comprehensive, evidence-aware analysis of potential video manipulation. Unlike systems that rely solely on facial analysis, DeepShield models cross-modal interactions between visual, audio, motion, and temporal features.
        </p>

        <h3>Available Modalities & Models</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mt-6">
          <div className="bg-card border border-border p-6 rounded-xl">
            <h4 className="font-semibold mb-2">Visual Branch</h4>
            <p className="text-sm text-muted-foreground mb-4">Analyzes frame-level spatial features for artifacts.</p>
            <div className="flex justify-between items-center text-sm border-t border-border pt-2">
              <span>Model: <span className="font-mono bg-secondary/50 px-1 rounded">VideoMAE</span></span>
              <span className="text-green-500 text-xs font-medium">Loaded</span>
            </div>
          </div>
          
          <div className="bg-card border border-border p-6 rounded-xl">
            <h4 className="font-semibold mb-2">Audio Branch</h4>
            <p className="text-sm text-muted-foreground mb-4">Analyzes spectral and waveform characteristics.</p>
            <div className="flex justify-between items-center text-sm border-t border-border pt-2">
              <span>Model: <span className="font-mono bg-secondary/50 px-1 rounded">WavLM</span></span>
              <span className="text-green-500 text-xs font-medium">Loaded</span>
            </div>
          </div>
          
          <div className="bg-card border border-border p-6 rounded-xl">
            <h4 className="font-semibold mb-2">Temporal Branch</h4>
            <p className="text-sm text-muted-foreground mb-4">Analyzes frame continuity and sequence consistency.</p>
            <div className="flex justify-between items-center text-sm border-t border-border pt-2">
              <span>Model: <span className="font-mono bg-secondary/50 px-1 rounded">Transformer</span></span>
              <span className="text-green-500 text-xs font-medium">Loaded</span>
            </div>
          </div>
          
          <div className="bg-card border border-border p-6 rounded-xl">
            <h4 className="font-semibold mb-2">Motion Branch</h4>
            <p className="text-sm text-muted-foreground mb-4">Evaluates optical flow and motion vectors.</p>
            <div className="flex justify-between items-center text-sm border-t border-border pt-2">
              <span>Method: <span className="font-mono bg-secondary/50 px-1 rounded">Optical Flow</span></span>
              <span className="text-green-500 text-xs font-medium">Available</span>
            </div>
          </div>
        </div>

        <h3 className="mt-12">Cross-Modal Fusion & Gating</h3>
        <p>
          DeepShield implements a cross-modal transformer layer that calculates consistency across available modalities. A learnable feature gating mechanism (using Gumbel-Softmax) dynamically selects the most reliable forensic evidence for the final classifier.
        </p>

        <h3 className="mt-12">Non-Facial Fallback</h3>
        <p>
          A core capability of this architecture is the graceful handling of videos without visible faces or low-quality facial data. When facial evidence is insufficient, the system activates the fallback mode, relying purely on visual context, temporal progression, motion consistency, and audio forensics.
        </p>
      </div>
    </div>
  );
};

export default Methodology;
