// ** Third Party Components
import { Bar } from 'react-chartjs-2'

// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody } from 'reactstrap'

const EmployeeBarChart = ({ gridLineColor, labelColor, data, highestTotalEmployeeCount }) => {
  // ** Chart Options
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
        min: 0,
        max: highestTotalEmployeeCount,
        grid: {
          color: gridLineColor,
          borderColor: gridLineColor
        },
        ticks: {
          stepSize: (highestTotalEmployeeCount / 5),
          color: labelColor
        }
      }
    },
    plugins: {
      legend: { display: false }
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

export default EmployeeBarChart
