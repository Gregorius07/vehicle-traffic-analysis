import { createSignal } from 'solid-js';

const UploadZone = (props) => {
  const [isDragging, setIsDragging] = createSignal(false);
  const [file, setFile] = createSignal(null);
  const [previewUrl, setPreviewUrl] = createSignal(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type.startsWith('video/')) {
        setFile(droppedFile);
        setPreviewUrl(URL.createObjectURL(droppedFile));
      }
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = e.target.files[0];
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
    }
  };

  const handleUpload = () => {
    if (file() && props.onUpload) {
      props.onUpload(file());
    }
  };

  return (
    <div class="glass-card rounded-3xl p-8 relative overflow-hidden">
      {/* Decorative gradient orb */}
      <div class="absolute top-0 right-0 w-64 h-64 bg-violet-600/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      
      <div class="relative z-10 flex flex-col md:flex-row gap-8 items-center">
        <div class="flex-1">
          <h2 class="text-2xl font-display font-bold text-white mb-2">Upload Video</h2>
          <p class="text-slate-400 text-sm md:text-base leading-relaxed">
            Upload traffic footage for AI analysis. Our YOLOv8 model will detect and count vehicles crossing the center virtual line automatically.
          </p>

          <div class="mt-4 p-4 rounded-xl bg-violet-500/10 border border-violet-500/20 text-sm text-slate-300 space-y-2">
            <h4 class="font-semibold text-violet-400 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
              Optimal Video Criteria
            </h4>
            <ul class="list-disc list-inside text-xs space-y-1 text-slate-400">
              <li><strong class="text-slate-300">Camera Angle:</strong> Elevated top-down or slight angle (drone/CCTV style).</li>
              <li><strong class="text-slate-300">Camera State:</strong> Must be strictly stationary (no panning or shaky footage).</li>
              <li><strong class="text-slate-300">Lighting:</strong> Clear daylight or well-lit night scenes for maximum accuracy.</li>
              <li><strong class="text-slate-300">Resolution:</strong> 720p to 1080p is recommended to balance speed and accuracy.</li>
            </ul>
          </div>
          
          <div class="mt-6 flex flex-wrap gap-2">
            <span class="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-300 flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-violet-400"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
              MP4, AVI, MOV
            </span>
            <span class="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-300 flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-400"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
              720p - 1080p Res
            </span>
          </div>
        </div>

        <div class="w-full md:w-[400px]">
          <div
            class={`relative border-2 border-dashed rounded-2xl p-6 transition-all duration-300 flex flex-col items-center justify-center text-center cursor-pointer group h-48
              ${isDragging() ? 'border-violet-500 bg-violet-500/10' : 'border-white/10 hover:border-violet-500/50 hover:bg-white/5 bg-[#0a0812]/50'}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById('video-upload').click()}
          >
            <input 
              id="video-upload" 
              type="file" 
              accept="video/*" 
              class="hidden" 
              onChange={handleChange}
            />

            {!file() ? (
              <>
                <div class="w-14 h-14 rounded-full bg-violet-500/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-violet-400">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" x2="12" y1="3" y2="15" />
                  </svg>
                </div>
                <h3 class="text-white font-medium mb-1">Click or drag video here</h3>
                <p class="text-xs text-slate-500 font-mono">Max size: 50MB</p>
              </>
            ) : (
              <div class="w-full flex flex-col items-center">
                <div class="w-full h-24 mb-3 rounded-lg overflow-hidden relative border border-white/10 bg-black/50">
                   <video src={previewUrl()} class="w-full h-full object-cover" muted playsinline></video>
                   <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end justify-center pb-2">
                      <h3 class="text-white font-medium truncate px-4 text-sm">{file().name}</h3>
                   </div>
                </div>
                <p class="text-xs text-slate-400 font-mono mb-4 w-full flex justify-between px-2">
                  <span>{(file().size / (1024 * 1024)).toFixed(2)} MB</span>
                  <span class="text-emerald-400 font-semibold text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded-full">Ready</span>
                </p>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleUpload(); }}
                  disabled={props.isLoading}
                  class="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-semibold rounded-xl shadow-[0_0_15px_rgba(109,40,217,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {props.isLoading ? (
                    <>
                      <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    'Analyze Now'
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadZone;
