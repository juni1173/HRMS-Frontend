import React from 'react'
import ReactApexChart from 'react-apexcharts'
import { Card, CardBody, CardHeader, CardTitle } from 'reactstrap'

const MedicalLimit = ({ data }) => {
  // Check if data is undefined
  if (!data) {
    return null // You can return null or any other placeholder component
  }

  const options = {
    chart: {
      width: 380,
      type: 'pie'
    },
    labels: ['Approved', 'Remaining'],

    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }
    ],
    series: [data.emp_yearly_limit - data.remaining_allowance, data.remaining_allowance],
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
          <ReactApexChart options={options} series={options.series} type="pie" width={380} />
        </div>
      </>
    )
  }

  return (
    <Card className='card-browser-states'>
      <CardHeader>
        <div>
          <CardTitle tag='h4'>Medical Balance</CardTitle>
        </div>
      </CardHeader>
      <CardBody>{renderStates()}</CardBody>
    </Card>
  )
}

export default MedicalLimit
