import { Fragment, useState } from 'react'
import { AlignRight, Grid, List, Filter, RefreshCcw, Save, Plus, Copy } from 'react-feather'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { Spinner, Row, Col, Badge, ListGroup, ListGroupItem, Button, Tooltip, Modal, ModalBody, ModalHeader, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap'
import AddTask from './AddTask'
import TaskDetail from './TaskDetail'
import { TbReportAnalytics } from "react-icons/tb"
import { BsSortAlphaDown, BsSortAlphaDownAlt, BsSortNumericUp, BsSortNumericDownAlt } from "react-icons/bs"
import Select from 'react-select'
// import TestDrag from './ViewComponents/testDrag'
import KanbanView from './ViewComponents/KanbanView'
import apiHelper from '../../Helpers/ApiHelper'
// import TaskGroups from './ViewComponents/TaskGroups'
const Tasks = ({ data, projectsData, CallBack, selectedTaskid, project_id, employees, priorities, types, role, statuses, projectStatuses, viewType, setViewType, taskloading, query, setQuery, priority_choices, setReportModal, reportModal }) => {
//   const [tooltipOpenAssignBy, setTooltipOpenAssignBy] = useState({})
const Api = apiHelper()
  const [tooltipOpenAssignTo, setTooltipOpenAssignTo] = useState({})
  const [centeredModal, setCenteredModal] = useState(false)
  const [taskDetailModal, setTaskDetailModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [currentIssue, setCurrentIssue] = useState(selectedTaskid ? data.find(pre => pre.id === selectedTaskid) : null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  // const [hoveredAssignBy, setHoveredAssignBy] = useState(null)
  const [hovered, setHovered] = useState(null)
  const [filterStatus, setFilterStatus] = useState(false)
  const [filterLoading, setFilterLoading] = useState(false)
  const [sortQuery, setSortQuery] = useState('all-task')
  const [currentAddStatusid, setCurrentAddStatusid] = useState(null)
  // const [groupTasksData, setGroupTasksData] = useState([])
  // const [groupTaskLoading, setGroupTaskLoading] = useState(false)
  const [sortingOrder, setSortingOrder] = useState([
    {status_title: 'asc'},
    {priority: 'asc'},
    {due_date: 'asc'}, 
    {task_type_title: 'asc'}
  ])
  
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen)
  }
//   const toggleTooltipAssignBy = (key) => {
//     setTooltipOpenAssignBy(prev => ({ ...prev, [key]: !prev[key] }))
//   }
  const toggleTooltipAssignTo = (key) => {
    setTooltipOpenAssignTo(prev => ({ ...prev, [key]: !prev[key] }))
  }
  const sortAction = (sort) => {
    setSortQuery(sort)
    CallBack(project_id, currentIssue, sort)
  }
  const onClickIssue = item => {
    setLoading(true)
    setCurrentIssue(item)
    setTaskDetailModal(true)
    setTimeout(() => {
      setLoading(false)
    }, 500)
  }
  const CallBackTask = selectedIssue => {
    setLoading(true)
    CallBack(selectedIssue.project, selectedIssue.id)
    setTimeout(() => {
      setLoading(false)
    }, 500)
  }
  const handleAddClick = (status_id = null) => {
    if (status_id) {
      setCurrentAddStatusid(status_id)
    }
    setCenteredModal(!centeredModal)
  }
  const getPriorityBadgeColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'low':
        return 'light-warning'
      case 'medium':
        return 'light-success'
      case 'high':
        return 'light-danger'
      default:
        return 'secondary'
    }
  }
  // Helper function to format name as "M. Akmal" or "N. Niazi"
  const formatName = (fullName) => {
    const names = fullName.trim().split(' ')
    const firstInitial = names[0]?.charAt(0).toUpperCase() || ''
    const lastName = names[names.length - 1] || ''
    return `${firstInitial}. ${lastName}`
  }
  const toggleTaskDetailModal = () => {
    setTaskDetailModal(!taskDetailModal)
    if (taskDetailModal) {
      CallBack(project_id, currentIssue, sortQuery, query)
    }
  }
  const CallBackAddAction = (project) => {
    CallBack(project)
    setCenteredModal(!centeredModal)
  }
  const applyFilters = () => {
    CallBack(project_id, currentIssue, sortQuery, query)
  }
  const applyResetFilters = () => {
    const nullQuery = {
      assign_to: null,
      task_type: null,
      priority: null,
      status: null
      }
    setQuery(() => (nullQuery))
    CallBack(project_id, currentIssue, sortQuery, nullQuery)
  }
  const updateStatus = async (id, status) => {
    if (id && status) {
      const formData = new FormData()
      formData['status'] = status.value
      if (Object.values(projectStatuses).length > 0) {
        for (const item of projectStatuses) {
            if (status.value === item.value) {
                formData['project_status'] = true
            }
        }
    }
      await Api.jsonPatch(`/taskify/update/task/status/${id}/`, formData).then(result => {
        if (result) {
            if (result.status === 200) {
                // CallBack(data)
                Api.Toast('success', result.message)
            } else {
                Api.Toast('error', result.message)
            }
        } else {
            Api.Toast('error', 'Server error!')
        }
    })
    }
  }
  const filterClick = () => {
    setFilterStatus(!filterStatus)
    setFilterLoading(true)
    setTimeout(() => {
        setFilterLoading(false)
    }, 500)
  }
  const onChangeTaskQueryHandler = (InputName, InputType, e) => {
    if (!e) {
        e = {
          target: InputName,
          value: null
        }
        setQuery(prevState => ({
            ...prevState,
            [InputName] : null
            
            }))
            return false
      }
    let InputValue
    if (InputType === 'input') {
    
    InputValue = e.target.value
    } else if (InputType === 'select') {
    
    InputValue = e
    } else if (InputType === 'date') {
        let dateFomat = e.split('/')
            dateFomat = `${dateFomat[2]}-${dateFomat[1]}-${dateFomat[0]}`    
        InputValue = dateFomat
    } else if (InputType === 'file') {
        InputValue = e.target.files[0].name
    }

    setQuery(prevState => ({
    ...prevState,
    [InputName] : InputValue
    
    }))
  }
  function sortTasks(tasks, attribute, order) {
    setSortingOrder(prevState => {
      return prevState.map(item => {
        return item.hasOwnProperty(attribute) ? { [attribute]: order } : item
      })
    })
    return tasks.sort((a, b) => {
        let valA = a[attribute]
        let valB = b[attribute]

        // Handle null or undefined values
        if (valA === null || valA === undefined) valA = ''
        if (valB === null || valB === undefined) valB = ''

        // Compare numbers or strings based on their type
        if (typeof valA === 'string' && typeof valB === 'string') {
            valA = valA.toLowerCase()
            valB = valB.toLowerCase()
        }

        // Sort based on the current order
        if (order === 'asc') {
            return valA > valB ? 1 : valA < valB ? -1 : 0
        } else {
            return valA < valB ? 1 : valA > valB ? -1 : 0
        }
    })
} 
  // const getGroupData = async () => {
  //   await Api.get(`/taskify/group/${project_id}`).then(result => {
  //     if (result) {
  //       setGroupTaskLoading(true)
  //         if (result.status === 200) {
  //             const groupData = result.data
  //             if (Object.values(groupData).length > 0) {
  //                setGroupTasksData(groupData)
  //             }
  //         } else {
  //           setGroupTasksData([])
  //             Api.Toast('error', result.message)
  //         }
  //         setGroupTaskLoading(false)
  //     } else {
  //         Api.Toast('error', 'Server error!')
  //     }
  // })
  // }
  // const groupTabHandler = () => {
  //   setViewType('group-view')
  //   getGroupData()
  // }
  // useEffect(() => {
  //   getGroupData()
  // }, [project_id])
  return (
    <Fragment>
      <div className='sidebar'>
        <div className='sidebar-content todo-sidebar'>
          <div className='todo-app-menu'>
            <Row>
              <Col md={12} className="bg-white">
                <div className='task-actions d-flex justify-content-between align-items-center mb-1'>
                  {/* Add New Task Button */}
                  <div className='add-task-section d-flex align-items-center'>
                    <Button
                      color="primary"
                      className="d-flex align-items-center rounded-pill px-2 py-1 btn-sm"
                      onClick={handleAddClick}
                    >
                      <Plus color="#fff" size={'18px'} className="" /> 
                      New Task
                    </Button>
                  </div>

                  {/* Sorting Dropdown */}
                  <div className='sort-dropdown d-flex align-items-center'>
                  <Button.Ripple color='flat-secondary' className='border-right' onClick={() => setViewType('list')}>
                    <List size={14} color={viewType === 'list' ? 'darkblue' : 'gray'}/>
                    <span className='align-middle ms-25'>List</span>
                  </Button.Ripple>
                  {/* <Button.Ripple color='flat-secondary' className='border-right' onClick={() => groupTabHandler()}>
                    <List size={14} color={viewType === 'group-view' ? 'darkblue' : 'gray'}/>
                    <span className='align-middle ms-25'>Groups</span>
                  </Button.Ripple> */}
                  <Button.Ripple color='flat-secondary' className='border-right' onClick={() => setViewType('kanban')}>
                    <Grid size={14} color={viewType === 'kanban' ? 'darkblue' : 'gray'}/>
                    <span className='align-middle ms-25'>Kanban</span>
                  </Button.Ripple>
                  <Button.Ripple color='flat-secondary' className='border-right' onClick={filterClick}>
                      <Filter size={14} color={filterStatus ? 'darkblue' : 'gray'}/>
                      <span className='align-middle ms-25'>Filters</span>
                      {Object.values(query).filter(value => value !== null).length > 0 && (
                        <Badge  className="ms-25" color='light-primary' pill>{Object.values(query).filter(value => value !== null).length}</Badge>
                      )}
                  </Button.Ripple> 
                    <Dropdown className={(role && role !== '' && Object.values(role).length > 0 && role.role_level < 5
                        && role.role_level > 0) ? 'border-right' : ''} isOpen={dropdownOpen} toggle={toggleDropdown} direction="down">
                      <DropdownToggle 
                        color='flat-secondary' 
                        className="d-flex align-items-center btn-sm" 
                        caret
                      >
                        <AlignRight size={16} className="me-1" />
                        {sortQuery
                          .split('-')                     // Split the string by hyphens
                          .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
                          .join(' ')}
                      </DropdownToggle>

                      <DropdownMenu>
                        <DropdownItem onClick={() => sortAction('all-tasks')}>All Tasks</DropdownItem>
                        <DropdownItem onClick={() => sortAction('assign-to-me')}>Assign to Me</DropdownItem>
                        <DropdownItem onClick={() => sortAction('created-by-me')}>Created by Me</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                    {(role && role !== '' && Object.values(role).length > 0 && role.role_level < 5
                        && role.role_level > 0) && (
                          <Button.Ripple color='flat-secondary' onClick={() => setReportModal(!reportModal)}>
                              <TbReportAnalytics size={14} color={'gray'}/>
                              <span className='align-middle ms-25'>Export</span>
                          </Button.Ripple> 
                        )}
                  </div>

                </div>
                
                  {filterStatus && (
                    !filterLoading ? (
                        <div className='row d-flex justify-content-center'>
                        <div className='col-md-2' style={{minWidth:'200px'}}>
                            <label className='form-label'>
                                Type  <RefreshCcw color='darkblue' size={'14'} onClick={() => onChangeTaskQueryHandler('task_type', 'select', null)}/>
                            </label>
                            <Select
                                isClearable={false}
                                className='react-select'
                                classNamePrefix='select'
                                name="type"
                                options={types ? types : ''}
                                value={types.find(option => option.value === query.task_type) || null}
                                onChange={ (e) => { onChangeTaskQueryHandler('task_type', 'select', e.value) }}
                                styles={{
                                  control: (provided) => ({
                                    ...provided,
                                    borderRadius: '30px',  // Adjust the value as needed (30px is just an example)
                                    borderColor: '#ccc',  // Optional: change the border color
                                    padding: '2px'       // Optional: Add padding if necessary
                                  }),
                                  dropdownIndicator: (provided) => ({
                                    ...provided,
                                    color: '#ccc'  // Optional: change the dropdown indicator color
                                  }),
                                  clearIndicator: (provided) => ({
                                    ...provided,
                                    color: '#ccc'  // Optional: change the clear indicator color
                                  })
                                }}
                            />
                        </div>
                        <div className='col-md-2' style={{minWidth:'200px'}}>
                            <label className='form-label'>
                                Status  <RefreshCcw color='darkblue' size={'14'} onClick={() => onChangeTaskQueryHandler('status', 'select', null)}/>
                            </label>
                            <Select
                                isClearable={false}
                                className='react-select'
                                classNamePrefix='select'
                                name="status"
                                options={statuses ? statuses : ''}
                                value={statuses.find(option => option.value === query.status) || null}
                                onChange={ (e) => { onChangeTaskQueryHandler('status', 'select', e.value) }}
                                styles={{
                                  control: (provided) => ({
                                    ...provided,
                                    borderRadius: '30px',  // Adjust the value as needed (30px is just an example)
                                    borderColor: '#ccc',  // Optional: change the border color
                                    padding: '2px'       // Optional: Add padding if necessary
                                  }),
                                  dropdownIndicator: (provided) => ({
                                    ...provided,
                                    color: '#ccc'  // Optional: change the dropdown indicator color
                                  }),
                                  clearIndicator: (provided) => ({
                                    ...provided,
                                    color: '#ccc'  // Optional: change the clear indicator color
                                  })
                                }}
                            />
                        </div>
                        <div className='col-md-2' style={{minWidth:'200px'}}>
                            <label className='form-label'>
                                Priority  <RefreshCcw color='darkblue' size={'14'} onClick={() => onChangeTaskQueryHandler('priority', 'select', null)}/>
                            </label>
                            <Select
                                isClearable={false}
                                className='react-select'
                                classNamePrefix='select'
                                name="priority"
                                options={priority_choices ? priority_choices : ''}
                                value={priority_choices.find(option => option.value === query.priority) || null}
                                onChange={ (e) => { onChangeTaskQueryHandler('priority', 'select', e.value) }}
                                styles={{
                                  control: (provided) => ({
                                    ...provided,
                                    borderRadius: '30px',  // Adjust the value as needed (30px is just an example)
                                    borderColor: '#ccc',  // Optional: change the border color
                                    padding: '2px'       // Optional: Add padding if necessary
                                  }),
                                  dropdownIndicator: (provided) => ({
                                    ...provided,
                                    color: '#ccc'  // Optional: change the dropdown indicator color
                                  }),
                                  clearIndicator: (provided) => ({
                                    ...provided,
                                    color: '#ccc'  // Optional: change the clear indicator color
                                  })
                                }}
                            />
                        </div>
                        <div className='col-md-2' style={{minWidth:'200px'}}>
                            <label className='form-label'>
                                Assignee  <RefreshCcw color='darkblue' size={'14'} onClick={() => onChangeTaskQueryHandler('assign_to', 'select', null)}/>
                            </label>
                            <Select
                                isClearable={false}
                                className='react-select'
                                classNamePrefix='select'
                                name="assign"
                                options={employees ? employees : ''}
                                value={employees.find(option => option.value === query.assign_to) || null}
                                onChange={ (e) => { onChangeTaskQueryHandler('assign_to', 'select', e.value) }}
                                styles={{
                                  control: (provided) => ({
                                    ...provided,
                                    borderRadius: '30px',  // Adjust the value as needed (30px is just an example)
                                    borderColor: '#ccc',  // Optional: change the border color
                                    padding: '2px'       // Optional: Add padding if necessary
                                  }),
                                  dropdownIndicator: (provided) => ({
                                    ...provided,
                                    color: '#ccc'  // Optional: change the dropdown indicator color
                                  }),
                                  clearIndicator: (provided) => ({
                                    ...provided,
                                    color: '#ccc'  // Optional: change the clear indicator color
                                  })
                                }}
                            />
                        </div>
                        <div 
                            className="col-md-3 d-flex justify-content-start mt-2" 
                            style={{ minWidth: '200px', height: '100%' }} // Ensure parent div has height
                          >
                            <div>
                              <Button.Ripple outline color="primary" onClick={applyFilters} className="mb-2 round">
                                <Save size={14} />
                                <span className="align-middle ms-25">Apply</span>
                              </Button.Ripple>
                            </div>
                            
                            <div><Button.Ripple className='round' color="flat-dark" onClick={applyResetFilters}>Reset All</Button.Ripple></div>
                          </div>

                    </div>                    
                    ) : <div className='text-center'><Spinner size={'16'} type='grow' color='blue'/></div>
                  )}
                  
                    {/* <TestDrag /> */}
                    {viewType === 'kanban' && (
                      !taskloading ? (
                        (data && Object.values(data).length > 0) && (
                          <KanbanView tasks={data} 
                          statuses={statuses}
                          onCardClick={onClickIssue}
                          onStatusChange={(id, status) => updateStatus(id, status)}
                          AddTask={handleAddClick}/>
                        )
                      ) : (
                        <div className="text-center">
                            <Spinner size="18" /> Loading tasks...
                        </div>
                      )
                    )}
                    {viewType === 'list' && (
                      <PerfectScrollbar className='sidebar-menu-list'
                      options={{ wheelPropagation: true }}
                      style={{ minHeight: '400px', overflow: 'hidden' }}>
                      {!taskloading ? (
                      <div className='task-list' >
                      {/* Header Section */}
                      <Row className='stripped fw-bold py-2 px-3 small'>
                        <Col xs={12} sm={4} md={3} className='header'>Title</Col>
                        {/* <Col xs={6} sm={2} md={2}>Assigned By</Col> */}
                        <Col xs={6} sm={2} md={2} className='header'>Assigned To</Col>
                        <Col xs={6} sm={2} md={2} className='header'>Status {sortingOrder.find(item => item.hasOwnProperty('status_title'))?.status_title === 'asc' ? <BsSortAlphaDown onClick={() => sortTasks(data, 'status_title', 'desc')} size={16} /> : <BsSortAlphaDownAlt onClick={() => sortTasks(data, 'status_title', 'asc')} size={16} />}
                        </Col>

                        <Col xs={6} sm={2} md={2} className='header'>
                          Type {sortingOrder.find(item => item.hasOwnProperty('task_type_title'))?.task_type_title === 'asc' ? <BsSortAlphaDown onClick={() => sortTasks(data, 'task_type_title', 'desc')} size={16} /> : <BsSortAlphaDownAlt onClick={() => sortTasks(data, 'task_type_title', 'asc')} size={16} />}
                        </Col>

                        <Col xs={6} sm={2} md={1} className='text-nowrap header'>
                          Priority {sortingOrder.find(item => item.hasOwnProperty('priority'))?.priority === 'asc' ? <BsSortAlphaDown onClick={() => sortTasks(data, 'priority', 'desc')} size={16} /> : <BsSortAlphaDownAlt onClick={() => sortTasks(data, 'priority', 'asc')} size={16} />}
                        </Col>

                        <Col xs={6} sm={2} md={2} className='text-nowrap header'>
                          Due Date {sortingOrder.find(item => item.hasOwnProperty('due_date'))?.due_date === 'asc' ? <BsSortNumericUp onClick={() => sortTasks(data, 'due_date', 'desc')} size={16} /> : <BsSortNumericDownAlt onClick={() => sortTasks(data, 'due_date', 'asc')} size={16} />}
                        </Col>
                      </Row>

                      {/* Body Section */}
                      <ListGroup tag='div'>
                        {Object.values(data).length > 0 ? (
                          Object.values(data).map((item, key) => {
                          //   const assignerFormattedName = formatName(item.employee_name)
                            const assigneeFormattedName = formatName(item.assign_to_name)

                            return (
                                <ListGroupItem
                                  action
                                  key={key}
                                  className={item.status_title === 'Completed' ? "task-list-item py-2 cursor-pointer list-group-item-completed" : "task-list-item py-2 cursor-pointer"}
                                  onClick={() => onClickIssue(item)}
                                  tag="div"
                                  onMouseEnter={() => setHovered(key)}
                                  onMouseLeave={() => setHovered(null)}
                                >
                                  <Row className='d-flex justify-content-between align-items-center small'>
                                    {/* Task Title */}
                                    <Col xs={12} sm={4} md={3}>
                                      <strong className={
                                          hovered === key  ? 'text-white cursor-pointer'  : item.status_title !== 'Completed' ? 'text-dark cursor-pointer' : 'text-white cursor-pointer'
                                        }>{(item.title).substring(0, 20)}...</strong>
                                    </Col>

                                    {/* Assigner Profile Image and Name */}
                                    {/* <Col xs={6} sm={2} md={2}>
                                      <div className='d-flex align-items-center'>
                                        {item.profile_image_employee && (
                                          <img
                                            src={item.profile_image_employee}
                                            alt="Assigner"
                                            className="rounded-circle"
                                            style={{ width: '24px', height: '24px', marginRight: '8px' }}
                                          />
                                        )}
                                        <span
                                          id={`assignBy-${key}`}
                                          className={hovered === key ? 'text-white cursor-pointer' : 'text-dark cursor-pointer'}
                                        >
                                          {assignerFormattedName}
                                        </span>
                                        <Tooltip
                                          placement="top"
                                          isOpen={tooltipOpenAssignBy[key]}
                                          target={`assignBy-${key}`}
                                          toggle={() => toggleTooltipAssignBy(key)}
                                        >
                                          {item.employee_name}
                                        </Tooltip>
                                      </div>
                                    </Col> */}

                                    {/* Assignee Profile Image and Name */}
                                    <Col xs={6} sm={2} md={2}>
                                      <div className='d-flex align-items-center'>
                                        {item.profile_image_assign_to && (
                                          <img
                                            src={item.profile_image_assign_to}
                                            alt="Assignee"
                                            className="rounded-circle"
                                            style={{ width: '24px', height: '24px', marginRight: '8px' }}
                                          />
                                        )}
                                        <span
                                          id={`assignTo-${key}`}
                                          className={hovered === key ? 'text-white cursor-pointer' : item.status_title !== 'Completed' ? 'text-dark cursor-pointer' : 'text-white cursor-pointer'}
                                        >
                                          {assigneeFormattedName}
                                        </span>
                                        <Tooltip
                                          placement="top"
                                          isOpen={tooltipOpenAssignTo[key]}
                                          target={`assignTo-${key}`}
                                          toggle={() => toggleTooltipAssignTo(key)}
                                        >
                                          {item.assign_to_name}
                                        </Tooltip>
                                      </div>
                                    </Col>

                                    {/* Task Status */}
                                    <Col xs={6} sm={2} md={2}>
                                      <Badge className='badge-glow'>{item.status_title}</Badge>
                                    </Col>

                                    {/* Task Type */}
                                    <Col xs={6} sm={2} md={2}>
                                      <span className={
                                          hovered === key  ? 'text-white cursor-pointer'  : item.status_title !== 'Completed' ? 'text-dark cursor-pointer' : 'text-white cursor-pointer'
                                        }>{item.task_type_title}</span>
                                    </Col>

                                    {/* Task Priority */}
                                    <Col xs={6} sm={2} md={1}>
                                      <Badge color={getPriorityBadgeColor(item.priority)}>
                                        {item.priority}
                                      </Badge>
                                    </Col>

                                    {/* Due Date */}
                                    <Col xs={6} sm={2} md={2} className='text-nowrap'>
                                      <span className={
                                          hovered === key  ? 'text-white cursor-pointer'  :  item.status_title !== 'Completed' ? 'text-dark cursor-pointer' : 'text-white cursor-pointer'
                                        }>{item.due_date ? item.due_date : 'N/A'}</span>
                                    </Col>
                                  </Row>
                                </ListGroupItem>
                            )
                          })
                        ) : (
                          <p className='text-center small'>No tasks found!</p>
                        )}
                      </ListGroup>
                      </div>
                      ) : (
                        <div className="text-center">
                            <Spinner size="18" /> Loading tasks...
                        </div>
                      )}
                      </PerfectScrollbar> 
                    )}
                    {/* {viewType === 'group-view' && (
                      !taskloading ? (
                      !groupTaskLoading ? (
                        (groupTasksData && Object.values(groupTasksData).length > 0) && (
                          <TaskGroups data={groupTasksData} onClickIssue={onClickIssue}/>
                        )
                      ) : <div className="text-center"><Spinner /></div>
                    ) : (
                      <div className="text-center">
                          <Spinner size="18" /> Loading tasks...
                      </div>
                    ))} */}
                    
              </Col>
            </Row>
          </div>
        </div>
      </div>
      {/* Modal for Add Task */}
      <Modal isOpen={centeredModal} toggle={() => setCenteredModal(!centeredModal)} className='modal-dialog-centered modal-lg'>
        <ModalHeader toggle={() => setCenteredModal(!centeredModal)}>Add Task</ModalHeader>
        <ModalBody>
          <AddTask projectsData={projectsData} CallBack={CallBackAddAction} currentAddStatus={currentAddStatusid}/>
        </ModalBody>
      </Modal>
      {/* Modal for Task Details */}
      <Modal isOpen={taskDetailModal} toggle={toggleTaskDetailModal} className='modal-dialog-centered modal-md'>
        <ModalHeader toggle={toggleTaskDetailModal} className='text-secondary pb-0'>
        {currentIssue && (
                <p className='text-secondary mb-0'>{currentIssue.project_name} / Task ID - {currentIssue.id} <Copy onClick={() => Api.copyToClipboard(`${Api.FrontendBaseUrl}/task/${currentIssue.id}`)} size={14} color="gray" alt="copy Link"/><span onClick={() => Api.copyToClipboard(`${Api.FrontendBaseUrl}/task/${currentIssue.id}`)} className='text-muted small cursor-pointer hover-underline'> copy link</span> <br></br><span className='text-muted small'>Created on {Api.formatDateWithMonthName(currentIssue.created_at)}</span></p>
          )}
        </ModalHeader>
        <ModalBody className='mx-1 pt-0'>
          {currentIssue && !loading ? (
            <TaskDetail 
            projectsData={projectsData}
            data={currentIssue}
            CallBack={CallBackTask}
            employees={employees}
            priorities={priorities}
            types={types}
            role={role}
            />
          ) : (
            <div className='text-center'><Spinner size="sm" /></div>
          )}
        </ModalBody>
      </Modal>
  </Fragment>
  )
}

export default Tasks
