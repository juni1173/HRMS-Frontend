import React, { useState, useRef } from "react"
import { Card, Badge, Tooltip, Button, CardImg } from "reactstrap"
import { PlusCircle, Paperclip, MessageCircle, Plus } from "react-feather"
import { ReactSortable } from "react-sortablejs"
import "@styles/react/libs/drag-and-drop/drag-and-drop.scss"
import Avatar from '@components/avatar'

const KanbanView = ({ tasks, onCardClick, onStatusChange, statuses, AddTask }) => {
    const boardRef = useRef(null)
  const [tooltipOpenAssignTo, setTooltipOpenAssignTo] = useState({})
  const [columns, setColumns] = useState(() => statuses.reduce((acc, status) => {
    acc[status.label] = tasks.filter((task) => task.status_title === status.label)
    return acc
  }, {})
  )

  const handleDrop = (taskId, sourceStatus, targetStatus) => {
    if (sourceStatus === targetStatus) return

    const taskToUpdate = columns[sourceStatus]?.find((task) => task.id === taskId)
    if (!taskToUpdate) return
    const updatedTask = { ...taskToUpdate, status_title: targetStatus, status: statuses.find(pre => pre.label === targetStatus).value }

    const updatedSource = columns[sourceStatus].filter((task) => task.id !== taskId)
    const updatedTarget = [...(columns[targetStatus] || []), updatedTask]

    setColumns((prevColumns) => ({
      ...prevColumns,
      [sourceStatus]: updatedSource,
      [targetStatus]: updatedTarget
    }))
    const updatedStatusObj = statuses.find(pre => pre.label === targetStatus)
    if (onStatusChange) {
      onStatusChange(updatedTask.id, updatedStatusObj)
    }
  }

  const onEndFunction = (evt) => {
    const taskId = evt.item?.getAttribute("data-id")
    const sourceStatus = evt.from?.closest(".kanban-column")?.getAttribute("data-status")
    const targetStatus = evt.to?.closest(".kanban-column")?.getAttribute("data-status")

    if (taskId && sourceStatus && targetStatus) {
      handleDrop(Number(taskId), sourceStatus, targetStatus)
    } else {
      console.warn("Invalid source or target status", { taskId, sourceStatus, targetStatus })
    }
  }

  const priorityClasses = {
    high: "light-danger",
    medium: "light-warning",
    low: "light-success"
  }

  const toggleTooltipAssignTo = (key) => {
    setTooltipOpenAssignTo((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
        <div ref={boardRef} className="kanban-board d-flex">
        {(tasks && Object.values(tasks).length > 0) ? (
            statuses.map((status) => (
                <div
                  key={status.value}
                  className="kanban-column"
                  data-status={status.label} // Correctly define drop zone attribute
                >
                  <div className="kanban-column-header d-flex justify-content-between">
                    <div><h4 className="title">{(columns[status.label] && columns[status.label].length > 0) && <Badge pill color="light-primary">{columns[status.label].length}</Badge>} {status.label}</h4></div>
                    <div>
                      <PlusCircle className="cursor-pointer" style={{marginRight: '2px'}} size={20} color="grey" onClick={() => AddTask(status.value)}/>
                      {/* <MoreHorizontal className="cursor-pointer" size={16} color="grey" /> */}
                    </div>
                  </div>
        
                  <ReactSortable
                    list={columns[status.label] || []}
                    setList={() => {}} // ReactSortable internally modifies DOM
                    group="shared-kanban-group"
                    animation={150}
                    forceFallback={false}
                    onEnd={onEndFunction}
                    tag="div"
                    className="sortable"
                    scroll={true} // Enable auto-scroll when dragging
                    scrollSensitivity={50} // Distance from edge to start scrolling
                    scrollSpeed={10} // Scroll speed
                  >
                    {(columns[status.label] || []).map((task) => (
                      <Card
                        key={task.id}
                        data-id={task.id}
                        className={`kanban-card draggable priority-${task.priority.toLowerCase()}`}
                        onClick={() => onCardClick(task)}
                      >
                        {task.attachment_image && (
                            <CardImg top src={task.attachment_image} className="max-vh-160" alt={task.title} />
                        )}
                        <h5 className="task-title">{task.title}</h5>
                        <div className="d-flex justify-content-start">
                            <Badge className="draggable" color="light-primary" pill>
                                {task.task_type_title}
                            </Badge>
                            <Badge
                                className="draggable"
                                color={priorityClasses[task.priority.toLowerCase()]}
                                pill
                            >
                                {task.priority}
                            </Badge>
                        </div>
                        <div className="d-flex justify-content-between mt-1">
                          <div>
                          <Button.Ripple style={{padding: "0.486rem 0rem"}} color='flat-secondary' size='sm'>
                            <Paperclip size={14} color="grey" />
                            <span className='align-middle ms-25'>{task.attachment_count && task.attachment_count}</span>
                          </Button.Ripple>
                          <span className="border-right" style={{margin: '0 4px'}}></span>
                          <Button.Ripple style={{padding: "0.486rem 0rem"}} color='flat-secondary' size='sm'>
                            <MessageCircle size={14} color="grey" />
                            <span className='align-middle ms-25'>{task.comment_count && task.comment_count}</span>
                          </Button.Ripple>
                          </div>
                          <div>
                          {task.profile_image_assign_to && (
                            <>
                                {task.profile_image_assign_to ? (
                                    <>
                                    <img
                                        src={task.profile_image_assign_to}
                                        alt="Assignee"
                                        id={`assignTo-${task.id}`}
                                        className="rounded-circle cursor-pointer"
                                        style={{ width: "24px", height: "24px", marginRight: "8px" }}
                                        />
                                        <Tooltip
                                        placement="top"
                                        isOpen={tooltipOpenAssignTo[task.id]}
                                        target={`assignTo-${task.id}`}
                                        toggle={() => toggleTooltipAssignTo(task.id)}
                                        >
                                        {task.assign_to_name}
                                        </Tooltip>
                                </>
                                ) : <Avatar color='light-primary' content={task.assign_to_name ? task.assign_to_name : 'N/A'} initials />}
                                
                            </>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}    
                  </ReactSortable>
                </div>
              ))
        ) : <div className="text-center"> No Task Found!</div>}
    </div>
  )
}

export default KanbanView
