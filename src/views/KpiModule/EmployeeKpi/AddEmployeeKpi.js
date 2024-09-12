import React, { Fragment, useState } from 'react'
import { Row, Input, Button, Spinner, Badge, Col, Label, CardBody, Card } from 'reactstrap'
import Select from 'react-select'
import apiHelper from '../../Helpers/ApiHelper'
import { Save } from 'react-feather'
import KpiList from './KpiList'
import {  convertToRaw } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import '@styles/react/libs/editor/editor.scss'
const AddEmployeeKpi = ({ preData, dropdownData, type, CallBack}) => {
    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const [employeeKpiData, setEmployeeKpiData] = useState({
        title: '',
        description: '',
        ep_type : '',
        evaluator: '',
        ep_complexity: '',
        scale_group: '',
        employees_project: '',
        ep_batch: '',
        objective: ''
   })
   const [addBtn, setAddBtn] = useState(false)
    const onChangemployeeKpiDetailHandler = (InputName, InputType, e) => {
        if (!e) {
            e = {
              target: InputName,
              value: ''
            }
            setEmployeeKpiData(prevState => ({
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
        } else if (InputType === 'editor') {
            InputValue = e
        }

        setEmployeeKpiData(prevState => ({
        ...prevState,
        [InputName] : InputValue
        
        }))

    }
    const submitForm = async () => {
        
        if (employeeKpiData.title !== '' && employeeKpiData.objective !== '' && employeeKpiData.description !== '' && employeeKpiData.ep_type !== '' && employeeKpiData.evaluator !== ''
        && employeeKpiData.ep_complexity !== '' && employeeKpiData.ep_batch !== '') {
            setLoading(true)
            const formData = new FormData()
            formData['title'] = employeeKpiData.title
            formData['description'] = draftToHtml(convertToRaw(employeeKpiData.description.getCurrentContent()))
            formData['kpis_objective'] = employeeKpiData.objective
            formData['ep_type'] = employeeKpiData.ep_type
            if (type === 'evaluator') {
                formData['employee'] = employeeKpiData.evaluator
            } else {
                formData['evaluator'] = employeeKpiData.evaluator
            }
            formData['ep_complexity'] = employeeKpiData.ep_complexity
            formData['ep_batch'] = employeeKpiData.ep_batch
            // formData['scale_group'] = 23
            if (employeeKpiData.employees_project !== '') formData['employee_project'] = employeeKpiData.employees_project
            if (type === 'evaluator') {
                await Api.jsonPost(`/kpis/team/lead/employees/`, formData).then(result => {
                    if (result) {
                        if (result.status === 200) {
                            Api.Toast('success', result.message)
                            CallBack()
                        } else {
                            Api.Toast('error', result.message)
                        }
                    }
                })
            } else {
                await Api.jsonPost(`/kpis/employees/`, formData).then(result => {
                    if (result) {
                        if (result.status === 200) {
                            Api.Toast('success', result.message)
                            CallBack()
                        } else {
                            Api.Toast('error', result.message)
                            setEmployeeKpiData(prevState => ({
                                ...prevState,
                                title: '',
                                ep_type : '',
                                evaluator: '',
                                ep_complexity: '',
                                scale_group: '',
                                employees_project: '',
                                ep_batch: ''
                            }))
                        }
                    }
                })
            }
            
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
            {type !== 'evaluator' && (
                <Button className='btn btn-success' onClick={() => setAddBtn(!addBtn)}>Add Your KPI </Button>
            )}
            </div>
        {!loading ? (
        <>
        {(addBtn || type === 'evaluator') && (
            <Card>
                <CardBody>
                    <Row>
                        <Col md={12}>
                        <Row>           
                        <Col md="12" className="mb-1">
                            <Label className="form-label">
                                Objective <Badge color="light-danger">*</Badge>
                            </Label>
                            <Select
                                isClearable={false}
                                className='react-select'
                                classNamePrefix='select'
                                name="kpis_objective"
                                options={dropdownData.objectiveData ? dropdownData.objectiveData : ''}
                                onChange={ (e) => { onChangemployeeKpiDetailHandler('objective', 'select', e ? e.value : null) }}
                                menuPlacement="auto" 
                                menuPosition='fixed'
                            />
                        </Col>
                        <Col md="12" className="mb-1">
                            <Label className="form-label">
                                Goal <Badge color="light-danger">*</Badge>
                            </Label>
                            <Input type="text" 
                                name="title"
                                onChange={ (e) => { onChangemployeeKpiDetailHandler('title', 'input', e) }}
                                placeholder="Goal"  />
                        </Col>
                        {/* <Col md="4" className="mb-1">
                            <Label className="form-label">
                            Scale Group <Badge color='light-danger'>*</Badge>
                            </Label>
                            <Select
                                isClearable={false}
                                className='react-select'
                                classNamePrefix='select'
                                name="scale_group"
                                options={dropdownData.scaleGroupData ? dropdownData.scaleGroupData : ''}
                                onChange={ (e) => { onChangemployeeKpiDetailHandler('scale_group', 'select', e ? e.value : null) }}
                                menuPlacement="auto" 
                                menuPosition='fixed'
                            />
                        </Col> */}
                        <Col md="4" className="mb-1">
                            <Label className="form-label">
                            Batch <Badge color='light-danger'>*</Badge>
                            </Label>
                            <Select
                                isClearable={false}
                                className='react-select'
                                classNamePrefix='select'
                                name="scale_group"
                                options={dropdownData.batchData ? dropdownData.batchData : ''}
                                onChange={ (e) => { onChangemployeeKpiDetailHandler('ep_batch', 'select', e.value) }}
                            />
                        </Col>
                        <Col md="4" className="mb-1">
                            <Label className="form-label">
                            Projects 
                            </Label>
                            <Select
                                isClearable={true}
                                className='react-select'
                                classNamePrefix='select'
                                name="project"
                                options={dropdownData.projectsData ? dropdownData.projectsData : null}
                                onChange={ (e) => { onChangemployeeKpiDetailHandler('employees_project', 'select', e ? e.value : null) }}
                            />
                        </Col>
                        
                        <Col md="4" className="mb-1">
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
                        
                        <Col md='4' className='mb-1'>
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
                        <Col md='4' className='mb-1'>
                            <label className='form-label'>
                        {type === 'evaluator' ? 'Employee' : 'Evaluator'} <Badge color='light-danger'>*</Badge>
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
                        
                        <Col md='12' className='mb-1'>
                            <label className='form-label'>
                            Kpi Details <Badge color='light-danger'>*</Badge>
                            </label>
                            <Editor
                //   editorState={experience.points}
                  wrapperStyle={{ backgroundColor: 'white' }} 
                  onEditorStateChange={(e) => { onChangemployeeKpiDetailHandler('description', 'editor', e) }}
                />
                            {/* <Input type="textarea" 
                                name="title"
                                onChange={ (e) => { onChangemployeeKpiDetailHandler('title', 'input', e) }}
                                placeholder="Write your kpi description!"  /> */}
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
        {type !== 'evaluator' ? (
            // <Card>
            //     <CardBody>
                    // <Row>
                        <KpiList preData={preData} CallBack={CallBack} dropdownData={dropdownData} type={type}/>
                    // </Row>
            //     </CardBody>
            // </Card>  
        ) : (
            <p></p>
        )}
            
        </>
        ) : (
            <div className="text-center"><Spinner color='white'/></div>
        )
        }

    </Fragment>
    
  )
}

export default AddEmployeeKpi