import React, { Fragment, useEffect, useState } from 'react'
import { Row, Input, Button, Badge, Col, CardBody, Card, Spinner, Nav, NavItem, NavLink } from 'reactstrap'
import Select from 'react-select'
import apiHelper from '../../Helpers/ApiHelper'
import { Save } from 'react-feather'
import EmployeeHelper from '../../Helpers/EmployeeHelper'
import { IoAddCircleOutline  } from "react-icons/io5"
const AddTicket = ({ CallBack, toggle, active }) => {
    const Api = apiHelper()
    const EmpHelper = EmployeeHelper()
    
    const [loading, setLoading] = useState(false)
    const [dep, setDep] = useState([])
    const [addBtn, setAddBtn] = useState(false)
    
    const [categories, setCategories] = useState([])
    const [employees, setEmployees] = useState([])
    const [leads, setLeads] = useState([])
    
    const getLeads = () => {
        if (Object.values(employees).length === 0) {
            EmpHelper.fetchEmployeeDropdown().then(result => {
                setLeads(result)
            })
        }
        setAddBtn(!addBtn)
    }
   
    const [TicketData, setTicketData] = useState({
        subject: '',
        department: '',
        category: '',
        assigned_to: '',
        description: '',
        team_lead: ''
   })
    const onChangTicketDetailHandler = (InputName, InputType, e) => {
        if (!e) {
            e = {
              target: InputName,
              value: ''
            }
            setTicketData(prevState => ({
                ...prevState,
                [InputName] : ''
                
                }))
                return false
          }
        let InputValue
        if (InputType === 'input') {
        
        InputValue = e.target.value
        } else if (InputType === 'select') {
        
        InputValue = e
        } else if (InputType === 'date') {
            let dateFomat = e.split('/')
                dateFomat = `${dateFomat[2]}-${dateFomat[1]}-${dateFomat[0]}`    
            InputValue = dateFomat
        } else if (InputType === 'file') {
            InputValue = e.target.files[0].name
        }

        setTicketData(prevState => ({
        ...prevState,
        [InputName] : InputValue
        
        }))

    }
    const submitForm = async () => {
        
        if (TicketData.subject !== '' && TicketData.department !== '' && TicketData.category !== ''
         && TicketData.description !== '') {
            setLoading(true)
            const formData = new FormData()
            formData['subject'] = TicketData.subject
            formData['ticket_department'] = TicketData.department
            formData['category'] = TicketData.category
            formData['assign_to'] = TicketData.assigned_to
            formData['description'] = TicketData.description
            if (TicketData.team_lead !== '') formData['team_lead'] = TicketData.team_lead
                await Api.jsonPost(`/ticket/employee/`, formData).then(result => {
                    if (result) {
                        if (result.status === 200) {
                            Api.Toast('success', result.message)
                            CallBack()
                        } else {
                            Api.Toast('error', result.message)
                        }
                    }
                })
            
            setTimeout(() => {
                setLoading(false)
            }, 1000)
        } else {
            Api.Toast('error', 'Please fill all required fields!')
        }
        
    }
    const getDepData = async (id) => {
    await Api.get(`/ticket/get/department/pre/data/${id}/`).then(result => {
        if (result) {
            if (result.status === 200) {
                // setDepartments()
                const catData = result.data.categories
                const empData = result.data.employees
                const empArr = empData.map(item => ({label: item.name, value: item.id}))
                const catArr = catData.map(item => ({label: item.title, value: item.id}))
                setEmployees(empArr)
                setCategories(catArr)
            } else {
                Api.message('error', 'Error in fetching departments!')
            }
        }
    })
    }
    const depChange = e => {
        onChangTicketDetailHandler('department', 'select', e.value) 
        getDepData(e.value)
    }
   const getDepartments = async () => {
    setLoading(true)
    await Api.get(`/ticket/get/department/pre/data/`).then(result => {
        if (result) {
            if (result.status === 200) {
                // setDepartments()
                const depData = result.data
                const depArr = depData.map(item => ({label: item.title, value: item.id}))
                setDep(depArr)
                setTimeout(() => {
                    setLoading(false)
                }, 500)
            } else {
                Api.message('error', 'Error in fetching departments!')
            }
        }
    })
   }
    useEffect(() => (
        getDepartments()
    ), [])    
  return (
    <Fragment>
        <div className='content-header' >
            <Card >
                <CardBody className='py-0'>
                <Row>
                <Col md={2} className='my-auto'> <h3>Help Desk</h3> </Col>
                    <Col md='8'>
                    <Nav tabs className='mb-0 course-tabs justify-content-center'>
                                    {/* <div className='col-md-6'> */}
                                        <NavItem >
                                        <NavLink
                                            active={active === '1'}
                                            onClick={() => {
                                            toggle('1')
                                            }}
                                        >
                                        <span style={{ marginRight: '8px' }}>Tickets</span>
                                        {/* <Badge color="success">{countData && countData.general_ticket_count}</Badge> */}
                                        </NavLink>
                                        </NavItem>
                                    {/* </div>
                                    <div className='col-md-6'> */}
                                        <NavItem >
                                        <NavLink
                                            active={active === '2'}
                                            onClick={() => {
                                            toggle('2')
                                            }}
                                        >
                                            <span style={{ marginRight: '8px' }}>Lead Approvals</span>
                                            {/* <Badge color="danger">{countData && countData.procurement_ticket_count}</Badge> */}
                                        </NavLink>
                                        </NavItem>
                                        <NavItem>
                                        <NavLink
                                            active={active === '3'}
                                            onClick={() => {
                                            toggle('3')
                                            }}
                                        >
                                            <span style={{ marginRight: '8px' }}>Assigned To You</span>
                                            {/* <Badge color="danger">{countData && countData.procurement_ticket_count}</Badge> */}
                                        </NavLink>
                                        </NavItem>
                                        <NavItem>
                                        <NavLink
                                            active={active === '4'}
                                            onClick={() => {
                                            toggle('4')
                                            }}
                                        >
                                            <span style={{ marginRight: '8px' }}>Transferred To You</span>
                                            {/* <Badge color="danger">{countData && countData.procurement_ticket_count}</Badge> */}
                                        </NavLink>
                                        </NavItem>
                                    
                                    {/* </div> */}
            </Nav>
                    </Col>
                <Col md={2} className="d-flex justify-content-end">
                    <button
                        className="border-0 no-background"
                        title="Add New Ticket"
                        style={{fontSize:'14px'}}
                        onClick={() => getLeads()}
                        >
                        <IoAddCircleOutline  color="#315180" size={'18px'}/> New
                    </button>   
                </Col>
                {!loading ? (
                    <Col md={12}>
                    {addBtn && (
                        <Card>
                            <CardBody>
                                <Row>
                                    <Col md={12}>
                                    <Row>
                                    
                                    <Col md={'4'} className='mb-1'>
                                        <label className='form-label'>
                                        Subject <Badge color='light-danger'>*</Badge>
                                        </label>
                                        <Input type="text" 
                                            name="subject"
                                            onChange={ (e) => { onChangTicketDetailHandler('subject', 'input', e) }}
                                            placeholder="Subject!"  />
                                    </Col>
                                    <Col md={'2'} className='mb-1'>
                                        <label className='form-label'>
                                            Department<Badge color='light-danger'>*</Badge>
                                        </label>
                                        <Select
                                            isClearable={false}
                                            className='react-select'
                                            classNamePrefix='select'
                                            name="department"
                                            options={dep ? dep : ''}
                                            onChange={(e) => depChange(e)}
                                        />
                                    </Col>
                                    <Col md={'2'} className='mb-1'>
                                        <label className='form-label'>
                                            Category<Badge color='light-danger'>*</Badge>
                                        </label>
                                        <Select
                                            isClearable={false}
                                            className='react-select'
                                            classNamePrefix='select'
                                            name="category"
                                            options={categories ? categories : ''}
                                            onChange={ (e) => { onChangTicketDetailHandler('category', 'select', e.value) }}
                                        />
                                    </Col>
                                    <Col md='2' className='mb-1'>
                                        <label className='form-label'>
                                            Team Lead
                                        </label>
                                        <Select
                                            isClearable={false}
                                            className='react-select'
                                            classNamePrefix='select'
                                            name="team_lead"
                                            options={leads ? leads : ''}
                                            onChange={ (e) => { onChangTicketDetailHandler('team_lead', 'select', e.value) }}
                                        />
                                    </Col>
                                    <Col md={'2'} className='mb-1'>
                                        <label className='form-label'>
                                        Assigned To <Badge color='light-danger'>*</Badge>
                                        </label>
                                        <Select
                                            isClearable={false}
                                            className='react-select'
                                            classNamePrefix='select'
                                            name="assigned_to"
                                            options={employees ? employees : ''}
                                            onChange={ (e) => { onChangTicketDetailHandler('assigned_to', 'select', e.value) }}
                                        />
                                    </Col>
                                    
                                    <Col md='6' className='mb-1'>
                                        <label className='form-label'>
                                        Description <Badge color='light-danger'>*</Badge>
                                        </label>
                                        <Input type="textarea" 
                                            name="description"
                                            onChange={ (e) => { onChangTicketDetailHandler('description', 'input', e) }}
                                            placeholder="Write your ticket's description!"  />
                                    </Col>
                                    <Col md={2}>
                                    <Button color="primary" className="btn-next mt-4" onClick={submitForm}>
                                    <span className="align-middle d-sm-inline-block">
                                    Save
                                    </span>
                                    <Save
                                    size={14}
                                    className="align-middle ms-sm-25 ms-0"
                                    ></Save>
                                </Button>
                                    </Col>
                                    
                                    </Row>
                                
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    )}
                </Col>
                ) : <div className="text-center"><Spinner type="grow"/></div>}
                
            </Row>
                    </CardBody>
            </Card>
            
            
        </div>
        

    </Fragment>
    
  )
}

export default AddTicket