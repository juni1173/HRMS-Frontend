import {Fragment, useState, useEffect} from 'react'
import { Button, Card, CardBody, Spinner, Row, Col, Table, Modal, ModalHeader, ModalBody, ModalFooter, Label, Badge } from 'reactstrap'
import apiHelper from '../../Helpers/ApiHelper'
import Select from 'react-select'
import Flatpickr from 'react-flatpickr'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { Clock } from 'react-feather'
const list = () => {
    const getCurrentTime = () => {
        const today = new Date()
        const currentTime = `${today.getHours()}:${today.getMinutes()}`
        return currentTime
    }
    const yearoptions = []
    const currentDate = new Date()
    // Get the current month and year
    const currentMonth = currentDate.getMonth() + 1 // Month is zero-based, so add 1
    const currentYear = currentDate.getFullYear() 
    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const [atndceData, setAtndceData] = useState([])
    const [centeredModal, setCenteredModal] = useState(false)
    const [check_in_time, setCheckInTime] = useState(getCurrentTime)
    const [check_out_time, setCheckOutTime] = useState(getCurrentTime)
    const [date, setDate] = useState(new Date())
    const [type, setType] = useState('')
    const [btnstatus, setBtnStatus] = useState('')
    const [monthvalue, setmonthvalue] = useState(currentMonth)
    const [yearvalue, setyearvalue] = useState(currentYear)
    const monthOptions = [
        { value: 1, label: 'January' },
        { value: 2, label: 'February' },
        { value: 3, label: 'March' },
        { value: 4, label: 'April' },
        { value: 5, label: 'May' },
        { value: 6, label: 'June' },
        { value: 7, label: 'July' },
        { value: 8, label: 'August' },
        { value: 9, label: 'September' },
        { value: 10, label: 'October' },
        { value: 11, label: 'November' },
        { value: 12, label: 'December' }
      ]
      // Generate options for the last 5 years and add them to the array
    for (let i = 0; i < 5; i++) {
        const year = currentYear - i
        yearoptions.push({ value: year, label: year.toString() })
    }
    const types_choices = [
        {value:'office', label: 'Office'},
        {value: 'WFH', label: 'WFH'}
    ]
    // const getAttendanceData = async () => {
    //         setLoading(true)
    //         await Api.get(`/attendance/list/all/`)
    //         .then((result) => {
    //             if (result) {
    //                 if (result.status === 200) {
    //                     if (result.data.length > 0) {
    //                         setAtndceData(result.data)
    //                     }
    //                 } else {
    //                         Api.Toast('error', result.message)
    //                 }
    //             } else {
    //                 Api.Toast('error', 'Server not responding')
    //             }
    //         })
    //         setTimeout(() => {
    //             setLoading(false)
    //           }, 1000)
    // }


    const getAttendanceData = async () => {
        setLoading(true)
        const formData = new FormData()
        formData['month'] = monthvalue
        formData['year'] = yearvalue
        await Api.jsonPost(`/attendance/list/all/`, formData)
        .then(result => {
            if (result) {
                if (result.status === 200) {
                   setAtndceData(result.data)
                } else {
                    Api.Toast('error', result.message)
                }
            } else {
                Api.Toast('error', result.message)
            }
        })
        setTimeout(() => {
            setLoading(false)
        }, 1000)
       
    }
    const Check_in = async () => {
        setLoading(true)
        if (type !== '') {
            const formData = new FormData()
            if (check_in_time) formData['check_in'] = `${check_in_time}:00`
            if (date) formData['date'] = Api.formatDate(date)
            if (type) formData['attendance_type'] = type
            // return false
            await Api.jsonPost(`/attendance/check_in/`, formData)
            .then((result) => {
                if (result) {
                    if (result.status === 200) {
                            setCenteredModal(false)
                            getAttendanceData()
                            Api.Toast('success', result.message)
                            setDate(new Date)
                            setType('')
                            setCheckInTime(getCurrentTime)
                            setCheckOutTime(getCurrentTime)
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
                            getAttendanceData()
                            Api.Toast('success', result.message)
                            setDate(new Date)
                            setType('')
                            setCheckInTime(getCurrentTime)
                            setCheckOutTime(getCurrentTime)
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

    useEffect(() => {
        getAttendanceData()
    }, [setAtndceData, monthvalue, yearvalue])
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
                <Row>
<Col md={6}>
            <Label>Select Month</Label>
            <Select
            id='month'
                isClearable={true}
                options={monthOptions}
                className='react-select mb-1'
                classNamePrefix='select'
                placeholder="Select Month"
                menuPlacement="auto" 
                menuPosition='fixed'
                onChange={(selectedOption) => {
                    if (selectedOption !== null) {
                        setmonthvalue(selectedOption.value)
                    } else {
                       
                        setmonthvalue(currentMonth)
                    }
            
              }}
            />
        </Col>
<Col md={6}>
            <Label>Select Year</Label>
            <Select
                isClearable={true}
                options={yearoptions}
                className='react-select mb-1'
                classNamePrefix='select'
                placeholder="Select Year"
                onChange={(selectedOption) => {
                    if (selectedOption !== null) {
                        setyearvalue(selectedOption.value)
                    } else {
                       
                        setyearvalue(currentYear)
                    }
            
              }}
            />
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
                        atndceData.sort((a, b) => {
                            // Assuming that item.date is a string in the "YYYY-MM-DD" format
                            const dateA = new Date(a.date)
                            const dateB = new Date(b.date)
                            return dateB - dateA // Sort in descending order by date
                          }).map((item, key) => (
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
        <Modal isOpen={centeredModal} toggle={() => setCenteredModal(!centeredModal)} className='modal-dialog-centered modal-lg'>
          <ModalHeader toggle={() => setCenteredModal(!centeredModal)}>Enter Time</ModalHeader>
          <ModalBody>
                {!loading ? (
                    <>
                   { btnstatus === 'check_in' && (
                        <Row>
                        <Col md="12">
                          <h3> Check in</h3></Col>   
                       <Col md="3" className="mb-1">
                       <Label className="form-label">
                        Time
                       </Label><br></br>
                           <input className="form-control" type="time" onChange={e => setCheckInTime(e.target.value)} defaultValue={check_in_time}></input>
                       </Col>
                       <Col md="3">
                       <Label className='form-label' for='default-picker'>
                           Date
                           </Label>
                           <Flatpickr className='form-control'  
                           onChange={(e) => setDate(e)} 
                           id='default-picker' 
                           placeholder='Date'
                           options={{
                             defaultDate: date
                            //    disable: [
                            //    function(date) {
                            //        // Weekend disable
                            //        return (date.getDay() === 0 || date.getDay() === 6) 
                            //    }
                            //    ]
                           } }
                           />
                       </Col>
                       <Col md="3">
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
                               onChange={ (e) => setType(e.value) }
                           />
                       </Col>
                           <Col md="3" className="mb-1">
                               <Button className='btn btn-primary mt-2' onClick={Check_in}>
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
                            //   disable: [
                            //   function(date) {
                            //       // Weekend disable
                            //       return (date.getDay() === 0 || date.getDay() === 6) 
                            //   }
                            //   ]
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
                     </>
                ) : (
                    <div className='text-center'><Spinner /></div>
                )
                }
                    
                
          </ModalBody>
          <ModalFooter>
           
          </ModalFooter>
        </Modal>
    </Fragment>
  )
}

export default list