const VehicleTable = (props) => {
  return (
    <div class="glass-card rounded-2xl p-0 overflow-hidden">
      <div class="p-6 border-b border-white/5">
        <h3 class="text-white font-display font-semibold text-lg flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-violet-400"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="3" x2="21" y1="9" y2="9"/><line x1="3" x2="21" y1="15" y2="15"/><line x1="9" x2="9" y1="9" y2="21"/><line x1="15" x2="15" y1="9" y2="21"/></svg>
          Detailed Breakdown
        </h3>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-white/[0.02]">
              <th class="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-white/5 w-1/4">Vehicle Type</th>
              <th class="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-white/5 text-center">Entry (Masuk)</th>
              <th class="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-white/5 text-center">Exit (Keluar)</th>
              <th class="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-white/5 text-end">Total</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/5">
            {!props.results ? (
              <tr>
                <td colspan="4" class="py-8 text-center text-slate-500">No data available</td>
              </tr>
            ) : (
              ['car', 'motorcycle', 'bus', 'truck'].map((type) => {
                const masuk = props.results.data.masuk[type];
                const keluar = props.results.data.keluar[type];
                const total = masuk + keluar;
                
                return (
                  <tr class="hover:bg-white/[0.02] transition-colors">
                    <td class="py-4 px-6">
                      <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                          {/* Basic icons for vehicle types */}
                          {type === 'car' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a2 2 0 0 0-1.6-.8H8.3a2 2 0 0 0-1.6.8L4 11l-5.16.86a1 1 0 0 0-.84.99V16h3m3 0a3 3 0 1 0 6 0m-6 0a3 3 0 1 1-6 0m14 0a3 3 0 1 0 6 0"/></svg>}
                          {type === 'motorcycle' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="5" cy="16" r="3"/><circle cx="19" cy="16" r="3"/><path d="M5 13 9 5h4l2.5 5H21"/><path d="m14 16-1-4"/></svg>}
                          {type === 'bus' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="16" x="4" y="4" rx="2"/><path d="M4 11h16"/><path d="M8 15h.01"/><path d="M16 15h.01"/><path d="M6 19v2"/><path d="M18 19v2"/></svg>}
                          {type === 'truck' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 17h4V5H2v12h3"/><path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5v8h2"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>}
                        </div>
                        <span class="text-sm font-medium text-slate-200 capitalize">{type}</span>
                      </div>
                    </td>
                    <td class="py-4 px-6 text-center">
                      <span class="inline-flex items-center px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 text-xs font-mono">
                        {masuk}
                      </span>
                    </td>
                    <td class="py-4 px-6 text-center">
                      <span class="inline-flex items-center px-2 py-1 rounded bg-rose-500/10 text-rose-400 text-xs font-mono">
                        {keluar}
                      </span>
                    </td>
                    <td class="py-4 px-6 text-end">
                      <span class="text-white font-semibold">{total}</span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VehicleTable;
