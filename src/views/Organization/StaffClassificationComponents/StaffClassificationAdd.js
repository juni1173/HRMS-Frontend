import { Fragment, useState } from "react" 
// ** Icons Imports
import { ArrowLeft, ArrowRight, Minus, Plus, Save, Check, X, XCircle } from "react-feather" 
// ** Reactstrap Imports
import { Label, Row, Col, Input, Form, Button } from "reactstrap" 
import InputNumber from 'rc-input-number'
// ** React Select
import Select from 'react-select'
import { toast, Slide } from 'react-toastify'
import Avatar from '@components/avatar'
const StaffClassificationAdd = ({ stepper, type, stepperStatus, fetchStaffClassification, fetchingStaffClassification }) => {
    const [title, setTitle] = useState('')
    const [plevel, setPLevel] = useState(5)
    const [sclass_status, setStatus] = useState(0)
  const staffStatus = [
    { value: '0', label: 'Inactive' },
    { value: '1', label: 'Active' }
    ]
    const organization = JSON.parse(localStorage.getItem('organization'))
    const ToastContent = ({ type, message }) => (
        type === 'success' ? (
        <Fragment>
          <div className='toastify-header'>
            <div className='title-wrapper'>
              <Avatar size='sm' color='success' icon={<Check size={12} />} />
              <h6 className='toast-title fw-bold'>Succesfull</h6>
            </div>
          </div>
          <div className='toastify-body'>
            <span>{message}</span>
          </div>
        </Fragment>) : (
        <Fragment>
          <div className='toastify-header'>
            <div className='title-wrapper'>
              <Avatar size='sm' color='danger' icon={<X size={12} />} />
              <h6 className='toast-title fw-bold'>Error</h6>
            </div>
          </div>
          <div className='toastify-body'>
            <span>{message}</span>
          </div>
        </Fragment>
        )
    )
    let token = localStorage.getItem('accessToken')
    token = token.replaceAll('"', '')
    token = `Bearer ${token}`
    function saveData() {
        const formData = new FormData()
        if (title.length > 0) {
          formData['title'] =  title
          formData['level'] = plevel
          formData['is_status'] =  sclass_status
          formData['organization'] = organization.id
    
          console.warn(formData)
          // ** Api Post Request
    
          fetch('http://127.0.0.1:8000/api/organization/staff_classification/', {
            method: "POST",
            headers: { "Content-Type": "Application/json", Authorization: token },
            body: JSON.stringify(formData)
          })
          .then((response) => response.json())
          .then((result) => {
            const data = {status:result.status, result_data:result.data, message: result.message }
            if (data.status === 201) {
              toast.success(
                <ToastContent type='success' message={data.message} />,
                { icon: false, transition: Slide, hideProgressBar: true, autoClose: 2000 }
              )
              fetchingStaffClassification()
              if (typeof fetchStaffClassification !== "undefined") { 
                fetchStaffClassification()
              }
              
            } else {
              alert('failed')
              toast.error(
                <ToastContent type='error' message={data.message} />,
                { icon: false, transition: Slide, hideProgressBar: true, autoClose: 2000 }
              )
            }
            
            // stepper.next()
          })
          .catch((error) => {
            
            console.log(error)
            toast.error(
              <ToastContent type='error' message="Not getting data" />,
              { icon: false, transition: Slide, hideProgressBar: true, autoClose: 2000 }
            )
          }) 
          
        } else {
            toast.error(
                <ToastContent type='error' message="Title is required" />,
                { icon: false, transition: Slide, hideProgressBar: true, autoClose: 2000 }
              )
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
          <Col md='6' className='mb-1'>
            <Label className='form-label' for={`staff-${type}`}>
              Title
            </Label>
            <Input type='text' id={`staff-title`} name='staff-title' placeholder='Add Title' onChange={e => setTitle(e.target.value)} />
          </Col>
          <Col md='6' className='mb-1'>
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
        <Row>
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
        </Row>
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
          <div className='row float-right'>
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