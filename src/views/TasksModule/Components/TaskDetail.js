import React, { Fragment, useEffect, useState } from 'react'
import { Badge, Input, Row, Col, Tooltip, Modal, ModalBody, ModalHeader, ModalFooter, Card, CardBody, CardText, Button, CardImg, CardHeader } from 'reactstrap'
import { BarChart2, User, Zap, Plus, XCircle, FileText, Trash2, Users, Calendar, Clock, Paperclip, Link, GitPullRequest, UserCheck, TrendingUp, Copy } from 'react-feather'
import apiHelper from '../../Helpers/ApiHelper'
import Select from 'react-select'
import TaskComments from './Comments/comments'
import InputMask from 'react-input-mask'
import Flatpickr from 'react-flatpickr'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import ChildTasks from './ChildTask'
import AddTask from './AddTask'
import { useDropzone } from 'react-dropzone'
import HistoryLog from './History/history'
import TimeLogList from './TimeLog/TimeLogList'
import Avatar from '@components/avatar'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { IoTimerOutline } from "react-icons/io5"
const TaskDetail = ({ data, projectsData, employees, priorities, types, isChild, role }) => {
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
    // const [accountHours, setAccountHours] = useState(formatTime(data.account_hour || 'N/A'))
    const [external_ticket_reference, setexternal_ticket_reference] = useState(data.external_ticket_reference || 'N/A')
    const [dueDate, setDueDate] = useState(data.due_date || 'N/A')
    const [isEditingPlannedHours, setIsEditingPlannedHours] = useState(false)
    const [isEditingActualHours, setIsEditingActualHours] = useState(false)
    // const [isEditingAccountHours, setIsEditingAccountHours] = useState(false)
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
    const [files, setFiles] = useState([])
    const [addAttachment, setAddAttachment] = useState(false)
    const [hoveredAttachment, setHoveredAttachment] = useState(null)
    const [timeLogs, setTimeLogs] = useState([])
    const [addTimeLogModal, setAddTimeLogModal] = useState(false)
    const [newHoursSpent, setNewHoursSpent] = useState('')
    const [newDate, setNewDate] = useState(new Date())
    const [LogAssignee, setLogAsignee] = useState('')
    const attributeDropdown = [{value: 'comments', label: 'Comments'}, {value: 'history', label: 'History'}]
    const [selectedAttribute, setSelectedAttribute] = useState(attributeDropdown[0])

    const handleMouseEnter = (id) => {
        setHoveredAttachment(id)
    }
    const handleMouseLeave = () => {
        setHoveredAttachment(null)
    }
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
            }
        } catch (error) {
            Api.Toast('error', 'Unable to fetch attachments')
        }
    }
    const fetchTimeLogs = async () => {
        try {
            const response = await Api.get(`/taskify/task/time/log/${data.id}/`)
            if (response.status === 200) {
                setTimeLogs(response.data)
            }
        } catch (error) {
            Api.Toast('error', 'Unable to fetch time logs')
        }
    }
    const toggletimelogmodal = () => {
        setAddTimeLogModal(!addTimeLogModal)
    }
    const handleAddTimeLog = async() => {
        const hs = newHoursSpent.replace(':', '.')
        const payload = {
            hours_spent: parseFloat(hs),
            date: Api.formatDate(newDate)
        }
        if (LogAssignee !== null && LogAssignee !== '') {
            payload.employee = LogAssignee
        }
        try {
            const response = await Api.jsonPost(`/taskify/task/time/log/${data.id}/`, payload)
            if (response.status === 200) {
                fetchTimeLogs()
            }
        } catch (error) {
            Api.Toast('error', 'Unable to update time logs')
        }
        setAddTimeLogModal(false)
        setNewHoursSpent('')
        setNewDate(new Date())
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
        if (fieldName === 'log_hours') {
            setNewHoursSpent(adjustedTime)
        }
        // if (fieldName === 'account_hour') {
        //     setAccountHours(adjustedTime)
        // }
    }
    const handleDateChange = (selectedDates) => {
        const formattedDate = Api.formatDate(selectedDates)
        setDueDate(formattedDate)
        handleSaveData('due_date', formattedDate)
        setIsEditingDueDate(false)
    }
    const getStatuses = async (id = null) => {
        const formData = new FormData()
        if (id) formData['project'] = id

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
      const handleAttributeChange = e => {
        if (e) {
            setSelectedAttribute(e)
        }
      }
    useEffect(() => {
        if (data && Object.values(data).length > 0) getStatuses(data.project)
    }, [data])
    // const assignerFormattedName = formatName(data.employee_name)
    useEffect(() => {
        if (data.id) {
            fetchChildTasks()
            fetchAttachments()
            fetchTimeLogs()
            
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
            className={`d-flex align-items-center ${isSelected ? 'bg-primary text-white' : isFocused ? 'bg-primary text-white' : 'bg-light'}`}
            style={{ cursor: 'pointer', padding:'5px' }}
            >
            {data.img ? (
                <Avatar img={data.img}/>
                
            ) : <Avatar color="light-primary" size='sm' content={data.label} initials/>}
            
            <span className='mx-1' style={{fontSize: '10px'}}> {data.label}</span>
            </div>
        )
    }
    const handleImageClick = (url) => {
            window.open(url, '_blank')
    }
    // Function to handle file drops
    const uploadAttachment = async (newFiles) => {
        if (Object.values(newFiles).length > 0) {
            const formData = new FormData()
            newFiles.forEach(file => {
                formData.append('attachments', file)
                })
            await Api.jsonPost(`/taskify/attachments/${data.id}/`, formData, false).then(result => {
                if (result) {
                    if (result.status === 200) {
                        Api.Toast('success', result.message)
                    } else {
                        Api.Toast('error', result.message)
                    }
                    fetchAttachments()
                } else {
                    Api.Toast('error', 'Attachment could not updated!')
                }
            })
        }
        
    }
    const { getRootProps, getInputProps } = useDropzone({
        accept: 'image/*, .pdf, .doc, .docx',
        onDrop: acceptedFiles => {
            setFiles([
                ...files, ...acceptedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
            }))
        ])
        uploadAttachment(acceptedFiles)
        }
    })
    const deleteAttachment = async (id) => {
        await Api.deleteData(`/taskify/attachments/delete/${id}/`, {method: 'DELETE'}).then(result => {
            if (result) {
                if (result.status === 200) {
                    Api.Toast('success', 'Attachment deleted successfully!')
                    fetchAttachments()
                } else {
                    Api.Toast('error', result.message)
                }
            } else {
                Api.Toast('error', 'Attachment could not updated!')
            }
        })
    }
    return (
        <Fragment>
            <PerfectScrollbar
                className='list-group todo-task-list-wrapper task-manager'
                options={{ wheelPropagation: false }}
                containerRef={(ref) => {
                if (ref) {
                    ref._getBoundingClientRect = ref.getBoundingClientRect

                    ref.getBoundingClientRect = () => {
                    const original = ref._getBoundingClientRect()
                    return { ...original, height: Math.floor(original.height) }
                    }
                }
                }}
                style={{ maxHeight: '500px', overflowY: 'auto' }} // Added inline styles for height and scrolling
            >
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
                                
                            </span>
                        </div>
                        {/* Description */}
                        <div className='mt-2' style={{overflowWrap: 'break-word'}}>
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
                <hr></hr>
                <Row className="">
                    <Col md="12" className="d-flex align-items-center">
                        <h6 className='border-right' style={{ paddingRight: '10px'}}><Paperclip color='gray' size={14}/> Attachments</h6> 
                        <p className='text-secondary cursor-pointer hover-underline' style={{ paddingLeft: '10px', marginTop:'5px' }} onClick={() => setAddAttachment(!addAttachment)}><Plus color='gray' size='14' /> Add Attachment</p>
                        {/* <div>
                            <Plus size={25} style={{ cursor: 'pointer', backgroundColor: '#f8f9fa',  padding: '5px', marginTop: '-10px' }} onClick={() => setAddAttachment(!addAttachment)}/>
                        </div> */}
                    </Col>
                    {addAttachment && (
                        <Col md={12} className="mb-1">
                            <div {...getRootProps({ className: 'dropzone bg-light border-dotted border-2 p-1 text-center' })}>
                                <input {...getInputProps()} />
                                <p>Drag 'n' drop some files here, or click to select files</p>
                            </div>
                        </Col>
                    )}
                </Row>
                <Row>
                {attachments.length > 0 ? (
                    attachments.map((attachment) => {
                        const isImage = attachment.attachment.match(/\.(jpeg|jpg|gif|png|svg)$/i)
                        const icons = require.context('@src/assets/images/icons', false, /\.png$/)
                        const formatImage = attachment.attachment.split('.').pop()
                        const defaultIcon = require('@src/assets/images/icons/unknown.png')
                        return (
                            <>
                            <Col md={2} key={attachment.id}>
                                <Card
                                    className="small w-100 mb-1 text-center"
                                    onMouseEnter={() => handleMouseEnter(attachment.id)}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    <div>
                                    {isImage && (
                                        <img 
                                        src={attachment.attachment}
                                        onClick={() => handleImageClick(attachment.attachment)}
                                        style={{ cursor: 'pointer', width: '100%', height: '77px' }}/>
                                        
                                    )}
                                    {(!isImage && formatImage) && (
                                        <img
                                        src={icons.keys().includes(`./${formatImage}.png`) ? icons(`./${formatImage}.png`).default : defaultIcon.default}
                                        alt="Attachment preview"
                                        onClick={() => handleImageClick(attachment.attachment)}
                                        style={{ cursor: 'pointer', width: '100%', height:'77px' }}
                                    />
                                    )}
                                    
                                        <div onClick={() => handleImageClick(attachment.attachment)} className='d-flex cursor-pointer hover-underline attachment-wrapper px-1 small'>{attachment.attachment.split('/').pop()}</div>
                                    </div>
                                    {hoveredAttachment === attachment.id && ( 
                                        <div
                                            onClick={() => deleteAttachment(attachment.id)} // Call remove function
                                            style={{
                                                position: 'absolute',
                                                top: '5px',
                                                right: '5px',
                                                cursor: 'pointer',
                                                color: 'red'
                                            }}
                                        >
                                            <Trash2 size={20} />
                                        </div>
                                    )}
                                </Card>
                            </Col>
                            </>
                        )
                    })
                ) : <span className='text-muted small'>No attachment found!</span>}
                </Row>
                <hr></hr>
    {!isChild ?   <> <Row className="">
        
                <Col md="12" className="d-flex align-items-center">
                    
                <h6 className="border-right position-relative pr-3" style={{ paddingRight: '10px' }}>
                <GitPullRequest color='gray' size={14}/> Child Issues
                    {childTasks && childTasks.length > 0 && (
                    <Badge pill color="light-primary" className="badge-top-right">
                        {childTasks.length}
                    </Badge>
                    )}
                </h6>
                    
                    <div>
                    <p className='text-secondary cursor-pointer hover-underline' style={{ paddingLeft: '10px', marginTop:'5px' }} onClick={() => setCenteredModal(!centeredModal)}><Plus color='gray' size='14' /> Add Child Issue</p>
                        {/* <Plus size={25} style={{ cursor: 'pointer', backgroundColor: '#f8f9fa',  padding: '5px', marginTop: '-10px' }} onClick={() => setCenteredModal(!centeredModal)} /> */}
                        {/* <Link size={25} className='ms-2' style={{ cursor: 'pointer', backgroundColor: '#f8f9fa', padding: '5px' }} onClick={() => console.log("Link issue clicked")} /> */}
                    </div>
                </Col>
                
            </Row>
            {!loading ? (
                <div className="border-bottom">
                    <ChildTasks childTasks={childTasks} projectsData={projectsData} employees={employees} priorities={priorities} types={types} role={role} onModalToggle={handleModalToggle}/>
                {/* <p className='text-secondary cursor-pointer hover-underline' onClick={() => setCenteredModal(!centeredModal)}><Plus color='gray' size='14' /> Add Child Issue</p> */}
                </div>
                ) : null} </> : null}
                <div className="mt-1">
                            <h6><Link color='gray' size={14}/> External Ticket {(external_ticket_reference && external_ticket_reference !== 'N/A' && !isEditingTicket) && <Copy size={14} color='gray' onClick={() => Api.copyToClipboard(external_ticket_reference)}/>}</h6>
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
                                <span onClick={() => setIsEditingTicket(true)} className={(external_ticket_reference && external_ticket_reference !== 'N/A') ? '' : 'text-muted small'} style={{ cursor: 'pointer' }}>
                                    {(external_ticket_reference && external_ticket_reference !== 'N/A') ? <span className='link hover-underline'>{external_ticket_reference}</span> : "Add external link"}
                                </span>
                            )}
                            {urlValidationMessage && <div style={{ color: 'red' }}>{urlValidationMessage}</div>}
                        </div>
            <div className='d-flex align-items-center mb-1 mt-1'>
        <div>
            <h5 style={{ margin: 0 }}> {/* Remove default margin for better alignment */}
                {selectedAttribute.label}
            </h5>
        </div>
        <div style={{ marginLeft: '10px' }}> {/* Add spacing between label and select */}
            <Select
                className='react-select'
                classNamePrefix='select'
                defaultValue={selectedAttribute}
                options={attributeDropdown}
                onChange={handleAttributeChange}
                isClearable={false}
                styles={{
                    control: (provided) => ({
                        ...provided,
                        minHeight: '30px', // Adjust height
                        height: '30px', // Set exact height
                        fontSize: '12px' // Adjust font size
                    }),
                    dropdownIndicator: (provided) => ({
                        ...provided,
                        padding: '4px' // Adjust padding
                    }),
                    indicatorSeparator: (provided) => ({
                        ...provided,
                        display: 'none' // Hide separator if desired
                    }),
                    menu: (provided) => ({
                        ...provided,
                        fontSize: '12px' // Adjust font size for dropdown menu
                    })
                }}
            />
        </div>
    </div>

                        {selectedAttribute.value === 'comments' ? (
                            <TaskComments task_id={data.id} />
                        ) : (
                            <HistoryLog task_id={data.id} />
                        )}
                        
                    </Col>

                    <Col md={4}>
                        <div className="d-flex flex-column mr-1">
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
                            {/* Assignee */}
                            <div className='border-bottom'>
                                <Row style={{margin:'10px 0px'}}>
                                    <Col md='4' className='p-0 content-center'>
                                        <div className='small text-secondary'><User color='gray' size={12}/> Assignee</div>
                                    </Col>
                                    <Col md='8'>
                                        <div className='d-flex align-items-center'>
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
                                                    {/* <User size={'18'} /> */}
                                                    {selectedAssignee.img ? (
                                                        <Avatar
                                                            img={selectedAssignee.img}
                                                            alt="Assignee"
                                                            size="sm"
                                                        />
                                                    ) : <Avatar color="light-primary" content={selectedAssignee.label} initials/>}
                                                    <span
                                                        className={'cursor-pointer mx-1 small'}
                                                        onClick={() => setIsEditingAssignee(true)}
                                                        >
                                                        {selectedAssignee.label || 'N/A'}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                            {/* Priority */}
                            <div className='border-bottom'>
                                <Row style={{margin:'10px 0px'}}>
                                    <Col md='4' className='p-0 content-center'>
                                        <div className='small text-secondary'><TrendingUp color='gray' size={12}/> Priority</div>
                                    </Col>
                                    <Col md='8'>
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
                                                    {selectedPriority.label || 'N/A'}
                                                </Badge>
                                            )}
                                    </Col>
                                </Row>
                            </div>
                            {/* Type */}
                            <div className='border-bottom'>
                                <Row style={{margin:'10px 0px'}}>
                                    <Col md='4' className='p-0 content-center'>
                                        <div className='small text-secondary'><Zap color='gray' size={12}/> Type</div>
                                    </Col>
                                    <Col md='8'>
                                    {isEditingType ? (
                                    <Select
                                        value={selectedType}
                                        options={types}
                                        className="float-right"
                                        onChange={(e) => handleTypeChange(e)}
                                        autoFocus
                                    />
                                    ) : (
                                        <Badge
                                            color='light-primary'
                                            className='cursor-pointer'
                                            onClick={() => setIsEditingType(true)}
                                            title='Task Type'
                                        >
                                            {selectedType.label || 'N/A'}
                                        </Badge>
                                    )}
                                    </Col>
                                </Row>
                            </div>
                            {/* Due Date */}
                            <div className="border-bottom">
                                <Row style={{margin:'10px 0px'}}>
                                    <Col md="4" className='p-0 content-center'>
                                        <div className='small text-secondary'><Calendar color='gray' size={12} /> Due Date</div>
                                    </Col>
                                    <Col md="8">
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
                                                {Api.formatDateWithMonthName(dueDate) || 'N/A'}
                                            </span>

                                        
                                        )}
                                    </Col>
                                    
                                    
                                </Row>
                            </div>

                            {/* Planned Hours */}
                            <div className="border-bottom">
                                <Row style={{margin:'10px 0px'}}>
                                    <Col md="4" className='p-0 content-center'>
                                        <div className='small text-secondary'><Clock color='gray' size={12} /> Planned Hours</div>
                                    </Col>
                                    <Col md="8">
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
                                    </Col>
                                </Row>
                            </div>

                            {/* Actual Hours */}
                            <div className="border-bottom">
                                <Row style={{margin:'10px 0px'}}>
                                    <Col md="4" className='p-0 content-center'>
                                        <div className='small text-secondary'><Clock color='gray' size={12} /> Actual Hours</div>
                                    </Col>
                                    <Col md="8">
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
                                    </Col>
                                    
                                    
                                </Row>
                            </div>
                            {/* Assign by */}
                            <div className="border-bottom">
                                <Row style={{margin:'10px 0px'}}>
                                    <Col md="4" className='p-0 content-center'>
                                        <div className='small text-secondary'><UserCheck color='gray' size={12}/> Assign By</div>
                                    </Col>
                                    <Col md="8">
                                    <div className='d-flex align-items-center'>
                                    {data.profile_image_employee ? (
                                    <Avatar
                                        img={data.profile_image_employee}
                                        size='sm'
                                    />
                                    ) : <Avatar color="light-primary" content={data.employee_name} initials/>}
                                    
                                    <span
                                    id={`assignBy-${data.id}`}
                                    className={'cursor-pointer mx-1 small'}
                                    >
                                    {data.employee_name}
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
                                    </Col>
                                </Row>
                            </div>
                                <div className="d-flex justify-content-between border-bottom mt-1">
                                    <div>
                                        <h6 style={{ paddingRight: '10px'}}><IoTimerOutline size={'15px'}/>Time Logs</h6> 
                                    </div>
                                    
                                    <div>
                                    <Button.Ripple style={{marginTop: '-10px'}} className="px-0" color='flat-secondary' onClick={() => toggletimelogmodal()}>
                                        <Plus size={14} color='gray'/>
                                        <span className='align-middle ms-25'>Add Time Log</span>
                                    </Button.Ripple>
                                    </div>
                                </div>
                                <TimeLogList LogData={timeLogs} formatName={formatName}/>
                            

                            {/* Account Hours */}
                            {/* <div className="mb-1">
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
                            </div> */}
                        </div>
                    </Col>
                </Row>
            </PerfectScrollbar>
            <Modal isOpen={centeredModal} toggle={() => setCenteredModal(!centeredModal)} className='modal-dialog-centered modal-lg'>
                <ModalHeader toggle={() => setCenteredModal(!centeredModal)}>Add Task</ModalHeader>
                <ModalBody>
                    <AddTask projectsData={projectsData} ChildCallBack={ChildCallBack} task={data} />
                </ModalBody>
            </Modal>
            <Modal isOpen={addTimeLogModal} toggle={() => setAddTimeLogModal(false)} className='modal-dialog-centered'>
            <ModalHeader toggle={() => setAddTimeLogModal(false)}>Add Time Log</ModalHeader>
            <ModalBody>
                <Row className='mt-1'>
                {(role && Object.values(role).length > 0 && role.role_level && role.role_level > 0 && role.role_level < 5) && (
                    <Col md={12}>
                        <Select
                            value={employees.find(pre => pre.value === LogAssignee)} // This ensures the selected value shows properly
                            placeholder='Select Team Member'
                            options={employees}
                            onChange={(e) => setLogAsignee(e.value)}
                            components={{ Option: CustomOption }}
                            getOptionLabel={(option) => option.label}
                            getOptionValue={(option) => option.value}
                            className='mb-1'
                            autoFocus
                            styles={{
                                option: (provided) => ({
                                ...provided,
                                display: 'flex', // Ensure the option is visible
                                alignItems: 'center'
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
                    </Col>
                )}
                <Col md={4}>
                    <InputMask
                        mask="99:99"
                        placeholder="Hours Spent"
                        className="form-control"
                        value={newHoursSpent}
                        onChange={e => handleTimeChange('log_hours', e)}
                        autoFocus
                    />
                </Col>
                <Col md={4}>
                <Flatpickr
                    className={(role && Object.values(role).length > 0 && role.role_level && role.role_level > 0 && role.role_level < 3) ? 'form-control' : 'form-control'}
                    value={newDate}
                    onChange={([date]) => setNewDate(date)}
                    options={{ dateFormat: 'Y-m-d' }}
                />
                </Col>
                <Col md={4}>
                <Button color="primary" 
                className={(role && Object.values(role).length > 0 && role.role_level && role.role_level > 0 && role.role_level < 3) ? 'form-control' : 'form-control'}
                onClick={handleAddTimeLog}>Save</Button></Col>
                </Row>
            </ModalBody>
            </Modal>
        </Fragment>
    )
}

export default TaskDetail
