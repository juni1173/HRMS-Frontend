import React, { Fragment, useEffect, useState } from 'react'
import { Badge, Row, Col, Tooltip, Modal, ModalBody, ModalHeader, ModalFooter, Card, CardBody, CardText, Button, CardImg } from 'reactstrap'
import { BarChart2, User, Zap, Plus, Link, FileText } from 'react-feather'
import apiHelper from '../../Helpers/ApiHelper'
import Select from 'react-select'
import TaskComments from './Comments/comments'
import { CiCalendarDate } from "react-icons/ci"
import { HiOutlineLightBulb, HiLightBulb } from "react-icons/hi"
import { RiAccountPinCircleFill } from "react-icons/ri"
import InputMask from 'react-input-mask'
import Flatpickr from 'react-flatpickr'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import ChildTasks from './ChildTask'
import AddTask from './AddTask'
import { Title } from 'chart.js'
const TaskDetail = ({ data, projectsData, employees, priorities, types, isChild }) => {
    const Api = apiHelper()
    const formatTime = (timeValue) => {
        if (!timeValue || timeValue === 'N/A') return 'N/A'
        const [hoursStr, minutesStr] = timeValue.includes(':') ? timeValue.split(':') : timeValue.split('.')
        let hours = parseInt(hoursStr, 10) || 0
        let minutes = parseInt(minutesStr, 10) || 0
        if (minutes > 59) {
            hours += Math.floor(minutes / 60)
            minutes = minutes % 60
        }
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
    }
    const [initialData, setInitialData] = useState(data)
    const [plannedHours, setPlannedHours] = useState(formatTime(data.planned_hours || 'N/A'))
    const [actualHours, setActualHours] = useState(formatTime(data.actual_hours || 'N/A'))
    const [accountHours, setAccountHours] = useState(formatTime(data.account_hour || 'N/A'))
    const [external_ticket_reference, setexternal_ticket_reference] = useState(data.external_ticket_reference || 'N/A')
    const [dueDate, setDueDate] = useState(data.due_date || 'N/A')
    const [isEditingPlannedHours, setIsEditingPlannedHours] = useState(false)
    const [isEditingActualHours, setIsEditingActualHours] = useState(false)
    const [isEditingAccountHours, setIsEditingAccountHours] = useState(false)
    const [isEditingDueDate, setIsEditingDueDate] = useState(false)
    const [selectedStatus, setSelectedStatus] = useState('')
    const [statusDropdown, setStatusDropdown] = useState([])
    const [projectStatuses, setProjectStatuses] = useState([])
    const [isEditingTitle, setIsEditingTitle] = useState(false)
    const [isEditingTicket, setIsEditingTicket] = useState(false)
    const [isEditingDescription, setIsEditingDescription] = useState(false)
    const [isEditingPriority, setIsEditingPriority] = useState(false)
    const [isEditingType, setIsEditingType] = useState(false)
    const [isEditingAssignee, setIsEditingAssignee] = useState(false)
    const [title, setTitle] = useState(data.title || '')
    const [description, setDescription] = useState(data.description || '')
    const [childTasks, setChildTasks] = useState([])
    const [attachments, setAttachments] = useState([])
    const [loading, setLoading] = useState(false)
    const [centeredModal, setCenteredModal] = useState(false)
    const [tooltipOpenAssignBy, setTooltipOpenAssignBy] = useState({})
    const [selectedPriority, setSelectedPriority] = useState(() => {
        const initialPriority = priorities.find(p => p.value === data.priority)
        return initialPriority || { value: '', label: 'N/A' }
    })
    const [selectedType, setSelectedType] = useState(() => {
        const initialType = types.find(t => t.value === data.task_type)
        return initialType || { value: '', label: 'N/A' }
    })
    const [selectedAssignee, setSelectedAssignee] = useState(() => {
        const initialAssignee = employees.find(emp => emp.value === data.assign_to)
        return initialAssignee || { value: '', label: 'N/A' }
    })
    // URL Validation function
    const isValidUrl = (url) => {
        const pattern = new RegExp('^(https?:\\/\\/)?' +
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + 
            '((\\d{1,3}\\.){3}\\d{1,3}))' + 
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
            '(\\?[;&a-z\\d%_.~+=-]*)?' + 
            '(\\#[-a-z\\d_]*)?$', 'i') 
        return !!pattern.test(url)
    }

    // State for URL validation message and temporary URL input
    const [urlValidationMessage, setUrlValidationMessage] = useState('')
    const [tempUrl, setTempUrl] = useState(data.external_ticket_reference || 'N/A')
    const fetchChildTasks = async () => {
        try {
            setLoading(true)
            const response = await Api.get(`/taskify/get/child/task/${data.id}/`)
            if (response.status === 200) {
                setChildTasks(response.data)
            }
        } catch (error) {
            setLoading(false)
            Api.Toast('error', 'Unable to fetch child tasks')
            // console.error("Error fetching child tasks:", error)
        } finally {
            setLoading(false)
        }
    }
    const fetchAttachments = async () => {
        try {
            const response = await Api.jsonPost(`/taskify/attachments/list/${data.id}/`)
            if (response.status === 200) {
                setAttachments(response.data)
                console.log(attachments)
            }
        } catch (error) {
            Api.Toast('error', 'Unable to fetch attachments')
        }
    }
    const toggleTooltipAssignBy = (key) => {
        setTooltipOpenAssignBy(prev => ({ ...prev, [key]: !prev[key] }))
      }
    const handleSaveData = async (fieldName, value) => {
        const fieldsToCheck = ['planned_hours', 'actual_hours', 'account_hour']
    if (fieldsToCheck.includes(fieldName)) {
        value = value.replace(/^0+/, '')
    }
        if (initialData[fieldName] !== value) {
        const formData = new FormData()
        formData[fieldName] = value
        await Api.jsonPatch(`/taskify/new/task/${data.id}/`, formData).then(result => {
            if (result && result.status === 200) {
                Api.Toast('success', 'Data saved successfully')
                setInitialData(result.data)
            } else {
                Api.Toast('error', result.message)
            }
        })
    }
    }
    const handleExternalTicketChange = (e) => {
        setTempUrl(e.target.value)
    }

    const handleExternalTicketBlur = () => {
        if (isValidUrl(tempUrl)) {
            setexternal_ticket_reference(tempUrl)
            handleSaveData('external_ticket_reference', tempUrl)
            setIsEditingTicket(false)
            setUrlValidationMessage('')
        } else {
            setUrlValidationMessage('Please enter a valid URL')
        }
    }
    const PriorityColor = priority => {
        if (priority) {
            if (priority === 'Low') return 'light-warning'
            if (priority === 'Medium') return 'light-primary'
            if (priority === 'High') return 'light-danger'
            return 'light-warning'
        }
    } 
    const theme = (theme) => ({
        ...theme,
        spacing: {
            ...theme.spacing,
            controlHeight: 30,
            baseUnit: 2
        }
    })
    
const handlePriorityChange = (priority) => {
    setSelectedPriority(priority)
    handleSaveData('priority', priority.value)
    setIsEditingPriority(false) 
}
const handleTypeChange = (type) => {
    setSelectedType(type)
    handleSaveData('task_type', type.value)
    setIsEditingType(false)
}
const handleAssigneeChange = (assignee) => {
    setSelectedAssignee(assignee)
    handleSaveData('assign_to', assignee.value)
    setIsEditingAssignee(false)
}
    const handleTimeChange = (fieldName, e) => {
        const value = e.target.value
        const [hoursStr, minutesStr] = value.split(':')
        let hours = parseInt(hoursStr, 10) || 0
        let minutes = parseInt(minutesStr, 10) || 0

        if (minutes > 59) {
            hours += Math.floor(minutes / 60)
            minutes = minutes % 60
        }

        const adjustedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`

        if (fieldName === 'planned_hours') {
            setPlannedHours(adjustedTime)
        }
        if (fieldName === 'actual_hours') {
            setActualHours(adjustedTime)
        }
        if (fieldName === 'account_hour') {
            setAccountHours(adjustedTime)
        }
    }
    const handleDateChange = (selectedDates) => {
        const formattedDate = Api.formatDate(selectedDates)
        setDueDate(formattedDate)
        handleSaveData('due_date', formattedDate)
        setIsEditingDueDate(false)
    }
    const getStatuses = async (id = null) => {
        const formData = new FormData()
        if (id) formData.append('project', id)

        await Api.jsonPost(`/taskify/task/status/pre/data/`, formData).then(result => {
            if (result && result.status === 200) {
                const statusData = result.data
                const defaultStatusArr = statusData.default_status.map(status => ({ value: status.id, label: status.title }))
                const projectStatusArr = statusData.project_status.map(status => ({ value: status.id, label: status.title }))
                setProjectStatuses(projectStatusArr)
                setStatusDropdown([...defaultStatusArr, ...projectStatusArr])
                setSelectedStatus([...defaultStatusArr, ...projectStatusArr].find(pre => pre.value === data.status))
            } else {
                Api.Toast('error', result.message)
            }
        })
    }
    const updateStatus = async (id, status) => {
        setSelectedStatus(status)
        const formData = new FormData()
        if (id) {
            formData['status'] = status.value
            if (Object.values(projectStatuses).length > 0) {
                for (const item of projectStatuses) {
                    if (status.value === item.value) {
                        formData['project_status'] = true
                    }
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
    const formatName = (fullName) => {
        const names = fullName.trim().split(' ')
        const firstInitial = names[0]?.charAt(0).toUpperCase() || ''
        const lastName = names[names.length - 1] || ''
        return `${firstInitial}. ${lastName}`
      }

    useEffect(() => {
        if (data && Object.values(data).length > 0) getStatuses(data.project)
    }, [data])
    const assignerFormattedName = formatName(data.employee_name)
    useEffect(() => {
        if (data.id) {
            fetchChildTasks()
            fetchAttachments()
            
        } else {
            console.log('not found')
        }
    }, [data.id])
    

    const ChildCallBack = () => {
                fetchChildTasks()
        }

    const handleModalToggle = () => {
            fetchChildTasks()  
        }
        const CustomOption = (props) => {
            const { data, innerRef, innerProps, isFocused, isSelected } = props
          
            return (
              <div
                ref={innerRef}
                {...innerProps}
                className={`d-flex align-items-center p-2 ${isSelected ? 'bg-primary text-white' : isFocused ? 'bg-primary text-white' : 'bg-light'}`}
                style={{ cursor: 'pointer' }}
              >
                <img 
                  src={data.img} 
                  alt={data.label} 
                  className="rounded-circle me-2"
                  style={{ width: '30px', height: '30px' }}
                />
                <span>{data.label}</span>
              </div>
            )
          }
          const handleImageClick = (url) => {
            window.open(url, '_blank')
        }

    return (
        <Fragment>
            <Row className='mt-1 mb-1'>
                <Col md={8} className='border-right'>
                    {/* Title */}
                    <div className="d-flex align-items-center justify-content-between">
                        {isEditingTitle ? (
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                onBlur={() => {
                                    handleSaveData('title', title)      
                                    setIsEditingTitle(false)
                                }}
                                autoFocus
                                className="form-control title-input"
                                style={{ border: 'none', backgroundColor: 'transparent', fontSize: '1.75rem', fontWeight: 'bold', width: '100%' }}
                            />
                        ) : (
                            <h3 className="mb-0" onClick={() => setIsEditingTitle(true)} style={{ cursor: 'pointer' }}>
                                {title || 'Click to add title'}
                            </h3>
                        )}
                        <span>
                            {isEditingPriority ? (
                                <Select
                                    value={selectedPriority}
                                    options={priorities}
                                    onChange={(e) =>  handlePriorityChange(e) }
                                    autoFocus
                                />
                            ) : (
                                <Badge
                                    color={PriorityColor(selectedPriority.value)}
                                    className="cursor-pointer"
                                    onClick={() => setIsEditingPriority(true)}
                                    title="Priority"
                                >
                                    <BarChart2 size={'18'} /> {selectedPriority.label || 'N/A'}
                                </Badge>
                            )}
                        </span>
                    </div>

                    {/* Assignee and Type */}
                    <Row className='mt-1'>
                        <Col md={6}>
                            {isEditingAssignee && !isChild ? (
                                 <Select
                                 value={selectedAssignee}
                                 options={employees}
                                 onChange={handleAssigneeChange}
                                 components={{ Option: CustomOption }}
                                 getOptionLabel={(option) => option.label}
                                 getOptionValue={(option) => option.value}
                                 autoFocus
                                 styles={{
                                   option: (provided) => ({
                                     ...provided,
                                    //  Hide the default options to prevent conflicts with CustomOption
                                     display: 'none'
                                   }),
                                   singleValue: (provided) => ({
                                     ...provided,
                                     display: 'flex',
                                     alignItems: 'center'
                                   }),
                                   menu: (provided) => ({
                                     ...provided,
                                     zIndex: 9999
                                   })
                                 }}
                               />
                            ) : (
                                <>
                                 <Badge
                                    color='primary'
                                    className='cursor-pointer'
                                    onClick={() => setIsEditingAssignee(true)}
                                    title='Assignee'
                                >
                                    <User size={'18'} />
                                    {/* <img
                                    src={selectedAssignee.img}
                                    alt="Assignee"
                                    className="rounded-circle"
                                    style={{ width: '24px', height: '24px', marginRight: '8px' }}
                                  /> */}
                                     {selectedAssignee.label || 'N/A'}
                                 </Badge>
                                </>
                            )}
                        </Col>
                        <Col md={6}>
                            {isEditingType ? (
                                <Select
                                    value={selectedType}
                                    options={types}
                                    onChange={(e) => handleTypeChange(e)}
                                    autoFocus
                                />
                            ) : (
                                <Badge
                                    color='info'
                                    className='cursor-pointer'
                                    onClick={() => setIsEditingType(true)}
                                    title='Task Type'
                                >
                                    <Zap size={'18'} /> {selectedType.label || 'N/A'}
                                </Badge>
                            )}
                        </Col>
                    </Row>

                    {/* Description */}
                    <div className='mt-2'>
                        {isEditingDescription ? (
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                onBlur={() => {
                                    handleSaveData('description', description)
                                    setIsEditingDescription(false)
                                }}
                                className="form-control"
                                rows={4}
                                autoFocus
                            />
                        ) : (
                            <p onClick={() => setIsEditingDescription(true)}>
                                {description || <Badge color='light-danger'>Click to add description</Badge>}
                            </p>
                        )}
                    </div>
                    <div className="mt-2">
                <h6>External Ticket</h6>
                {isEditingTicket ? (
                    <input
                        type="text"
                        id="external_ticket_reference"
                        value={tempUrl}
                        onChange={handleExternalTicketChange}
                        onBlur={handleExternalTicketBlur}
                        autoFocus
                        className="form-control title-input"
                        style={{ border: 'none', backgroundColor: 'transparent', width: '100%' }}
                    />
                ) : (
                    <span onClick={() => setIsEditingTicket(true)} style={{ cursor: 'pointer' }}>
                        {external_ticket_reference || 'N/A'}
                    </span>
                )}
                {urlValidationMessage && <div style={{ color: 'red' }}>{urlValidationMessage}</div>}
            </div>
    
            <Row className="mt-1">
                <Col md="12" className="d-flex align-items-center">
                    <h6>Attachments</h6>
                </Col>
            </Row>
            <Row>
                {attachments.length > 0 ? (
                    attachments.map((attachment) => {
                        const isImage = attachment.attachment.match(/\.(jpeg|jpg|gif|png|svg)$/i)
                        return (
                            <Col md={4} key={attachment.id} className="">
                                <Card className="text-center">
                                    {isImage ? (
                                        <CardImg
                                            top
                                            width="100%"
                                            height="150px" // Fixed height
                                            src={attachment.attachment}
                                            alt="Attachment preview"
                                            onClick={() => handleImageClick(attachment.attachment)}
                                            style={{ cursor: 'pointer' }}
                                        />
                                    ) : (
                                        <CardBody onClick={() => handleImageClick(attachment.attachment)}>
                                            <FileText size={50} />
                                            <CardText className="mt-2">
                                                {attachment.attachment.split('/').pop()}
                                            </CardText>
                                        </CardBody>
                                    )}
                                </Card>
                            </Col>
                        )
                    })
                ) : (
                    <Col md="12">
                        {/* <Card body> */}
                            No Attachments Found
                        {/* </Card> */}
                    </Col>
                )}
            </Row>
            

{!isChild ?   <> <Row className="mt-1">
    
            <Col md="12" className="d-flex align-items-center">
                <h6>Child Issues</h6>
                <div>
                    <Plus size={25} className='ms-2' style={{ cursor: 'pointer', backgroundColor: '#f8f9fa',  padding: '5px' }} onClick={() => setCenteredModal(!centeredModal)} />
                    {/* <Link size={25} className='ms-2' style={{ cursor: 'pointer', backgroundColor: '#f8f9fa', padding: '5px' }} onClick={() => console.log("Link issue clicked")} /> */}
                </div>
            </Col>
        </Row>
        {!loading ? <ChildTasks childTasks={childTasks} projectsData={projectsData} employees={employees} priorities={priorities} types={types} onModalToggle={handleModalToggle}/> : null} </> : null}
                    <TaskComments task_id={data.id} className/>
                </Col>

                <Col md={4}>
                    <div className="d-flex flex-column px-2">
                         {/* Status Dropdown */}
    <div className="mb-2">
      <Select
        isClearable={false}
        className='react-select sm custom-dropdown'
        styles={{
          control: (base) => ({
            ...base,
            height: '36px',
            fontSize: '14px',
            padding: '2px 8px',
            borderColor: '#ccc'
          }),
          option: (base) => ({
            ...base,
            color: '#333'
          })
        }}
        classNamePrefix='select'
        theme={theme}
        name="status"
        options={statusDropdown ? statusDropdown : ''}
        value={selectedStatus}
        menuPlacement="auto"
        onChange={(e) => updateStatus(data.id, e)}
      />
    </div>
     {/* Due Date */}
                        <div className="mb-1">
                            <div className="d-flex flex-column">
                                <span style={{ fontSize: '12px' }}>Assign By</span>
                                <Badge color='primary' className='mt-1'>
                                <div className='d-flex align-items-center'>
                                {data.profile_image_employee && (
                                  <img
                                    src={data.profile_image_employee}
                                    alt="Assigner"
                                    className="rounded-circle"
                                    style={{ width: '24px', height: '24px', marginRight: '8px' }}
                                  />
                                )}
                                
                                <span
                                  id={`assignBy-${data.id}`}
                                  className={'text-white cursor-pointer'}
                                >
                                  {assignerFormattedName}
                                </span>
                               
                                <Tooltip
                                  placement="top"
                                  isOpen={tooltipOpenAssignBy[data.id]}
                                  target={`assignBy-${data.id}`}
                                  toggle={() => toggleTooltipAssignBy(data.id)}
                                >
                                  {data.employee_name}
                                </Tooltip>
                              </div>
                              </Badge>
                            </div>
                           
                        </div>
                        {/* Due Date */}
                        <div className="mb-1">
                            <div className="d-flex flex-column">
                                <span style={{ fontSize: '12px' }}>Due Date</span>
                                {isEditingDueDate ? (
                                    <Flatpickr
                                        className='form-control'
                                        value={dueDate === 'N/A' ? '' : dueDate}
                                        onChange={handleDateChange}
                                        options={{ dateFormat: 'Y-m-d' }}
                                        autoFocus
                                    />
                                ) : (
                                    <span
    style={{
        backgroundColor: "#f8f9fa",
        padding: '5px',
        display: 'inline-block',
        textAlign: 'center', 
        borderRadius: '4px', 
        cursor: 'pointer' 
    }}
    className="cursor-pointer"
    onClick={() => setIsEditingDueDate(true)}
    title='Assignee'
>
    {dueDate || 'N/A'}
</span>

                                
                                )}
                            </div>
                        </div>

                        {/* Planned Hours */}
                        <div className="mb-1">
                            <div className="d-flex flex-column">
                                <span  style={{ fontSize: '12px' }}>Planned Hours</span>
                                {isEditingPlannedHours ? (
                                    <InputMask
                                        className="form-control"
                                        mask="99:99"
                                        value={plannedHours === 'N/A' ? '' : plannedHours}
                                        onChange={e => handleTimeChange('planned_hours', e)}
                                        onBlur={() => {
                                            setIsEditingPlannedHours(false)
                                            handleSaveData('planned_hours', plannedHours.replace(':', '.'))

                                        }}
                                        autoFocus
                                    />
                                ) : (
                                    <span
                                    style={{
                                        backgroundColor: "#f8f9fa",
                                        padding: '5px',
                                        display: 'inline-block',
                                        textAlign: 'center', 
                                        borderRadius: '4px', 
                                        cursor: 'pointer' 
                                    }}
                                    className="cursor-pointer"
                                        onClick={() => setIsEditingPlannedHours(true)}
                                    >
                                        {plannedHours || 'N/A'}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Actual Hours */}
                        <div className="mb-1">
                            <div className="d-flex flex-column">
                                <span style={{ fontSize: '12px' }}>Actual Hours</span>
                                {isEditingActualHours ? (
                                    <InputMask
                                        className="form-control"
                                        mask="99:99"
                                        value={actualHours === 'N/A' ? '' : actualHours}
                                        onChange={e => handleTimeChange('actual_hours', e)}
                                        onBlur={() => {
                                            setIsEditingActualHours(false)
                                            handleSaveData('actual_hours', actualHours.replace(':', '.'))
                                        }}
                                        autoFocus
                                    />
                                ) : (
                                    <span
                                    style={{
                                        backgroundColor: "#f8f9fa",
                                        padding: '5px',
                                        display: 'inline-block',
                                        textAlign: 'center', 
                                        borderRadius: '4px', 
                                        cursor: 'pointer' 
                                    }}
                                        className="cursor-pointer"
                                        onClick={() => setIsEditingActualHours(true)}
                                    >
                                        {actualHours || 'N/A'}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Account Hours */}
                        <div className="mb-1">
                            <div className="d-flex flex-column">
                                <span style={{ fontSize: '12px' }}>Account Hours</span>
                                {isEditingAccountHours ? (
                                    <InputMask
                                        className="form-control"
                                        mask="99:99"
                                        value={accountHours === 'N/A' ? '' : accountHours}
                                        onChange={e => handleTimeChange('account_hour', e)}
                                        onBlur={() => {
                                            setIsEditingAccountHours(false)
                                            handleSaveData('account_hour', accountHours.replace(':', '.'))
                                        }}
                                        autoFocus
                                    />
                                ) : (
                                    <span
                                    style={{
                                        backgroundColor: "#f8f9fa",
                                        padding: '5px',
                                        display: 'inline-block',
                                        textAlign: 'center', 
                                        borderRadius: '4px', 
                                        cursor: 'pointer' 
                                    }}
                                    className="cursor-pointer"
                                        onClick={() => setIsEditingAccountHours(true)}
                                    >
                                        {accountHours || 'N/A'}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
            <Modal isOpen={centeredModal} toggle={() => setCenteredModal(!centeredModal)} className='modal-dialog-centered modal-lg'>
                <ModalHeader toggle={() => setCenteredModal(!centeredModal)}>Add Task</ModalHeader>
                <ModalBody>
                    <AddTask projectsData={projectsData} ChildCallBack={ChildCallBack} task={data} />
                </ModalBody>
            </Modal>
        </Fragment>
    )
}

export default TaskDetail
