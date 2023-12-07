// ** React Imports
import { Fragment, useState, useEffect } from 'react'
// import CustomOffcanvas from '../../../../admin-payroll/Components/hrpayrollcomponents/offcanvas'

// ** Third Party Components
import { Save, Lock, Unlock, Trash2 } from 'react-feather'

// ** Reactstrap Imports
import { FormGroup, Row, Col, Card, CardHeader, CardBody, Form, Label, Input, Button, Spinner, Badge, Table, CardTitle, Offcanvas, OffcanvasBody, OffcanvasHeader, Modal, ModalBody, ModalHeader  } from 'reactstrap'
import apiHelper from '../../../../../Helpers/ApiHelper'
// import Swal from 'sweetalert2'
// import withReactContent from 'sweetalert2-react-content'

const DeductionRequests = ({data, updatepredata}) => {
    const isSuperuser = JSON.parse(localStorage.getItem('is_superuser'))
    const Api = apiHelper()
    const [deductiondata, setdeductiondata] = useState([])
    const [loading, setLoading] = useState(false)
    const [selectedCheckboxIds, setSelectedCheckboxIds] = useState([])
    const [batchresponse, setBatchResponse] = useState([])
    const getData = async () => {
      const formdata = new FormData()
      formdata['payroll_batch'] = data.id
      setLoading(true)
      try {
        const deductionAttributesResponse = await Api.get(`/payroll/deduction/attributes`)
        const batchAttributesResponse = await Api.jsonPost(`/payroll/batch/attributes/view/`, formdata)
    
        if (deductionAttributesResponse.status === 200) {
          setdeductiondata(deductionAttributesResponse.data)
        } else {
          Api.Toast('error', deductionAttributesResponse.message)
        }
    
        if (batchAttributesResponse.status === 200) {
          const selectedIds = batchAttributesResponse.data.map(item => item.payroll_attribute)
          setSelectedCheckboxIds(selectedIds)
          setBatchResponse(batchAttributesResponse.data)
        } else {
          Api.Toast('error', batchAttributesResponse.message)
        }
      } catch (error) {
        Api.Toast('error', 'Server not responding')
      } finally {
        setLoading(false)
      }
    }
    
      const handleCheckboxChange = (checkboxId) => {
        if (selectedCheckboxIds.includes(checkboxId)) {
          setSelectedCheckboxIds(selectedCheckboxIds.filter(id => id !== checkboxId))
        } else {
          setSelectedCheckboxIds([...selectedCheckboxIds, checkboxId])
        }
      }
      const CallBack = () => {
        getData()
      }
      const updatepayrollattributelist = async(updatepredata) => {
        const formData = new FormData()
          formData['payroll_attribute'] = selectedCheckboxIds
          formData['payroll_batch'] = data.id
          await Api.jsonPost(`/payroll/batch/add/attributes/`, formData).then(result => {
            if (result) {
                if (result.status === 200) {
                    
                    Api.Toast('success', result.message)
                    CallBack()
                    updatepredata()
                } else {
                    Api.Toast('error', result.message)
                }
            } else {
                Api.Toast('error', 'Server not responding')
            }
          })
      } 
      useEffect(() => {
        getData()
      }, [])
      const handleTaxableToggle = async(batchAttr) => {
        const formData = new FormData()
        formData['is_Taxable'] = !batchAttr.is_Taxable
        formData['payroll_batch'] = data.id
        await  Api.jsonPatch(`/payroll/batch/compositions/attributes/${batchAttr.id}/`, formData)
        .then((result) => {
            // const data = {status:result.status, result_data:result.data, message: result.message }
            if (result.status === 200) {
            Api.Toast('success', result.message)
            CallBack()
            } else {
                Api.Toast('error', result.message)
            }
        })
    .catch((error) => {
        Api.Toast('error', error)
    }) 
      }
  return (
    <Fragment>
        <h2 className='text-light'>Deductions</h2>
          {!loading ? (
            <>
      <Row>
        {Object.values(deductiondata).length > 0 ? (
        <>
                {deductiondata.map((item) => (
                   <Col key={item.id} sm='6' md='4' lg='3'>
                        <Card>
                            <CardBody>
                            <Label check>
                    <Input type='checkbox' onChange={() => handleCheckboxChange(item.id)} disabled={!isSuperuser}
                        checked={selectedCheckboxIds.includes(item.id)}/> {item.title}
                  </Label>
                  {batchresponse.map((batchAttr) => {
  return (
    batchAttr.payroll_attribute === item.id ? (
      <div key={batchAttr.id} className='mt-2'>
        <FormGroup switch>
          <Label switch>
            <Input
              type="switch"
              checked={batchAttr.is_Taxable} // Set the initial state based on is_Taxable
              onChange={() => handleTaxableToggle(batchAttr)}
              disabled={!isSuperuser}
            />
            {batchAttr.is_Taxable ? 'Taxable' : 'Non Taxable'}
          </Label>
        </FormGroup>
      </div>
    ) : null
  )
})}
                            </CardBody>
                        </Card>
                    </Col>
                ))}
                </>) :  <div className='text-center'>No data found</div>}
            </Row>
            {isSuperuser ?   <Row className="justify-content-center">
             <Col md={2} className='pt-2'>
               <Button color='success' className='text-nowrap px-1' onClick={() => updatepayrollattributelist(updatepredata)} outline>
                 <Save size={14} className='me-50' />
                 <span>Save</span>
               </Button>
             </Col>
           </Row> : null }
           </>
          ) : (
            <div className='text-center'><Spinner type='grow' color='white'/></div>
        )} 
    </Fragment>
  )
}

export default DeductionRequests
