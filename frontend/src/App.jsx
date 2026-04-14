import { createSignal, onMount } from 'solid-js';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import Settings from './pages/Settings';

function App() {
  const [currentPage, setCurrentPage] = createSignal('dashboard');

  onMount(() => {
    const handleHashChange = () => {
      let hash = window.location.hash.replace('#', '');
      let basePath = hash.split('/')[0] || 'dashboard';
      if (['dashboard', 'history', 'settings'].includes(basePath)) {
        setCurrentPage(basePath);
      }
    };
    
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Init
    
    return () => window.removeEventListener('hashchange', handleHashChange);
  });

  return (
    <div class="flex h-screen w-full relative overflow-hidden bg-[#07050f]">
      {/* Dynamic Background Glow */}
      <div class="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />
      <div class="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
      
      <Sidebar currentPage={currentPage()} />
      
      <main class="flex-1 h-full overflow-y-auto relative z-10 px-4 py-8 md:px-10 lg:px-12">
        <div class="max-w-7xl mx-auto h-full flex flex-col">
          {currentPage() === 'dashboard' && <Dashboard />}
          {currentPage() === 'history' && <History />}
          {currentPage() === 'settings' && <Settings />}
        </div>
      </main>
    </div>
  );
}

export default App;
