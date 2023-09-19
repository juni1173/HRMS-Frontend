// ** Third Party Components
import { Item } from 'react-contexify'
import { FileText } from 'react-feather'
import { useState, useEffect} from 'react'
// ** Reactstrap Imports
import {
  Card,
  CardBody,
  CardText,
  CardTitle,
  CardHeader,
  Badge,
  Button,
  Row
} from 'reactstrap'
import ReactApexChart from 'react-apexcharts'
const LeavesCount = ({ data }) => {
  const [series, setSeries] = useState([0])
  const [annualSeries, setAnnualSeries] = useState([0])
  const [casualSeries, setCasualSeries] = useState([0])
  const [BereavementSeries, SetBereavementSeries] = useState([0])
  const [UmrahSeries, SetUmrahSeries] = useState([0])
  let totalAllowedLeaves = 0
  let totalRemainingLeaves = 0
  let CasualLeaves = 0
  let RemainingCasual = 0
  let AnnualLeaves = 0
  let RemainingAnnual = 0
  let BereavementLeaves = 0
  let RemainingBereavement = 0
  let Umrahleaves = 0
  let RemainingUmrah = 0
  

  useEffect(() => {
    data.forEach((item) => {
      totalAllowedLeaves += item.allowed_leaves
      totalRemainingLeaves += item.remaining_leaves
      if (item.leave_type === 'Casual Leaves') {
        CasualLeaves += item.allowed_leaves
        RemainingCasual += item.remaining_leaves
      } else if (item.leave_type === 'Annual Leaves') {
        AnnualLeaves += item.allowed_leaves
        RemainingAnnual += item.remaining_leaves
      } else if (item.leave_type === 'Bereavement Leaves') {
        BereavementLeaves += item.allowed_leaves
        RemainingBereavement += item.remaining_leaves
      } else if (item.leave_type === 'Hajj/ Umrah Leaves') {
        Umrahleaves += item.allowed_leaves
        RemainingUmrah += item.remaining_leaves
      }
    })
    let percentageRemaining = (totalRemainingLeaves / totalAllowedLeaves) * 100
percentageRemaining =  100 - percentageRemaining
setSeries([percentageRemaining.toFixed(2)])

let percentageRemainingCasual = (RemainingCasual / CasualLeaves) * 100
percentageRemainingCasual =  100 - percentageRemainingCasual
setCasualSeries([percentageRemainingCasual.toFixed(2)])

let percentageRemainingAnnual = (RemainingAnnual / AnnualLeaves) * 100
percentageRemainingAnnual =  100 - percentageRemainingAnnual
setAnnualSeries([percentageRemainingAnnual.toFixed(2)])

let percentageRemainingBereavement = (RemainingBereavement / BereavementLeaves) * 100
percentageRemainingBereavement =  100 - percentageRemainingBereavement
SetBereavementSeries([percentageRemainingBereavement.toFixed(2)])

let percentageRemainingUmrah = (RemainingUmrah / Umrahleaves) * 100
percentageRemainingUmrah =  100 - percentageRemainingUmrah
SetUmrahSeries([percentageRemainingUmrah.toFixed(2)])

  }, [data])
  const [options] = useState({
    chart: {
      height: 350,
      type: 'radialBar',
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 225,
        hollow: {
          margin: 0,
          size: '70%',
          background: '#fff',
          image: undefined,
          imageOffsetX: 0,
          imageOffsetY: 0,
          position: 'front',
          dropShadow: {
            enabled: true,
            top: 3,
            left: 0,
            blur: 4,
            opacity: 0.24
          }
        },
        track: {
          background: '#fff',
          strokeWidth: '67%',
          margin: 0,
          dropShadow: {
            enabled: true,
            top: -3,
            left: 0,
            blur: 4,
            opacity: 0.35
          }
        },
        dataLabels: {
          show: true,
          name: {
            offsetY: -10,
            show: true,
            color: '#888',
            fontSize: '16px'
          },
          value: {
            formatter() {
              return `${totalRemainingLeaves} / ${totalAllowedLeaves}`
            },
            color: '#111',
            fontSize: '18px',
            show: true
          }
        }
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'horizontal',
        shadeIntensity: 0.5,
        gradientToColors: ['#ABE5A1'],
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100]
      }
    },
    stroke: {
      lineCap: 'round'
    },
    labels: ['Total Left']

  })
  const [BereavementOptions] = useState({
    chart: {
      height: 350,
      type: 'radialBar',
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 225,
        hollow: {
          margin: 0,
          size: '70%',
          background: '#fff',
          image: undefined,
          imageOffsetX: 0,
          imageOffsetY: 0,
          position: 'front',
          dropShadow: {
            enabled: true,
            top: 3,
            left: 0,
            blur: 4,
            opacity: 0.24
          }
        },
        track: {
          background: '#fff',
          strokeWidth: '67%',
          margin: 0,
          dropShadow: {
            enabled: true,
            top: -3,
            left: 0,
            blur: 4,
            opacity: 0.35
          }
        },
        dataLabels: {
          show: true,
          name: {
            offsetY: -10,
            show: true,
            color: '#888',
            fontSize: '6px'
          },
          value: {
            formatter() {
              return `${RemainingBereavement} / ${BereavementLeaves}`
            },
            color: '#111',
            fontSize: '12px',
            show: true,
            offsetY: -10
          }
        }
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'horizontal',
        shadeIntensity: 0.5,
        gradientToColors: ['#008000'],
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100]
      }
    },
    stroke: {
      lineCap: 'round'
    },
    labels: ['Bereavement']

  })
  const [UmrahOptions] = useState({
    chart: {
      height: 350,
      type: 'radialBar',
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 225,
        hollow: {
          margin: 0,
          size: '70%',
          background: '#fff',
          image: undefined,
          imageOffsetX: 0,
          imageOffsetY: 0,
          position: 'front',
          dropShadow: {
            enabled: true,
            top: 3,
            left: 0,
            blur: 4,
            opacity: 0.24
          }
        },
        track: {
          background: '#fff',
          strokeWidth: '67%',
          margin: 0,
          dropShadow: {
            enabled: true,
            top: -3,
            left: 0,
            blur: 4,
            opacity: 0.35
          }
        },
        dataLabels: {
          show: true,
          name: {
            offsetY: -10,
            show: true,
            color: '#888',
            fontSize: '10px'
          },
          value: {
            formatter() {
              return `${RemainingUmrah} / ${Umrahleaves}`
            },
            color: '#111',
            fontSize: '12px',
            show: true,
            offsetY: -10
          }
        }
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'horizontal',
        shadeIntensity: 0.5,
        gradientToColors: ['#ABE5A1'],
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100]
      }
    },
    stroke: {
      lineCap: 'round'
    },
    labels: ['Hajj/Umrah']

  })
  const [casualOptions] = useState({
    chart: {
      height: 350,
      type: 'radialBar',
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 225,
        hollow: {
          margin: 0,
          size: '70%',
          background: '#fff',
          image: undefined,
          imageOffsetX: 0,
          imageOffsetY: 0,
          position: 'front',
          dropShadow: {
            enabled: true,
            top: 3,
            left: 0,
            blur: 4,
            opacity: 0.24
          }
        },
        track: {
          background: '#fff',
          strokeWidth: '67%',
          margin: 0,
          dropShadow: {
            enabled: true,
            top: -3,
            left: 0,
            blur: 4,
            opacity: 0.35
          }
        },
        dataLabels: {
          show: true,
          name: {
            offsetY: -10,
            show: true,
            color: '#888',
            fontSize: '10px'
          },
          value: {
            formatter() {
              return `${RemainingCasual} / ${CasualLeaves}`
            },
            color: '#111',
            fontSize: '12px',
            show: true,
            offsetY: -10
          }
        }
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'horizontal',
        shadeIntensity: 0.5,
        gradientToColors: ['#800080'],
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100]
      }
    },
    stroke: {
      lineCap: 'round'
    },
    labels: ['Casual']

  })
  const [AnnualOptions] = useState({
    chart: {
      type: 'radialBar',
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 225,
        hollow: {
          margin: 0,
          size: '70%',
          background: '#fff',
          image: undefined,
          imageOffsetX: 0,
          imageOffsetY: 0,
          position: 'front',
          dropShadow: {
            enabled: true,
            top: 3,
            left: 0,
            blur: 4,
            opacity: 0.24
          }
        },
        track: {
          background: '#fff',
          strokeWidth: '67%',
          margin: 0,
          dropShadow: {
            enabled: true,
            top: -3,
            left: 0,
            blur: 4,
            opacity: 0.35
          }
        },
        dataLabels: {
          show: true,
          name: {
            offsetY: -10,
            show: true,
            color: '#888',
            fontSize: '10px'
          },
          value: {
            formatter() {
              return `${RemainingAnnual} / ${AnnualLeaves}`
            },
            color: '#111',
            fontSize: '12px',
            show: true,
            offsetY: -10
          }
        }
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'horizontal',
        shadeIntensity: 0.5,
        gradientToColors: ['#ff0000'],
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100]
      }
    },
    stroke: {
      lineCap: 'round'
    },
    labels: ['Annual']

  })

  const renderStates = () => {
    
      return (
        <>
  <div className="row">
  <div className="col-md-6">
    {/* Main Chart */}
    <div id="chart">
      <ReactApexChart options={options} series={series} type="radialBar" height={200} />
    </div>
  </div>
  <div className="col-md-6">
    <div className="row">
      <div className="col-md-6">
        {/* Sub-Chart 1 */}
        <div id="annual-chart">
          <ReactApexChart options={AnnualOptions} series={annualSeries} type="radialBar" height={110} />
        </div>
      </div>
      <div className="col-md-6">
        {/* Sub-Chart 2 */}
        <div id="casual-chart">
          <ReactApexChart options={casualOptions} series={casualSeries} type="radialBar" height={110} />
        </div>
      </div>
    </div>
    <div className="row">
      <div className="col-md-6">
        {/* Sub-Chart 1 */}
        <div id="annual-chart">
          <ReactApexChart options={BereavementOptions} series={BereavementSeries} type="radialBar" height={110} />
        </div>
      </div>
      <div className="col-md-6">
        {/* Sub-Chart 2 */}
        <div id="casual-chart">
          <ReactApexChart options={UmrahOptions} series={UmrahSeries} type="radialBar" height={110} />
        </div>
      </div>
    </div>
  </div>
</div>


        </>
        
      )
  }

  return (
    <Card className='card-browser-states'>
      <CardHeader>
        <div>
          <CardTitle tag='h4'>Leaves Balance</CardTitle>
        </div>
      </CardHeader>
      <CardBody>
        {renderStates()}
        </CardBody>
    </Card>
  )
}

export default LeavesCount
