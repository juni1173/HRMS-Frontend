import { Fragment, useState } from "react" 
// ** Icons Imports
import { ArrowLeft, ArrowRight, Save, Check, X, XCircle } from "react-feather" 
// ** Reactstrap Imports
import { Label, Row, Col, Input, Form, Button } from "reactstrap" 
import Select from 'react-select'
import { toast, Slide } from 'react-toastify'
import Avatar from '@components/avatar'
const GroupHeadAdd = ({ stepper, fetchGroupHeads, stepperStatus, GroupHeadCallBack }) => {
    const groupStatus = [
        { value: 0, label: 'Inactive' },
        { value: 1, label: 'Active' }
      ]
      const groupType = [
        { value: 1, label: 'Non-Technical' },
        { value: 2, label: 'Technical' }
      ]
      const [title, setTitle] = useState('')
      const [group_type, setType] = useState(0)
      const [group_status, setStatus] = useState(0)
      const [group_description, setdescription] = useState('')
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
    const onSubmit = async () => {
        const formData = new FormData()
        if (title.length > 0) {
          formData['title'] =  title
          formData['grouphead_type'] = !group_type ? groupType[0].value : group_type
          formData['is_status'] =  !group_status ? groupStatus[0].value : group_status
          formData['description'] = group_description
          formData['organization'] = organization.id
    
          // console.warn(formData)
          // ** Api Post Request
    
          fetch(`${process.env.REACT_APP_API_URL}/organization/grouphead/`, {
            method: "POST",
            headers: { "Content-Type": "Application/json", Authorization: token },
            body: JSON.stringify(formData)
          })
          .then((response) => response.json())
          .then((result) => {
            // const data = {status:result.status, result_data:result.data, message: result.message }
            if (result.status === 200) {
              toast.success(
                <ToastContent type='success' message={result.message} />,
                { icon: false, transition: Slide, hideProgressBar: true, autoClose: 2000 }
              )
              GroupHeadCallBack()
              if (typeof fetchGroupHeads !== "undefined") { 
                fetchGroupHeads() 
              }
              
            } else {
              toast.error(
                <ToastContent type='error' message={result.message} />,
                { icon: false, transition: Slide, hideProgressBar: true, autoClose: 2000 }
              )
            }
          })
          .catch((error) => {
            
            console.log(error)
            toast.error(
              <ToastContent type='error' message={error} />,
              { icon: false, transition: Slide, hideProgressBar: true, autoClose: 2000 }
            )
          }) 
          
        } else {
          toast.error(
            <ToastContent type='error' message='Title is required' />,
            { icon: false, transition: Slide, hideProgressBar: true, autoClose: 2000 }
          )
        }
      }
return (
    <Fragment>
      <div className='content-header' >
        <h5 className='mb-0'>Group Head</h5>
        <small>Add Group Heads.</small>
      </div>
      <Form onSubmit={e => e.preventDefault()}  id="groupHeadForm">
        <Row>
          <Col md='6' className='mb-1'>
            <Label className='form-label' for={`group-title`}>
              Title
            </Label>
            <Input type='text' name={`title`} id={`title`} placeholder='Group Title' onChange={e => setTitle(e.target.value)}/>
          </Col>
          <Col md='3' className='mb-1'>
            <Label className='form-label' for={`type`}>
              Type
            </Label>
            <Select
              theme={groupType}
              isClearable={false}
              id='group-type'
              name='group-type'
              className='react-select'
              classNamePrefix='select'
              options={groupType}
              defaultValue={groupType[0]}
              onChange={type => { setType(type.value) }}
            />
          </Col>
          <Col md='3' className='mb-1'>
            <Label className='form-label' for={`group-status`}>
              Status
            </Label>
            <Select
              theme={groupStatus}
              isClearable={false}
              id='group-status'
              name='group-status'
              className='react-select'
              classNamePrefix='select'
              options={groupStatus}
              defaultValue={groupStatus[0]}
              onChange={status => { setStatus(status.value) }}
            />
          </Col>
        </Row>
        <Row>
          <Col md='12' className='mb-1'>
            <Label className='form-label' for={`group`}>
              Description
            </Label>
            <Input type='textarea' row="3" name='group_description' id='group_description' placeholder='Description' onChange={e => setdescription(e.target.value)}/>
          </Col>
        </Row>
        {stepperStatus ? (
            <div className='d-flex justify-content-between'>
            <Button color='primary' className='btn-prev' onClick={() => stepper.previous()}>
              <ArrowLeft size={14} className='align-middle me-sm-25 me-0'></ArrowLeft>
              <span className='align-middle d-sm-inline-block d-none'>Previous</span>
            </Button>
            <div className='d-flex'>
                <Button color='success' className='btn-next me-1' onClick={onSubmit}>
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
              <div className='col-lg-12 '>
                <Button color='primary' className='btn-next me-1' onClick={onSubmit}>
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
GroupHeadAdd.defaultProps = {
  stepperStatus: true
}
export default GroupHeadAdd