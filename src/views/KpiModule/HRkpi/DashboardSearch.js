import {Fragment, useState, useEffect, useRef } from 'react'
import { Card, CardBody, Row, Col, Label, Badge, Button } from 'reactstrap'
import Select from 'react-select'
import DepartmentsHelper from '../../Helpers/DepartmentsHelper'
const DashboardSearch = ({segmentation, dropdownData, Callback, callbackParams}) => {
    const depHelper = DepartmentsHelper()
    const [dropdown_ep_batch] = useState([])
    const isMounted = useRef(true)
    const [department, setDepartment] = useState([])
    const [kpiData, setKpiData] = useState({
        yearly_segmentation : '',
        ep_batch : '',
        department: ''
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
    const seg = segmentation.find(pre => pre.id === id.value).ep_batches
    seg.forEach(element => {
        dropdown_ep_batch.push({ value: element.id, label: element.title})
    })

   }
   const submitReset = () => {
        setKpiData({
            yearly_segmentation : '',
            ep_batch : '',
            department: ''
       })
       Callback()
   }
    const submitForm = () => {
        Callback(kpiData)
    }
    useEffect(() => {
        if (Object.values(department).length === 0) {
            depHelper.fetchDepartments().then(result => {
             if (isMounted.current) setDepartment(result.depActive)
            })
        }
        return (() => {
            isMounted.current = false
        })
    }, [setDepartment])
  return (
    <Fragment>
            <Row>  
            {(callbackParams && Object.values(callbackParams).length > 0) && (
                (callbackParams.yearly_segmentation.label && callbackParams.yearly_segmentation.label !== '' && callbackParams.ep_batch.label && callbackParams.ep_batch.label !== '') && (
                    <Col md="12" className='mb-1'>
                            <div className={'mr-1 tag-item cursor-pointer'}>
                                <span className="text small">Segmentation "{callbackParams.yearly_segmentation.label}"</span>
                            </div>
                            <div className={'tag-item cursor-pointer'}>
                                <span className="text small">Batch "{callbackParams.ep_batch.label}"</span>
                            </div>
                            <div className={'tag-item cursor-pointer'} style={{background: 'transparent', color: '#302b63'}}>
                                <span className='small link underline' onClick={submitReset}>Reset</span>
                            </div>
                    </Col> 
                )
            )}
                <Col md={kpiData.yearly_segmentation !== '' ? "6" : "8"} className="mb-1">
                       <Label className="form-label">
                       Yearly Segmentation <Badge color='light-danger'>*</Badge>
                       </Label>
                       <Select
                           isClearable={false}
                           className='react-select'
                           classNamePrefix='select'
                           name="scale_group"
                           options={dropdownData.yearlySegmentation ? dropdownData.yearlySegmentation : ''}
                           onChange={ (e) => { handleSegmentation(e) }}
                           menuPlacement="auto" 
                            menuPosition='fixed'
                            styles={{
                                control: (provided) => ({
                                  ...provided,
                                  borderRadius: '30px',  // Adjust the value as needed (30px is just an example)
                                  borderColor: '#ccc',  // Optional: change the border color
                                  padding: '2px'       // Optional: Add padding if necessary
                                }),
                                dropdownIndicator: (provided) => ({
                                  ...provided,
                                  color: '#ccc'  // Optional: change the dropdown indicator color
                                }),
                                clearIndicator: (provided) => ({
                                  ...provided,
                                  color: '#ccc'  // Optional: change the clear indicator color
                                })
                              }}
                       />
                   </Col>
                   {kpiData.yearly_segmentation !== '' && (
                     <Col md="6" className="mb-1">
                        <Label className="form-label">
                        Batch <Badge color='light-danger'>*</Badge>
                        </Label>
                        <Select
                            isClearable={false}
                            className='react-select'
                            classNamePrefix='select'
                            name="scale_group"
                            options={dropdown_ep_batch}
                            onChange={ (e) => { onChangeKpiDetailHandler('ep_batch', 'select', e) }}
                            styles={{
                                control: (provided) => ({
                                  ...provided,
                                  borderRadius: '30px',  // Adjust the value as needed (30px is just an example)
                                  borderColor: '#ccc',  // Optional: change the border color
                                  padding: '2px'       // Optional: Add padding if necessary
                                }),
                                dropdownIndicator: (provided) => ({
                                  ...provided,
                                  color: '#ccc'  // Optional: change the dropdown indicator color
                                }),
                                clearIndicator: (provided) => ({
                                  ...provided,
                                  color: '#ccc'  // Optional: change the clear indicator color
                                })
                              }}
                        />
                    </Col>
                   )}
                   {/* {kpiData.ep_batch !== '' && (
                    <Col md="10" className="mb-1">
                         <Label>Select Department</Label>
                                <Select
                                options={department}
                                onChange={ (e) => { onChangeKpiDetailHandler('department', 'select', e.value) }}
                                menuPlacement="auto" 
                                menuPosition='fixed'
                                styles={{
                                    control: (provided) => ({
                                      ...provided,
                                      borderRadius: '30px',  // Adjust the value as needed (30px is just an example)
                                      borderColor: '#ccc',  // Optional: change the border color
                                      padding: '2px'       // Optional: Add padding if necessary
                                    }),
                                    dropdownIndicator: (provided) => ({
                                      ...provided,
                                      color: '#ccc'  // Optional: change the dropdown indicator color
                                    }),
                                    clearIndicator: (provided) => ({
                                      ...provided,
                                      color: '#ccc'  // Optional: change the clear indicator color
                                    })
                                  }}
                                />
                    </Col>
                   )} */}
                   <Col md={kpiData.yearly_segmentation !== '' ? 12 : 2} className={kpiData.yearly_segmentation !== '' ? "d-flex justify-content-center" : "d-flex align-items-center"}>
                    <button className={kpiData.yearly_segmentation !== '' ? "btn btn-outline-primary mt-0 text-center rounded-pill" : "btn btn-outline-primary mt-1 btn-md rounded-pill"} onClick={submitForm}>
                        Go
                    </button>
                   </Col>
                   
                   </Row>
    </Fragment>
  )
}

export default DashboardSearch