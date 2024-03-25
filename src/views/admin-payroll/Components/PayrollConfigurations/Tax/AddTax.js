// ** React Imports
import { Fragment, useState } from 'react'

// ** Third Party Components
import { Save, Lock, Unlock, Trash2, Edit} from 'react-feather'

// ** Reactstrap Imports
import { Row, Col, Card, CardHeader, CardBody, Form, Label, Input, Button, Spinner, Badge, Table } from 'reactstrap'
import apiHelper from '../../../../Helpers/ApiHelper'
import Select from 'react-select'

const AddTax = ({callBack}) => {
    const Api = apiHelper()
    const yearoptions = []
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear() 
  // ** State
  const [loading, setLoading] = useState(false)

    const [taxDetail, setTaxDetail] = useState({
        initial_income_threshold: '',
        income_ceiling: '',
        country: '',
        tax_rate: '',
        exemption_amount: '',
        fixed_amount: '',
        year:''
      })
      
      const country_options = [
        { label: 'Pakistan', value: 'PK' },
        { label: 'United Arab Emirates (Dubai)', value: 'AE' },
        { label : 'United States of America', value: 'US'}
      ]
      for (let i = 0; i < 5; i++) {
        const year = currentYear - i
        yearoptions.push({ value: year, label: year.toString() })
    }
      
      const onChangeTaxDetailHandler = (InputName, InputType, e) => {
        
        let InputValue
        if (InputType === 'input') {
        
        InputValue = e.target.value
        } else if (InputType === 'select') {
        
        InputValue = e
        } else if (InputType === 'date') {
              
              const formatDate = Api.formatDate(e)
            InputValue = formatDate
        } else if (InputType === 'file') {
            InputValue = e.target.files[0].name
        }

        setTaxDetail(prevState => ({
        ...prevState,
        [InputName] : InputValue
        
        }))

    }
  const saveTax = () => {
    if (taxDetail.initial_income_threshold !== '' && taxDetail.income_ceiling !== '' && taxDetail.tax_rate !== ''
    && taxDetail.country !== '' && taxDetail.year !== ''
    ) {
        setLoading(true)
        const formData = {
            initial_income_threshold: taxDetail.initial_income_threshold,
            income_ceiling: taxDetail.income_ceiling,
            tax_rate: taxDetail.tax_rate,
            country: taxDetail.country.value,
            year: taxDetail.year.value,
            exemption_amount: taxDetail.exemption_amount,
            fixed_amount: taxDetail.fixed_amount
          }
        
        Api.jsonPost(`/payroll/add/tax/slab/`, formData).then(result => {
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
  return (
    <Fragment>
        {!loading ? (
            <>
                        {/* ADDON ATTRIBUTES */}
                        <Card>
                            <CardBody>
                            <>
                                    <h5 className='pt-2'>Add Tax</h5>
                                    <Form>
                                        <Row className='justify-content-between align-items-center'>
                                            <Col md={6} className='mb-md-0 mb-1'>
                                            <Label className='form-label'>
                                                Initial Amount<Badge color='light-danger'>*</Badge>
                                            </Label>
                                            <Input type='number' placeholder='Initial Amount' 
                                            onChange={ (e) => { onChangeTaxDetailHandler('initial_income_threshold', 'input', e) }}/>
                                            </Col>
                                            <Col md={6} className='mb-md-0 mb-1'>
                                            <Label className='form-label'>
                                                Ceiling Amount<Badge color='light-danger'>*</Badge>
                                            </Label>
                                            <Input type='number' placeholder='Ceiling Amount' 
                                            onChange={ (e) => { onChangeTaxDetailHandler('income_ceiling', 'input', e) }}/>
                                            </Col>
                                            <Col md={6} className='mb-md-0 mb-1'>
                                            <Label className='form-label'>
                                                Exemption Amount
                                            </Label>
                                            <Input type='number' placeholder='Exemption Amount' 
                                            onChange={ (e) => { onChangeTaxDetailHandler('exemption_amount', 'input', e) }}/>
                                            </Col>
                                            <Col md={6} className='mb-md-0 mb-1'>
                                            <Label className='form-label'>
                                                Fixed Amount
                                            </Label>
                                            <Input type='number' placeholder='Fixed Amount' 
                                            onChange={ (e) => { onChangeTaxDetailHandler('fixed_amount', 'input', e) }}/>
                                            </Col>
                                            <Col md={6} className='mb-md-0 mb-1'>
                                            <Label className='form-label'>
                                                Country<Badge color='light-danger'>*</Badge>
                                            </Label>
                                            <Select
                            type="text"
                            name="valueType"
                            options={country_options}
                            onChange={ (e) => { onChangeTaxDetailHandler('country', 'select', e) }}
                        />
                                            </Col>
                                            <Col md={6} className='mb-md-0 mb-1'>
                                            <Label className='form-label'>
                                                Year<Badge color='light-danger'>*</Badge>
                                            </Label>
                                            <Select
                            type="text"
                            name="valueType"
                            options={yearoptions}
                            onChange={ (e) => { onChangeTaxDetailHandler('year', 'select', e) }}
                        />
                                            </Col>
                                            <Col md={6} className='mb-md-0 mb-1'>
                                            <Label className='form-label'>
                                                Tax Rate<Badge color='light-danger'>*</Badge>
                                            </Label>
                                            <Input type='number' placeholder='Tax Rate' 
                                            onChange={ (e) => { onChangeTaxDetailHandler('tax_rate', 'input', e) }}/>
    </Col>
                                            <Col md={2} className='pt-2'>
                                            <Button color='success' className='text-nowrap px-1' onClick={saveTax} outline>
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

export default AddTax
