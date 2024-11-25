import React from 'react'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const DepartmentBasedLineGraph = ({ EmployeeData }) => {
    const departmentKpiCounts = {}

    EmployeeData.forEach(employee => {
      const { department_title, employee_kpis_data } = employee
      const totalKpisForEmployee = employee_kpis_data.status_count_details.reduce((sum, status) => sum + status.status_count, 0)
  
      if (departmentKpiCounts[department_title]) {
        departmentKpiCounts[department_title] += totalKpisForEmployee
      } else {
        departmentKpiCounts[department_title] = totalKpisForEmployee
      }
    })
  
    // Step 2: Prepare data for chart
    const departmentTitles = Object.keys(departmentKpiCounts)
    const kpiCounts = Object.values(departmentKpiCounts)
  
    // Step 3: Chart.js data configuration
    const data = {
      labels: departmentTitles, // x-axis labels (department titles)
      datasets: [
        {
          label: 'KPI Count per Department',
          data: kpiCounts, // y-axis values (KPI counts per department)
          borderColor: '#302b63',
          backgroundColor: '#302b63',
          fill: false,
          tension: 0.1
        }
      ]
    }
  
    // Step 4: Chart.js options
    const options = {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'KPI Distribution by Department'
        },
        tooltip: {
          callbacks: {
            label: (context) => `${context.raw} KPIs` // Tooltip formatting
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Total KPIs'
          }
        }
      }
    }

  return (
    <div>
      <Line data={data} options={options} />
    </div>
  )
}

export default DepartmentBasedLineGraph
