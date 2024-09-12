import React, { useState } from 'react'
import { Modal, ModalHeader, ModalBody, ListGroup, ListGroupItem, Spinner } from 'reactstrap'
import TaskDetail from './TaskDetail'

const ChildTasks = ({ childTasks, projectsData, employees, priorities, types, onModalToggle }) => {
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
                <ListGroup className="mt-1">
                    {childTasks.length > 0 ? (
                        childTasks.map((task, index) => (
                            <ListGroupItem
                                key={index}
                                className="border-0 border-bottom mb-1"
                                style={{
                                    backgroundColor: "#f8f9fa",
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                                onClick={() => handleTaskClick(task)}
                            >
                                <span className="text-dark">{task.title}</span>
                            </ListGroupItem>
                        ))
                    ) : (
                        <ListGroupItem className="border-0 p-2">No child tasks available.</ListGroupItem>
                    )}
                </ListGroup>

                {/* Modal for Task Details */}
                <Modal
                    isOpen={taskDetailModal}
                    toggle={toggleModal}  // Use the toggle function here
                    className='modal-dialog-centered modal-lg'
                >
                    <ModalHeader toggle={toggleModal}>Task Details</ModalHeader>
                    <ModalBody>
                        {selectedTask ? (
                            <TaskDetail
                                projectsData={projectsData}
                                data={selectedTask}
                                employees={employees}
                                priorities={priorities}
                                types={types}
                                isChild={true}
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
