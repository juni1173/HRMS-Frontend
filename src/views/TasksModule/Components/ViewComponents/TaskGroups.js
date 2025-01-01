import React, { useState, useCallback } from 'react'
import { Collapse, Button, Row, Col, ListGroup, ListGroupItem, Tooltip, Badge, Input } from 'reactstrap'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { ChevronDown, Plus } from 'react-feather'

const TaskGroups = ({ data, onClickIssue }) => {
  const [openGroupId, setOpenGroupId] = useState(null)
  const [hovered, setHovered] = useState(null)
  const [tooltipOpenAssignTo, setTooltipOpenAssignTo] = useState({})
  const [selectedTaskIds, setSelectedTaskIds] = useState([])

  const toggleCollapse = useCallback((groupId) => {
    setOpenGroupId((prevGroupId) => (prevGroupId === groupId ? null : groupId))
  }, [])

  const toggleTooltipAssignTo = useCallback((key) => {
    setTooltipOpenAssignTo((prev) => ({ ...prev, [key]: !prev[key] }))
  }, [])

  const handleCheckboxChange = useCallback((taskId) => {
    setSelectedTaskIds((prevSelected) => {
      if (prevSelected.includes(taskId)) {
        return prevSelected.filter((id) => id !== taskId)
      } else {
        return [...prevSelected, taskId]
      }
    })
  }, [])

  const getPriorityBadgeColor = (priority) => {
    switch (priority?.toLowerCase()) {
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

  const formatName = (fullName) => {
    const names = fullName?.trim().split(' ') || []
    const firstInitial = names[0]?.charAt(0).toUpperCase() || ''
    const lastName = names[names.length - 1] || ''
    return `${firstInitial}. ${lastName}`
  }
const handleMoveTasks = ids => {
    await Api.get(`/taskify/group/${project_id}`).then(result => {
        if (result) {
          setGroupTaskLoading(true)
            if (result.status === 200) {
                const groupData = result.data
                if (Object.values(groupData).length > 0) {
                   setGroupTasksData(groupData)
                }
            } else {
              setGroupTasksData([])
                Api.Toast('error', result.message)
            }
            setGroupTaskLoading(false)
        } else {
            Api.Toast('error', 'Server error!')
        }
    })
}
  const renderTaskItem = (item) => {
    const assigneeFormattedName = formatName(item.assign_to_name)

    return (
        <ListGroupItem
        action
        key={item.id} 
        className={item.status_title === 'Completed' ? 'task-list-item py-2 cursor-pointer list-group-item-completed' : 'task-list-item py-2 cursor-pointer'}
        onClick={(e) => {
          // Prevent onClick when clicking inside the checkbox column
          if (e.target.type === 'checkbox') return 
          onClickIssue(item)
        }}
        onMouseEnter={() => setHovered(item.id)}
        onMouseLeave={() => setHovered(null)}
      >
        <Row className='d-flex justify-content-between align-items-center small'>
          <Col xs={1}>
            <Input 
              type="checkbox" 
              checked={selectedTaskIds.includes(item.id)} 
              onClick={(e) => e.stopPropagation()} // Important to prevent click bubbling
              onChange={(e) => { 
                e.stopPropagation() 
                handleCheckboxChange(item.id) 
              }} 
            />
          </Col>
      
          <Col xs={3}>
            <strong className={hovered === item.id ? 'text-white cursor-pointer' : item.status_title !== 'Completed' ? 'text-dark cursor-pointer' : 'text-white cursor-pointer'}>
              {item?.title?.substring(0, 20) ?? ''}...
            </strong>
          </Col>
      
          <Col xs={2}>
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
                id={`assignTo-${item.id}`}
                className={hovered === item.id ? 'text-white cursor-pointer' : item.status_title !== 'Completed' ? 'text-dark cursor-pointer' : 'text-white cursor-pointer'}
              >
                {assigneeFormattedName}
              </span>
              <Tooltip
                placement="top"
                isOpen={tooltipOpenAssignTo[item.id]}
                target={`assignTo-${item.id}`}
                toggle={() => toggleTooltipAssignTo(item.assign_to_name)}
              >
                {item.assign_to_name}
              </Tooltip>
            </div>
          </Col>
      
          <Col xs={2}>
            <Badge className='badge-glow'>{item.status_title}</Badge>
          </Col>
      
          <Col xs={2}>
            <span>{item.task_type_title}</span>
          </Col>
      
          <Col xs={1}>
            <Badge color={getPriorityBadgeColor(item.priority)}>
              {item.priority}
            </Badge>
          </Col>
      
          <Col xs={1}>
            <span>{item.due_date ? item.due_date : 'N/A'}</span>
          </Col>
        </Row>
      </ListGroupItem>
      
    )
  }

  const allGroups = [...data.groups, { ...data.default_group, group_id: 'default' }]

  return (
    <div>
      <div className='w-100 d-flex justify-content-between'>
        <div> 
            {selectedTaskIds.length > 0 && (
            <span 
                className='text-secondary cursor-pointer hover-underline'
                onClick={() => handleMoveTasks(selectedTaskIds)}
            >
                Move ({selectedTaskIds.length} selected)
            </span>
            )}
        </div>
        <div>
            <span className='text-secondary cursor-pointer hover-underline' style={{ paddingLeft: '10px', margin: '0', float: 'right' }}>
            <Plus color='gray' size='14' /> Add new group
            </span>
        </div>
        
      </div>
      {allGroups.map((group) => (
        <div key={group.group_id} style={{ marginBottom: '15px' }}>
          <Button 
            color="light"
            className='group-header-text' 
            onClick={() => toggleCollapse(group.group_id)} 
            style={{ width: '100%', textAlign: 'left' }}
          >
            <ChevronDown size={16} color='#9095A0FF' /> 
            {group.group_title} 
            <span className='group-header-count'>{group.tasks.length} tasks</span>
          </Button>

          <Collapse isOpen={openGroupId === group.group_id}>
            <PerfectScrollbar 
              className='sidebar-menu-list'
              options={{ wheelPropagation: true }}
              style={{ maxHeight: '400px', overflowY: 'auto' }}
            >
              <div className='task-list'>
                <Row className='stripped fw-bold py-2 px-3 small'>
                  <Col xs={1}>Select</Col>
                  <Col xs={3}>Title</Col>
                  <Col xs={2}>Assigned To</Col>
                  <Col xs={2}>Status</Col>
                  <Col xs={2}>Type</Col>
                  <Col xs={1}>Priority</Col>
                  <Col xs={1}>Due Date</Col>
                </Row>

                <ListGroup tag='div'>
                  {group.tasks.length > 0 ? (
                    group.tasks.map(renderTaskItem)
                  ) : (
                    <p className='text-center small'>No tasks found!</p>
                  )}
                </ListGroup>
              </div>
            </PerfectScrollbar>
          </Collapse>
        </div>
      ))}
    </div>
  )
}

export default TaskGroups
