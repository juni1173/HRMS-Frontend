import React from 'react'
import Chart from 'react-apexcharts'

const TaskStatusPieChart = ({ data }) => {
  // Get the specific task data for the employee

        const taskStatusCounts = data[0].task_status_counts

        // Generate series and labels for the pie chart
        const series = taskStatusCounts.map((status) => status.count)
        const labels = taskStatusCounts.map((status) => status.title)

        const options = {
            chart: {
            type: 'pie',
            height: 300,
            toolbar: { show: true }
            },
            labels,
            colors: [
                '#23511E',    // Green
                '#2A265F',     // Blue
                '#C58C00',     // Orange
                '#7D1007'      // Red
            ],
            fill: {
                type: 'gradient',
                gradient: {
                shade: 'dark',
                type: "vertical",
                gradientToColors: [
                    '#23511E',    // Green
                    '#2A265F',     // Blue
                    '#C58C00',     // Orange
                    '#7D1007'      // Red
                ],
                stops: [0, 100]
                }
            },
            legend: {
                position: 'bottom',
                horizontalAlign: 'center',
                labels: {
                colors: '#333' // Dark text for contrast on light backgrounds
                }
            },
            tooltip: {
                theme: 'dark'
            }
        }
  
  return (
        <div className="chart">
          <div style={{ display: 'flex', alignItems: 'top', gap: '1rem' }}>
            {/* Left Column for Status Titles and Counts */}
            <div style={{ width: '30%' }}>
              <h4 style={{ color: '#607d8b', fontSize: '16px', marginBottom: '1rem' }}>Summary</h4>
              <ul style={{ listStyleType: 'none', padding: 0, fontSize: '12px', lineHeight: '1.6' }}>
                {taskStatusCounts.map((status, index) => (
                  <li key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                    <span>{status.title}</span>
                    <strong>{status.count}</strong>
                  </li>
                ))}
              </ul>
            </div>
      
            {/* Right Column for Pie Chart */}
            <div style={{ width: '70%' }}>
              <Chart options={options} series={series} type="pie" height={300} />
            </div>
          </div>
        </div>
      
  )
}

export default TaskStatusPieChart
