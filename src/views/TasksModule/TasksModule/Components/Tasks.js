import { Fragment, React, useState } from 'react'
import { Filter, Plus, AlignRight } from 'react-feather'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { Spinner, Row, Col, Badge, ListGroup, ListGroupItem, Button, Modal, ModalBody, ModalHeader, Dropdown, DropdownItem, DropdownMenu } from 'reactstrap'
import AddTask from './AddTask'
import TaskDetail from './TaskDetail'
import { IoAddCircleOutline } from "react-icons/io5"

const Tasks = ({ data, projectsData, CallBack, selectedTaskid, project_id }) => {

  const [centeredModal, setCenteredModal] = useState(false)
  const [taskDetailModal, setTaskDetailModal] = useState(false) // State to handle task detail modal
  const [loading, setLoading] = useState(false)
  const [currentIssue, setCurrentIssue] = useState(selectedTaskid ? data.find(pre => pre.id === selectedTaskid) : null)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen)
  }

  const sortAction = (sort) => {
    CallBack(project_id, currentIssue, sort)
  }

  const onClickIssue = item => {
    setLoading(true)
    setCurrentIssue(item)
    setTaskDetailModal(true) // Open task detail modal when a task is clicked
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

  return (
    <Fragment>
      <div className='sidebar'>
        <div className='sidebar-content todo-sidebar'>
          <div className='todo-app-menu'>
            <Row style={{ height: '400px' }}>

              <Col md={4} id='' className='border-right p-0' style={{ backgroundColor: '#fff' }}>
                <div className='add-task' style={{ backgroundColor: '#eaf1ff' }}>

                  <div className='d-flex justify-content-between pb-2' style={{ backgroundColor: '#eaf1ff' }}>
                    <div className='pt-1'>
                      <button
                        className="border-0 no-background float-left"
                        title="Add new task"
                        style={{ fontSize: '14px' }}
                        onClick={handleAddClick}
                      >
                        <IoAddCircleOutline color="#315180" size={'18px'} /> New Task
                      </button>
                    </div>
                    <div className='d-flex pt-1'>
                      <Dropdown isOpen={dropdownOpen} toggle={() => toggleDropdown()} direction="" className='chart-dropdown'>
                        <div onClick={() => toggleDropdown()}><AlignRight size={'20'} /></div>
                        <DropdownMenu className='btn-sm border-0'>
                          <DropdownItem className='w-100'>
                            <button
                              className="border-0 no-background"
                              title="All Tasks"
                              onClick={() => sortAction('all-tasks')}
                            >
                              All Tasks
                            </button>
                          </DropdownItem>
                          <DropdownItem className='w-100'>
                            <button
                              className="border-0 no-background"
                              title="Assign to me"
                              onClick={() => sortAction('assign-to-me')}
                            >
                              Assign to me
                            </button>
                          </DropdownItem>
                          <DropdownItem className='w-100'>
                            <button
                              className="border-0 no-background text-nowrap"
                              title="Created by me"
                              onClick={() => sortAction('created-by-me')}
                            >
                              Created by me
                            </button>
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                  </div>
                </div>
                <PerfectScrollbar className='sidebar-menu-list' options={{ wheelPropagation: false }}>
                  <ListGroup tag='div' className='list-group-filters'>
                    {Object.values(data).length > 0 ? (
                      Object.values(data).map((item, key) => (
                        <ListGroupItem
                          action
                          key={key}
                          className="cursor-pointer"
                          active={currentIssue && currentIssue.id === item.id}
                          onClick={() => onClickIssue(item)}
                        >
                          <div className='d-flex justify-content-between'>
                            <span>{(item.title).substring(0, 20)}...</span>
                            <Badge className='badge-glow'>{item.status_title}</Badge>
                          </div>
                        </ListGroupItem>
                      ))
                    ) : (
                      <p className='text-center'>No any task found!</p>
                    )}
                  </ListGroup>
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
          <AddTask projectsData={projectsData} CallBack={CallBack} />
        </ModalBody>
      </Modal>

      {/* Modal for Task Details */}
      <Modal isOpen={taskDetailModal} toggle={() => setTaskDetailModal(!taskDetailModal)} className='modal-dialog-centered modal-lg'>
        <ModalHeader toggle={() => setTaskDetailModal(!taskDetailModal)}>Task Details</ModalHeader>
        <ModalBody>
          {currentIssue && !loading ? (
            <TaskDetail projectsData={projectsData} data={currentIssue} CallBack={CallBackTask} />
          ) : (
            <div className='text-center'><Spinner /></div>
          )}
        </ModalBody>
      </Modal>

    </Fragment>
  )
}

export default Tasks
