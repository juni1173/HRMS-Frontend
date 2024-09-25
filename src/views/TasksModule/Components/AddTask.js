import React, { Fragment, useState, useEffect } from 'react'
import { Row, Col, Badge, Input, Button } from 'reactstrap'
import { Save, XCircle, Paperclip } from 'react-feather'
import Select from 'react-select'
import apiHelper from '../../Helpers/ApiHelper'
import InputMask from 'react-input-mask'
import Flatpickr from 'react-flatpickr'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { useDropzone } from 'react-dropzone'
const AddTask = ({ projectsData, CallBack, task, ChildCallBack }) => {
    const Api = apiHelper()
    const [TaskData, setTaskData] = useState({
        title: '',
        project: task ? task.project : '',
        assign_to: task ? task.assign_to : '',
        task_type: '',
        priority: '',
        planned_hours: '',
        actual_hours: '',
        account_hours: '',
        due_date: '',
        external_ticket_reference: '',
        status: '',
        description: ''
   })
   const [files, setFiles] = useState([])
   
   const [typeDropdown, setTypeDropdown] = useState([])
   const [hoursError, setHoursError] = useState('')
   const priority_choices = [
    {value: 'Low', label: 'Low'},
    {value: 'Medium', label:'Medium'},
    {value: 'High', label:'High'}
   ]
   const [projDropdown, setProjectDropdown] = useState([])
   const [employeeDropdown, setEmployeeDropdown] = useState([])
   const [isDisabled, setisDisabled] = useState(false)
   const [urlValidationMessage, setUrlValidationMessage] = useState('')
//    const [statusDropdown, setStatusDropdown] = useState([])
  const projectDropdown =  () => {
    const arr = []
    if (projectsData) {
        for (const pro of projectsData) {
            arr.push({value: pro.id, label: pro.name})
        }
    }
    return arr
  }
  const getEmployees = async (id) => {
    await Api.get(`/taskify/get/project/employee/${id}/`).then(result => {
        if (result) {
            if (result.status === 200) {
                const employeeData = result.data
                if (employeeData.length > 0) {
                    const arr = []
                    for (const emp of employeeData) {
                        arr.push({value: emp.id, label: emp.name})
                    }
                    setEmployeeDropdown(arr)
                }
            } else {
                Api.Toast('error', result.message)
            }
        } else {
            Api.Toast('error', 'Server error!')
        }
    })
  }
  const getTaskTypes = async (id = null) => {
    const formData = new FormData()
    if (id) {
        formData['project'] = id
    }
    await Api.jsonPost(`/taskify/task/types/pre/data/`, formData).then(result => {
        if (result) {
            if (result.status === 200) {
                const typesData = result.data
                if (Object.values(typesData).length > 0) {
                    const defaultTypesArr = []
                    const projectTypesArr = []
                    for (const default_types of typesData.default_task_type) {
                        defaultTypesArr.push({value: default_types.id, label: default_types.title, type: 'default_task_type'})
                    }
                    if (Object.values(typesData.project_task_type).length > 0) {
                        for (const project_types of typesData.project_task_type) {
                            projectTypesArr.push({value: project_types.id, label: project_types.title, type: 'project_task_type'})
                        }
                    }
                    setTypeDropdown([...defaultTypesArr, ...projectTypesArr])
                }
            } else {
                Api.Toast('error', result.message)
            }
        } else {
            Api.Toast('error', 'Server error!')
        }
    })
  }  
  const getStatuses = async (id = null) => {
    const formData = new FormData()
    if (id) {
        formData['project'] = id
    }
    await Api.jsonPost(`/taskify/task/status/pre/data/`, formData).then(result => {
        if (result) {
            if (result.status === 200) {
                const statusData = result.data
                if (Object.values(statusData).length > 0) {
                    const defaultStatusArr = []
                    const projectStatusArr = []
                    for (const status of statusData.default_status) {
                        defaultStatusArr.push({value: status.id, label: status.title})
                    }
                    if (Object.values(statusData.project_status).length > 0) {
                        for (const status of statusData.project_status) {
                            projectStatusArr.push({value: status.id, label: status.title})
                        }
                    }
                    
                    // setStatusDropdown([...defaultStatusArr, ...projectStatusArr])
                }
            } else {
                Api.Toast('error', result.message)
            }
        } else {
            Api.Toast('error', 'Server error!')
        }
    })
  }  
   const onChangeTaskDetailHandler = (InputName, InputType, e) => {
    if (!e) {
        e = {
          target: InputName,
          value: ''
        }
        setTaskData(prevState => ({
            ...prevState,
            [InputName] : ''
            
            }))
            return false
      }
    let InputValue
    if (InputType === 'hours') {
        InputValue = e.target.value
        InputValue = InputValue.replace(':', '.')
    }
    if (InputType === 'input') {
    
    InputValue = e.target.value
    } else if (InputType === 'select') {
    
    InputValue = e
    } else if (InputType === 'date') {
        InputValue = Api.formatDate(e)
    } else if (InputType === 'file') {
        InputValue = e.target.files[0].name
    }
    if ((InputName === 'planned_hours' && InputValue > 4.00) || (InputName === 'actual_hours' && InputValue > 4.00) || (InputName === 'account_hours' && InputValue > 4.00)) {
        setHoursError(`Planned and Actual hours are recommended to be less than 4 hours!`)
    } else {
        setHoursError('')
    }
    setTaskData(prevState => ({
    ...prevState,
    [InputName] : InputValue
    
    }))

}
const onChangeProject = (e) => {
    setTaskData(prevState => ({
        ...prevState,
        project : '',
        assign_to: ''
        }))
    if (e) {
        onChangeTaskDetailHandler('project', 'select', e)
        getTaskTypes(e)
        getEmployees(e)
        getStatuses(e)
    } else {
        setTaskData(prevState => ({
            ...prevState,
            project : '',
            assign_to: ''
            }))
    }
    
  }
useEffect(() => {
    setProjectDropdown(projectDropdown())
    getTaskTypes()
    getStatuses()
    if (task) {
        setisDisabled(true)
    }
}, [])
const getProjectTaskType = () => {
    const taskTypeCheck = typeDropdown.find(pre => (pre.value === TaskData.task_type))
    if (taskTypeCheck.type === 'project_task_type') {
        return true
    } else {
        return false
    }
}
const handleTimeChange = (fieldName, e, onChangeTaskDetailHandler) => {
    const value = e.target.value
    const [hoursStr, minutesStr] = value.split(':')
    let hours = parseInt(hoursStr, 10) || 0
    let minutes = parseInt(minutesStr, 10) || 0
  
    // Adjust hours and minutes if minutes exceed 59
    if (minutes > 59) {
      hours += Math.floor(minutes / 60)
      minutes = minutes % 60
    }
  
    // Create the adjusted time string
    const adjustedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
   console.warn(adjustedTime)
    // Call the change handler with adjusted time
    onChangeTaskDetailHandler(fieldName, 'hours', { target: { value: adjustedTime } })
  }
  const isValidUrl = (url) => {
    const pattern = /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|(\d{1,3}\.){3}\d{1,3})(:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/i
    return pattern.test(url)
  }
const handleSubmit = async (event) => {
    event.preventDefault()
    if (TaskData.external_ticket_reference !== null && TaskData.external_ticket_reference !== '') {
    if (!isValidUrl(TaskData.external_ticket_reference)) {
        setUrlValidationMessage('Please enter a valid URL')
        return
    } else {
        setUrlValidationMessage('')
    }
}
    if (TaskData.title !== '' && TaskData.project !== '' && TaskData.assign_to !== '' && TaskData.description !== ''
    && TaskData.priority !== '' && TaskData.task_type !== '') {
      const formData = new FormData()
      formData.append('title', TaskData.title)
      formData.append('project', TaskData.project)
      formData.append('assign_to', TaskData.assign_to)
      formData.append('description', TaskData.description)
      formData.append('project_task_type', getProjectTaskType())
      formData.append('priority',  TaskData.priority)
    //   formData['attachments'] = files
     files.forEach(file => {
        formData.append('attachments', file)
      })
      if (TaskData.due_date !== '') formData.append('due_date', TaskData.due_date)
      if (TaskData.planned_hours !== '') formData.append('planned_hours', TaskData.planned_hours)
      if (TaskData.actual_hours !== '') formData.append('actual_hours', TaskData.actual_hours)
      if (TaskData.account_hours !== '') formData.append('account_hour', TaskData.account_hours)
      if (TaskData.external_ticket_reference !== '') formData.append('external_ticket_reference', TaskData.external_ticket_reference)
      formData.append('task_type', TaskData.task_type)
      formData.append('status', TaskData.status)
      if (task) formData.append('parent', task.id) 
      await Api.jsonPost(`/taskify/new/task/`, formData, false).then(result => {
        if (result) {
          if (result.status === 200) {
            Api.Toast('success', result.message)
            if (task) {
                ChildCallBack()
            } else {
            CallBack(TaskData.project) 
            }
          } else {
            Api.Toast('error', result.message)
          }
        } else {
          Api.Toast('error', 'Server not responding!')
        }
      })
    } else {
      Api.Toast('error', 'Please fill all the fields')
    }
  }
  
  const handleExternalTicketChange = (e) => {
    const { value } = e.target
    setTaskData(prev => ({ ...prev, external_ticket_reference: value }))
  }
    // Function to handle file drops
    const { getRootProps, getInputProps } = useDropzone({
        accept: 'image/*, .pdf, .doc, .docx',
        onDrop: acceptedFiles => {
            setFiles([
                ...files, ...acceptedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
            }))
        ])
        }
    })

    // Function to remove a file
    const removeFile = file => {
        const newFiles = files.filter(f => f.path !== file.path)
        setFiles(newFiles)
    }

    // Generate file previews
    const filePreviews = files.map(file => (
        <Col md={3}>
        <div key={file} className="file-preview position-relative">
                 {file.type.startsWith('image/') ? (
                    <img src={URL.createObjectURL(file)} alt="preview" style={{ height: '50px', width: 'auto' }} />
                ) : (
                    <Paperclip size={20} className="mx-1" />
                )}
                <XCircle className="position-absolute" style={{ top: 0, right: 0, cursor: 'pointer' }} size={16} color="red" onClick={() => removeFile(file)} />
                <div className="file-name small text-center">{file.name}</div>
            </div>
        </Col>
    ))

  
  return (
    <Fragment>
         <Row>
            <Col md={12}>
            <Row>
            
            <Col md={8} className='mb-1'>
                <label className='form-label'>
                Title <Badge color='light-danger'>*</Badge>
                </label>
                <Input type="text" 
                    name="title"
                    onChange={ (e) => { onChangeTaskDetailHandler('title', 'input', e) }}
                    placeholder="Title!"  />
            </Col>
            <Col md={4} className='mb-1'>
                <label className='form-label'>
                    Project<Badge color='light-danger'>*</Badge>
                </label>
                <Select
                    isClearable={false}
                    isDisabled = {isDisabled}
                    className='react-select'
                    classNamePrefix='select'
                    name="project"
                    options={projDropdown ? projDropdown : ''}
                    onChange={ (e) => { onChangeProject(e.value) }}
                />
            </Col>
            <Col md={3} className='mb-1'>
                <label className='form-label'>
                    Type<Badge color='light-danger'>*</Badge>
                </label>
                <Select
                    isClearable={false}
                    // value={employeeDropdown.find(option => option.value === task.task_type)}
                    className='react-select'
                    classNamePrefix='select'
                    name="type"
                    options={typeDropdown ? typeDropdown : ''}
                    // value={TaskData.assign_to ? TaskData.assign_to : ''}
                    onChange={ (e) => { onChangeTaskDetailHandler('task_type', 'select', e.value) }}
                />
            </Col>
            
            <Col md={4} className='mb-1'>
                <label className='form-label'>
                    Assign to<Badge color='light-danger'>*</Badge>
                </label>
                <Select
                    isClearable={false}
                    className='react-select'
                    isDisabled = {isDisabled}
                    classNamePrefix='select'
                    name="assign"
                    options={employeeDropdown ? employeeDropdown : ''}
                    // value={TaskData.assign_to ? TaskData.assign_to : ''}
                    onChange={ (e) => { onChangeTaskDetailHandler('assign_to', 'select', e.value) }}
                />
            </Col>
            <Col md={2} className='mb-1'>
                <label className='form-label'>
                    Priority<Badge color='light-danger'>*</Badge>
                </label>
                <Select
                    isClearable={false}
                    className='react-select'
                    classNamePrefix='select'
                    name="priority"
                    options={priority_choices ? priority_choices : ''}
                    // value={TaskData.assign_to ? TaskData.assign_to : ''}
                    onChange={ (e) => { onChangeTaskDetailHandler('priority', 'select', e.value) }}
                />
            </Col>
            <Col md='3' className='mb-1'>
            <label className='form-label'>
                    Due Date
                </label>
                <Flatpickr className='form-control' placeholder='YYYY-MM-DD'  onChange={date => onChangeTaskDetailHandler('due_date', 'date', date)} id='default-picker' />
            </Col>
            <Col md='3' className='mb-1'>
        <label className='form-label' htmlFor='planned_hours'>
          Planned Hours
        </label>
        <InputMask
          className='form-control'
          mask='99:99'
          id='planned_hours'
          name='planned-hours'
          placeholder='HH:MM'
          value={TaskData.planned_hours}
          onChange={e => handleTimeChange('planned_hours', e, onChangeTaskDetailHandler)}
        />
      </Col>
            <Col md='3' className='mb-1'>
            <label className='form-label'>
                    Actual Hours
                </label>
            <InputMask className="form-control"
                        mask="99:99"  
                        id="actual_hours"
                        // value={cnic}
                        name="actual-hours"
                        placeholder="HH:MM"
                        value={TaskData.actual_hours}
                        // onBlur={onValidateCnic}
                        onChange={e => handleTimeChange('actual_hours', e, onChangeTaskDetailHandler)}
                        
                        />
            </Col>
            <Col md='3' className='mb-1'>
            <label className='form-label'>
                    Account Hours
                </label>
            <InputMask className="form-control"
                        mask="99:99"  
                        id="account_hours"
                        // value={cnic}
                        name="account-hours"
                        value={TaskData.account_hours}
                        placeholder="HH:MM"
                        onChange={e => handleTimeChange('account_hours', e, onChangeTaskDetailHandler)}
                        
                        />
            </Col>
            <Col md={3} className='mb-1'>
              <label className='form-label'>External Ticket</label>
              <Input type="text" name="external_ticket_reference" value={TaskData.external_ticket_reference} onChange={handleExternalTicketChange} className="form-control" />
              {urlValidationMessage && <div className='text-danger'>{urlValidationMessage}</div>}
            </Col>
            {hoursError !== '' && (
                <div className=''>
                    <small className='text-danger'>{hoursError}</small>
                </div>
            )}
            {/* <Col md={3} className='mb-1'>
                <label className='form-label'>
                    Status<Badge color='light-danger'>*</Badge>
                </label>
                <Select
                    isClearable={false}
                    className='react-select'
                    classNamePrefix='select'
                    name="status"
                    options={statusDropdown ? statusDropdown : ''}
                    // value={TaskData.assign_to ? TaskData.assign_to : ''}
                    onChange={ (e) => { onChangeTaskDetailHandler('status', 'select', e.value) }}
                />
            </Col> */}
            <Col md={12} className="mb-2">
                            <div {...getRootProps({ className: 'dropzone bg-light border-dashed border-2 p-3 text-center' })}>
                                <input {...getInputProps()} />
                                <p>Drag 'n' drop some files here, or click to select files</p>
                            </div>
                            <Row className='mt-1'>{filePreviews}</Row>
                        </Col>
            
            <Col md='8' className='mb-1'>
                <label className='form-label'>
                Description <Badge color='light-danger'>*</Badge>
                </label>
                <Input type="textarea" 
                    name="description"
                    onChange={ (e) => { onChangeTaskDetailHandler('description', 'input', e) }}
                    placeholder="Write your ticket's description!"  />
            </Col>
            <Col md={4}>
            <Button color="primary" className="btn-next mt-4" onClick={handleSubmit}>
            <span className="align-middle d-sm-inline-block">
            Save
            </span>
            <Save
            size={14}
            className="align-middle ms-sm-25 ms-0"
            ></Save>
        </Button>
            </Col>
            
            </Row>
        
            </Col>
        </Row>
    </Fragment>
  )
}

export default AddTask