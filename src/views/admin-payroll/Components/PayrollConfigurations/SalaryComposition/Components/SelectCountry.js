// ** React Imports
import { Fragment, useState } from 'react'

// ** Third Party Components
import { Save, Lock, Unlock, Trash2, Edit} from 'react-feather'

// ** Reactstrap Imports
import { Row, Col, Card, CardHeader, CardBody, Form, Label, Input, Button, Spinner, Badge, Table } from 'reactstrap'
import apiHelper from '../../../../../Helpers/ApiHelper'
import Select from 'react-select'

const TaxCountry = ({batch_id, callBack}) => {
    const Api = apiHelper()
  // ** State
  const [loading, setLoading] = useState(false)

    const [taxDetail, setTaxDetail] = useState({
        country: ''
      })
      
      const country_options = [
        { label: 'Pakistan', value: 'PK' },
        { label: 'United Arab Emirates (Dubai)', value: 'AE' },
        { label : 'United States of America', value: 'US'}
      ]
      
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
    if (taxDetail.country !== '') {
        setLoading(true)
        const formData = {
            country: taxDetail.country.value
          }
        Api.jsonPatch(`/payroll/batch/${batch_id}/`, formData).then(result => {
            if (result) {
                if (result.status === 200) {
                    Api.Toast('success', result.message)
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
                                    <h5 className='pt-2'>Tax Country</h5>
                                    <Form>
                                        <Row className='justify-content-between align-items-center'>
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

export default TaxCountry
