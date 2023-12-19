import React, { Fragment, useState } from 'react'
import { Card, CardBody, CardTitle, CardSubtitle, Badge, Row, Col, Button, Label, Input, Offcanvas, OffcanvasHeader, OffcanvasBody, Spinner } from 'reactstrap'
import { Edit, Eye, XCircle } from 'react-feather'
import Select from 'react-select'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import apiHelper from '../../../../Helpers/ApiHelper'
import ReasonsTable from './ReasonsTable'

const ApprovalsList = ({ data, CallBack, status_choices }) => {
    const Api = apiHelper()
    const MySwal = withReactContent(Swal)
    const [loading, setLoading] = useState(false)
    const [canvasPlacement, setCanvasPlacement] = useState('end')
    const [canvasOpen, setCanvasOpen] = useState(false)
    const [reasonData, setReasonsData] = useState([])
    const toggleCanvasEnd = (reasons) => {
        if (reasons && Object.values(reasons).length > 0) {
            setReasonsData(reasons)
        } 
        setCanvasPlacement('end')
        setCanvasOpen(!canvasOpen)
      }
    const onStatusUpdate = async (id, status_value, comment) => {
        MySwal.fire({
            title: 'Are you sure?',
            text: "Do you want to update the Status!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, update it!',
            customClass: {
            confirmButton: 'btn btn-primary',
            cancelButton: 'btn btn-danger ms-1'
            },
            buttonsStyling: false
        }).then(function (result) {
            if (result.value) {
                const formData = new FormData()
                formData['certification_status'] = status_value
                if (comment !== '') formData['reason'] = comment
                 Api.jsonPatch(`/certification/team/lead/approval/${id}/`, formData)
                    .then((result) => {
                        if (result.status === 200) {
                            MySwal.fire({
                                icon: 'success',
                                title: 'Status Updated!',
                                text: 'Status is updated.',
                                customClass: {
                                confirmButton: 'btn btn-success'
                                }
                            }).then(async function (result) {
                                if (result.isConfirmed) {
                                    setLoading(true)
                                    await CallBack()
                                    setTimeout(() => {
                                        setLoading(false)
                                    }, 1000)
                                }
                            })
                            } else {
                                MySwal.fire({
                                    title: 'Error',
                                    text: result.message ? result.message : 'Something went wrong',
                                    icon: 'error',
                                    customClass: {
                                      confirmButton: 'btn btn-success'
                                    }
                                  })
                            }
                    })
            } 
        })
    }
    const StatusComponent = ({ item, index }) => {
    const [toggleThisElement, setToggleThisElement] = useState(false)
    const [comment, setComment] = useState('')
    const [statusValue, setStatusValue] = useState(item.certification_status ? item.certification_status : '')
    
    return (
        <div className="single-history" key={index}>
        
        {toggleThisElement ? (
            <div className="row min-width-300">
            <div className="col-lg-8">
            <Select
                isClearable={false}
                options={status_choices}
                className='react-select mb-1'
                classNamePrefix='select'
                defaultValue={status_choices.find(({value}) => value === item.certification_status) ? status_choices.find(({value}) => value === item.certification_status) : status_choices[0] }
                onChange={(statusData) => setStatusValue(statusData.value)}
                />
                    <>
                    <Label>
                    Reason
                </Label>
                <Input 
                    type='textarea'
                    className='mb-1'
                    name='commentText'
                    placeholder="Add Reason"
                    onChange={ (e) => { setComment(e.target.value) }}
                />
                </>
                
                <Button className="btn btn-primary" onClick={ async () => {
                    await onStatusUpdate(item.id, statusValue, comment).then(() => {
                        setToggleThisElement((prev) => !prev)
                    })
                }}>
                    Submit
                </Button>
            </div>
            <div className="col-lg-4 float-right">
            <XCircle color="red" onClick={() => setToggleThisElement((prev) => !prev)}/>
            </div>
        </div>
        ) : (
            <div className="row min-width-225">
                <div className="col-lg-8">
                <p><Badge color='light-secondary'>{status_choices.find(({value}) => value === item.certification_status) ? status_choices.find(({value}) => value === item.certification_status).label : status_choices[0].label }</Badge></p>
                </div>
                
                <div className="col-lg-4 float-right">
                    <Edit className="float-right" color="orange" onClick={() => setToggleThisElement((prev) => !prev)}/>
                 </div>
            </div>
        )
            
        }
        </div>
    )
    }
  return (
    <Fragment>
      {!loading ? (
        (data && Object.values(data).length > 0) ? (
            <Row>
                <Col md={12}>
                    {Object.values(data).map((item, index) => (
                        <Card key={index}>
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
                                    <span style={{color: "black", fontWeight:"10px", padding:"0.3rem 0.5rem"}}>{item.mode_of_course_title && item.mode_of_course_title}</span>
                                </div>
                                <div className="col-md-4">
                                <div className="mb-1">
                                    <StatusComponent item={item} key={index}/>
                                    </div>
                                <Badge color='light-success'>
                                Relevance 
                                    </Badge><Eye className='float-right' onClick={() => toggleCanvasEnd(item.decision)}/><br></br>
                                    <h4><Badge color='light-danger'>{item.relevance_title ? item.relevance_title : <Badge color='light-danger'>N/A</Badge>}</Badge></h4>
                                    
                                </div>
                            </div>
                        </CardBody>
                        </Card> 
                    ))}
                </Col>   
            </Row>
        ) : (
            <div className="text-center">No Certifications Data Found!</div>
        )
      ) : (
        <div className='text-center'><Spinner color='white'/></div>
      )
      
        }

         <Offcanvas direction={canvasPlacement} isOpen={canvasOpen} toggle={toggleCanvasEnd} className="Job-Form-Canvas">
          <OffcanvasHeader toggle={toggleCanvasEnd}></OffcanvasHeader>
          <OffcanvasBody className=''>
            <ReasonsTable reasonsData={reasonData}/>
          </OffcanvasBody>
        </Offcanvas>
    </Fragment>
  )
}

export default ApprovalsList