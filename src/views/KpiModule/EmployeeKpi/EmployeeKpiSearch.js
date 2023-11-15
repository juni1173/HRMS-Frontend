import React, { Fragment, useState } from 'react'
import apiHelper from '../../Helpers/ApiHelper'
import { Card, CardBody, Row, Col, Label, Badge, Button } from 'reactstrap'
import { Search } from 'react-feather'
import Select from 'react-select'
import KpiList from './KpiList'
const EmployeeKpiSearch = ({dropdownData, CallBack}) => {
    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const [kpiData, setKpiData] = useState({
        ep_batch : ''
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
    const submitForm = async () => {
        
        if (kpiData.ep_batch !== '') {
            setLoading(true)
            const formData = new FormData()
            formData['ep_batch'] = kpiData.ep_batch
            // return false
                await Api.jsonPost(`/kpis/employee/pervious/batch/kpis/data/`, formData).then(result => {
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
  return (
    <Fragment>
        <Card>
            <CardBody>
            <Row>
                   
                   <Col md="4" className="mb-1">
                       <Label className="form-label">
                       Batch <Badge color='light-danger'>*</Badge>
                       </Label>
                       <Select
                           isClearable={false}
                           className='react-select'
                           classNamePrefix='select'
                           name="scale_group"
                           options={dropdownData.ep_batch ? dropdownData.ep_batch : ''}
                           onChange={ (e) => { onChangeKpiDetailHandler('ep_batch', 'select', e.value) }}
                       />
                   </Col>
                   {/* <Col md="4" className="mb-1">
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
                   </Col> */}
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
                   <Col md={4}>
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
                <KpiList key={1} searchData={data} dropdownData={dropdownData} CallBack={CallBack} type='search'/>
                
            ) : (
                <Card>
                <CardBody>
                No Data Found!
                </CardBody>
            </Card>
                
            )
        ) : (
            <Card>
                <CardBody>
                    No data found
                </CardBody>
            </Card>
        )}
    </Fragment>
  )
}

export default EmployeeKpiSearch