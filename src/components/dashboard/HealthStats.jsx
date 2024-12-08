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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function HealthStats({ data }) {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Health Trends'
      }
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day'
        }
      }
    }
  };

  return (
    <div>
      {data.datasets.length > 0 ? (
        <Line data={data} options={options} />
      ) : (
        <p className="text-gray-500">No health data available</p>
      )}
    </div>
  );
}

export default HealthStats;