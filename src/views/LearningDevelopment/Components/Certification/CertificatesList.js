import React, { Fragment, useState } from 'react'
import { DollarSign, Eye, Trash2 } from 'react-feather'
import { Card, CardBody, CardTitle, CardSubtitle, Badge, Row, Col, Offcanvas, OffcanvasHeader, OffcanvasBody } from 'reactstrap'
import CertificateDetails from './CertificateDetails'
import apiHelper from '../../../Helpers/ApiHelper'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Reimbursement from './Reimbursement'

const CertificateList = ({ data, CallBack }) => {
    const Api = apiHelper()
    const [canvasPlacement, setCanvasPlacement] = useState('end')
    const [canvasOpen, setCanvasOpen] = useState(false)
    const [updateData, setUpdateData] = useState([])
    const [toggleType, setToggleType] = useState('')
    const MySwal = withReactContent(Swal)
    const toggleCanvasEnd = (item, type) => {
        setToggleType(type)
        if (item) setUpdateData(item)
        setCanvasPlacement('end')
        setCanvasOpen(!canvasOpen)
      }
      const CallBackList = () => {
        CallBack()
        setCanvasPlacement('end')
        setCanvasOpen(!canvasOpen)
      }
      const deleteCertification = (id) => {
        MySwal.fire({
            title: 'Are you sure?',
            text: "Do you want to remove the Certification!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Delete it!',
            customClass: {
            confirmButton: 'btn btn-primary',
            cancelButton: 'btn btn-danger ms-1'
            },
            buttonsStyling: false
        }).then(function (result) {
            if (result.value) {
                Api.deleteData(`/certification/employee/${id}/`, {method: 'DELETE'})
                .then((deleteResult) => {
                    if (deleteResult.status === 200) {
                        MySwal.fire({
                            icon: 'success',
                            title: 'Certification Deleted!',
                            text: 'Certification is Deleted.',
                            customClass: {
                            confirmButton: 'btn btn-success'
                            }
                        }).then(function (result) {
                            if (result.isConfirmed) {
                                CallBack()
                            }
                        })
                    } else {
                        MySwal.fire({
                            icon: 'error',
                            title: deleteResult.message ? deleteResult.message : 'Certification can not be Deleted!',
                            text: 'Certification is not Deleted.',
                            customClass: {
                            confirmButton: 'btn btn-danger'
                            }
                        })
                    }
                        
                    })
            } 
        })
    }
  return (
    <Fragment>
      {(data && Object.values(data).length > 0) ? (
            <Row>
                <Col md={12}>
                    {Object.values(data).map((item, index) => (
                        <Card key={index} className="dark-shadow">
                        <CardBody>
                            <div className="row">
                                
                                <div className="col-md-4">
                                <CardTitle tag='h1'>{item.employee_name ? item.employee_name : <Badge color='light-danger'>N/A</Badge>}</CardTitle>
                                <CardSubtitle>
                                Course: <b>{item.title ? item.title : 'Title not found!'}</b>
                                <h4><Badge color='light-success'>Cost: {item.cost ? item.cost : <Badge color='light-danger'>N/A</Badge>}</Badge></h4>
                                    <h4><Badge color='light-warning'>{`${item.certification_status_title ? item.certification_status_title : <Badge color='light-danger'>N/A</Badge>}`}</Badge></h4></CardSubtitle>
                                </div>
                                <div className="col-md-4">
                                    <Badge color='light-success'>
                                            Duration
                                    </Badge><br></br>
                                    <span className="jd_position" style={{color: "black", fontWeight:"20px", padding:"0.3rem 0.5rem"}}>{item.duration && item.duration}</span>
                                    
                                    <br></br><Badge color='light-danger'>
                                        Mode
                                    </Badge><br></br>
                                    <span style={{color: "black", fontWeight:"10px", padding:"0.3rem 0.5rem"}}>{item.mode_of_course_title ? item.mode_of_course_title : 'N/A'}</span>
                                </div>
                                <div className="col-md-4">
                                    <Badge color='light-success'>
                                        Relevance
                                    </Badge><br></br>
                                    <h4><Badge color='light-danger'>{item.relevance_title ? item.relevance_title : <Badge color='light-danger'>N/A</Badge>}</Badge></h4>
                                   <div className='mt-1'>
                                        <Eye color='green' onClick={() => toggleCanvasEnd(item, 'view')} />
                                        {(item.certification_status === 4 || item.certification_status > 4) && (
                                            <DollarSign color='orange' onClick={() => toggleCanvasEnd(item, 'reimbursement')}/>
                                        )}
                                        {item.certification_status === 1 && (
                                            <Trash2 color='red' onClick={() => deleteCertification(item.id)}/>
                                        )}
                                    </div>
                                </div>
                            </div>
                                
                        </CardBody>
                        </Card> 
                    ))}
                </Col>   
            </Row>
        ) : (
            <div className="text-center">No Certifications Data Found!</div>
        )}
          <Offcanvas direction={canvasPlacement} isOpen={canvasOpen} toggle={toggleCanvasEnd} >
        <OffcanvasHeader toggle={toggleCanvasEnd}></OffcanvasHeader>
        <OffcanvasBody className=''>
            {toggleType === 'view' && (
                <CertificateDetails data={updateData}/>
            )}
            {toggleType === 'reimbursement' && (
                <Reimbursement data={updateData} CallBack={CallBackList}/>
            )}
           
        </OffcanvasBody>
      </Offcanvas>
    </Fragment>
  )
}

export default CertificateList