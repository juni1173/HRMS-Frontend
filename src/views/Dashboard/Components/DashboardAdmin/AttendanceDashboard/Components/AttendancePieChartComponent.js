import { useState } from 'react'
// ** Third Party Components
import { Doughnut } from 'react-chartjs-2'

// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody, Row, Col, Table, Modal, ModalBody, ModalHeader } from 'reactstrap'
import { FcLeave } from "react-icons/fc"
import { MdCoPresent, MdHomeWork } from "react-icons/md"
import EmployeeListData from './EmployeeListData'
const AttendancePieChartComponent = ({ tooltipShadow, successColorShade, warningLightColor, danger, countData }) => {
  const [basicModal, setBasicModal] = useState(false)
  const [employeeData, setEmployeeData] = useState({
    list: [],
    total: 0,
    type: ''
  })
  const onClickFunction = (data, total, type) => {
    if (data) {
      setEmployeeData(prev => ({
          ...prev,
          list: data
    }))
    }
    if (total !== 0) {
      setEmployeeData(prev => ({
        ...prev,
        total
      }))
    }
    if (type !== '') {
      setEmployeeData(prev => ({
        ...prev,
        type
      }))
     setBasicModal(!basicModal)   
    }
  }
  // ** Chart Options
  const options = {
      legend: {
        display: true
      },
      maintainAspectRatio: false,
      cutout: 60,
      animation: {
        resize: {
          duration: 500
        }
      },
      tooltips: {
        
        // Updated default tooltip UI
        shadowOffsetX: 1,
        shadowOffsetY: 1,
        shadowBlur: 8,
        shadowColor: tooltipShadow,
        backgroundColor: '#fff',
        titleFontColor: '#000',
        bodyFontColor: '#000'
      }
    
  }

  // ** Chart data
  const data = {
    datasets: [
      {
        labels: ['Presents', 'WFH', 'On Leaves'],
        data: [countData.Presents, countData.WFH, countData.Leaves],
        backgroundColor: [successColorShade, warningLightColor, danger],
        borderWidth: 0,
        pointStyle: 'rectRounded'
      }
    ]
  }
const textCenter = {
  id : 'text-center',
  beforeDatasetsDraw(chart) {
    const { ctx } = chart    
    ctx.font = `bold 30px Arial`
    ctx.fillStyle = '#000'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    const totalReported = countData.Presents + countData.WFH + countData.Leaves
    const percentage = (totalReported / countData.Headcount) * 100
    const text = `${percentage.toFixed(0)}%`
    const x = chart.width / 2
    const y = chart.height / 2

    ctx.fillText(text, x, y) 
    ctx.save()
  }
}
  return (
    <>
    <Card style={{height: '210px'}}>
      <CardHeader className='d-flex justify-content-between align-items-sm-center align-items-start flex-sm-row flex-column pb-0 p-1'>
        <CardTitle tag='h4'>Attendance Today</CardTitle>
      </CardHeader>
      <CardBody className='p-0'>
        <Row>
          <Col md='5' className='mb-1'>
            {/* <div className='d-flex justify-content-center'><MdCoPresent size={17} className='text-primary' /> {countData.Presents && countData.Presents} Presents</div>
            <div className='d-flex justify-content-center'><MdHomeWork size={17} className='text-warning' /> {countData.WFH && countData.WFH} WFH</div>
            <div className='d-flex justify-content-center'><FcLeave size={17} className='text-success' /> {countData.Leaves && countData.Leaves} Leaves</div> */}
            <Table striped responsive>
                <thead>
                    <tr>
                        <th className='cursor-pointer' title="List of employees" onClick={() => onClickFunction(countData.PresentsData, countData.Presents, 'presents')}><MdCoPresent size={17} className='text-primary' /> <span style={{fontSize:'xxx-large'}}>{countData.Presents && countData.Presents}</span> Presents</th>
                    </tr>
                    <tr>
                        <th className='cursor-pointer' title="List of employees" onClick={() => onClickFunction(countData.WFHData, countData.WFH, 'wfh')}><MdHomeWork size={17} className='text-warning' /> {countData.WFH && countData.WFH} WFH</th>
                    </tr>
                    <tr>
                        <th className='cursor-pointer' title="List of employees" onClick={() => onClickFunction(countData.LeavesData, countData.Leaves, 'leaves')}><FcLeave size={17} className='text-success' /> {countData.Leaves && countData.Leaves} Leaves</th>
                    </tr>
                </thead>
            </Table>
          </Col>
          <Col md='7'>
            <div style={{ height: '185px' }}>
              <Doughnut data={data} options={options} height={275} plugins={[textCenter]}/>
            </div>
          </Col>
          
        </Row>
      </CardBody>
    </Card>
    <Modal isOpen={basicModal} toggle={() => setBasicModal(!basicModal)}>
    <ModalHeader toggle={() => setBasicModal(!basicModal)}>
        {employeeData.type === 'presents' && (
            <h5 >{employeeData.total} Presents</h5>
        )}
        {employeeData.type === 'wfh' && (
            <h5>{employeeData.total} WFH Today</h5>
        )}
        {employeeData.type === 'leaves' && (
            <h5>{employeeData.total} Leaves</h5>
        )}
    </ModalHeader>
    <ModalBody>
      <EmployeeListData empData={employeeData}/>
    </ModalBody>
    </Modal>
    </>
  )
}

export default AttendancePieChartComponent
