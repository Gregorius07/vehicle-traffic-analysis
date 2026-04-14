const Sidebar = (props) => {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect width="7" height="9" x="3" y="3" rx="1" />
          <rect width="7" height="5" x="14" y="3" rx="1" />
          <rect width="7" height="9" x="14" y="12" rx="1" />
          <rect width="7" height="5" x="3" y="16" rx="1" />
        </svg>
      )
    },
    {
      id: 'history',
      label: 'History',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
          <path d="M12 7v5l4 2" />
        </svg>
      )
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )
    }
  ];

  return (
    <aside class="w-20 md:w-64 h-full border-r border-white/5 bg-[#0a0812]/50 backdrop-blur-xl flex flex-col transition-all duration-300 z-20">
      <div class="h-20 flex items-center justify-center md:justify-start md:px-6 border-b border-white/5">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(139,92,246,0.5)]">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
             <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
             <polyline points="17 2 12 7 7 2" />
             <circle cx="12" cy="14" r="3" />
             <line x1="12" y1="14" x2="12.01" y2="14" stroke-width="4" />
          </svg>
        </div>
        <div class="ml-3 hidden md:block">
          <h1 class="font-display font-bold text-[17px] tracking-tight text-white leading-tight">Traffic<br/><span class="text-violet-400">Analyzer</span></h1>
        </div>
      </div>

      <nav class="flex-1 py-6 flex flex-col gap-2 px-3 md:px-4">
        {navItems.map(item => (
          <a
            href={`#${item.id}`}
            class={`flex items-center gap-3 px-3 py-3 md:py-3.5 rounded-xl transition-all duration-200 group relative overflow-hidden ${
              props.currentPage === item.id 
                ? 'bg-violet-500/10 text-white' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
            }`}
          >
            {props.currentPage === item.id && (
              <div class="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-transparent opacity-50" />
            )}
            {props.currentPage === item.id && (
              <div class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full bg-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.8)]" />
            )}
            
            <div class={`relative z-10 flex items-center justify-center w-6 h-6 transition-transform group-hover:scale-110 ${
              props.currentPage === item.id ? 'text-violet-400' : ''
            }`}>
              {item.icon}
            </div>
            
            <span class="font-medium hidden md:block relative z-10">{item.label}</span>
          </a>
        ))}
      </nav>

      <div class="p-4 border-t border-white/5 hidden md:flex items-center gap-3">
        <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
        <span class="text-xs text-slate-400 font-medium font-mono">System Online</span>
      </div>
    </aside>
  );
};

export default Sidebar;
