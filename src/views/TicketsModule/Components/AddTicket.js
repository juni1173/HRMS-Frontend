import React, { Fragment, useState } from 'react'
import { Row, Input, Button, Badge, Col, CardBody, Card, Spinner } from 'reactstrap'
import Select from 'react-select'
import apiHelper from '../../Helpers/ApiHelper'
import { Save } from 'react-feather'
import EmployeeHelper from '../../Helpers/EmployeeHelper'

const AddTicket = ({ CallBack }) => {
    const Api = apiHelper()
    const EmpHelper = EmployeeHelper()
    
    const [loading, setLoading] = useState(false)
    const [addBtn, setAddBtn] = useState(false)
    const category_choices = [
        {label: 'Procurement', value: 1},
        {label: 'General', value: 2},
        {label: 'HR Services', value: 3}
    ]
    const [employees, setEmployees] = useState([])
    
    const getEmployees = () => {
        if (Object.values(employees).length === 0) {
            EmpHelper.fetchEmployeeDropdown().then(result => {
                setEmployees(result)
            })
        }
        setAddBtn(!addBtn)
    }
   
    const [TicketData, setTicketData] = useState({
        subject: '',
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
        
        if (TicketData.subject !== '' && TicketData.category !== ''
         && TicketData.description !== '') {
            setLoading(true)
            const formData = new FormData()
            formData['subject'] = TicketData.subject
            formData['category'] = TicketData.category
           if (TicketData.category === 3 && TicketData.assigned_to !== '') {
                formData['assign_to'] = TicketData.assigned_to
            } 
            formData['description'] = TicketData.description
           if (TicketData.category === 1) {
            if (TicketData.team_lead !== '') {
                formData['team_lead'] = TicketData.team_lead
            } else {
                Api.Toast('error', 'Team Lead is required for precurement ticket!')
            }
           }
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
   
        
  return (
    <Fragment>
        <div className='content-header' >
            <Row>
                <Col md={6}> <h2>Tickets Panel</h2> </Col>
                <Col md={6} className="d-flex justify-content-end">
                    <Button className='btn btn-success mb-1' onClick={() => getEmployees()}>Add New Ticket </Button>    
                </Col>
                {!loading ? (
                    <Col md={12}>
                    {addBtn && (
                        <Card>
                            <CardBody>
                                <Row>
                                    <Col md={12}>
                                    <Row>
                                    
                                    <Col md={TicketData.category === 1 ? '3' : (TicketData.category === 3 ? '6' : '4')} className='mb-1'>
                                        <label className='form-label'>
                                        Subject <Badge color='light-danger'>*</Badge>
                                        </label>
                                        <Input type="text" 
                                            name="subject"
                                            onChange={ (e) => { onChangTicketDetailHandler('subject', 'input', e) }}
                                            placeholder="Subject!"  />
                                    </Col>
                                    
                                    <Col md={TicketData.category === 1 ? '3' : (TicketData.category === 3 ? '6' : '4')} className='mb-1'>
                                        <label className='form-label'>
                                            Category<Badge color='light-danger'>*</Badge>
                                        </label>
                                        <Select
                                            isClearable={false}
                                            className='react-select'
                                            classNamePrefix='select'
                                            name="category"
                                            options={category_choices ? category_choices : ''}
                                            onChange={ (e) => { onChangTicketDetailHandler('category', 'select', e.value) }}
                                        />
                                    </Col>
                                    {TicketData.category === 1 && (
                                        <Col md='3' className='mb-1'>
                                            <label className='form-label'>
                                                Team Lead<Badge color='light-danger'>*</Badge>
                                            </label>
                                            <Select
                                                isClearable={false}
                                                className='react-select'
                                                classNamePrefix='select'
                                                name="team_lead"
                                                options={employees ? employees : ''}
                                                onChange={ (e) => { onChangTicketDetailHandler('team_lead', 'select', e.value) }}
                                            />
                                        </Col>
                                    )}
                                    {TicketData.category !== 3 && (
                                        <Col md={TicketData.category === 1 ? '3' : '4'} className='mb-1'>
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
                                    )}
                                    
                                    <Col md='8' className='mb-1'>
                                        <label className='form-label'>
                                        Description <Badge color='light-danger'>*</Badge>
                                        </label>
                                        <Input type="textarea" 
                                            name="description"
                                            onChange={ (e) => { onChangTicketDetailHandler('description', 'input', e) }}
                                            placeholder="Write your ticket's description!"  />
                                    </Col>
                                    <Col md={4}>
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
            
        </div>
        

    </Fragment>
    
  )
}

export default AddTicket