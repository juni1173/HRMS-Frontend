import React from 'react'
import ReactApexChart from 'react-apexcharts'
import { Card, CardBody, CardHeader, CardTitle } from 'reactstrap'

const GymLimit = ({ data }) => {
  // Check if data is undefined
  if (!data) {
    return null // You can return null or any other placeholder component
  }

  const options = {
    chart: {
      type: 'pie'
    },
    labels: ['Approved', 'Remaining'],

    colors: ['#315180', '#c6c8cc'],
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            position: 'bottom'
          }
        }
      }
    ],
    plotOptions: {
        pie: {
          dataLabels: {
            offset: -20
          }
        }
      },
    series: [data[0].amount, data[0].gym_monthly_limit - data[0].amount],
    dataLabels: {
      formatter (val, opts) {
        return opts.w.config.series[opts.seriesIndex]
    }
    },
    legend: {
      position: 'bottom'
    }
  }

  const renderStates = () => {
    return (
      <div id="chart" style={{ marginLeft: '-30px', marginRight: '-30px' }}>
          <ReactApexChart options={options} series={options.series} type="pie" width={240} />
        </div>
    )
  }

  return (
    <Card className='card-browser-states'>
      <CardHeader>
        <div>
          <CardTitle tag='h4'>Gym Balance - Monthly</CardTitle>
        </div>
      </CardHeader>
      <CardBody>{renderStates()}</CardBody>
    </Card>
  )
}

export default GymLimit
