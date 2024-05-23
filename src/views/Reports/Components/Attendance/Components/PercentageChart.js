// ** React Imports
import { useContext } from 'react'

// ** Third Party Components
// import axios from 'axios'
import Chart from 'react-apexcharts'
import { ThemeColors } from '@src/utility/context/ThemeColors'
// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  CardBody,
  CardText
} from 'reactstrap'

const PercentageChart = props => {
  // ** State
  const { colors } = useContext(ThemeColors)

  const options = {
      plotOptions: {
        radialBar: {
          size: 150,
          offsetY: 20,
          startAngle: -150,
          endAngle: 150,
          hollow: {
            size: '65%'
          },
          track: {
            background: '#fff',
            strokeWidth: '100%'
          },
          dataLabels: {
            name: {
              offsetY: -5,
              fontFamily: 'Montserrat',
              fontSize: '1rem'
            },
            value: {
              offsetY: 15,
              fontFamily: 'Montserrat',
              fontSize: '1.714rem'
            }
          }
        }
      },
      colors: [colors.danger.main],
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          type: 'horizontal',
          shadeIntensity: 0.5,
          gradientToColors: [colors.primary.main],
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100]
        }
      },
      stroke: {
        dashArray: 8
      },
      labels: [props.label]
    },
    series = [parseInt(props.total)]

  return (
    <Card>
      
      <CardBody>
        <Row>
          <Col sm='12' className='d-flex flex-column flex-wrap text-center'>
            {/* <h3 className=' fw-bolder mt-2 mb-0'>Presents {props.data} <span>out of</span> expected {props.employeeTotal}</h3> */}
            <CardText>{props.label}</CardText>
          </Col>
          <Col sm='12' className='d-flex justify-content-center'>
            <Chart options={options} series={series} type='radialBar' height={200} id='support-tracker-card' />
          </Col>
        </Row>
        {/* <div className='d-flex justify-content-between mt-1'>
          <div className='text-center'>
            <CardText className='mb-50'>New Tickets</CardText>
            <span className='font-large-1 fw-bold'>{data.newTicket}</span>
          </div>
          <div className='text-center'>
            <CardText className='mb-50'>Open Tickets</CardText>
            <span className='font-large-1 fw-bold'>{data.openTicket}</span>
          </div>
          <div className='text-center'>
            <CardText className='mb-50'>Response Time</CardText>
            <span className='font-large-1 fw-bold'>{data.responseTime}d</span>
          </div>
        </div> */}
      </CardBody>
    </Card>
  )
}
export default PercentageChart
