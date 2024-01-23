// ** Third Party Components
import Chart from 'react-apexcharts'

// ** Reactstrap Imports
import { Card, CardBody, Row, Col } from 'reactstrap'

const SessionChart = ({ data, Sessions }) => {
    const options = {
      chart: {
        toolbar: {
          show: false
        }
      },
      dataLabels: {
        enabled: false
      },
      legend: { show: false },
      // comparedResult: [2, -3, 8],
      labels: Object.keys(data[0]) ? Object.keys(data[0]) : '',
      stroke: { width: 0 },
      // colors: ['#fff3cd', '#d1ecf1', '#d4edda', '#f8d7da'],
      grid: {
        padding: {
          right: -20,
          bottom: -8,
          left: -20
        }
      },
      plotOptions: {
        pie: {
          startAngle: -10,
          donut: {
            labels: {
              show: true,
              name: {
                offsetY: 15
              },
              value: {
                offsetY: -15,
                formatter(val) {
                  return `${parseInt(val)}`
                }
              },
              total: {
                show: true,
                offsetY: 15,
                label: 'Sessions',
                formatter() {
                  return Sessions
                }
              }
            }
          }
        }
      },
      responsive: [
        {
          breakpoint: 1325,
          options: {
            chart: {
              height: 100
            }
          }
        },
        {
          breakpoint: 1200,
          options: {
            chart: {
              height: 120
            }
          }
        },
        {
          breakpoint: 1065,
          options: {
            chart: {
              height: 100
            }
          }
        },
        {
          breakpoint: 992,
          options: {
            chart: {
              height: 120
            }
          }
        }
      ]
    }
  
    return (
      <Card className='earnings-card'>
        <CardBody className='p-0'>
          <Row>
            {/* <Col xs='6'>
              <CardTitle className='mb-1'>Earnings</CardTitle>
              <div className='font-small-2'>This Month</div>
              <h5 className='mb-1'>$4055.56</h5>
              <CardText className='text-muted font-small-2'>
                <span className='fw-bolder'>68.2%</span>
                <span> more earnings than last month.</span>
              </CardText>
            </Col> */}
            <Col xs='12'>
              <Chart options={options} series={Object.values(data[0])} type='donut' height={170} />
            </Col>
          </Row>
        </CardBody>
      </Card>
    )
  }

export default SessionChart
