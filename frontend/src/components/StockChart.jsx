import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

export default function StockChart({ ticker }) {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchChart = async () => {
      const res = await fetch(`http://localhost:8000/api/stock-history/${ticker}`);
      const data = await res.json();

      const labels = data.map(item => item.date);
      const prices = data.map(item => item.close);
      const ma50 = data.map(item => item.ma50);
      const ma200 = data.map(item => item.ma200);

      setChartData({
        labels,
        datasets: [
          {
            label: 'Pris',
            data: prices,
            borderColor: '#3b82f6',
            fill: false,
          },
          {
            label: '50-dagers MA',
            data: ma50,
            borderColor: '#10b981',
            fill: false,
          },
          {
            label: '200-dagers MA',
            data: ma200,
            borderColor: '#f59e0b',
            fill: false,
          },
        ]
      });
    };

    fetchChart();
  }, [ticker]);

  if (!chartData) return <p>Laster diagram...</p>;

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md">
      <h2 className="text-lg mb-2">Historisk Pris</h2>
      <Line data={chartData} />
    </div>
  );
}
