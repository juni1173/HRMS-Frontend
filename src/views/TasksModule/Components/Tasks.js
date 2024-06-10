import {Fragment, React, useState} from 'react'
import { Filter, Plus, AlignRight } from 'react-feather'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { Spinner, Row, Col, Badge, ListGroup, ListGroupItem, Button, Modal, ModalBody, ModalHeader, Dropdown, DropdownItem, DropdownMenu } from 'reactstrap'
import AddTask from './AddTask'
import TaskDetail from './TaskDetail'

const Tasks = ({ data, projectsData, CallBack, selectedTaskid, project_id }) => {
    
        const [centeredModal, setCenteredModal] = useState(false)
        // const [assigneeModal, setAssigneeModal] = useState(false)
        // const [statusCount, setStatusCount] = useState([])
        // const [assigneeCount, setAssigneeCount] = useState([])
        const [loading, setLoading] = useState(false)
        const [currentIssue, setCurrentIssue] = useState(selectedTaskid ? data.find(pre => pre.id === selectedTaskid) : [])
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
            // handleTaskSidebar()
            setCenteredModal(!centeredModal)
          }
      return (
        <Fragment>
            <div className='sidebar'>
             <div className='sidebar-content todo-sidebar'>
          <div className='todo-app-menu'>
            <Row style={{height: '400px'}}>
                
                <Col md={4} id='' className='border-right p-0' style={{backgroundColor: '#315180'}}>
                <div className='add-task'>
                    
                    <div className='d-flex justify-content-between mb-2'>
                        <div className='pt-1'>
                        <Button color='success' onClick={handleAddClick} className='btn-sm float-left'>
                            <Plus size={'16'}/> Add Task
                        </Button>
                        </div>
                        <div className='d-flex pt-1'>
                            <Dropdown  isOpen={dropdownOpen} toggle={() => toggleDropdown()} direction="">
                                {/* <DropdownToggle className="no-background m-0 px-0"> */}
                                <div onClick={() => toggleDropdown()}><AlignRight size={'20'} color='white'/></div>
                                {/* </DropdownToggle> */}
                                <DropdownMenu>
                                <DropdownItem>
                                        <button
                                            className="border-0 no-background"
                                            title="All Tasks"
                                            onClick={() => sortAction('all-tasks')}
                                            >
                                            All Tasks
                                        </button> 
                                </DropdownItem>
                                <DropdownItem>
                                    <button
                                        className="border-0 no-background"
                                        title="Assign to me"
                                        onClick={() => sortAction('assign-to-me')}
                                        >
                                        Assign to me
                                    </button> 
                                </DropdownItem>
                                <DropdownItem>
                                    <button
                                        className="border-0 no-background text-nowrap"
                                        // style={{marginTop:'15px', padding:'10px'}}
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
                        <p className='text-center text-white'>No any task found!</p>
                    )
            }
             
                    </ListGroup>
              </PerfectScrollbar>
                </Col>
                <Col md={8} className='mid-scroll'>
                    
                    {/* <Button className='btn btn-success text-center m-2' onClick={getStatusChart}>
                        Status Chart <BarChart2 />
                    </Button>
                    <Button className='btn btn-success text-center' onClick={getAssigneeChart}>
                        Assignee Chart <BarChart2 />
                    </Button> */}
                    {
                        (currentIssue && Object.values(currentIssue).length > 0) ? (
                            !loading ? (
                                currentIssue ? ( 
                                <TaskDetail projectsData={projectsData} data={currentIssue} CallBack={CallBackTask}/>
                                ) : null
                            ) : <div className='text-center'><Spinner /></div>
                        ) : (
                            <div className='text-center'>No task selected...</div>
                        )
                    }
                </Col>
            </Row>
            </div>
            </div>
            </div>
            <Modal isOpen={centeredModal} toggle={() => setCenteredModal(!centeredModal)} className='modal-dialog-centered modal-lg'>
              <ModalHeader toggle={() => setCenteredModal(!centeredModal)}>Add Task</ModalHeader>
              <ModalBody>
                    <AddTask projectsData={projectsData} CallBack={CallBack}/>
              </ModalBody>
            </Modal>
            {/*<Modal isOpen={assigneeModal} toggle={() => setAssigneeModal(!assigneeModal)} className='modal-dialog-centered modal-lg'>
              <ModalHeader toggle={() => setAssigneeModal(!assigneeModal)}>Assignee Chart</ModalHeader>
              <ModalBody>
                    <AssigneeChart data={assigneeCount} />
              </ModalBody>
              <ModalFooter>
               
              </ModalFooter>
            </Modal> */}
        </Fragment>
      )
    }

export default Tasks