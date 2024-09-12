// ** Third Party Components
import { useContext } from 'react'
import Chart from 'react-apexcharts'
import { ThemeColors } from '@src/utility/context/ThemeColors'

// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody, CardSubtitle } from 'reactstrap'

const BarChart = props => {
    const { colors } = useContext(ThemeColors)
  // ** Chart Options
  const options = {
    chart: {
        type: 'bar',
        height: 350
    },
    plotOptions: {
        bar: {
            borderRadius: 4,
            borderRadiusApplication: 'end',
            horizontal: true
          }
    },
    colors: colors.primary.main,
    dataLabels: {
      enabled: true
    },
    xaxis: {
      categories: props.categories
    }
  }

  // ** Chart Series
  const series = [
    {
      data: props.percentage
    }
  ]

  return (
    <Card>
      <CardHeader className='d-flex flex-sm-row flex-column justify-content-md-between align-items-start justify-content-start'>
       <h3>Attendance</h3>
      </CardHeader>
      <CardBody>
        <Chart options={options} series={series} type='bar' height={400} />
      </CardBody>
    </Card>
  )
}

export default BarChart
