import { createSignal, createEffect, onCleanup } from 'solid-js';
import Swal from 'sweetalert2';
import { api } from '../api';
import UploadZone from '../components/UploadZone';
import StatsCards from '../components/StatsCards';
import TrafficChart from '../components/TrafficChart';
import VehicleTable from '../components/VehicleTable';
import StatusBadge from '../components/StatusBadge';

const Dashboard = () => {
  const [isUploading, setIsUploading] = createSignal(false);
  const [currentVideoId, setCurrentVideoId] = createSignal(null);
  const [results, setResults] = createSignal(null);
  let pollInterval;

  createEffect(() => {
    const hash = window.location.hash.replace('#', '');
    const [path, id] = hash.split('/');
    if (path === 'dashboard' && id) {
      const numId = parseInt(id);
      if (numId && numId !== currentVideoId()) {
        setCurrentVideoId(numId);
        startPolling(numId);
      }
    }
  });

  const handleUpload = async (file) => {
    try {
      setIsUploading(true);
      const res = await api.uploadVideo(file);
      
      Swal.fire({
        toast: true, position: 'top-end', icon: 'success',
        title: 'Video uploaded successfully!', showConfirmButton: false, timer: 3000,
        background: '#1e1b2e', color: '#fff'
      });
      
      window.location.hash = `#dashboard/${res.video_id}`;
    } catch (error) {
      Swal.fire({
        toast: true, position: 'top-end', icon: 'error',
        title: 'Upload failed', text: error.message, showConfirmButton: false, timer: 3000,
        background: '#1e1b2e', color: '#fff'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const startPolling = (id) => {
    if (pollInterval) clearInterval(pollInterval);
    
    const fetchResults = async () => {
      try {
        const data = await api.getResults(id);
        setResults(data);
        
        if (data.status === 'completed') {
          clearInterval(pollInterval);
          Swal.fire({
            toast: true, position: 'bottom-end', icon: 'success',
            title: 'Analysis Complete!', showConfirmButton: false, timer: 3000,
            background: '#1e1b2e', color: '#fff'
          });
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    };

    fetchResults(); // initial fetch
    pollInterval = setInterval(fetchResults, 2000); // Poll every 2s
  };

  onCleanup(() => {
    if (pollInterval) clearInterval(pollInterval);
  });

  return (
    <div class="space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">
      <header class="mb-8">
        <h2 class="text-3xl font-display font-bold text-white tracking-tight">Overview</h2>
        <p class="text-slate-400 mt-1">Real-time AI vehicle tracking and flow analysis.</p>
      </header>
      
      {/* Upload Section */}
      <UploadZone onUpload={handleUpload} isLoading={isUploading()} />
      
      {/* Results Section */}
      {currentVideoId() && (
        <div class="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 fill-mode-both">
          <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 glass-panel rounded-2xl p-4">
            <div>
              <p class="text-sm text-slate-400 mb-1">Status Report: <span class="font-mono text-white ml-2">{results()?.filename || `Video #${currentVideoId()}`}</span></p>
              <div class="flex items-center gap-2">
                <StatusBadge status={results()?.status || 'pending'} />
                {results()?.status === 'pending' && (
                  <span class="text-xs text-amber-400 animate-pulse">Initializing Model...</span>
                )}
                {results()?.status === 'processing' && (
                  <span class="text-xs text-blue-400 animate-pulse flex items-center gap-1">
                    <span class="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span> Live Real-time Analysis
                  </span>
                )}
              </div>
            </div>
            
            <div class="flex gap-3">
              <button class="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Export CSV
              </button>
            </div>
          </div>

          <StatsCards results={results()} />

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="lg:col-span-2 relative">
              <TrafficChart results={results()} />
              {results()?.status === 'pending' && (
                <div class="absolute inset-0 bg-[#0a0812]/60 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
                   <div class="flex flex-col items-center">
                    <div class="w-12 h-12 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mb-4" />
                    <p class="text-amber-300 font-medium">Initializing YOLOv8 Model...</p>
                    <p class="text-slate-400 text-xs mt-1">Allocating memory and loading weights</p>
                   </div>
                </div>
              )}
            </div>
            <div class="lg:col-span-1 border-white/5 relative">
              <VehicleTable results={results()} />
               {results()?.status === 'pending' && (
                <div class="absolute inset-0 bg-[#0a0812]/60 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
