const StatusBadge = (props) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'pending':
        return {
          bg: 'bg-amber-500/10',
          border: 'border-amber-500/20',
          text: 'text-amber-400',
          dot: 'bg-amber-500',
          label: 'Pending'
        };
      case 'processing':
        return {
          bg: 'bg-blue-500/10',
          border: 'border-blue-500/20',
          text: 'text-blue-400',
          dot: 'bg-blue-500 animate-pulse',
          label: 'Processing'
        };
      case 'completed':
        return {
          bg: 'bg-emerald-500/10',
          border: 'border-emerald-500/20',
          text: 'text-emerald-400',
          dot: 'bg-emerald-500',
          label: 'Completed'
        };
      default:
        return {
          bg: 'bg-slate-500/10',
          border: 'border-slate-500/20',
          text: 'text-slate-400',
          dot: 'bg-slate-500',
          label: status || 'Unknown'
        };
    }
  };

  const config = getStatusConfig(props.status);

  return (
    <div class={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${config.bg} ${config.border} ${config.text} text-xs font-semibold uppercase tracking-wider backdrop-blur-sm`}>
      <span class={`w-1.5 h-1.5 rounded-full ${config.dot} shadow-[0_0_5px_currentColor]`}></span>
      {config.label}
    </div>
  );
};

export default StatusBadge;
