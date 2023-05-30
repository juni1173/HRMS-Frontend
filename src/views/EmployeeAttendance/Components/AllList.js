import {Fragment, useEffect, useState} from 'react'
import { Button, Card, CardBody, Spinner, Row, Col, Table, Modal, ModalHeader, ModalBody, ModalFooter, Label, Badge } from 'reactstrap'
import apiHelper from '../../Helpers/ApiHelper'
const list = () => {
    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const [atndceData, setAtndceData] = useState([])
    const [centeredModal, setCenteredModal] = useState(false)
    const [check_in_time, setCheckInTime] = useState(null)
    const [check_out_time, setCheckOutTime] = useState(null)
    const [btnstatus, setBtnStatus] = useState('')
    const getAttendanceData = async () => {
            setLoading(true)
            await Api.get(`/attendance/list/all/`)
            .then((result) => {
                if (result) {
                    if (result.status === 200) {
                        if (result.data.length > 0) {
                            setAtndceData(result.data)
                        }
                    } else {
                            Api.Toast('error', result.message)
                    }
                } else {
                    Api.Toast('error', 'Server not responding')
                }
            })
            setTimeout(() => {
                setLoading(false)
              }, 1000)
    }
    const Check_in = async () => {
            setLoading(true)
                const formData = new FormData()
            if (check_in_time) formData['check_in'] = check_in_time
            await Api.jsonPost(`/attendance/check_in/`, formData)
            .then((result) => {
                if (result) {
                    if (result.status === 200) {
                            setCenteredModal(false)
                            getAttendanceData()
                    } else {
                            Api.Toast('error', result.message)
                        
                    }
                } else {
                    Api.Toast('error', 'Server not responding')
                }
            })
           
            
            setTimeout(() => {
                setLoading(false)
              }, 1000)
    }
    const Check_out = async () => {
            setLoading(true)
            const formData = new FormData()
            if (check_out_time) formData['check_out'] = check_out_time 
            await Api.jsonPost(`/attendance/check_out/`, formData)
            .then((result) => {
                if (result) {
                    if (result.status === 200) {
                            setCenteredModal(false)
                            getAttendanceData()
                    } else {
                            Api.Toast('error', result.message)
                        
                    }
                } else {
                    Api.Toast('error', 'Server not responding')
                }
            })
            setTimeout(() => {
                setLoading(false)
              }, 1000)
        
    }
    const getCurrentTime = () => {
        const today = new Date()
        const time = `${today.getHours()}:${today.getMinutes()}}`
        return time
    }
    useEffect(() => {
        getAttendanceData()
    }, [setAtndceData])
  return (
    <Fragment>
        <Card>
            <CardBody>
                <h3 className='mb-2'>Attendance</h3>
                <Row className='mb-2'>
                    <Col className='col-6'>
                        <Button className='btn btn-success' onClick={() => {
                            setBtnStatus('check_in')
                            setCenteredModal(!centeredModal)
                            }}>
                            Check In
                        </Button>
                    </Col>
                    <Col className='col-6'>
                        <Button className='btn btn-danger float-right' onClick={() => {
                            setBtnStatus('check_out')
                            setCenteredModal(!centeredModal)
                        }}>
                            Check Out
                        </Button>
                    </Col>
                </Row>
                    <Table bordered striped responsive>
                    <thead className='table-dark text-center'>
                        <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Duration</th>
                        <th>Check In</th>
                        <th>Check Out</th>
                        </tr>
                    </thead>
                    {!loading ? (
                    Object.values(atndceData).length > 0 ? (
                        atndceData.map((item, key) => (
                            <tbody key={key}>
                                <tr>
                                <td className='nowrap'>{item.date ? item.date : <Badge color='light-danger'>N/A</Badge>}</td>
                                <td>{item.attendance_type ? item.attendance_type : <Badge color='light-danger'>N/A</Badge>}</td>
                                <td>{item.duration ? <Badge color='light-success'>{item.duration}</Badge> : <Badge color='light-danger'>N/A</Badge>}</td>
                                <td>{item.check_in ? item.check_in : <Badge color='light-danger'>N/A</Badge>}</td>
                                <td>{item.check_out ? item.check_out : <Badge color='light-danger'>N/A</Badge>}</td>
                                </tr>
                            </tbody>
                        ))
                    ) : (
                        <tbody>
                            <tr>
                            <td colSpan={5}><div className='text-center'>No Data Found</div></td>
                            </tr>
                        </tbody>
                    )
                    ) : (
                        <tbody>
                            <tr>
                            <td colSpan={5}><div className='text-center'><Spinner /></div></td>
                            </tr>
                        </tbody>
                            
                    )
                    }
                </Table>
            </CardBody>
        </Card>
        <Modal isOpen={centeredModal} toggle={() => setCenteredModal(!centeredModal)} className='modal-dialog-centered'>
          <ModalHeader toggle={() => setCenteredModal(!centeredModal)}>Enter Time</ModalHeader>
          <ModalBody>
                
                    {btnstatus === 'check_in' && (
                        <>
                        <Col md="6" className="mb-1">
                        <Label className="form-label">
                         Time
                        </Label><br></br>
                            <input className="form-control" type="time" onChange={e => setCheckInTime(e.target.value)} defaultValue={getCurrentTime}></input>
                            </Col>
                            <Col md="6" className="mb-1">
                                <Button className='btn btn-primary' onClick={Check_in}>
                                Check in
                            </Button>
                            </Col>
                      </>
                    )} 
                    {btnstatus === 'check_out' && (
                        <>
                        <Col md="6" className="mb-1">
                        <Label className="form-label">
                         Time
                        </Label><br></br>
                            <input className="form-control" type="time" onChange={e => setCheckOutTime(e.target.value)}></input>
                        
                            </Col>
                            <Col md="6" className="mb-1">
                            <Button className='btn btn-primary' onClick={Check_out}>
                                Check out
                            </Button>
                            </Col>
                      </>
                    )}
                
          </ModalBody>
          <ModalFooter>
           
          </ModalFooter>
        </Modal>
    </Fragment>
  )
}

export default list