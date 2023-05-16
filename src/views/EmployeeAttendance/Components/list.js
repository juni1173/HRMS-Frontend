import {Fragment, useEffect, useState} from 'react'
import { Button, Card, CardBody, Spinner, Row, Col, Table, Modal, ModalHeader, ModalBody, ModalFooter, Label } from 'reactstrap'
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
            await Api.get(`/attendance/list/`)
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
            if (check_in_time) {
                const formData = new FormData()
            formData['check_in'] = check_in_time && check_in_time
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
            } else {
                Api.Toast('error', 'Check in time is required!!')
            }
            
            setTimeout(() => {
                setLoading(false)
              }, 1000)
    }
    const Check_out = async () => {
        if (check_out_time) {
            setLoading(true)
            const formData = new FormData()
            formData['check_out'] = check_out_time && check_out_time 
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
        } else {
            Api.Toast('error', 'Check out time is required!')
        }
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
                    <Col md={6}>
                        <Button className='btn btn-success' onClick={() => {
                            setBtnStatus('check_in')
                            setCenteredModal(!centeredModal)
                            }}>
                            Check In
                        </Button>
                    </Col>
                    <Col md={6}>
                        <Button className='btn btn-danger float-right' onClick={() => {
                            setBtnStatus('check_out')
                            setCenteredModal(!centeredModal)
                        }}>
                            Check Out
                        </Button>
                    </Col>
                </Row>
                    <Table>
                    <thead>
                        <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Check In</th>
                        <th>Check Out</th>
                        </tr>
                    </thead>
                    {!loading ? (
                    Object.values(atndceData).length > 0 ? (
                        atndceData.map((item, key) => (
                            <tbody key={key}>
                                <tr>
                                <td>{item.date}</td>
                                <td>{item.attendance_type}</td>
                                <td>{item.check_in}</td>
                                <td>{item.check_out}</td>
                                </tr>
                            </tbody>
                        ))
                    ) : (
                        <tbody>
                            <tr>
                            <td colSpan={4}><div className='text-center'>No Data Found</div></td>
                            </tr>
                        </tbody>
                    )
                    ) : (
                        <tbody>
                            <tr>
                            <td colSpan={4}><div className='text-center'><Spinner /></div></td>
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