import React, { Fragment, useState, useEffect } from 'react'
import { Row, Col, Badge, Input, Button } from 'reactstrap'
import { Save } from 'react-feather'
import Select from 'react-select'
import apiHelper from '../../Helpers/ApiHelper'
import InputMask from 'react-input-mask'
import Flatpickr from 'react-flatpickr'
import '@styles/react/libs/flatpickr/flatpickr.scss'
const AddTask = ({ projectsData, CallBack }) => {
    const Api = apiHelper()
    const [TaskData, setTaskData] = useState({
        title: '',
        project: '',
        assign_to: '',
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
   
   const [typeDropdown, setTypeDropdown] = useState([])
   const priority_choices = [
    {value: 'Low', label: 'Low'},
    {value: 'Medium', label:'Medium'},
    {value: 'High', label:'High'}
   ]
   const [projDropdown, setProjectDropdown] = useState([])
   const [employeeDropdown, setEmployeeDropdown] = useState([])
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
  
    // Call the change handler with adjusted time
    onChangeTaskDetailHandler(fieldName, 'hours', { target: { value: adjustedTime } })
  }
  
const handleSubmit = async (event) => {
    event.preventDefault()
   
    if (TaskData.title !== '' && TaskData.project !== '' && TaskData.assign_to !== '' && TaskData.description !== ''
    && TaskData.priority !== '' && TaskData.task_type !== '') {
      const formData = new FormData()
      formData['title'] = TaskData.title
      formData['project'] = TaskData.project
      formData['assign_to'] = TaskData.assign_to
      formData['description'] = TaskData.description
      formData['project_task_type'] = getProjectTaskType()
      formData['priority'] = TaskData.priority
      if (TaskData.due_date !== '') formData['due_date'] = TaskData.due_date
      if (TaskData.planned_hours !== '') formData['planned_hours'] = TaskData.planned_hours
      if (TaskData.actual_hours !== '') formData['actual_hours'] = TaskData.actual_hours
      if (TaskData.account_hours !== '') formData['account_hour'] = TaskData.account_hours
      formData['task_type'] = TaskData.task_type
      formData['status'] = TaskData.status
      await Api.jsonPost(`/taskify/new/task/`, formData).then(result => {
        if (result) {
          if (result.status === 200) {
            Api.Toast('success', result.message)
            CallBack(TaskData.project)
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
                        // onBlur={onValidateCnic}
                        onChange={e => onChangeTaskDetailHandler('actual_hours', 'hours', e)}
                        
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
                        placeholder="HH:MM"
                        // onBlur={onValidateCnic}
                        onChange={e => onChangeTaskDetailHandler('account_hours', 'hours', e)}
                        
                        />
            </Col>
            
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