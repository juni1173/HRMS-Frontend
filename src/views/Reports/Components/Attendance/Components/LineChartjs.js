import React from 'react'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, PointElement } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, PointElement)

const LineChartjs = ({ categories, percentage, primary }) => {
  const data = {
    labels: categories,
    datasets: [
      {
        label: 'Attendance %',
        data: percentage,
        borderColor: primary,
        backgroundColor: 'rgba(49, 81, 128, 0.5)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: primary,
        pointHoverRadius: 5,
        pointRadius: 3
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          color: 'transparent',
          borderColor: 'transparent'
        },
        ticks: {
          color: '#fff',
          fontSize: 14,
          fontFamily: 'Montserrat'
        },
        title: {
          display: true,
          text: 'Departments',
          color: '#fff',
          font: {
            size: 16,
            family: 'Montserrat',
            weight: 'bold'
          }
        }
      },
      y: {
        grid: {
          color: 'transparent',
          borderColor: 'transparent'
        },
        ticks: {
          color: '#fff',
          fontSize: 14,
          fontFamily: 'Montserrat',
          callback(value) {
            return value > 999 ? `${(value / 1000).toFixed(1)}k` : value
          }
        },
        title: {
          display: true,
          text: 'Attendance %',
          color: '#fff',
          font: {
            size: 16,
            family: 'Montserrat',
            weight: 'bold'
          }
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#000',
        titleColor: '#fff',
        bodyColor: '#fff'
      }
    },
    elements: {
      line: {
        borderWidth: 3
      }
    }
  }

  return (
    <div style={{ background: 'linear-gradient(to right, #232526, #414345)', padding: '20px', borderRadius: '8px' }}>
      <Line data={data} options={options} height={350} />
    </div>
  )
}

export default LineChartjs
