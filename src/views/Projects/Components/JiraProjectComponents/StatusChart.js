import React, { Fragment } from 'react'
import { Bar } from 'react-chartjs-2'
import { useSkin } from '@hooks/useSkin'
// import DashboardChart from './JiraDashoardCharts'
const StatusChart = ({ data }) => {
    console.warn(data)
const labels = data.map((d) => d.name)
const values = data.map((d) => d["Number of Issues"])

const chartData = {
  labels,
  datasets: [
    {
      label: 'Number of Issues',
      data: values,
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1
    }
  ]
}
    const skin  = useSkin()
    const labelColor = skin === 'dark' ? '#b4b7bd' : '#6e6b7b'
    const gridLineColor = 'rgba(200, 200, 200, 0.2)'
    // const success = '#28dac6'
const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 500 },
    scales: {
      x: {
        grid: {
          color: gridLineColor,
          borderColor: gridLineColor
        },
        ticks: { color: labelColor }
      },
      y: {
        // min: 0,
        // max: 400,
        grid: {
          color: gridLineColor,
          borderColor: gridLineColor
        },
        ticks: {
            beginAtZero: true,
            color: labelColor
        }
      }
    },
    plugins: {
      legend: { display: false }
    }
  }
  return (
    <Fragment>
    <div>
      <Bar data={chartData} options={options} />
    </div>
    {/* <div>
        <DashboardChart dashboardId={10024}/>
    </div> */}
    </Fragment>
  )
}

export default StatusChart