import {Fragment, useState} from 'react'
import { Row, Col, Table, Spinner, Button, Badge, CardBody, Card, CardTitle, Offcanvas, OffcanvasHeader, OffcanvasBody } from 'reactstrap'
import { Eye, Trash2 } from 'react-feather'
import TicketDetails from './TicketDetails'
import apiHelper from '../../Helpers/ApiHelper'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const TicketList = ({ data, CallBack }) => {
  const Api = apiHelper()
  const MySwal = withReactContent(Swal)
  const [canvasPlacement, setCanvasPlacement] = useState('end')
    const [canvasOpen, setCanvasOpen] = useState(false)
    const [UpdateData, setUpdateData] = useState([])
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
    const deleteAction = (id) => {
      console.warn(id)
      MySwal.fire({
          title: 'Are you sure?',
          text: "Do you want to remove ticket?",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, proceed!',
          customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-danger ms-1'
          },
          buttonsStyling: false
      }).then(function (result) {
          if (result.value) {
              Api.deleteData(`/ticket/employee/${id}/`, {method: 'Delete'})
              .then((deleteResult) => {
                  if (deleteResult.status === 200) {
                      MySwal.fire({
                          icon: 'success',
                          title: 'Ticket Deleted!',
                          text: 'Ticket deleted successfully.',
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
                          title: 'Ticket can not be deleted!',
                          text: deleteResult.message ? deleteResult.message : 'Ticket is not in deleted.',
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
    {data && Object.values(data).length > 0 ? (
                    Object.values(data).map((item, key) => (
                        <div className="row" key={key}>
                                    <Col md={12} className='p-0'>
                                        <Card bg="light" style={{ backgroundColor: '#F2F3F4' }} className='text-nowrap'>    
                                            <CardBody>
                                                <Row>
                                                    <Col md={4}><h4>{item.subject ? (item.subject).substring(0, 25) : 'N/A'}</h4></Col>
                                                    <Col md={4}>
                                                       {item.category === 1 && (<><b>Lead - </b><Badge color='light-warning'>{item.team_lead_name ? item.team_lead_name : 'N/A'}</Badge><br></br></>)}
                                                    </Col>
                                                    <Col md={4} className='d-flex justify-content-end'>
                                                        <Eye color='green' onClick={() => DetailsToggle(item)}/><br></br>
                                                    </Col>
                                                    <Col md={4}>
                                                        {item.ticket_status_title ? (
                                                        <>
                                                            <Badge color="light-success">{item.ticket_status_title}</Badge>
                                                        </>
                                                        ) : <Badge color="light-danger">N/A</Badge>}<br></br>
                                                        <Badge color='light-warning' className='mt-1'>{item.category_title ? item.category_title : 'N/A'}</Badge>
                                                    </Col>
                                                    <Col md={4}>
                                                        {item.transfer_to && <><b>{`Transferred to ${(item.transfer_to_name ? item.transfer_to_name.toUpperCase() : 'N/A')}`}</b><br></br></>}
                                                        {item.category !== 3 && (<><b>Assign To - </b><Badge color='light-info' className='mt-1'>{item.assign_to_name ? item.assign_to_name : 'N/A'}</Badge></>)}
                                                    </Col>
                                                    <Col md={4} className="">
                                                        <p>{item.ticket_status === 1 && <Trash2 className="float-right" color='red' onClick={() => deleteAction(item.id)}/>}</p><br></br>
                                                        <span style={{color: '#808080b5'}} className="float-right">{Api.formatDateDifference(item.updated_at)}</span>
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

export default TicketList