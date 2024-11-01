import React, { useState, useEffect, useRef } from 'react'
import { Button, Card, CardBody, Spinner, Row, Col, Table, Modal, ModalHeader, ModalBody, ModalFooter, Label, Badge, Input, CardHeader, CardFooter, CardTitle } from 'reactstrap'
import * as Icon from 'react-feather'
import Avatar from '@components/avatar'
import apiHelper from '../../../Helpers/ApiHelper'
import EmployeeHelper from '../../../Helpers/EmployeeHelper'
import Flatpickr from 'react-flatpickr'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import Select from 'react-select'
import { TbClockPlus, TbClockMinus  } from "react-icons/tb"

const AttendanceCard = () => {
    const isMounted = useRef(true)
  const Api = apiHelper()
  const EmpHelper = EmployeeHelper()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState()
  const [centeredModal, setCenteredModal] = useState(false)
  const [check_in_time, setCheckInTime] = useState()
  const [check_out_time, setCheckOutTime] = useState()
  const [date, setDate] = useState(new Date())
  const [type, setType] = useState('')
  const [btnstatus, setBtnStatus] = useState('')
  const [notifyActive, setNotifyActive] = useState(false)
  const [notify, setNotify] = useState(false)
  const [teamLead, setTeamLead] = useState('')
  const types_choices = [
    //   {value:'office', label: 'office'},
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
  const preDataApi = async () => {
    if (isMounted.current) setLoading(true)
    const response = await Api.get('/employee/current/date/atteandance/')
    if (response.status === 200) {
        if (isMounted.current) setData(response.data)
    } else {
        return Api.Toast('error', 'Server not found')
    }
    // let date = new Date()
    // date = Api.formatDate(date)
    setTimeout(() => {
      if (isMounted.current) setLoading(false)
    }, 1000)
    return () => {
        isMounted.current = false
      }
}
useEffect(() => {
  preDataApi()
  return () => {
    isMounted.current = false
  }
  }, [])
  const CallBack = () => {
    preDataApi()
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

    return (
        <Card className='attendance-card' style={{background: 'linear-gradient(to right, #2c3e50, #3498db)'}}>
            <CardHeader>
                <CardTitle tag='h4' className='text-white'>Today</CardTitle>
                <a href='../attendancelist/'><Icon.ArrowRight size={18} color='white' className='cursor-pointer' /></a>
            </CardHeader>
            {!loading ?   <CardBody className='px-1'>
                <div className='d-flex justify-content-between align-items-center mb-2'>
                  
                  <Col md={6} className='text-center'>
                  <button className="button-47" role="button" onClick={() => {
                            setBtnStatus('check_in')
                            setCenteredModal(!centeredModal)
                            }}><TbClockPlus color='' size={'20'}/>  Check In</button>
                  {/* <Button  className='btn'> </Button> */}
                    </Col>
                    <Col md={6} className='text-center'>
                        
                     <button onClick={() => {
                            setBtnStatus('check_out')
                            setCenteredModal(!centeredModal)
                            }} className='button-47'><TbClockMinus color='' size={'20'}/> Check Out</button>
                    </Col>
                </div>
                <h4 className='transaction-title text-center text-white'>{data && data.total_time}</h4>
                { data && data.data && data.data.length > 0 ? (
  data.data.map((item, index) => (
    <div className='text-center' key={index}>
      <span className='text-white'>Check In : </span>
      <small className='pr-1 text-white'>{item.check_in ? item.check_in : 'Pending'}</small><br></br>
      <span className='text-white pt-1'>Check Out : </span>
      <small className='text-white'>{item.check_out ? item.check_out : 'Pending'}</small>     
    </div>
  ))
) : (
    <div className='text-center'>
    <span className='text-white'>Check In : </span>
    <small className='pr-1 text-white' >Pending</small>
    <span className='text-white'>Check Out : </span>
    <small className='text-white'>Pending</small>     
  </div>
)}


                {data && data.data && data.data.length <= 1 ? <><br/></> : null}
            </CardBody> : <div className="container h-100 d-flex justify-content-center">
        <div className="jumbotron my-auto">
          <div className="display-3"><Spinner type='grow' color='white'/></div>
        </div>
    </div>}
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
                                <Icon.Clock/>
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
                                <Icon.Clock />
                            </Button>
                            </Col>
                      </Row>
                    )}
                
          </ModalBody>
          <ModalFooter>
           
          </ModalFooter>
        </Modal>
        </Card>
    )
}

export default AttendanceCard
