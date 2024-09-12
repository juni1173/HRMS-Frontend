// ** Third Party Components
import Chart from 'react-apexcharts'
import { Settings } from 'react-feather'

// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody, CardText } from 'reactstrap'

const LineChart = props => {
  const options = {
      chart: {
        toolbar: { show: false },
        zoom: { enabled: false },
        type: 'line',
        dropShadow: {
          enabled: true,
          top: 18,
          left: 2,
          blur: 5,
          opacity: 0.2
        },
        offsetX: -10
      },
      stroke: {
        curve: 'smooth',
        width: 3
      },
      grid: {
        borderColor: '#ebe9f1',
        padding: {
          top: -20,
          bottom: 5,
          left: 20
        }
      },
      legend: {
        show: false
      },
      colors: ['#315180'],
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          inverseColors: false,
          gradientToColors: [props.primary],
          shadeIntensity: 1,
          type: 'horizontal',
          opacityFrom: 1,
          opacityTo: 1,
          stops: props.percentage
        }
      },
      markers: {
        size: 0,
        hover: {
          size: 5
        }
      },
      xaxis: {
        labels: {
          offsetY: 5,
          style: {
            colors: '#000',
            fontSize: '0.657rem',
            fontFamily: 'Montserrat'
          }
        },
        axisTicks: {
          show: false
        },
        categories: props.categories,
        axisBorder: {
          show: false
        },
        tickPlacement: 'on',
        range: props.categories.length
      },
      yaxis: {
        tickAmount: 5,
        labels: {
          style: {
            colors: '#000',
            fontSize: '0.857rem',
            fontFamily: 'Montserrat'
          },
          formatter(val) {
            return val > 999 ? `${(val / 1000).toFixed(1)}k` : val
          }
        }
      },
      tooltip: {
        x: { show: false }
      }
    },
    series = [
      {
        name: 'Attendance %',
        data: props.percentage
      }
    ]
  return (
    <Card>
      <CardHeader className='align-items-start'>
        <div>
          <CardTitle className='mb-25' tag='h4'>
            Attendance % from {props.from} to {props.to}
          </CardTitle>
          {/* <CardText className='mb-0'>2020 Total Sales: 12.84k</CardText> */}
        </div>
        {/* <Settings size={18} className='text-muted cursor-pointer' /> */}
      </CardHeader>
      <CardBody className='pb-0'>
        <Chart options={options} series={series} type='line' height={240} />
      </CardBody>
    </Card>
  )
}
export default LineChart
