import { Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';

// Error Fix 1: Ensure ALL elements are registered
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function FeedbackChart({ fairPath = [], biasedPath = [] }) {
  // Error Fix 2: Safeguard against empty data to prevent "width -1" error
  const chartData = {
    labels: Array.from({ length: 24 }, (_, i) => `W${i + 1}`),
    datasets: [
      {
        label: 'Fair Path',
        data: fairPath.length > 0 ? fairPath : Array(24).fill(0),
        borderColor: '#00ff88',
        backgroundColor: '#00ff88',
        tension: 0.4,
        pointRadius: 0,
      },
      {
        label: 'Biased Path',
        data: biasedPath.length > 0 ? biasedPath : Array(24).fill(0),
        borderColor: '#ef4444',
        backgroundColor: '#ef4444',
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { color: 'rgba(255,255,255,0.3)', font: { size: 10 } } },
      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: 'rgba(255,255,255,0.3)', font: { size: 10 } } }
    }
  };

  return (
    <div style={{ width: '100%', height: '300px', position: 'relative' }}>
      <Line data={chartData} options={options} />
    </div>
  );
}