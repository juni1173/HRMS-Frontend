import React, { useState } from 'react'
import { Modal, ModalHeader, ModalBody, ListGroup, ListGroupItem, Spinner } from 'reactstrap'
import TaskDetail from './TaskDetail'
import apiHelper from '../../Helpers/ApiHelper'
import { Copy } from 'react-feather'
const ChildTasks = ({ childTasks, projectsData, employees, priorities, types, onModalToggle, role }) => {
    
    const Api = apiHelper()
    const [taskDetailModal, setTaskDetailModal] = useState(false)
    const [selectedTask, setSelectedTask] = useState(null)
    const handleTaskClick = (task) => {
        setSelectedTask(task)
        setTaskDetailModal(true)
    }
    const toggleModal = () => {
        setTaskDetailModal(!taskDetailModal)
        if (onModalToggle) {
            onModalToggle()  // Trigger the callback to alert parent when the modal is toggled
        }
    }
    return (
        <>
            {/* Display child tasks */}
            <div className="child-tasks-container">
                <ListGroup className="">
                    {childTasks.length > 0 ? (
                        childTasks.map((task, index) => (
                            <ListGroupItem
                                key={index}
                                className="border-0 border-bottom mb-1"
                                style={{
                                    backgroundColor: "rgb(0 0 0 / 10%)",
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                                onClick={() => handleTaskClick(task)}
                            >
                                <span className="text-dark" style={{fontWeight: '600'}}>{task.title}</span>
                            </ListGroupItem>
                        ))
                    
                    ) : (
                        <p className="border-0 text-muted small">No child tasks available.</p>
                    )}
                </ListGroup>

                {/* Modal for Task Details */}
                <Modal
                    isOpen={taskDetailModal}
                    toggle={toggleModal}  // Use the toggle function here
                    className='modal-dialog-centered modal-md'
                >
                    <ModalHeader toggle={toggleModal} className='text-secondary pb-0'>
                        {selectedTask && (
                            <p className='text-secondary mb-0'>{selectedTask.project_name} / Task ID - {selectedTask.id} <Copy onClick={() => Api.copyToClipboard(`${Api.FrontendBaseUrl}/task/${selectedTask.id}`)} size={14} color="gray" alt="copy Link"/><br></br><span className='text-muted small'>Created on {Api.formatDateWithMonthName(selectedTask.created_at)}</span></p>
                        )}
                    </ModalHeader>
                    <ModalBody className='mx-1 pt-0'>
                        {selectedTask ? (
                            <TaskDetail
                                projectsData={projectsData}
                                data={selectedTask}
                                employees={employees}
                                priorities={priorities}
                                types={types}
                                isChild={true}
                                role={role}
                            />
                        ) : (
                            <div className='text-center'><Spinner size="sm" /></div>
                        )}
                    </ModalBody>
                </Modal>
            </div>
        </>
    )
}

export default ChildTasks
