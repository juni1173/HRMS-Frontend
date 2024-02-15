// ** React Imports
import { Fragment, useState, useEffect } from 'react'

// ** Third Party Components
import { Save, Lock, Unlock, Trash2, Edit} from 'react-feather'

// ** Reactstrap Imports
import { Row, Col, Card, CardHeader, CardBody, Form, Label, Input, Button, Spinner, Badge, Table } from 'reactstrap'
import apiHelper from '../../../../../Helpers/ApiHelper'
import Select from 'react-select'

const AddAttribute = ({callBack}) => {
    const Api = apiHelper()
  // ** State
  const [loading, setLoading] = useState(false)

    const [attributePayrollDetail, setAttributePayrollDetail] = useState({
        title: '',
        payroll_type: '',
        valueType: '',
        // is_Taxable: '',
        is_employee_base: '',
        is_organization_base: ''
      })
      
      const category_options = [
        { label: 'Addon', value: 'Addon' },
        { label: 'Deduction', value: 'Deduction' }
      ]
      // const payment_frequency_options = [
      //   { label: 'Monthly', value: 'Monthly' },
      //   { label: 'Yearly', value: 'Yearly' }
      // ]
    const [valueTypedropdown] = useState([])
    const onChangePayrollAttributeDetailHandler = (InputName, InputType, e) => {
        
        let InputValue
        if (InputType === 'input') {
        
        InputValue = e.target.value
        } else if (InputType === 'select') {
        
        InputValue = e

        if (InputName === 'baseFlag') {
            if (InputValue.value === 'Organization Base') {
              // Set 'is_organization_base' to true and 'is_employee_base' to false
              setAttributePayrollDetail(prevState => ({
                ...prevState,
                is_organization_base: true,
                is_employee_base: false
              }))
            } else if (InputValue.value === 'Employee Base') {
              // console.log('here')
              // Set 'is_organization_base' to false and 'is_employee_base' to true
              setAttributePayrollDetail(prevState => ({
                ...prevState,
                is_organization_base: false,
                is_employee_base: true
              }))
            }
        }
        } else if (InputType === 'date') {
            let dateFomat = e.split('/')
            dateFomat = `${dateFomat[2]}-${dateFomat[1]}-${dateFomat[0]}`    
            InputValue = dateFomat
        } else if (InputType === 'file') {
            InputValue = e.target.files[0].name
        }
    
        setAttributePayrollDetail(prevState => ({
        ...prevState,
        [InputName] : InputValue
        
        
        }))
    }
  const savePayrollAttribute = () => {
    if (attributePayrollDetail.title !== '' && attributePayrollDetail.category !== '' && attributePayrollDetail.payroll_type !== ''
    && attributePayrollDetail.valueType !== '' && attributePayrollDetail.is_employee_base !== ''
    && attributePayrollDetail.is_organization_base !== ''
    ) {
        setLoading(true)
        const formData = {
            title: attributePayrollDetail.title,
            payroll_type: attributePayrollDetail.payroll_type.value,
            valueType: attributePayrollDetail.valueType.value,
            // is_Taxable: attributePayrollDetail.is_Taxable.value,
            is_employee_base: attributePayrollDetail.is_employee_base,
            is_organization_base: attributePayrollDetail.is_organization_base
          }
        
        Api.jsonPost(`/payroll/addons/attributes/`, formData).then(result => {
            if (result) {
                if (result.status === 200) {
                    Api.Toast('success', 'Attribute added successfully')
                    callBack()
                } else {
                    Api.Toast('error', result.message)
                }
            } else {
                Api.Toast('error', 'Server not responding')
            }
        })
    setTimeout(() => {
        setLoading(false)
    }, 1000)
    } else {
        Api.Toast('error', 'Fields are required!')
    }
}
const getData =  async () => {
  setLoading(true)
      await Api.get(`/payroll_compositions/valueTypechoices/`).then(result => {
          if (result) {
              if (result.status === 200) {
                valueTypedropdown.splice(1, valueTypedropdown.length)
                for (let i = 0; i < result.data.length; i++) {
                    if (result.data[i].is_active) {
                        valueTypedropdown.push({value:result.data[i].id, label: result.data[i].title })
                    }
                } 
              } else {
                  Api.Toast('error', result.message)
              }
          } else {
              Api.Toast('error', 'Server not responding')
          }
      })
      setTimeout(() => {
          setLoading(false)
      }, 1000)
}
useEffect(() => {
getData()
}, [])
  return (
    <Fragment>
        {!loading ? (
            <>
                        {/* ADDON ATTRIBUTES */}
                        <Card>
                            <CardBody>
                            <>
                                    <h5 className='pt-2'>Add Addon/Deduction Attribute</h5>
                                    <Form>
                                        <Row className='justify-content-between align-items-center'>
                                            <Col md={4} className='mb-md-0 mb-1'>
                                            <Label className='form-label'>
                                                Title<Badge color='light-danger'>*</Badge>
                                            </Label>
                                            <Input type='text' placeholder='Title' 
                                            onChange={ (e) => { onChangePayrollAttributeDetailHandler('title', 'input', e) }}/>
                                            </Col>
                                            <Col md={4} className='mb-md-0 mb-1'>
                                            <Label className='form-label'>
                                                Category<Badge color='light-danger'>*</Badge>
                                            </Label>
                                            <Select
                            type="text"
                            name="payroll_type"
                            options={category_options}
                            onChange={ (e) => { onChangePayrollAttributeDetailHandler('payroll_type', 'select', e) }}
                        />
                                            </Col>
                                            <Col md={4} className='mb-md-0 mb-1'>
                                            <Label className='form-label'>
                                                Type<Badge color='light-danger'>*</Badge>
                                            </Label>
                                            <Select
                            type="text"
                            name="valueType"
                            options={valueTypedropdown}
                            onChange={ (e) => { onChangePayrollAttributeDetailHandler('valueType', 'select', e) }}
                        />
                                            </Col>
                                            {/* <Col md={4} className='mb-md-0 mb-1'>
      <Label className='form-label'>
        Is Taxable<Badge color='light-danger'>*</Badge>
      </Label>
      <Select
        type="checkbox"
        name="is_Taxable"
        options={[
          { label: 'Taxable', value: true },
          { label: 'Non-Taxable', value: false }
        ]}
        onChange={(e) => {
          onChangePayrollAttributeDetailHandler('is_Taxable', 'select', e)
        }}
      />
    </Col> */}
    <Col md={4} className='mb-md-0 mb-1'>
    <Label className='form-label'>
        Base Flag<Badge color='light-danger'>*</Badge>
      </Label>
    <Select
        type="checkbox"
        name="baseFlag"
        options={[
          { label: 'Organization Base', value: 'Organization Base' },
          { label: 'Employee Base', value: 'Employee Base' }
        ]}
        onChange={(e) => {
          onChangePayrollAttributeDetailHandler('baseFlag', 'select', e)
        }}
      />
      </Col>
      {/* <Col md={4} className='mb-md-0 mb-1'>
    <Label className='form-label'>
        Payment Frequency<Badge color='light-danger'>*</Badge>
      </Label>
    <Select
        type="checkbox"
        name="payment_frequency"
        options={payment_frequency_options}
        onChange={(e) => {
          onChangePayrollAttributeDetailHandler('payment_frequency', 'select', e)
        }}
      />
      </Col> */}
                                            <Col md={2} className='pt-2'>
                                            <Button color='success' className='text-nowrap px-1' onClick={savePayrollAttribute} outline>
                                                <Save size={14} className='me-50' />
                                                <span>Save</span>
                                            </Button>
                                            </Col>
                                        </Row>
                                    </Form>
                                    </>                                                 
                            </CardBody>
                        </Card> 
                
            </>
        ) : (
            <div className='text-center'><Spinner type='grow' color='white'/></div>
        )}
    </Fragment>
    
  )
}

export default AddAttribute
