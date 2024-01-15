import React, { Fragment, useState } from 'react'
import apiHelper from '../../Helpers/ApiHelper'
import { Card, CardBody, Row, Col, Label, Badge, Button, Spinner } from 'reactstrap'
import { Search } from 'react-feather'
import Select from 'react-select'
import EvaluatorKpiList from './EvaluatorKpiList'
import KpiList from './KpiList'
const EmployeeKpiSearch = ({segmentation, dropdownData, CallBack}) => {
    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const [dropdown_ep_batch] = useState([])
    const [searchAsEvaluator, setAsEvaluator] = useState(false)
    const [kpiData, setKpiData] = useState({
        ep_batch : '',
        yearly_segmentation: '',
        employee:''
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
            if (kpiData.employee !== '' && searchAsEvaluator) formData['employee'] = kpiData.employee
            // return false
            let url = ''
            searchAsEvaluator ? (
                url = '/kpis/team/lead/pervious/batch/kpis/data/'
            ) : (
                url = '/kpis/employee/pervious/batch/kpis/data/'
            )
                await Api.jsonPost(url, formData).then(result => {
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
    const handleSearchSelection = (bool) => {
        setAsEvaluator(bool)
        setData([])
        return false
    }
  return (
    <Fragment>
        <Card>
            <CardBody>
                <Row className='mb-2'>
                    <Col md={4}>
                        <button className={!searchAsEvaluator ? 'btn btn-success' : 'btn btn-outline-dark'} onClick={() => handleSearchSelection(false)}>Search Your Kpi's</button>
                        
                    </Col>
                    <Col md={4}><button className={searchAsEvaluator ? 'btn btn-success' : 'btn btn-outline-dark'} onClick={() => handleSearchSelection(true)}>Search As Evaluator</button></Col>
                    <Col md={4}></Col>
                </Row>
            <Row>
                    <Col md={searchAsEvaluator ? '3' : '4'} className="mb-1">
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
                   <Col md={searchAsEvaluator ? '3' : '4'} className="mb-1">
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
                           menuPlacement="auto" 
                    menuPosition='fixed'
                       />
                   </Col>
                   )}
                   {searchAsEvaluator && (
                   <Col md="3" className="mb-1">
                       <Label className="form-label">
                       Employee <Badge color='light-danger'>*</Badge>
                       </Label>
                       <Select
                           isClearable={false}
                           className='react-select'
                           classNamePrefix='select'
                           name="project"
                           options={dropdownData.employeesDropdown ? dropdownData.employeesDropdown : ''}
                           onChange={ (e) => { onChangeKpiDetailHandler('employee', 'select', e.value) }}
                       />
                   </Col>
                   )}
                   {/* <Col md="4" className="mb-1">
                       <Label className="form-label">
                       Evaluator 
                       </Label>
                       <Select
                           isClearable={false}
                           className='react-select'
                           classNamePrefix='select'
                           name="project"
                           options={dropdownData.employeesDropdown ? dropdownData.employeesDropdown : ''}
                           onChange={ (e) => { onChangeKpiDetailHandler('evaluator', 'select', e.value) }}
                       />
                   </Col> */}
                   <Col md={3}>
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
                // data.map((item, index) => (
                //     <div key={index}>
                        
                //     </div>
                // ))
                (searchAsEvaluator && kpiData.employee !== '') ? (
                        <EvaluatorKpiList key={1} data={data} dropdownData={dropdownData} CallBack={CallBack} type='search'/>
                           
                    ) : (
                        <KpiList key={1} searchData={data} dropdownData={dropdownData} CallBack={CallBack} type='search'/>
                    )
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
                    <Spinner type='grow' color='primary'/>
                </CardBody>
            </Card>
        )}
    </Fragment>
  )
}

export default EmployeeKpiSearch