// ** Third Party Components
import { PolarArea } from 'react-chartjs-2'
import { MoreVertical } from 'react-feather'
// ** Reactstrap Imports
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody
} from 'reactstrap'
const EvaluationChart = props => {

  // ** Props
  const { labelColor, graphData } = props
    
  // ** Chart Options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 500 },
    layout: {
      padding: {
        top: -5,
        bottom: -45
      }
    },
    scales: {
      r: {
        grid: { display: false },
        ticks: { display: false }
      }
    },
    plugins: {
      legend: {
        position: 'right',
        labels: {
          padding: 25,
          boxWidth: 9,
          color: labelColor,
          usePointStyle: true
        }
      }
    }
  }

  // ** Chart Data
  
 
  return (
    <Card>
      <CardHeader className='d-flex justify-content-between align-items-sm-center align-items-start flex-sm-row flex-column'>
        <CardTitle tag='h4'>Kpi Evaluation</CardTitle>
        {/* <UncontrolledDropdown>
          <DropdownToggle className='cursor-pointer' tag='span'>
            <MoreVertical size={14} />
          </DropdownToggle>
          <DropdownMenu end>
            <DropdownItem className='w-100'>Last 28 days</DropdownItem>
            <DropdownItem className='w-100'>Last Month</DropdownItem>
            <DropdownItem className='w-100'>Last Year</DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown> */}
      </CardHeader>
      <CardBody>
                <div style={{ height: '350px' }}>
                    <PolarArea data={graphData} options={options} height={350} />
                </div>
      </CardBody>
    </Card>
  )
}

export default EvaluationChart
