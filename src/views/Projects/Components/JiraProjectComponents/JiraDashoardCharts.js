import React, { useState, useEffect } from 'react'
// import { Bar } from 'react-chartjs-2'
import apiHelper from '../../../Helpers/ApiHelper'
// import XMLParser from 'react-xml-parser'

const DashboardChart = ({ dashboardId }) => {
    const Api = apiHelper()
  const [dashboardData, setDashboardData] = useState({})
  const [gadgetData] = useState([])
  const getDashboardData = async (uri) => {
    // console.warn(`https://api.atlassian.com/ex/jira/ebd17c20-72d8-441c-81eb-b6185d42c9d8/${uri}`)
    try {
      await fetch(`https://api.atlassian.com/ex/jira/ebd17c20-72d8-441c-81eb-b6185d42c9d8/${uri}`)
      .then(response => response.text())
      .then(text => console.warn(text))
    } catch (err) {
      console.error(err)
      return null
    }
  }
  const fetchDashboardData = async () => {
        gadgetData.splice(0, gadgetData.length)
        await Api.jiraGet(`/rest/api/3/dashboard/${dashboardId}/gadget`).then(result => {
            setDashboardData(result)
            for (let i = 0; i < result.gadgets.length; i++) {
                
                gadgetData.push({title: result.gadgets[i].title, data: getDashboardData(result.gadgets[i].uri)})
            }
        })
    console.warn(`gadget data: ${JSON.stringify(gadgetData[0])}`)
    }
  useEffect(() => {
    
    fetchDashboardData()
  }, [dashboardId])

//   const chartData = {
//     labels: dashboardData.gadgets
//       ?.filter((g) => g.gadgetType === 'com.atlassian.jira.gadgets:filterresults')
//       .map((g) => g.filter.title),
//     datasets: [
//       {
//         label: 'Issue Count',
//         data: dashboardData.gadgets
//           ?.filter((g) => g.gadgetType === 'com.atlassian.jira.gadgets:filterresults')
//           .map((g) => g.data.totalCount),
//         backgroundColor: 'rgba(54, 162, 235, 0.5)',
//         borderColor: 'rgba(54, 162, 235, 1)',
//         borderWidth: 1
//       }
//     ]
//   }

//   const options = {
//     scales: {
//       yAxes: [
//         {
//           ticks: {
//             beginAtZero: true
//           }
//         }
//       ]
//     }
//   }

  return (
    <div>
        {dashboardData.length > 0 ? <p>data</p> : <p>no data</p>}
      {/* <Bar data={chartData} options={options} /> */}
    </div>
  )
}

export default DashboardChart