import {Fragment, useState} from 'react'
import { Row, Col, Input, Button, Badge, CardBody, Card, Label, Offcanvas, OffcanvasHeader, OffcanvasBody } from 'reactstrap'
import { Eye, Edit, XCircle, CheckCircle } from 'react-feather'
import TicketDetails from '../../Components/TicketDetails'
import apiHelper from '../../../Helpers/ApiHelper'
import Select from 'react-select'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const HRTicketsList = ({ data, CallBack }) => {
  const Api = apiHelper()
  const MySwal = withReactContent(Swal)
  const [canvasPlacement, setCanvasPlacement] = useState('end')
    const [canvasOpen, setCanvasOpen] = useState(false)
    const [UpdateData, setUpdateData] = useState([])
    const status_choices = [
        {value: 1, label: 'Pending'},
        {value: 2, label:'In Progress by Team Lead'},
        {value: 3, label: 'Rejected by Team Lead'},
        {value: 4, label: 'Approved by Team Lead'},
        {value: 5, label: 'In Progress by CTO'},
        {value: 6, label: 'Rejected by CTO'},
        {value: 7, label: 'Approved by CTO'},
        {value: 8, label: 'In Progress by Admin'},
        {value: 9, label: 'Rejected by Admin'},
        {value: 10, label: 'Solved by Admin'},
        {value: 11, label: 'In Progress by HR'},
        {value: 12, label: 'Reject by HR'},
        {value: 13, label: 'Solved by HR'}
    ]
    const hr_choices = [
        {value: 11, label:'In Progress by HR'},
        {value: 12, label: 'Reject by HR'},
        {value: 13, label: 'Solved by HR'}
    ]
    const toggleCanvasEnd = () => {
      setCanvasPlacement('end')
      setCanvasOpen(!canvasOpen)
    }
    const DetailsToggle = (item) => {
      if (item !== null) {
          setUpdateData(item)
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
                formData['ticket_status'] = status_value
                if (comment !== '') {
                    formData['decision_reason'] = comment
                    Api.jsonPatch(`/ticket/action/by/hr/${id}/`, formData)
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
                                    await CallBack()
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
                } else Api.Toast('error', 'Comment is required!')
            } 
        })
    }
    const StatusComponent = ({ item, index }) => {
        const [toggleThisElement, setToggleThisElement] = useState(false)
        const [comment, setComment] = useState('')
        const [statusValue, setStatusValue] = useState('')
        return (
            <div className="single-history" key={index}>
            
            {toggleThisElement ? (
                <div className="row min-width-300">
                <div className="col-lg-8">
                <Select
                    isClearable={false}
                    options={hr_choices}
                    className='react-select mb-1'
                    classNamePrefix='select'
                    defaultValue={status_choices.find((value) => value === item.ticket_status) ? status_choices.find((value) => value === item.ticket_status) : status_choices[0] }
                    onChange={(statusData) => setStatusValue(statusData.value)}
                    />
                    <>
                        <Label>
                            Comment
                        </Label>
                        <Input 
                            type='textarea'
                            className='mb-1'
                            name='commentText'
                            placeholder="Add Remarks"
                            onChange={ (e) => { setComment(e.target.value) }}
                        />
                    </>
                    
                    <Button className="btn btn-primary" onClick={ async () => {
                        await onStatusUpdate(item.id, statusValue, comment).then(() => {
                            setToggleThisElement((prev) => !prev)
                        })
                    }} >
                        Submit
                    </Button>
                </div>
                <div className="col-lg-4 float-right">
                <XCircle color="red" onClick={() => setToggleThisElement((prev) => !prev)}/>
                </div>
            </div>
            ) : (
                <div className="row min-width-225">
                    <div className="col-lg-9">
                    <h3><Badge color='light-secondary'>{status_choices.find(({value}) => value === item.ticket_status) ? status_choices.find(({value}) => value === item.ticket_status).label : status_choices[0].label }</Badge></h3>
                    </div>
                    {item.ticket_status === 11 && (
                        <div className="col-lg-3 float-right">
                            <Edit color="orange" onClick={() => setToggleThisElement((prev) => !prev)}/>
                        </div>
                    )}
                </div>
            )
                
            }
            </div>
        )
        }
    
  return (
    <Fragment>
        <h3 className="mb-2">HR Services Tickets</h3>
    {data && Object.values(data).length > 0 ? (
                    Object.values(data).map((item, key) => (
                        <div className="row" key={key}>
                                    <Col md={12} className='p-0'>
                                        <Card bg="light" style={{ backgroundColor: '#F2F3F4' }} className='text-nowrap'>    
                                            <CardBody>
                                                <Row>
                                                    <Col md={4} className='mb-1'><h4>{item.subject ? (item.subject).substring(0, 30) : 'N/A'}</h4></Col>
                                                    
                                                    <Col md={4} className=''>
                                                        {(item.ticket_status === 4 || item.ticket_status === 7 || item.ticket_status === 10 || item.ticket_status === 13) ? (
                                                                <>
                                                                    <CheckCircle color='green'/> {item.ticket_status_title ? item.ticket_status_title : 'N/A'}
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Badge color='light-warning'>{item.ticket_status_title ? item.ticket_status_title : 'N/A'}</Badge>
                                                                </>
                                                        )}
                                                    </Col>
                                                    <Col md={4} className='d-flex justify-content-end'>
                                                        <Eye color='green' onClick={() => DetailsToggle(item)}/><br></br>
                                                    </Col>
                                                    <Col md={4}>
                                                        {item.employee_name ? (
                                                        <>
                                                            <b style={{color:'#808080b5'}}>{item.employee_name}</b>
                                                        </>
                                                        ) : <Badge color="light-danger">N/A</Badge>}<br></br>
                                                       
                                                    </Col>
                                                    <Col md={4}>
                                                        {item.ticket_status === 11 && (
                                                            <StatusComponent item={item} key={key}/>
                                                        )}  
                                                    </Col>
                                                    <Col md={4} className="d-flex justify-content-end">   
                                                    <span style={{color: '#808080b5'}} className="mt-1">{Api.formatDateDifference(item.updated_at)}</span>
                                                    </Col>
                                                    
                                                </Row>
                                        
                                            </CardBody>
                                        </Card>
                                    </Col>
                        </div>
                        ))
                    
      ) : (
          <div className="text-center">No Ticket Data Found!</div>
    )}
     <Offcanvas direction={canvasPlacement} isOpen={canvasOpen} toggle={toggleCanvasEnd} >
          <OffcanvasHeader toggle={toggleCanvasEnd}></OffcanvasHeader>
          <OffcanvasBody className=''>
           <TicketDetails data={UpdateData}/>
            
          </OffcanvasBody>
        </Offcanvas>
    </Fragment>
  )
}

export default HRTicketsList