import { Fragment, useState } from 'react'
import { AlignRight } from 'react-feather'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { Spinner, Row, Col, Badge, ListGroup, ListGroupItem, Button, Tooltip, Modal, ModalBody, ModalHeader, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap'
import AddTask from './AddTask'
import TaskDetail from './TaskDetail'
import { IoAddCircleOutline } from "react-icons/io5"

const Tasks = ({ data, projectsData, CallBack, selectedTaskid, project_id, employees, priorities, types }) => {
//   const [tooltipOpenAssignBy, setTooltipOpenAssignBy] = useState({})
  const [tooltipOpenAssignTo, setTooltipOpenAssignTo] = useState({})
  const [centeredModal, setCenteredModal] = useState(false)
  const [taskDetailModal, setTaskDetailModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [currentIssue, setCurrentIssue] = useState(selectedTaskid ? data.find(pre => pre.id === selectedTaskid) : null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
//   const [hoveredAssignBy, setHoveredAssignBy] = useState(null)
  const [hovered, setHovered] = useState(null)
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
  const handleAddClick = () => {
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
      CallBack(project_id)
    }
  }
  const CallBackAddAction = (project) => {
    CallBack(project)
    setCenteredModal(!centeredModal)
  }
  return (
    <Fragment>
      <div className='sidebar'>
        <div className='sidebar-content todo-sidebar'>
          <div className='todo-app-menu'>
            <Row>
              <Col md={12} className="bg-white">
                <div className='task-actions d-flex justify-content-between align-items-center mb-2'>
                  {/* Add New Task Button */}
                  <div className='add-task-section d-flex align-items-center'>
                    <Button
                      color="primary"
                      className="d-flex align-items-center rounded-pill px-2 py-1 btn-sm"
                      onClick={handleAddClick}
                    >
                      <IoAddCircleOutline color="#fff" size={'14px'} className="mr-1" /> 
                      Add Task
                    </Button>
                  </div>

                  {/* Sorting Dropdown */}
                  <div className='sort-dropdown d-flex align-items-center'>
                    <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown} direction="down">
                      <DropdownToggle className="d-flex align-items-center text-dark bg-white border border-secondary rounded-pill px-2 py-1 btn-sm" caret>
                        <AlignRight size={'16px'} className="mr-1" />
                        Sort By
                      </DropdownToggle>

                      <DropdownMenu>
                        <DropdownItem onClick={() => sortAction('all-tasks')}>All Tasks</DropdownItem>
                        <DropdownItem onClick={() => sortAction('assign-to-me')}>Assign to Me</DropdownItem>
                        <DropdownItem onClick={() => sortAction('created-by-me')}>Created by Me</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </div>

                <PerfectScrollbar className='sidebar-menu-list' options={{ wheelPropagation: false }}>
                  <div className='task-list'>
                    {/* Header Section */}
                    <Row className='bg-light fw-bold py-2 px-3 small'>
                      <Col xs={12} sm={4} md={3}>Title</Col>
                      {/* <Col xs={6} sm={2} md={2}>Assigned By</Col> */}
                      <Col xs={6} sm={2} md={2}>Assigned To</Col>
                      <Col xs={6} sm={2} md={2}>Status</Col>
                      <Col xs={6} sm={2} md={2}>Type</Col>
                      <Col xs={6} sm={2} md={1}>Priority</Col>
                      <Col xs={6} sm={2} md={2} className='text-nowrap'>Due Date</Col>  
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
                              className="task-list-item py-2 cursor-pointer"
                              onClick={() => onClickIssue(item)}
                              tag="div"
                              onMouseEnter={() => setHovered(key)}
                              onMouseLeave={() => setHovered(null)}
                            >
                              <Row className='d-flex justify-content-between align-items-center small'>
                                {/* Task Title */}
                                <Col xs={12} sm={4} md={3}>
                                  <strong className={
                                      hovered === key  ? 'text-white cursor-pointer'  : 'text-dark cursor-pointer'
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
                                      className={hovered === key ? 'text-white cursor-pointer' : 'text-dark cursor-pointer'}
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
                                      hovered === key  ? 'text-white cursor-pointer'  : 'text-dark cursor-pointer'
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
                                      hovered === key  ? 'text-white cursor-pointer'  : 'text-dark cursor-pointer'
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
                </PerfectScrollbar>
              </Col>
            </Row>
          </div>
        </div>
      </div>
      {/* Modal for Add Task */}
      <Modal isOpen={centeredModal} toggle={() => setCenteredModal(!centeredModal)} className='modal-dialog-centered modal-lg'>
        <ModalHeader toggle={() => setCenteredModal(!centeredModal)}>Add Task</ModalHeader>
        <ModalBody>
          <AddTask projectsData={projectsData} CallBack={CallBackAddAction} />
        </ModalBody>
      </Modal>
      {/* Modal for Task Details */}
      <Modal isOpen={taskDetailModal} toggle={toggleTaskDetailModal} className='modal-dialog-centered modal-lg'>
        <ModalHeader toggle={toggleTaskDetailModal}>Task Details</ModalHeader>
        <ModalBody>
          {currentIssue && !loading ? (
            <TaskDetail projectsData={projectsData} data={currentIssue} CallBack={CallBackTask} employees={employees} priorities={priorities} types={types}/>
          ) : (
            <div className='text-center'><Spinner size="sm" /></div>
          )}
        </ModalBody>
      </Modal>
  </Fragment>
  )
}

export default Tasks
