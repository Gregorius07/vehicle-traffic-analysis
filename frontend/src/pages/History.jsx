import { createSignal, onMount } from 'solid-js';
import { api } from '../api';
import StatusBadge from '../components/StatusBadge';

const History = () => {
  const [history, setHistory] = createSignal([]);
  const [isLoading, setIsLoading] = createSignal(true);

  onMount(async () => {
    try {
      const data = await api.getHistory();
      setHistory(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <header class="mb-8">
        <h2 class="text-3xl font-display font-bold text-white tracking-tight">Processing History</h2>
        <p class="text-slate-400 mt-1">Review previously analyzed video footages and their generated traffic statistics.</p>
      </header>

      <div class="glass-card rounded-3xl overflow-hidden relative">
        <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        {isLoading() ? (
          <div class="p-12 flex justify-center items-center">
            <div class="w-8 h-8 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
          </div>
        ) : history().length === 0 ? (
          <div class="p-16 flex flex-col items-center justify-center text-center">
            <div class="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6 text-slate-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            </div>
            <h3 class="text-white font-semibold text-lg mb-2">No history records found</h3>
            <p class="text-slate-400 max-w-sm">You haven't processed any traffic footage yet. Head over to the Dashboard to upload your first video.</p>
          </div>
        ) : (
          <div class="overflow-x-auto relative z-10">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-white/[0.04]">
                  <th class="py-5 px-6 text-xs font-semibold uppercase tracking-wider text-slate-300 border-b border-white/10 w-16 text-center">ID</th>
                  <th class="py-5 px-6 text-xs font-semibold uppercase tracking-wider text-slate-300 border-b border-white/10">Filename</th>
                  <th class="py-5 px-6 text-xs font-semibold uppercase tracking-wider text-slate-300 border-b border-white/10">Date Processed</th>
                  <th class="py-5 px-6 text-xs font-semibold uppercase tracking-wider text-slate-300 border-b border-white/10">Status</th>
                  <th class="py-5 px-6 text-xs font-semibold uppercase tracking-wider text-slate-300 border-b border-white/10 text-right">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5">
                {history().map((item) => (
                  <tr class="hover:bg-white/[0.02] transition-colors group">
                    <td class="py-5 px-6 text-slate-400 font-mono text-center">#{item.id}</td>
                    <td class="py-5 px-6">
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="m10 13 4 4"/><path d="m14 13-4 4"/></svg>
                        </div>
                        <span class="text-slate-200 font-medium group-hover:text-white transition-colors">{item.filename}</span>
                      </div>
                    </td>
                    <td class="py-5 px-6 text-slate-400 font-mono text-sm">{item.date}</td>
                    <td class="py-5 px-6">
                      <StatusBadge status={item.status} />
                    </td>
                    <td class="py-5 px-6 text-right">
                       <a 
                         href={`#dashboard/${item.id}`}
                         class="inline-flex px-4 py-2 rounded-lg bg-white/5 hover:bg-violet-500/20 text-slate-300 hover:text-violet-300 text-sm font-medium transition-all opacity-0 group-hover:opacity-100 items-center justify-end gap-2 ml-auto"
                       >
                         View Details
                         <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                       </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
