import React, { Fragment } from 'react'
import { Bar, Pie } from 'react-chartjs-2'
import { useSkin } from '@hooks/useSkin'
// import DashboardChart from './JiraDashoardCharts'
const StatusChart = ({ data, project, assignee }) => {
  console.warn(data)
const labels = data.map((d) => d.name)
const values = data.map((d) => d["Number of Issues"])

const chartData = {
  labels,
  datasets: [
    {
      data: values,
      backgroundColor: [
        'rgba(255, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.5)',
        'rgba(255, 206, 86, 0.5)',
        'rgba(75, 192, 192, 0.5)',
        'rgba(153, 102, 255, 0.5)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)'
      ],
      borderWidth: 1
    }
  ]
}
    const skin  = useSkin()
    const labelColor = skin === 'dark' ? '#b4b7bd' : '#6e6b7b'
    // const gridLineColor = 'rgba(200, 200, 200, 0.2)'
    // const success = '#28dac6'
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 500 },
      plugins: {
        legend: {
          labels: { color: labelColor }
        }
      }
    }
  return (
    <Fragment>
      <a target='_blank' href={`https://kavtech.atlassian.net/jira/software/projects/${project}/issues/?jql=project%20%3D%20%22${project}%22%20and%20status%20%3D%20%22In%20Progress%22%20and%20assignee%20%3D%20${assignee}%0AORDER%20BY%20created%20DESC`}>In Progress Issues</a><br></br>
      <a target='_blank' href={`https://kavtech.atlassian.net/jira/software/projects/${project}/issues/?jql=project%20%3D%20%22${project}%22%20and%20status%20%3D%20%22To%20Do%22%20and%20assignee%20%3D%20${assignee}%20ORDER%20BY%20created%20DESC`}>To Do Issues</a>
    <div>
      
      <Pie data={chartData} options={options} />
    </div>
    {/* <div>
        <DashboardChart dashboardId={10024}/>
    </div> */}
    </Fragment>
  )
}

export default StatusChart