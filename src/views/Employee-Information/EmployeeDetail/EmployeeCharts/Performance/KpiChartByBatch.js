// ** Third Party Components
import { Fragment } from 'react'
import { Bar } from 'react-chartjs-2'
import { Table } from 'reactstrap'
import { FaBatteryFull, FaBatteryHalf, FaBatteryQuarter } from "react-icons/fa"
const KpiChartByBatch = ({ data }) => {
console.warn(data)
  const getDataset = (arr) => {

    const labels = data.map(d => d.batch)
     // Extract data for each KPI complexity and status
  const highCompletedData = arr.map(d => d.total_high_complexity_completed)
  const mediumCompletedData = arr.map(d => d.total_medium_complexity_completed)
  const lowCompletedData = arr.map(d => d.total_low_complexity_completed)
  
  const highCarryForwardData = arr.map(d => d.total_high_complexity_carry_forward)
  const mediumCarryForwardData = arr.map(d => d.total_medium_complexity_carry_forward)
  const lowCarryForwardData = arr.map(d => d.total_low_complexity_carry_forward)

  const highIncompleteData = arr.map(d => d.total_high_complexity_incomplete)
  const mediumIncompleteData = arr.map(d => d.total_medium_complexity_incomplete)
  const lowIncompleteData = arr.map(d => d.total_low_complexity_incomplete)
   const datasets = [
      {
        label: 'High Complexity Completed',
        maxBarThickness: 45,
        data: highCompletedData,
        backgroundColor: '#FF5733', // Orange color for high complexity completed
        stack: 'Stack 0'
      },
      {
        label: 'Medium Complexity Completed',
        maxBarThickness: 45,
        data: mediumCompletedData,
        backgroundColor: '#FFC300', // Yellow color for medium complexity completed
        stack: 'Stack 1'
      },
      {
        label: 'Low Complexity Completed',
        maxBarThickness: 45,
        data: lowCompletedData,
        backgroundColor: '#DAF7A6', // Light green color for low complexity completed
        stack: 'Stack 2'
      },
      {
        label: 'High Complexity Carry Forward',
        maxBarThickness: 45,
        data: highCarryForwardData,
        backgroundColor: '#C70039', // Dark red color for high complexity carry forward
        stack: 'Stack 0'
      },
      {
        label: 'Medium Complexity Carry Forward',
        maxBarThickness: 45,
        data: mediumCarryForwardData,
        backgroundColor: '#FF6F61', // Coral color for medium complexity carry forward
        stack: 'Stack 1'
      },
      {
        label: 'Low Complexity Carry Forward',
        maxBarThickness: 45,
        data: lowCarryForwardData,
        backgroundColor: '#F0E5CF', // Beige color for low complexity carry forward
        stack: 'Stack 2'
      },
      {
        label: 'High Complexity Incomplete',
        maxBarThickness: 45,
        data: highIncompleteData,
        backgroundColor: '#900C3F', // Darker red color for high complexity incomplete
        stack: 'Stack 0'
      },
      {
        label: 'Medium Complexity Incomplete',
        maxBarThickness: 45,
        data: mediumIncompleteData,
        backgroundColor: '#FF4D4D', // Light red color for medium complexity incomplete
        stack: 'Stack 1'
      },
      {
        label: 'Low Complexity Incomplete',
        maxBarThickness: 45,
        data: lowIncompleteData,
        backgroundColor: '#F7C6C7', // Light pink color for low complexity incomplete
        stack: 'Stack 2'
      }
    ]
    return {
      labels,
      datasets
    }
  }
  // ** Chart Options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        // stacked: false,
        title: {
          display: true,
          text: 'Batch'
        }
      },
      y: {
        // stacked: false,
        title: {
          display: true,
          text: 'Number of KPIs'
        },
        ticks: {
          stepSize: 1
        }
      }
    },
    plugins: {
      legend: {
        display: false,
        position: 'top'
      },
      tooltip: {
        callbacks: {
          label(context) {
            return `${context.dataset.label}: ${context.raw}`
          }
        }
      }
    }
  }
  // const getScore = (arr) => {
  //   const batches = data.map(d => d.batch)
  //   batches.forEach(batch => {
  //     let highResult = arr.map(d => ((d.total_high_complexity_completed > 0 && d.batch === batch) ? d.total_high_complexity_result / d.total_high_complexity_completed : 0))
  //       highResult = highResult.reduce((a, b) => {
  //         return a + b
  //       })
  //   })
  //   let highResult = arr.map(d => (d.total_high_complexity_completed > 0 ? d.total_high_complexity_result / d.total_high_complexity_completed : 0))
  //   highResult = highResult.reduce((a, b) => {
  //     return a + b
  //   })
  //   let mediumResult = arr.map(d => (d.total_medium_complexity_completed > 0 ? d.total_medium_complexity_result / d.total_medium_complexity_completed : 0))
  //   mediumResult = mediumResult.reduce((a, b) => {
  //     return a + b
  //   })
  //   let lowResult = arr.map(d => (d.total_low_complexity_completed > 0 ? d.total_low_complexity_result / d.total_low_complexity_completed : 0))
  //   lowResult = lowResult.reduce((a, b) => {
  //     return a + b
  //   })
  //   console.warn({batches, highResult, mediumResult, lowResult})
  //   return false
  // }
  return (
      <Fragment>
        <div className='d-flex justify-content-center'>
          <div style={{height:'400px'}}>
              <Bar data={() => getDataset(data)} options={options} height={400} />
          </div>
          <div>
            {/* <button onClick={() => getScore(data)}>Get Score</button> */}
            
                {data && Object.values(data).length > 0 && (
                  Object.values(data).map((item, key) => (
                  <Table striped responsive key={key}>
                    <thead>
                      <tr>
                        <th colSpan="3">Batch / {item.batch && item.batch}</th>
                      </tr>
                    </thead>
                   <tbody>
                      <tr>
                      <td><FaBatteryFull /> High <br></br><span className='font-small-2 text-primary'>{(item.total_high_complexity_result && item.total_high_complexity_completed > 0) ? `${(item.total_high_complexity_result / item.total_high_complexity_completed).toFixed(2)}%` : 0}</span></td>
                      <td><FaBatteryHalf /> Medium <br></br><span className='font-small-2 text-warning'>{(item.total_medium_complexity_result && item.total_medium_complexity_completed > 0) ? `${(item.total_medium_complexity_result / item.total_medium_complexity_completed).toFixed(2)}%` : 0}</span></td>
                      <td><FaBatteryQuarter /> Low <br></br><span className='font-small-2 text-danger'>{(item.total_low_complexity_result && item.total_low_complexity_completed > 0) ? `${(item.total_low_complexity_result / item.total_low_complexity_completed).toFixed(2)}%` : 0}</span></td>
                    </tr>
                    </tbody>
                    </Table>
                  ))
                )}
              
              
                  {/* <tr>
                      <th className='cursor-pointer' ><MdCoPresent size={17} className='text-success' /> <span>{data[0].total_presents && data[0].total_presents}<span className='font-small-1 text-secondary'> Presents</span></span><br></br><span className='font-small-1 text-secondary'>{data[0].total_presents && convertDaysToYearsMonths(data[0].total_presents)}</span></th>
                      <th className='cursor-pointer'><MdHomeWork size={17} className='text-warning' /> {data[0].total_wfh && data[0].total_wfh} <span className='font-small-1 text-secondary'> WFH</span><br></br><span className='font-small-1 text-secondary'>{(data[0].total_wfh && data[0].total_wfh !== 0) && convertDaysToYearsMonths(data[0].total_wfh)}</span></th>
                  </tr>
                  <tr>
                      <th className='cursor-pointer'><FcLeave size={17} className='text-success' /> {data[0].total_leaves && data[0].total_leaves} <span className='font-small-1 text-secondary'> Leaves</span><br></br><span className='font-small-1 text-secondary'>{(data[0].total_leaves && data[0].total_leaves !== 0) && convertDaysToYearsMonths(data[0].total_leaves)}</span></th>
                      <th className='cursor-pointer'><MdReportOff size={17} color={colors.danger.main} /> {data[0].total_absent && data[0].total_absent} <span className='font-small-1 text-secondary'> Absents</span><br></br><span className='font-small-1 text-secondary'>{(data[0].total_absent && data[0].total_absent !== 0) && convertDaysToYearsMonths(data[0].total_absent)}</span></th>
                  </tr>
                  <tr>
                      <th className='cursor-pointer'><MdWorkOff size={17} color='#1A5319' /> {data[0].total_weekday_holidays && data[0].total_weekday_holidays} <span className='font-small-1 text-secondary'> Weekday Holidays</span><br></br><span className='font-small-1 text-secondary'>{(data[0].total_weekday_holidays && data[0].total_weekday_holidays !== 0) && convertDaysToYearsMonths(data[0].total_weekday_holidays)}</span></th>
                      <th className='cursor-pointer'><MdWorkOff size={17} color='#508D4E' /> {data[0].total_weekend_holidays && data[0].total_weekend_holidays} <span className='font-small-1 text-secondary'> Weekdend Holidays</span><br></br><span className='font-small-1 text-secondary'>{(data[0].total_weekend_holidays && data[0].total_weekend_holidays !== 0) && convertDaysToYearsMonths(data[0].total_weekend_holidays)}</span></th>
                  </tr> */}
                  
          </div>
        </div>
        
      </Fragment>
  )
}

export default KpiChartByBatch
