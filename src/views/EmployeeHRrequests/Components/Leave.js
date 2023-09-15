import React, { Fragment, useEffect, useState } from 'react'
import { Row, Col, Label, Button, Spinner, Input, Badge, Table, UncontrolledTooltip } from 'reactstrap'
import { Save, XCircle, FileText, HelpCircle } from 'react-feather'
import Select from 'react-select'
import apiHelper from '../../Helpers/ApiHelper'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Flatpickr from 'react-flatpickr'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import DatePicker, { DateObject } from "react-multi-date-picker"
import DatePanel from "react-multi-date-picker/plugins/date_panel"
const format = "YYYY-MM-DD"
const Leave = ({ data, CallBack }) => {
    const Api = apiHelper()
    const MySwal = withReactContent(Swal)
    const [loading, setLoading] = useState(false)
    const [isButtonDisabled, setIsButtonDisabled] = useState(false)
    const [leave_types] = useState([])
    const [attachment, setAttachment] = useState(null)
    const [leaveData, setLeaveData] = useState({
        leave_types: '',
        start_date : '',
        end_date: '',
        duration: ''
   })
   const [dates, setDates] = useState([])
    // new DateObject().set({ day: 4, format }),
    // new DateObject().set({ day: 25, format }),
    // new DateObject().set({ day: 20, format })
  
    const onChangeLeavesDetailHandler = (InputName, InputType, e) => {
        
        let InputValue
        if (InputType === 'input') {
        
        InputValue = e.target.value
        } else if (InputType === 'select') {
        
        InputValue = e
        } else if (InputType === 'date') {
            const formatDate = Api.formatDate(e)
            InputValue = formatDate
        } else if (InputType === 'file') {
            InputValue = e.target.files[0].name
        }

        setLeaveData(prevState => ({
        ...prevState,
        [InputName] : InputValue
        
        }))

    }
    const leave_types_dropdown = () => {
        if (Object.values(data).length > 0) {
            leave_types.splice(0, leave_types.length)
            for (let i = 0; i < data['leave_types'].length; i++) {
                    leave_types.push({value:data['leave_types'][i].id, label: data['leave_types'][i].title })
            } 
    }
    }
    const imageChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
          setAttachment(e.target.files[0]) 
        }
      } 
    const remove_attachment = () => {
        setAttachment() 
      } 
    const submitForm = async () => {
        setIsButtonDisabled(true)
        leaveData.duration = dates.length
          const leaveDates = dates.map((date) => date.format())
          leaveData.start_date = leaveDates[0]
        leaveData.end_date = leaveDates[leaveDates.length - 1]
        if (leaveData.leave_types !== '' && leaveData.start_date !== '' && leaveData.end_date !== '' && leaveData.duration !== '') {
            const formData = new FormData()
            formData.append('leave_types', leaveData.leave_types)
            formData.append('start_date', leaveData.start_date)
            formData.append('end_date', leaveData.end_date)
            formData.append('duration', leaveData.duration)
            formData.append('leave_dates', leaveDates)
            console.log(formData)
            if (attachment !== null) formData.append('attachment', attachment)
            await Api.jsonPost(`/reimbursements/employees/leaves/`, formData, false).then(result => {
                if (result) {
                    if (result.status === 200) {
                        setLoading(true)
                        Api.Toast('success', result.message)
                        CallBack()
                        setLeaveData(prevState => ({
                            ...prevState,
                            leave_types: '',
                            start_date : '',
                            end_date: '',
                            duration: ''
                       })
                        )
                        setTimeout(() => {
                            setLoading(false)
                        }, 1000)
                    } else {
                        Api.Toast('error', result.message)
                    }
                    setIsButtonDisabled(false)
                }
            })
        } else {
            Api.Toast('error', 'Please fill required fields!')
            setIsButtonDisabled(false)
        }
       
    }
    const removeAction = (id) => {
        MySwal.fire({
            title: 'Are you sure?',
            text: "Do you want to delete the Leave Request!",
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
                Api.deleteData(`/reimbursements/employees/leaves/${id}/`, {method: 'Delete'})
                .then((deleteResult) => {
                    if (deleteResult.status === 200) {
                        MySwal.fire({
                            icon: 'success',
                            title: 'Leave Request Deleted!',
                            text: 'Leave Request is deleted.',
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
                            title: 'Leave Request can not be deleted!',
                            text: deleteResult.message ? deleteResult.message : 'Leave Request is not deleted.',
                            customClass: {
                            confirmButton: 'btn btn-danger'
                            }
                        })
                    }
                            
                    })
            } 
        })
    }
  
    useEffect(() => {
        leave_types_dropdown()
    }, [data])
  return (
    <Fragment>
        <Row>
         <div className='content-header' >
          <h5 className='mb-2'>Add Leaves Request</h5>
          {/* <small>Add position.</small> */}
        </div>
        {!loading && (
            <>
        <Col md="6" className="mb-1">
                <Label className="form-label">
                Leave Type <Badge color='light-danger'>*</Badge>
                </Label>
                <Select
                    isClearable={false}
                    className='react-select'
                    classNamePrefix='select'
                    name="leave_types"
                    options={leave_types}
                    onChange={ (e) => onChangeLeavesDetailHandler('leave_types', 'select', e.value) }
                />
        </Col>
        {/* <Col md='4' className='mb-1'>
                <label className='form-label'>
                  Duration <Badge color="light-danger">*</Badge> 
                </label>
                <Input type="number" 
                    name="duration"
                    onChange={ (e) => { onChangeLeavesDetailHandler('duration', 'input', e) }}
                    placeholder="Duration"  />
        </Col> */}
        <Col md={6} className="mb-1">
        <Label className="form-label">Attachment</Label>
            {attachment ? (
              <div className="float-right">
                {/* <img
                  src={URL.createObjectURL(attachment)}
                  alt="Thumb"
                  width="50"
                /> */}
                <FileText color='green'/>
                <button className="btn" onClick={remove_attachment}>
                  <XCircle />
                </button>
              </div>
                ) : (
                <div>
                    <Input
                        type="file"
                        id="attachment"
                        name="attachment"
                        accept="image/*"
                        onChange={imageChange}
                        />
                </div>
                )}
        </Col>
        <Col md="5" className="mb-1">
        <Label className='form-label' for='default-picker'>
               Leave Dates <Badge color="light-danger">*</Badge>
            </Label>
        <DatePicker
          value={dates}
          onChange={setDates}
          multiple
          sort
          format={format}
          calendarPosition="bottom-center"
          plugins={[<DatePanel />]}
          style={{ height: '40px' }}
          placeholder='Leave Dates'
        />
            </Col>
        {/* <Col md="5" className="mb-1">
            <Label className='form-label' for='default-picker'>
               Start Date <Badge color="light-danger">*</Badge>
            </Label>
            <Flatpickr className='form-control'  
            onChange={(date) => onChangeLeavesDetailHandler('start_date', 'date', date)} 
            id='default-picker' 
            placeholder='Start Date'
            options={{
                minDate: "today"
                // disable: [
                // // function(date) {
                // //     // Weekend disable
                // //     return (date.getDay() === 0 || date.getDay() === 6) 
                // // }, 
                // function(date) {
                //     // past dates disable
                //     const d = new Date()
                //     return (date <= d) 
                // }
                // ]
              } }
            />
        </Col> */}
        {/* <Col md="5" className="mb-1">
            <Label className='form-label' for='default-picker'>
               End Date <Badge color="light-danger">*</Badge>
            </Label>
                <Flatpickr className='form-control'  
                onChange={(date) => onChangeLeavesDetailHandler('end_date', 'date', date)} 
                id='default-picker' 
                placeholder='End Date'
                options={{
                    minDate: new Date(leaveData.start_date)
                    // disable: [
                    // // function(date) {
                    // //     // Weekend disable
                    // //     return (date.getDay() === 0 || date.getDay() === 6) 
                    // // }, 
                    // function(date) {
                    //     // past dates disable
                    //     let startDate = null
                    //     const d = new Date()
                    //     if (leaveData.start_date !== '') {
                    //         startDate = new Date(leaveData.start_date)
                    //         return (date < startDate) 
                    //     } 
                    //     return (date <= d) 
                    // }
                    // ]
                  } }
                />
           
            
        </Col> */}
        <Col md={2}>
                <Button color="primary" className="btn-next mt-2" onClick={submitForm} disabled={isButtonDisabled}>
                <span className="align-middle d-sm-inline-block">
                  Submit
                </span>
                <Save
                  size={14}
                  className="align-middle ms-sm-25 ms-0"
                ></Save>
              </Button>
        </Col>
        </>
        )}
        </Row>
        {!loading ? (
                <>
        {(data.employee_leaves && Object.values(data.employee_leaves).length > 0) ? (
                <Row>
                <Col md={12}>
                    <Table bordered striped responsive className='my-1'>
                            <thead className='table-dark text-center'>
                            <tr>
                                <th scope="col" className="text-nowrap">
                                Type
                                </th>
                                <th scope="col" className="text-nowrap">
                                Duration
                                </th>
                                <th scope="col" className="text-nowrap">
                                Start Date
                                </th>
                                <th scope="col" className="text-nowrap">
                                End Date
                                </th>
                                <th scope="col" className="text-nowrap">
                                Attachment
                                </th>
                                <th scope="col" className="text-nowrap">
                                Status
                                </th>
                                <th scope="col" className="text-nowrap">
                                Actions
                                </th>
                            </tr>
                            </thead>
                            
                            <tbody className='text-center'>
                                {Object.values(data.employee_leaves).map((item, key) => (
                                        <tr key={key}>
                                        <td className='nowrap'>{item.leave_types_title ? item.leave_types_title : <Badge color='light-danger'>N/A</Badge>}</td>
                                        <td className='nowrap'>{item.duration ? item.duration : <Badge color='light-danger'>N/A</Badge>}</td>
                                        <td className='nowrap'>{item.start_date ? item.start_date : <Badge color='light-danger'>N/A</Badge>}</td>
                                        <td className='nowrap'>{item.end_date ? item.end_date : <Badge color='light-danger'>N/A</Badge>}</td>
                                        <td>{item.attachment ? <a target='_blank' href={`${process.env.REACT_APP_BACKEND_URL}${item.attachment}`}> <FileText /> </a> : <Badge color='light-danger'>N/A</Badge>}</td>
                                        <td>
                                        <Badge>{item.status ? item.status : <Badge color='light-danger'>N/A</Badge>}</Badge> 
                                        {item.decision_reason && (<> <HelpCircle id={`UnControlledLeave${key}`}/><UncontrolledTooltip  target={`UnControlledLeave${key}`}>{item.decision_reason} </UncontrolledTooltip></>)}
                                        </td>
                                        
                                        <td>
                                            {item.status === 'in-progress' && (
                                            <Row className='text-center'>
                                           
                                            <Col className='col-12'>
                                                <button
                                                className="border-0 no-background"
                                                onClick={() => removeAction(item.id)}
                                                >
                                                <XCircle color="red" />
                                                </button>
                                            </Col>
                                            </Row>
                                            )}
                                        </td>

                                        </tr>
                                )
                                )}
                            
                            </tbody>
                            
                    </Table>
                </Col>
            </Row>
                ) : (
                    <div className="text-center">No Leave Data Found!</div>
                )
                
                }
                    </>
                ) : (
                    <div className="text-center"><Spinner /></div>
                )  
            }
    </Fragment>
  )
}

export default Leave