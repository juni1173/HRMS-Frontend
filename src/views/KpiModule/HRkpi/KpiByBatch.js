import {Fragment, useState, useEffect } from 'react'
import apiHelper from '../../Helpers/ApiHelper'
import { Card, CardBody, Row, Col, Label, Badge, Button, Spinner } from 'reactstrap'
import { Search } from 'react-feather'
import Select from 'react-select'
import KpiList from './KpiList'
import DepartmentsHelper from '../../Helpers/DepartmentsHelper'
const KpiByBatch = ({segmentation, dropdownData, CallBack}) => {
    const Api = apiHelper()
    const depHelper = DepartmentsHelper()
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const [dropdown_ep_batch] = useState([])
    const [dep, setDep] = useState('')
    const [department, setDepartment] = useState([])
    const [kpiData, setKpiData] = useState({
        yearly_segmentation : '',
        ep_batch : '',
        employee: '',
        evaluator: ''
   })
  
   const onChangeKpiDetailHandler = (InputName, InputType, e) => {
        
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

    setKpiData(prevState => ({
    ...prevState,
    [InputName] : InputValue
    
    }))

    }
   const handleSegmentation = (id) => {
    dropdown_ep_batch.splice(0, dropdown_ep_batch.length)
    onChangeKpiDetailHandler('yearly_segmentation', 'select', id)
    const seg = segmentation.find(pre => pre.id === id).ep_batches
    seg.forEach(element => {
        dropdown_ep_batch.push({ value: element.id, label: element.title})
    })

   }
    const submitForm = async () => {
        
        if (kpiData.yearly_segmentation !== '' && kpiData.ep_batch !== '') {
            setLoading(true)
            const formData = new FormData()
            formData['ep_yearly_segmentation'] = kpiData.yearly_segmentation
            formData['ep_batch'] = kpiData.ep_batch
            if (kpiData.employee !== '') formData['employee'] = kpiData.employee
            if (kpiData.evaluator !== '') formData['evaluator'] = kpiData.evaluator
            if (dep !== '') formData['department'] = dep
            // return false
                await Api.jsonPost(`/kpis/hr/pervious/batch/kpis/data/`, formData).then(result => {
                    if (result) {
                        if (result.status === 200) {
                            setData(result.data)
                        } else {
                            setData([])
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
    useEffect(() => {
        if (Object.values(department).length === 0) {
            depHelper.fetchDepartments().then(result => {
                console.warn(result)
                setDepartment(result.depActive)
            })
        }
    }, [setDepartment])
  return (
    <Fragment>
        <Card>
            <CardBody>
            <Row>
                   
                   <Col md="3" className="mb-1">
                       <Label className="form-label">
                       Yearly Segmentation <Badge color='light-danger'>*</Badge>
                       </Label>
                       <Select
                           isClearable={false}
                           className='react-select'
                           classNamePrefix='select'
                           name="scale_group"
                           options={dropdownData.yearlySegmentation ? dropdownData.yearlySegmentation : ''}
                           onChange={ (e) => { handleSegmentation(e.value) }}
                           menuPlacement="auto" 
                            menuPosition='fixed'
                       />
                   </Col>
                   {kpiData.yearly_segmentation !== '' && (
                     <Col md="4" className="mb-1">
                        <Label className="form-label">
                        Batch <Badge color='light-danger'>*</Badge>
                        </Label>
                        <Select
                            isClearable={false}
                            className='react-select'
                            classNamePrefix='select'
                            name="scale_group"
                            options={dropdown_ep_batch}
                            onChange={ (e) => { onChangeKpiDetailHandler('ep_batch', 'select', e.value) }}
                        />
                    </Col>
                   )}
                   {kpiData.ep_batch !== '' && (
                    <Col md="4" className="mb-1">
                         <Label>Select Department</Label>
                                <Select
                                options={department}
                                onChange={(e) => setDep(e.value)}
                                menuPlacement="auto" 
                                menuPosition='fixed'
                                />
                    </Col>
                   )}
                   <Col md="4" className="mb-1">
                       <Label className="form-label">
                       Employee
                       </Label>
                       <Select
                           isClearable={true}
                           className='react-select'
                           classNamePrefix='select'
                           name="project"
                           options={dropdownData.employeesDropdown ? dropdownData.employeesDropdown : ''}
                        //    onChange={ (e) => { onChangeKpiDetailHandler('employee', 'select', e.value) }}
                        onChange={(selectedOption) => {
                            // Check if the selected option is null, indicating clearing
                            const selectedValue = selectedOption ? selectedOption.value : null
                            onChangeKpiDetailHandler('employee', 'select', selectedValue)
                        }}
                       />
                   </Col>
                   <Col md="3" className="mb-1">
                       <Label className="form-label">
                       Evaluator 
                       </Label>
                       <Select
                           isClearable={true}
                           className='react-select'
                           classNamePrefix='select'
                           name="project"
                           options={dropdownData.employeesDropdown ? dropdownData.employeesDropdown : ''}
                        //    onChange={ (e) => { onChangeKpiDetailHandler('evaluator', 'select', e.value) }}
                        onChange={(selectedOption) => {
                            // Check if the selected option is null, indicating clearing
                            const selectedValue = selectedOption ? selectedOption.value : null
                            onChangeKpiDetailHandler('evaluator', 'select', selectedValue)
                        }}
                       />
                   </Col>
                   <Col md={2}>
                   <Button color="dark" className="btn-next mt-2" onClick={submitForm}>
                   
                   <Search
                   size={14}
                   className="align-middle md-2"
                   ></Search>
               </Button>
                   </Col>
                   
                   </Row>
            </CardBody>
        </Card>
        {!loading ? (
            data && Object.values(data).length > 0 ? (
                data.map((item, index) => (
                    <div key={index}>
                        <KpiList key={index} data={item} dropdownData={dropdownData} CallBack={CallBack} type='search'/>
                    </div>
                ))
                
            ) : (
                <Card>
                <CardBody>
                No Data Found!
                </CardBody>
            </Card>
                
            )
        ) : (
            <Card>
            <CardBody className='d-flex align-items-center justify-content-center'>
               <div><Spinner type='grow' color='primary' /></div>
                {/* <p className='text-muted ml-2'>Please wait while data is loading...</p> */}
            </CardBody>
        </Card>
        )}
    </Fragment>
  )
}

export default KpiByBatch