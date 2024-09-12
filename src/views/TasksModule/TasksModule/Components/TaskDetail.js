import React, { Fragment, useEffect, useState } from 'react'
import { Badge, Row, Col, Card, CardBody, Modal, ModalBody, ModalHeader } from 'reactstrap'
import { BarChart2, Edit, User, Zap } from 'react-feather'
import apiHelper from '../../Helpers/ApiHelper'
import Select from 'react-select'
import TaskComments from './Comments/comments'
import UpdateTask from './UpdateTask'
import { CiCalendarDate } from "react-icons/ci"
import { HiOutlineLightBulb, HiLightBulb  } from "react-icons/hi"
import { RiAccountPinCircleFill } from "react-icons/ri"
const TaskDetail = ({ data, CallBack, projectsData }) => {
    const Api = apiHelper()
    const [statusDropdown, setStatusDropdown] = useState([])
    const [selectedStatus, setSelectedStatus] = useState('')
    // const [defaultStatuses, setDefaultStatuses] = useState([])
    const [projectStatuses, setProjectStatuses] = useState([])
    const [basicModal, setBasicModal] = useState(false)
    const [updateTask, setUpdateTask] = useState([])
    const openUpdateModal = (data) => {
        setUpdateTask(data)
        setBasicModal(!basicModal)
    }
    const getStatuses = async (id = null) => {
        const formData = new FormData()
        if (id) {
            formData['project'] = id
        }
        await Api.jsonPost(`/taskify/task/status/pre/data/`, formData).then(result => {
            if (result) {
                if (result.status === 200) {
                    const statusData = result.data
                    if (Object.values(statusData).length > 0) {
                        const defaultStatusArr = []
                        const projectStatusArr = []
                        for (const status of statusData.default_status) {
                            defaultStatusArr.push({value: status.id, label: status.title})
                        }
                        if (Object.values(statusData.project_status).length > 0) {
                            for (const status of statusData.project_status) {
                                projectStatusArr.push({value: status.id, label: status.title})
                            }
                        }
                        // setDefaultStatuses(defaultStatusArr)
                        setProjectStatuses(projectStatusArr)
                        const Dropdown = [...defaultStatusArr, ...projectStatusArr]
                        setStatusDropdown(Dropdown)
                        setSelectedStatus(Dropdown.find(pre => pre.value === data.status))
                    }
                } else {
                    Api.Toast('error', result.message)
                }
            } else {
                Api.Toast('error', 'Server error!')
            }
        })
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
    const customStyles = {
    control: (base, state) => ({
        ...base,
        background: "#2229351a",
        fontWeight: "600",
        textAlign: "center",
        cursor: 'pointer',
        // match with the menu
        borderRadius: state.isFocused ? "3px 3px 0 0" : 3,
        // Overwrittes the different states of border
        borderColor: state.isFocused ? "yellow" : "green",
        // Removes weird border around container
        boxShadow: state.isFocused ? null : null,
        "&:hover": {
            // Overwrittes the different states of border
            borderColor: state.isFocused ? "red" : "gray"
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
                    const statusData = result.data
                    if (Object.values(statusData).length > 0) {
                        CallBack(data)
                    }
                } else {
                    Api.Toast('error', result.message)
                }
            } else {
                Api.Toast('error', 'Server error!')
            }
        })
    }
    
    useEffect(() => {
        if (data && Object.values(data).length > 0) getStatuses(data.project)
    }, [])
  return (
    <Fragment>
         {
            Object.values(data).length > 0 ? (
                <>
                    <Card>
                        <CardBody>
                        <Row>
                            <Col md="10">
                                <h3>{data.title}</h3>
                            </Col>
                            <Col md="2">
                                <Edit color='orange' className='float-right' onClick={() => openUpdateModal(data)}/>
                            </Col>
                        </Row>
                        <div className='d-flex justify-content-between mt-1'>
                            <div><Badge color='light-primary' title='Assignee' className='cursor-pointer'><User size={'18'}/> {data.assign_to_name ? (data.assign_to_name && data.assign_to_name) : 'N/A'} </Badge></div>
                            <div><Badge color={PriorityColor(data.priority)} className='cursor-pointer' title='Priority'><BarChart2 size={'18'}/> {data.priority ? (data.priority && data.priority) : 'N/A'} </Badge></div>
                            <div><Badge color='light-primary' className='cursor-pointer' title='Task Type'><Zap size={'18'}/> {data.task_type_title ? (data.task_type_title && data.task_type_title) : 'N/A'} </Badge></div>
                            <div style={{minWidth: '100px'}}>
                            <Select
                                isClearable={false}
                                className='react-select sm'
                                styles={customStyles}
                                classNamePrefix='select'
                                theme={theme}
                                name="status"
                                components={{ DropdownIndicator:() => null, IndicatorSeparator:() => null }}
                                options={statusDropdown ? statusDropdown : ''}
                                value={selectedStatus}
                                menuPlacement="auto"
                                menuPosition="fixed"
                                onChange={ (e) => { updateStatus(data.id, e) }}
                            />
                            </div>
                        </div>
                        <div className='d-flex justify-content-between mt-1'>
                        <div><Badge color='light-primary' title='Planned Hours' className='cursor-pointer'><CiCalendarDate size={'18'}/> {`Due: ${data.due_date ? (data.due_date && data.due_date) : 'N/A'}`} </Badge></div>
                            <div><Badge color='light-primary' title='Planned Hours' className='cursor-pointer'><HiOutlineLightBulb size={'18'}/> {`Planned: ${data.planned_hours ? (data.planned_hours && `${data.planned_hours.replace('.', ':')} hours`) : 'N/A'}`} </Badge></div>
                            <div><Badge color='light-primary' className='cursor-pointer' title='Actual Hours'><HiLightBulb size={'18'}/> {`Actual: ${data.actual_hours ? (data.actual_hours && `${data.actual_hours.replace('.', ':')} hours`) : 'N/A'}`} </Badge></div>
                            <div><Badge color='light-primary' className='cursor-pointer' title='Account Hour'><RiAccountPinCircleFill size={'18'}/> {`Account: ${data.account_hour ? (data.account_hour && `${data.account_hour.replace('.', ':')} hours`) : 'N/A'}`} </Badge></div>
                            
                        </div>
                            <Row className=''>
                                
                                <Col md={12} className='mt-2'>
                                <b>Description </b><br></br>
                                {data.description ? data.description : <Badge color='light-danger'>N/A</Badge>}
                                    {/* <br></br><br></br>
                                    <b>Priority: </b>{data.priority ? (
                                    <Row>
                                        {data.priority.iconUrl && (
                                        <Col md={2} className="text-center">
                                            <img src={data.priority.iconUrl} width="32" height={32} />
                                        </Col>
                                        )} 
                                    {data.priority.name && (
                                            <Col md={10}>
                                            <Badge>{data.priority.name}</Badge>
                                        </Col>
                                        )} 
                                    
                                </Row>
                                    ) : <Badge>N/A</Badge>}  */}
                                </Col>
                            </Row>
                            {/* <Row>
                                <Col md={12} className='mb-1'>
                                    <h5 className='mb-1'>Time Log</h5>
                                    {Object.values(data.worklog.worklogs).length > 0 ? (
                                                (data.worklog.worklogs).map((worklog, key) => (
                                                <Row key={key}>
                                                <Col md={2} className="text-center">
                                                    <img src={worklog.author.avatarUrls["32x32"]} width="32" height={32} />
                                                </Col>
                                                <Col md={10}>
                                                    <h6>{worklog.author.displayName}</h6>
                                                    <p>{worklog.timeSpent}</p>
                                                </Col>
                                            </Row>
                                            )
                                        )
                                        ) : (
                                            <p>No Worklog found!</p>
                                        )}
                                </Col>
                            </Row> */}
                            {/* <Row>
                                <Col md={12}>
                                    <h5>Comments</h5>
                                    <div className='commentBox'>
                                        {Object.values(data.comment.comments).length > 0 ? (
                                                (data.comment.comments).map((comment, key) => (
                                                <Row key={key}>
                                                <Col md={2} className="text-center">
                                                    <img src={comment.author.avatarUrls["32x32"]} width="32" height={32} />
                                                </Col>
                                                <Col md={10}>
                                                    <h6>{comment.author.displayName}</h6>
                                                    <p><div dangerouslySetInnerHTML={{ __html: comment.body }} /></p>
                                                </Col>
                                            </Row>
                                            )
                                        )
                                        ) : (
                                            <p>No comments found!</p>
                                        )}
                                    </div>
                                </Col>
                            </Row> */}
                        </CardBody>
                    </Card>
                    <Card>
                        <CardBody>
                            <TaskComments task_id={data.id}/>
                        </CardBody>
                    </Card>
                </>
                ) : (
                    <p>Task detail not Found!</p>
                )
        }
         <Modal isOpen={basicModal} toggle={() => setBasicModal(!basicModal)} className='modal-lg'>
         <ModalHeader toggle={() => setBasicModal(!basicModal)}>Update Task</ModalHeader>
          <ModalBody>
                <UpdateTask data={updateTask} projectsData={projectsData} CallBack={CallBack}/>
          </ModalBody>
        </Modal>
    </Fragment>
  )
}

export default TaskDetail