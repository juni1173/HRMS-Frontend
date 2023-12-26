import React, { Fragment, useEffect, useState, useRef } from 'react'
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
const Leave = ({leavedata, yearoptions}) => {
    const Api = apiHelper()
    const MySwal = withReactContent(Swal)
    const [loading, setLoading] = useState(true)
    const [isButtonDisabled, setIsButtonDisabled] = useState(false)
    const [data, setData] = useState()
    const [yearvalue, setYearValue] = useState(null)
    const yearValueRef = useRef(null)
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
      if (Object.values(leavedata).length > 0) {
        leave_types.splice(0, leave_types.length)
        for (let i = 0; i < leavedata['leave_types'].length; i++) {
                leave_types.push({value:leavedata['leave_types'][i].id, label: leavedata['leave_types'][i].title })
        } 
}
}
    const leaves = async () => {
      setLoading(true)
      const formData = new FormData()
      formData['year'] = yearvalue
      const response = await Api.jsonPost('/reimbursements/employee/recode/leave/data/', formData)
      if (response.status === 200) {
          setData(response.data)
          leave_types_dropdown()
      } else {
          return Api.Toast('error', 'Pre server data not found')
      }
      setTimeout(() => {
          setLoading(false)
      }, 2000)
  }
  useEffect(() => {
    leaves()
  }, [setData, yearvalue])

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
                        setDates([])
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
                    menuPlacement="auto" 
                    menuPosition='fixed'
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
            <div style={{ height: '200px', overflow: 'auto' }}>
        <DatePicker
          value={dates}
          onChange={setDates}
          multiple
          sort
          format={format}
          containerStyle={{
            width: "180px",
            margin: "auto"
          }}
          style={{ //input style
            width: "100%",
            height: "40px",
            boxSizing: "border-box"
          }}
          calendarPosition="right"
          plugins={[<DatePanel />]}
          placeholder='Leave Dates'
        />
        </div>
            </Col>
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
  <Row>
                <Col md={4}></Col>
        <Col md={4}></Col>
        <Col md={4} className="mt-2">
    <Label>Select Year</Label>
    <Select
      isClearable={true}
      options={yearoptions}
      className='react-select mb-1'
      classNamePrefix='select'
      placeholder="Select Year"
      value={yearoptions.find(option => option.value === yearvalue)}
      onChange={(selectedOption) => {
        if (selectedOption !== null) {
          setYearValue(selectedOption.value)
          yearValueRef.current = selectedOption.value
        } else {
          setYearValue(currentYear)
          yearValueRef.current = currentYear
        }
      }}
    />
  </Col>
  </Row>
   {!loading ? (
  <>
    {(data.length > 0) ? (
      <Row>
        <Col md={12}>
          {data.map((employeeData, employeeKey) => (
            <React.Fragment key={employeeKey}>
              {employeeData.leave_data.length > 0 && (
                
                <Table bordered striped responsive className='my-1' key={employeeKey}>
                  {employeeData.leave_data.some(leaveData => leaveData.employee_leave_records.length > 0) && (
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
                  )}
                  <tbody className='text-center'>
                    {employeeData.leave_data.map((leaveData, leaveDataKey) => (
                      <React.Fragment key={leaveDataKey}>
                        {leaveData.employee_leave_records.map((record, recordKey) => (
                          <tr key={recordKey}>
                            <td className='nowrap'>{record.leave_types_title ? record.leave_types_title : <Badge color='light-danger'>N/A</Badge>}</td>
                            <td className='nowrap'>{record.duration ? record.duration : <Badge color='light-danger'>N/A</Badge>}</td>
                            <td className='nowrap'>{record.start_date ? record.start_date : <Badge color='light-danger'>N/A</Badge>}</td>
                            <td className='nowrap'>{record.end_date ? record.end_date : <Badge color='light-danger'>N/A</Badge>}</td>
                            <td>
                              {record.attachment ? <a target='_blank' href={`${process.env.REACT_APP_PUBLIC_URL}${record.attachment}`}> <FileText /> </a> : <Badge color='light-danger'>N/A</Badge>}
                            </td>
                            <td>
                              <Badge>{record.status ? record.status : <Badge color='light-danger'>N/A</Badge>}</Badge> 
                              {record.decision_reason && (
                                <>
                                  <HelpCircle id={`UnControlledLeave${recordKey}`} />
                                  <UncontrolledTooltip target={`UnControlledLeave${recordKey}`}>{record.decision_reason}</UncontrolledTooltip>
                                </>
                              )}
                            </td>
                            <td>
                              {record.status === 'in-progress' && (
                                <Row className='text-center'>
                                  <Col className='col-12'>
                                    <button
                                      className="border-0 no-background"
                                      onClick={() => removeAction(record.id)}
                                    >
                                      <XCircle color="red" />
                                    </button>
                                  </Col>
                                </Row>
                              )}
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                  </tbody>
                </Table>
              )}
            </React.Fragment>
          ))}
          {!data.some(employeeData => employeeData.leave_data.some(leaveData => leaveData.employee_leave_records.length > 0)) && (
            <div className="text-center">No Leave Data Found!</div>
          )}
        </Col>
      </Row>
    ) : (
      <div className="text-center">No Leave Data Found!</div>
    )}
  </>
) : (
  <div className="text-center"><Spinner /></div>
)}

  </>
) : (
  <div className="text-center"><Spinner /></div>
)}

    </Fragment>
  )
}

export default Leave