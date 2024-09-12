// ** Third Party Components
import { Bar } from 'react-chartjs-2'

// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody } from 'reactstrap'

const ChartByDepartment = ({ gridLineColor, labelColor, data, highestTotalEmployeeCount }) => {
  // ** Chart Options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y', // This makes the bar chart horizontal
    animation: { duration: 500 },
    scales: {
      x: {
        grid: {
          color: 'lightgrey',
          borderColor: gridLineColor
        },
        ticks: { color: labelColor }
      },
      y: {
        min: 0,
        max: highestTotalEmployeeCount,
        grid: {
          color: gridLineColor,
          borderColor: gridLineColor
        },
        ticks: {
          stepSize: highestTotalEmployeeCount / 5,
          color: labelColor
        }
      }
    },
    layout: {
      padding: 0
    },
    plugins: {
      legend: {
        position: 'top',
        align:'start',
        labels: { 
          font: {
            size: 10
          },
          color: labelColor,
          align:'left',
           usePointStyle: true, // Use point style to render as circles
        pointStyle: 'circle' }
      },
      tooltip: {
        backgroundColor: '#000',
        titleColor: '#fff',
        bodyColor: '#fff'
      }
    }
  }

  return (
    <Card>
      <CardHeader className='d-flex justify-content-between align-items-sm-center align-items-start flex-sm-row flex-column'>
        <CardTitle tag='h4'>Employee Count By Department</CardTitle>
      </CardHeader>
      <CardBody>
        <div style={{ height: '400px' }}>
          <Bar data={data} options={options} height={400} />
        </div>
      </CardBody>
    </Card>
  )
}

export default ChartByDepartment
