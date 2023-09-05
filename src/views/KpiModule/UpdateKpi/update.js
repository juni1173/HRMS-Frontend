import React, { useState } from 'react'
import { Row, Input, Button, Badge, Col, Label, Spinner } from 'reactstrap'
import Select from 'react-select'
import apiHelper from '../../Helpers/ApiHelper'
const UpdateKpi = ({ data, CallBack, dropdownData, type }) => {
    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const [employeeKpiData, setEmployeeKpiData] = useState({
        title: data.title ? data.title : '',
        ep_type : data.ep_type ? data.ep_type : dropdownData.typeDropdown.find(pre => pre.value === data.ep_type).value ? dropdownData.typeDropdown.find(pre => pre.value === data.ep_type).value : '',
        evaluator: dropdownData.employeesDropdown.find(pre => pre.value === data.evaluator).value ? dropdownData.employeesDropdown.find(pre => pre.value === data.evaluator).value : '',
        ep_complexity: data.ep_complexity ? data.ep_complexity : ''
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
            let url = ''
            if (data.kpis_status_level === 1) {
                url = `/kpis/employees/${data.id}/`
            } else if (data.kpis_status_level === 2) {
                url = `/kpis/team/lead/review/${data.id}/`
            } else {
                return false
            }
            await Api.jsonPatch(url, formData).then(result => {
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
    <Row>
        {!loading ? (
             <Col md={12}>
             <Row>
             <Col md={1} className='mb-1'></Col>
             {type === 'employee' && (
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
                        defaultValue={dropdownData.typeDropdown.find(pre => pre.value === data.ep_type) ? dropdownData.typeDropdown.find(pre => pre.value === data.ep_type) : ''}
                        onChange={ (e) => { onChangemployeeKpiDetailHandler('ep_type', 'select', e.value) }}
                    />
                </Col>
             )}
                 
                 
                 <Col md={type === 'employee' ? '3' : '6'} className='mb-1'>
                     <label className='form-label'>
                     Complexity <Badge color='light-danger'>*</Badge>
                     </label>
                     <Select
                         isClearable={false}
                         className='react-select'
                         classNamePrefix='select'
                         name="complexity"
                         options={dropdownData.complexityDropdown ? dropdownData.complexityDropdown : ''}
                         defaultValue={dropdownData.complexityDropdown.find(pre => pre.value === data.ep_complexity) ? dropdownData.complexityDropdown.find(pre => pre.value === data.ep_complexity) : ''}
                         onChange={ (e) => { onChangemployeeKpiDetailHandler('ep_complexity', 'select', e.value) }}
                     />
                 </Col>
                 {type === 'employee' && (
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
                                defaultValue={dropdownData.employeesDropdown.find(pre => pre.value === data.evaluator) ? dropdownData.employeesDropdown.find(pre => pre.value === data.evaluator) : ''}
                                onChange={ (e) => { onChangemployeeKpiDetailHandler('evaluator', 'select', e.value) }}
                            />
                        </Col>
                 )}
                
                 <Col md={1} className='mb-1'></Col>
                 <Col md={2} className='mb-1'></Col>
                 {type !== 'employee' && (
                    <Col md={2} className='mb-1'></Col>
                 )}
                 <Col md='6' className='mb-1'>
                     <label className='form-label'>
                     Kpi Details <Badge color='light-danger'>*</Badge>
                     </label>
                     <Input type="textarea" 
                         name="title"
                         onChange={ (e) => { onChangemployeeKpiDetailHandler('title', 'input', e) }}
                         defaultValue={data.title ? data.title : ''}
                         placeholder="Write your kpi description!"  />
                 </Col>
                 <Col md={2}>
                 <Button color="warning" className="btn-next mt-4" onClick={submitForm}>
                 <span className="align-middle d-sm-inline-block">
                 Update
                 </span>
                 
             </Button>
                 </Col>
                 <Col md={2} className='mb-1'></Col>
                 
             </Row>
         
             </Col>
        ) : (
            <div className='text-center'><Spinner /></div>
        )}
               
            </Row>
  )
}

export default UpdateKpi