import { createSignal, onMount } from 'solid-js';
import Swal from 'sweetalert2';
import { api } from '../api';

const Settings = () => {
  const [confidence, setConfidence] = createSignal(0.4);
  const [modelType, setModelType] = createSignal('yolov8n');
  const [isSaving, setIsSaving] = createSignal(false);
  const [isLoading, setIsLoading] = createSignal(true);

  onMount(async () => {
    try {
      const data = await api.getSettings();
      setConfidence(data.confidence);
      setModelType(data.model_size);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  });

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await api.saveSettings({
        confidence: parseFloat(confidence()),
        model_size: modelType()
      });
      Swal.fire({
        toast: true, position: 'top-end', icon: 'success',
        title: 'Settings saved successfully', showConfirmButton: false, timer: 3000,
        background: '#1e1b2e', color: '#fff'
      });
    } catch (err) {
      Swal.fire({
        toast: true, position: 'top-end', icon: 'error',
        title: 'Failed to save settings', showConfirmButton: false, timer: 3000,
        background: '#1e1b2e', color: '#fff'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const models = [
    { id: 'yolov8n', name: 'Nano (yolov8n)', desc: 'Fastest parsing, suitable for real-time with lower accuracy. Recommended for most use cases.', color: 'emerald' },
    { id: 'yolov8s', name: 'Small (yolov8s)', desc: 'Good balance between speed and precision. Ideal for standard footage.', color: 'blue' },
    { id: 'yolov8m', name: 'Medium (yolov8m)', desc: 'High accuracy, slower processing. Best for complex scenes with difficult angles.', color: 'violet' }
  ];

  return (
    <div class="space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">
      <header class="mb-8">
        <h2 class="text-3xl font-display font-bold text-white tracking-tight">System Settings</h2>
        <p class="text-slate-400 mt-1">Configure YOLOv8 AI model behavior to balance speed and accuracy.</p>
      </header>
      
      {isLoading() ? (
        <div class="flex justify-center items-center py-20">
          <div class="w-8 h-8 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
        </div>
      ) : (
        <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div class="xl:col-span-2 space-y-6">
            
            {/* Confidence Settings */}
            <div class="glass-card rounded-3xl p-8 relative overflow-hidden group">
              <div class="absolute inset-0 bg-gradient-to-r from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div class="relative z-10">
                <div class="flex items-center gap-3 mb-6">
                  <div class="w-10 h-10 rounded-xl bg-violet-500/20 text-violet-400 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                  </div>
                  <div>
                    <h3 class="text-xl font-display font-semibold text-white">Confidence Threshold</h3>
                    <p class="text-sm text-slate-400">Minimum probability required for a detection.</p>
                  </div>
                </div>

                <div class="bg-black/20 rounded-2xl p-6 border border-white/5">
                  <div class="flex justify-between items-end mb-4">
                     <span class="text-3xl font-bold font-mono text-white tracking-tight">{confidence()}</span>
                     <span class="text-slate-400 text-sm">Valid range: 0.1 to 1.0</span>
                  </div>
                  
                  <input 
                    type="range" 
                    min="0.1" 
                    max="1.0" 
                    step="0.05" 
                    value={confidence()}
                    onInput={(e) => setConfidence(e.target.value)}
                    class="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-violet-500"
                  />
                  <div class="flex justify-between mt-2 text-xs text-slate-500 font-medium font-mono">
                    <span>Low (More false positives)</span>
                    <span>Strict (More false negatives)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Model Architecture Settings */}
            <div class="glass-card rounded-3xl p-8 relative overflow-hidden">
               <div class="flex items-center gap-3 mb-6">
                  <div class="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 7h10"/><path d="M7 12h10"/><path d="M7 17h10"/></svg>
                  </div>
                  <div>
                    <h3 class="text-xl font-display font-semibold text-white">YOLO Model Variant</h3>
                    <p class="text-sm text-slate-400">Select the underlying neural network size.</p>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {models.map(m => (
                    <label 
                      class={`cursor-pointer border rounded-2xl p-5 transition-all duration-300 relative overflow-hidden
                        ${modelType() === m.id 
                          ? `border-${m.color}-500 bg-${m.color}-500/10` 
                          : 'border-white/10 bg-black/20 hover:bg-white/5'
                        }`}
                    >
                      <input 
                        type="radio" 
                        name="modelType" 
                        value={m.id} 
                        checked={modelType() === m.id}
                        onChange={(e) => setModelType(e.target.value)}
                        class="hidden"
                      />
                      {modelType() === m.id && (
                        <div class={`absolute top-0 right-0 w-16 h-16 bg-${m.color}-500/20 rounded-full blur-xl -translate-y-1/2 translate-x-1/2`} />
                      )}
                      <div class="flex items-center justify-between mb-3 relative z-10">
                        <span class={`font-bold text-${modelType() === m.id ? 'white' : 'slate-300'}`}>{m.name}</span>
                        {modelType() === m.id && (
                          <div class={`w-5 h-5 rounded-full bg-${m.color}-500 flex items-center justify-center text-[#0a0812]`}>
                             <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                          </div>
                        )}
                      </div>
                      <p class="text-xs text-slate-400 leading-relaxed text-balance">{m.desc}</p>
                    </label>
                  ))}
                </div>
            </div>

            <div class="flex justify-end pt-4">
               <button 
                onClick={handleSave}
                disabled={isSaving()}
                class="px-8 py-3 bg-white text-[#0a0812] hover:bg-slate-200 font-bold rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all flex items-center gap-2 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving() ? (
                  <>
                    <div class="w-4 h-4 border-2 border-slate-800/30 border-t-slate-800 rounded-full animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                   <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                    Apply Settings
                  </>
                )}
              </button>
            </div>

          </div>

          <div class="xl:col-span-1">
             <div class="glass-card rounded-3xl p-6 border-l-4 border-l-violet-500">
                <h4 class="text-white font-semibold flex items-center gap-2 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-amber-400"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                  Important Note
                </h4>
                <div class="space-y-4 text-sm text-slate-400">
                  <p>Changes made here apply to <strong>future uploads only</strong>. Currently processing videos will use the settings that were active when they were uploaded.</p>
                  <p>Using higher accuracy models like <span class="text-slate-300 font-mono">yolov8m</span> will significantly increase processing time, especially on systems without dedicated GPUs.</p>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
