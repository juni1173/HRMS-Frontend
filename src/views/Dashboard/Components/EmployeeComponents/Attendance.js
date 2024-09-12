import {Fragment, useEffect, useState} from 'react'
import { Button, Card, CardBody, Spinner, Row, Col, Table, Modal, ModalHeader, ModalBody, ModalFooter, Label, Badge, Input } from 'reactstrap'
import apiHelper from '../../../Helpers/ApiHelper'
import Select from 'react-select'
import Flatpickr from 'react-flatpickr'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { Clock } from 'react-feather'
import EmployeeHelper from '../../../Helpers/EmployeeHelper'
const Attendance = ({atndceData, CallBack}) => {
    const Api = apiHelper()
    const EmpHelper = EmployeeHelper()
    const [loading, setLoading] = useState(false)
    const [centeredModal, setCenteredModal] = useState(false)
    const [check_in_time, setCheckInTime] = useState(Api.currentTime)
    const [check_out_time, setCheckOutTime] = useState(Api.currentTime)
    const [date, setDate] = useState(new Date())
    const [type, setType] = useState('')
    const [btnstatus, setBtnStatus] = useState('')
    const [notifyActive, setNotifyActive] = useState(false)
    const [notify, setNotify] = useState(false)
    const [teamLead, setTeamLead] = useState('')
    const types_choices = [
        // {value:'office', label: 'office'},
        {value: 'WFH', label: 'WFH'}
    ]
    const typeChange = (e) => {
        if (e) {
            setType(e)
            if (e === 'WFH') {
                setNotifyActive(true)
            } else setNotifyActive(false)
        }
    }
    const handleCheck = (event) => {
        // const { id } = event.target
        const isChecked = event.target.checked
        setNotify(isChecked)
    }
    const notifyTL = async () => {
        if (notifyActive && notify) {
            if (teamLead !== '') {
                const formData = new FormData()
                formData['team_lead'] = teamLead
              await  Api.jsonPost(`/attendance/notify/`, formData).then(result => {
                    if (result.status === 200) {

                    } else Api.Toast('error', result.message)
                })
            } else Api.Toast('error', 'Please select team lead to notify!')
        }
    }
    const Check_in = async () => {
      
            setLoading(true)
            if (type !== '') {
                const formData = new FormData()
                if (check_in_time) formData['check_in'] = `${check_in_time}:00`
                if (date) formData['date'] = Api.formatDate(date)
                if (type) formData['attendance_type'] = type
                await Api.jsonPost(`/attendance/check_in/`, formData)
                .then((result) => {
                    if (result) {
                        if (result.status === 200) {
                                setCenteredModal(false)
                                notifyTL()
                                CallBack()
                                Api.Toast('success', result.message)
                        } else {
                                Api.Toast('error', result.message)
                            
                        }
                    } else {
                        Api.Toast('error', 'Server not responding')
                    }
                })
            } else {
                Api.Toast('error', 'Please fill all required fields!')
            }
            setTimeout(() => {
                setLoading(false)
              }, 1000)
    }
    const Check_out = async () => {
            setLoading(true)
                const formData = new FormData()
                if (check_out_time) formData['check_out'] = `${check_out_time}:00` 
                if (date) formData['date'] = Api.formatDate(date)
                await Api.jsonPost(`/attendance/check_out/`, formData)
                .then((result) => {
                    if (result) {
                        if (result.status === 200) {
                                setCenteredModal(false)
                                CallBack()
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
    const EmployeeList = () => {
        const [employees, setEmployees] = useState([])
        useEffect(() => {
            if (Object.values(employees).length === 0) {
                EmpHelper.fetchEmployeeDropdown().then(result => {
                    setEmployees(result)
                })
            }
        }, [setEmployees])
        return (
            <>
                <Label>Select Team Lead</Label>
                <Select
                options={employees}
                onChange={(e) => setTeamLead(e.value)}
                />
            </>
        )
    }
    

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
                        <th>Check In</th>
                        <th>Check Out</th>
                        </tr>
                    </thead>
                    {!loading ? (
                    (atndceData && Object.values(atndceData).length > 0) ? (
                        atndceData.map((item, key) => (
                            <tbody key={key}>
                                <tr>
                                <td className='nowrap'>{item.date}</td>
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
        <Modal isOpen={centeredModal} toggle={() => setCenteredModal(!centeredModal)} className='modal-dialog-centered modal-lg'>
          <ModalHeader toggle={() => setCenteredModal(!centeredModal)}></ModalHeader>
          <ModalBody>
                
                    {btnstatus === 'check_in' && (
                        <Row>
                         <Col md="12">
                           <h3> Check in</h3></Col>   
                        <Col md="3" className="mb-1">
                        <Label className="form-label">
                         Time
                        </Label><br></br>
                            <input className="form-control" type="time" onChange={e => setCheckInTime(e.target.value)} defaultValue={check_in_time}></input>
                        </Col>
                        <Col md={notifyActive ? "2" : "3"}>
                        <Label className='form-label' for='default-picker'>
                            Date
                            </Label>
                            <Flatpickr className='form-control'  
                            onChange={(e) => setDate(e)} 
                            id='default-picker' 
                            placeholder='Date'
                            options={{
                                defaultDate: date
                                // disable: [
                                // function(date) {
                                //     // Weekend disable
                                //     return (date.getDay() === 0 || date.getDay() === 6) 
                                // }
                                // ]
                            } }
                            />
                        </Col>
                        <Col md={notifyActive ? "2" : "3"}>
                            <Label>
                                Type <Badge color="light-danger">*</Badge>
                            </Label>
                            <Select
                                isClearable={false}
                                className='react-select'
                                classNamePrefix='select'
                                name="type"
                                options={types_choices}
                                defaultValue={types_choices.find(pre => pre.value === type)}
                                onChange={ (e) => typeChange(e.value) }
                            />
                        </Col>
                        {notifyActive && (
                            <Col md="2" className='mb-1'>
                                <Label>
                                    Notify Team Lead
                                </Label><br></br>
                                <Input type='checkbox' 
                                onChange={handleCheck}
                                />
                            </Col>
                        )}
                        {notify && (
                            <>
                            <Col md="3" className='mb-1'>
                                <EmployeeList />
                            </Col>
                            <Col md="9"></Col>
                            </>
                        )}
                            
                            <Col md="3" className="mb-1">
                                <Button className='btn btn-primary mt-2 float-right' onClick={Check_in}>
                                <Clock/>
                            </Button>
                            </Col>
                      </Row>
                    )} 
                    {btnstatus === 'check_out' && (
                        <Row>
                            <Col md="12">
                           <h3> Check out</h3></Col>  
                        <Col md="4" className="mb-1">
                        <Label className="form-label">
                         Time 
                        </Label><br></br>
                            <input className="form-control" type="time" onChange={e => setCheckOutTime(e.target.value)} defaultValue={check_out_time}></input>
                        </Col>
                        <Col md="4">
                            <Label className='form-label' for='default-picker'>
                            Date
                            </Label>
                            <Flatpickr className='form-control'  
                            onChange={(e) => setDate(e)} 
                            id='default-picker' 
                            placeholder='Date'
                            options={{
                                defaultDate: date
                                // disable: [
                                // function(date) {
                                //     // Weekend disable
                                //     return (date.getDay() === 0 || date.getDay() === 6) 
                                // }
                                // ]
                            } }
                            />
                        </Col>
                            <Col md="4" className="mb-1">
                            <Button className='btn btn-primary mt-2' onClick={Check_out}>
                                <Clock />
                            </Button>
                            </Col>
                      </Row>
                    )}
                
          </ModalBody>
          <ModalFooter>
           
          </ModalFooter>
        </Modal>
    </Fragment>
  )
}

export default Attendance