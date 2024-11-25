import React, {useState} from 'react'
import { Col, Card, CardBody, Badge, ListGroup, ListGroupItem, Offcanvas, OffcanvasHeader, OffcanvasBody} from 'reactstrap'
import Avatar from '@components/avatar'
import defaultAvatar from '@src/assets/images/avatars/user_blank.png'
import Masonry from 'react-masonry-component'
import { FaUser } from "react-icons/fa"
import EmployeeKpiList from './Components/EmployeeKpiList'
const EmployeeListCard = ({ data, statusLevel, dropdownData }) => {
    const [employee, setEmployee] = useState([])
    const [canvasPlacement, setCanvasPlacement] = useState('end')
    const [canvasOpen, setCanvasOpen] = useState(false)
    const toggleCanvasEnd = () => {
        setCanvasPlacement('end')   
        setCanvasOpen(!canvasOpen)
    }

    const ViewKpisToggle = (item) => {
        // return false
        if (item !== null) {
            setEmployee(item)
        }
        setCanvasPlacement('end')
        setCanvasOpen(!canvasOpen)
        
    }
  return (
    <>
        <div className='d-flex justify-content-end'>
            <p><FaUser /> {data && data.length} Employees</p>
        </div>
       <Masonry className="row" style={{background: '#e9e9e9'}}>
               {Object.values(data).map((employee) => (
                 <Col md={4} key={employee.employee_id} className="pt-1">
                   <Card className='mb-0 border-primary-glow cursor-pointer' onClick={() => ViewKpisToggle(employee)}>
                     <CardBody>
                       {/* Avatar and Name */}
                       <div className="d-flex align-items-center">
                            <Avatar img={employee.profile_image ? `${employee.profile_image}` : defaultAvatar} imgHeight='50' imgWidth='50' />
                         <div className="mx-1">
                           <h5>{employee.employee_name}</h5>
                           <small>{employee.department_title} - {employee.designation_title || 'No Designation'}</small>
                         </div>
                       </div>
                        {employee.total_kpis === 0 && (
                            <ListGroup>
                                <ListGroupItem style={{zIndex: '0'}} active>
                                    No Kpi Recieved!
                                </ListGroupItem>
                            </ListGroup>
                        )}
                       {/* Status Count */}
                       {employee.employee_kpis_data.status_count_details.length > 0 && (
                             <ListGroup>
                                <ListGroupItem style={{zIndex: '0'}} className='d-flex justify-content-between align-items-center' active>
                                    <span>Total KPIs</span>
                                    <Badge color='danger' pill>
                                        {employee.total_kpis}
                                    </Badge>
                                </ListGroupItem>
                                {employee.employee_kpis_data.status_count_details.map((status, index) => (
                                    <ListGroupItem key={index} className={(statusLevel && statusLevel === status.status_level) ? 'd-flex justify-content-between align-items-center border-warning-glow' : 'd-flex justify-content-between align-items-center'}>
                                        <span>{status.status_title}</span>
                                        <Badge color='primary' pill>
                                            {status.status_count}
                                        </Badge>
                                    </ListGroupItem>
                                ))}
                            </ListGroup>
                       )}
                     </CardBody>
                   </Card>
                 </Col>
               ))}
        </Masonry>
        <Offcanvas direction={canvasPlacement} isOpen={canvasOpen} toggle={toggleCanvasEnd} >
          <OffcanvasHeader toggle={toggleCanvasEnd}></OffcanvasHeader>
          <OffcanvasBody className=''>
            {employee && Object.values(employee).length > 0 ? (
                <EmployeeKpiList data={employee} statusLevel={statusLevel} dropdownData={dropdownData}/>
            ) : null}
            {/* <KpiListHR data={employee} dropdownData={dropdownData} CallBack={CallBack} type={type}/> */}
            
          </OffcanvasBody>
        </Offcanvas>
    </>
  )
}

export default EmployeeListCard