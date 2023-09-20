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
    labels: ['Used', 'Left'],
    colors: ['#315180', '#c6c8cc'],
    // title: {
    //     text: 'Gym Balance - Monthly',
    //     align: 'center',
    //     margin: 10,
    //     style: {
    //       fontSize: '16px',
    //       fontWeight: 'bold'
    //     }
    //   },

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
    series: [data[0].amount, data[0].gym_monthly_limit - data[0].amount],
    dataLabels: {
      formatter (val, opts) {
        return opts.w.config.series[opts.seriesIndex]
    }
    }
  }
  const renderStates = () => {
    return (
      <>
        <div id="chart">
          <ReactApexChart options={options} series={options.series} type="pie" width={320} />
        </div>
      </>
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
