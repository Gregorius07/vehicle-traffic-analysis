const StatsCards = (props) => {
  const { results } = props;
  
  if (!results) return null;

  const totalIn = Object.values(results.data.masuk).reduce((a, b) => a + b, 0);
  const totalOut = Object.values(results.data.keluar).reduce((a, b) => a + b, 0);
  const total = totalIn + totalOut;

  const cards = [
    {
      title: 'Total Vehicles',
      value: total,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-violet-400"><path d="M14 19a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"/><path d="M8 19H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-4"/><path d="M2 9V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2"/></svg>
      ),
      bg: 'from-violet-500/20 to-indigo-500/5',
      border: 'border-violet-500/20'
    },
    {
      title: 'Total Entry (Masuk)',
      value: totalIn,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-400"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
      ),
      bg: 'from-emerald-500/20 to-teal-500/5',
      border: 'border-emerald-500/20'
    },
    {
      title: 'Total Exit (Keluar)',
      value: totalOut,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-rose-400"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
      ),
      bg: 'from-rose-500/20 to-pink-500/5',
      border: 'border-rose-500/20'
    },
    {
      title: 'Dominant Type',
      value: (() => {
        const types = ['car', 'motorcycle', 'bus', 'truck'];
        let max = 0;
        let dominant = '-';
        types.forEach(t => {
          const sum = results.data.masuk[t] + results.data.keluar[t];
          if (sum > max) { max = sum; dominant = t; }
        });
        return dominant.charAt(0).toUpperCase() + dominant.slice(1);
      })(),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-amber-400"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
      ),
      bg: 'from-amber-500/20 to-orange-500/5',
      border: 'border-amber-500/20'
    }
  ];

  return (
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
      {cards.map((c) => (
        <div class={`glass-card rounded-2xl p-6 relative overflow-hidden group`}>
          <div class={`absolute inset-0 bg-linear-to-br ${c.bg} opacity-50 group-hover:opacity-100 transition-opacity duration-300`} />
          <div class="relative z-10">
            <div class={`w-12 h-12 rounded-xl border ${c.border} bg-[#0a0812]/50 flex items-center justify-center mb-4`}>
              {c.icon}
            </div>
            <p class="text-slate-400 text-sm font-medium mb-1">{c.title}</p>
            <h3 class="text-3xl font-display font-bold text-white tracking-tight">{c.value}</h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
