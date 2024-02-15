import React, { Fragment, useState } from 'react'
import { Row, Col, Badge, Offcanvas, OffcanvasHeader, OffcanvasBody, Card, CardBody, CardTitle } from 'reactstrap'
import { Eye, Star } from 'react-feather'
import Avatar from '@components/avatar'
import defaultAvatar from '@src/assets/images/avatars/user_blank.png'
// import KpiRequests from './kpiRequests2'
import KpiListHR from './kpiListHR'
const EmployeeListHR = ({ data, dropdownData, CallBack, type }) => {
    
    const [employee, setEmployee] = useState('')
    const [canvasPlacement, setCanvasPlacement] = useState('end')
    const [canvasOpen, setCanvasOpen] = useState(false)
    
    const toggleCanvasEnd = () => {
        setCanvasPlacement('end')
        setCanvasOpen(!canvasOpen)
    }

    const ViewKpisToggle = (item) => {
        if (item !== null) {
            setEmployee(item)
        }
        setCanvasPlacement('end')
        setCanvasOpen(!canvasOpen)
        
    }
  return (
    <Fragment>
        {Object.values(data).length > 0 ? (
                // <Card>
                //     <CardBody>
                    <Row>
                            {Object.values(data).reverse().map((item, key) => (
                                    <Col md={6} key={key}>
                                        <Card bg="light" style={{ backgroundColor: '#F2F3F4' }} className='text-nowrap'>    
                                            <CardBody>
                                                <Row>
                                                    <Col md={12}>
                                                        <CardTitle>
                                                            <Row>
                                                                <Col md="2" className='float-right'>
                                                                    <Avatar img={item.profile_image ? `${item.profile_image}` : defaultAvatar} imgHeight='50' imgWidth='50' />
                                                                </Col>
                                                                <Col md="10">
                                                                {item.name ? (item.name) : 'N/A'}<br></br>
                                                                <Badge color="success" className='badge-glow'>{item.employment_type_title ? item.employment_type_title : 'N/A'}</Badge>
                                                                </Col>
                                                            </Row>
                                                            </CardTitle></Col>
                                                    <Col md={6} >
                                                            <Badge color='light-warning'>
                                                                <Star size={20} className='align-middle me-25' />
                                                                <span className='align-middle'>Total Kpis</span>
                                                            </Badge>
                                                            <Badge color="danger" className='badge-glow'>{item.total_kpis ? item.total_kpis : 'N/A'}</Badge>
                                                    </Col>
                                                    <Col md={6}>
                                                        <Eye className='float-right' onClick={() => ViewKpisToggle(item)}/>
                                                    </Col>
                                                   
                                                </Row>
                                        
                                            </CardBody>
                                        </Card>
                                    </Col>
                            ))}
                    </Row>
                //     </CardBody>
                // </Card> 
            ) : (
                <div className="text-center text-white">No Kpi Data Found!</div>
            )
        }
        <Offcanvas direction={canvasPlacement} isOpen={canvasOpen} toggle={toggleCanvasEnd} >
          <OffcanvasHeader toggle={toggleCanvasEnd}></OffcanvasHeader>
          <OffcanvasBody className=''>
            <KpiListHR data={employee} dropdownData={dropdownData} EmployeeCallBack={CallBack} type={type}/>
            
          </OffcanvasBody>
        </Offcanvas>
    </Fragment>
  )
}

export default EmployeeListHR