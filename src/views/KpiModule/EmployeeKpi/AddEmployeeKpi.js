import React, { Fragment, useState } from 'react'
import { Row, Input, Button, Spinner, Badge, Col, Label, CardBody, Card } from 'reactstrap'
import Select from 'react-select'
import apiHelper from '../../Helpers/ApiHelper'
import { Save } from 'react-feather'
import KpiList from './KpiList'
const AddEmployeeKpi = ({ preData, dropdownData, CallBack}) => {
    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const [employeeKpiData, setEmployeeKpiData] = useState({
        title: '',
        ep_type : '',
        evaluator: '',
        ep_complexity: ''
   })
    const onChangemployeeKpiDetailHandler = (InputName, InputType, e) => {
        
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

        setEmployeeKpiData(prevState => ({
        ...prevState,
        [InputName] : InputValue
        
        }))

    }
    const submitForm = async () => {
        
        if (employeeKpiData.title !== '' && employeeKpiData.ep_type !== '' && employeeKpiData.evaluator !== ''
        && employeeKpiData.ep_complexity !== '') {
            setLoading(true)
            const formData = new FormData()
            formData['title'] = employeeKpiData.title
            formData['ep_type'] = employeeKpiData.ep_type
            formData['evaluator'] = employeeKpiData.evaluator
            formData['ep_complexity'] = employeeKpiData.ep_complexity
            await Api.jsonPost(`/kpis/employees/`, formData).then(result => {
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
            <h5 className='mb-2'>KPI Details</h5>
            </div>
        {!loading ? (
        <>
        <Card>
            <CardBody>
                <Row>
                    <Col md={12}>
                    <Row>
                    <Col md={2} className='mb-1'></Col>
                    <Col md="3" className="mb-1">
                        <Label className="form-label">
                        Type <Badge color='light-danger'>*</Badge>
                        </Label>
                        <Select
                            isClearable={false}
                            className='react-select'
                            classNamePrefix='select'
                            name="type"
                            options={dropdownData.typeDropdown ? dropdownData.typeDropdown : ''}
                            onChange={ (e) => { onChangemployeeKpiDetailHandler('ep_type', 'select', e.value) }}
                        />
                    </Col>
                    
                    <Col md='2' className='mb-1'>
                        <label className='form-label'>
                        Complexity <Badge color='light-danger'>*</Badge>
                        </label>
                        <Select
                            isClearable={false}
                            className='react-select'
                            classNamePrefix='select'
                            name="complexity"
                            options={dropdownData.complexityDropdown ? dropdownData.complexityDropdown : ''}
                            onChange={ (e) => { onChangemployeeKpiDetailHandler('ep_complexity', 'select', e.value) }}
                        />
                    </Col>
                    <Col md='3' className='mb-1'>
                        <label className='form-label'>
                        Evaluator <Badge color='light-danger'>*</Badge>
                        </label>
                        <Select
                            isClearable={false}
                            className='react-select'
                            classNamePrefix='select'
                            name="evaluator"
                            options={dropdownData.employeesDropdown ? dropdownData.employeesDropdown : ''}
                            onChange={ (e) => { onChangemployeeKpiDetailHandler('evaluator', 'select', e.value) }}
                        />
                    </Col>
                    <Col md={2} className='mb-1'></Col>
                    <Col md={2} className='mb-1'></Col>
                    <Col md='6' className='mb-1'>
                        <label className='form-label'>
                        Kpi Details <Badge color='light-danger'>*</Badge>
                        </label>
                        <Input type="textarea" 
                            name="title"
                            onChange={ (e) => { onChangemployeeKpiDetailHandler('title', 'input', e) }}
                            placeholder="Write your kpi description!"  />
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
                    <Col md={2} className='mb-1'></Col>
                    </Row>
                
                    </Col>
                </Row>
            </CardBody>
        </Card>
        <Card>
            <CardBody>
                <Row>
                    <KpiList preData={preData} CallBack={CallBack} dropdownData={dropdownData}/>
                </Row>
            </CardBody>
        </Card>    
            
        </>
        ) : (
            <div className="text-center"><Spinner /></div>
        )
        }

    </Fragment>
    
  )
}

export default AddEmployeeKpi