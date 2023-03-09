import { Fragment, useState } from "react" 
// ** Icons Imports
import { ArrowLeft, ArrowRight, Minus, Plus, Save } from "react-feather" 
// ** Reactstrap Imports
import { Label, Row, Col, Input, Form, Button, Badge, FormFeedback} from "reactstrap" 
import InputNumber from 'rc-input-number'
// ** React Select
import apiHelper from "../../Helpers/ApiHelper"
const StaffClassificationAdd = ({ stepper, type, stepperStatus, fetchStaffClassification, fetchingStaffClassification }) => {
    const Api = apiHelper()
    const [title, setTitle] = useState('')
    const [initial, setInitial] = useState('')
    const [initialError, setInitialError] = useState('')
    const [plevel, setPLevel] = useState(5)
    const getInitail = value => {
      if (value) {
        setTitle(value)
        const matches = value.match(/\b(\w)/g)
        const acronym = matches.join('') 
        const initialLength = acronym.length
        if (initialLength < 5) {
          setInitial(acronym.toUpperCase())
        } else {
          setInitialError('Initial cannot be greater than 4 alphabets')
        }
        
      } else {
        setInitial('')
      }
      
    }
    function saveData() {
        const formData = new FormData()
        if (title !== '' && initial !== '') {
          formData['title'] =  title
          formData['level'] = plevel
          formData['initial'] =  initial
    
          // ** Api Post Request
    
           Api.jsonPost(`/organizations/staff_classification/`, formData)
          .then((result) => {
            const data = {status:result.status, result_data:result.data, message: result.message }
            if (data.status === 200) {
             
              fetchingStaffClassification()
              if (typeof fetchStaffClassification !== "undefined") { 
                fetchStaffClassification()
              }
            } else {
              Api.Toast('error', data.message)
            }
          })
        } else {
            Api.Toast('error', 'Fill all the required fields!')
        }
      }
return (
    <Fragment>
      <div className='content-header'>
        <h5 className='mb-0'>Staff Classification</h5>
        <small>Add Staff Classification.</small>
      </div>
      <Form onSubmit={e => e.preventDefault()}>
        <Row>
          <Col md='4' className='mb-1'>
            <Label className='form-label' for={`staff-${type}`}>
              Title<Badge color="light-danger">*</Badge>
            </Label>
            <Input type='text' id={`staff-title`} name='staff-title' placeholder='Add Title' onChange={e => getInitail(e.target.value)}/>
          </Col>
          <Col md='4' className='mb-1'>
            <Label className='form-label' for={`staff-${type}`}>
              Initial<Badge color="light-danger">*</Badge>
            </Label>
            <Input type='text' id={`staff-initial`} name='staff-initial'
            defaultValue={initial && initial} placeholder='Add Initial' onChange={e => setInitial(e.target.value)} />
            {initialError !== '' ? <FormFeedback style={{display : 'block'}}>{initialError}</FormFeedback> : null}
          </Col>
          <Col md='4' className='mb-1'>
                <Label className='form-label' for='min-max-number-input'>
                    Priority Level [ 1 - 30 ]
                </Label>
                <InputNumber
                    className='input-lg'
                    min={1}
                    max={30}
                    defaultValue={5}
                    upHandler={<Plus />}
                    downHandler={<Minus />}
                    id='min-max-number-input'
                    onChange={value => setPLevel(value)}
                  />
          </Col>
        </Row>
        {/* <Row>
          <Col md='6' className='mb-1'>
            <Label className='form-label' for={`staff-status`}>
              Status
            </Label>
            <Select
              theme={staffStatus}
              isClearable={false}
              id='staff-status'
              name='staff-status'
              className='react-select'
              classNamePrefix='select'
              options={staffStatus}
              defaultValue={staffStatus[0]}
              onChange={status => setStatus(status.value)}
            />
          </Col>
        </Row> */}
        {stepperStatus ? (
        <div className='d-flex justify-content-between'>
          
            <Button color='primary' className='btn-prev' onClick={() => stepper.previous()}>
            <ArrowLeft size={14} className='align-middle me-sm-25 me-0'></ArrowLeft>
            <span className='align-middle d-sm-inline-block d-none'>Previous</span>
          </Button>
          <div className='d-flex'>
              <Button color='success' className='btn-next me-1' onClick={saveData}>
                <span className='align-middle d-sm-inline-block d-none'>Save</span>
                <Save size={14} className='align-middle ms-sm-25 ms-0'></Save>
              </Button>
              
                <Button color='primary' className='btn-next' onClick={() => stepper.next()}>
                <span className='align-middle d-sm-inline-block d-none'>Next</span>
                <ArrowRight size={14} className='align-middle ms-sm-25 ms-0'></ArrowRight>
              </Button>   
          </div>
        </div>
        ) : (
          <div className='row'>
            <div className='col-lg-12'>
            <Button color='primary' className='btn-next me-1' onClick={saveData}>
                <span className='align-middle d-sm-inline-block d-none'>Save</span>
                <Save size={14} className='align-middle ms-sm-25 ms-0'></Save>
              </Button>
            </div>
          </div>
        )}
      </Form>
    </Fragment>
)

}
StaffClassificationAdd.defaultProps = {
  stepperStatus: true
}
export default StaffClassificationAdd