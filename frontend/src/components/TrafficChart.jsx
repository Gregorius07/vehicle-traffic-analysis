import { onMount, createEffect } from 'solid-js';
import Chart from 'chart.js/auto';

const TrafficChart = (props) => {
  let chartRef;
  let chartInstance = null;

  createEffect(() => {
    if (!props.results || !chartRef) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    const { masuk, keluar } = props.results.data;
    const labels = ['Car', 'Motorcycle', 'Bus', 'Truck'];

    // Common Chart.js global defaults for Dark Theme
    Chart.defaults.color = '#94a3b8';
    Chart.defaults.font.family = 'Inter';

    chartInstance = new Chart(chartRef, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Entry (Masuk)',
            data: [masuk.car, masuk.motorcycle, masuk.bus, masuk.truck],
            backgroundColor: 'rgba(16, 185, 129, 0.8)', // Emerald
            borderRadius: 6,
          },
          {
            label: 'Exit (Keluar)',
            data: [keluar.car, keluar.motorcycle, keluar.bus, keluar.truck],
            backgroundColor: 'rgba(244, 63, 94, 0.8)', // Rose
            borderRadius: 6,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              usePointStyle: true,
              padding: 20
            }
          },
          tooltip: {
            backgroundColor: 'rgba(15, 13, 26, 0.9)',
            titleColor: '#fff',
            bodyColor: '#cbd5e1',
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 8
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(255, 255, 255, 0.05)',
            },
            border: { display: false }
          },
          x: {
            grid: {
              display: false
            },
            border: { display: false }
          }
        }
      }
    });
  });

  return (
    <div class="glass-card rounded-2xl p-6 h-[400px]">
      <h3 class="text-white font-display font-semibold text-lg mb-6 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-violet-400"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
        Traffic Distribution
      </h3>
      <div class="w-full h-[300px] relative">
        {props.results ? (
          <canvas ref={chartRef}></canvas>
        ) : (
          <div class="absolute inset-0 flex items-center justify-center text-slate-500">
            Waiting for data...
          </div>
        )}
      </div>
    </div>
  );
};

export default TrafficChart;
