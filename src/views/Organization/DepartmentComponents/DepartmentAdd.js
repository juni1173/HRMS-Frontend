import { Fragment, useState } from "react" 
// ** Icons Imports
import { ArrowLeft, Save, Check, X } from "react-feather" 
// ** Reactstrap Imports
import { Label, Row, Col, Input, Form, Button, Spinner } from "reactstrap" 
import Select from 'react-select'
import { toast, Slide } from 'react-toastify'
import Avatar from '@components/avatar'
import { selectThemeColors } from '@utils'
const DepartmentAdd = ({ stepper, groupHeadActive, stepperStatus, gHeadLoading, fetchDepartments, fetchDepCallBack }) => {
    
      const [gHeadID, setGHeadID] = useState(null)
      const [dep_title, setDepTitle] = useState(null)
      const [dep_status, setDepStatus] = useState(0)
      const [dep_description, setDepDescription] = useState(null)
     
      const depStatus = [
        { value: '0', label: 'Inactive' },
        { value: '1', label: 'Active' }
      ]
    //   const organization = JSON.parse(localStorage.getItem('organization'))
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
        if ((gHeadID !== undefined || groupHeadActive[0].value !== null) && dep_title !== undefined) {
          const formData = new FormData()
          
          formData['grouphead'] = !gHeadID ? groupHeadActive[0].value : gHeadID
          formData['title'] = dep_title
          formData['status'] = dep_status
          formData['description'] = dep_description
      
          console.warn(formData)
          // ** Api Post Request
      
          fetch('http://127.0.0.1:8000/api/organization/department/', {
            method: "POST",
            headers: { "Content-Type": "Application/json", Authorization: token },
            body: JSON.stringify(formData)
          })
          .then((response) => response.json())
          .then((result) => {
            if (result.status === 200) {
              toast.success(
                <ToastContent type='success' message={result.message} />,
                { icon: false, transition: Slide, hideProgressBar: true, autoClose: 2000 }
              )
              fetchDepartments()
              console.warn(typeof fetchDepCallBack)
              if (typeof fetchDepCallBack !== "undefined") { 
                fetchDepCallBack()
              }
              
            } else {
              toast.error(
                <ToastContent type='error' message={result.message} />,
                { icon: false, transition: Slide, hideProgressBar: true, autoClose: 2000 }
              )
            }
            
            // stepper.next()
          })
          .catch((error) => {
            console.error(error)
            toast.error(
              <ToastContent type='error' message="Not getting data" />,
              { icon: false, transition: Slide, hideProgressBar: true, autoClose: 2000 }
            )
      
            
          }) 
          
        } else {
          toast.error(
            <ToastContent type='error' message="Not Valid Information Please Try Agian!" />,
            { icon: false, transition: Slide, hideProgressBar: true, autoClose: 2000 }
          )
        }
      }
return (
    <Fragment>
       <div className='content-header'>
        <h5 className='mb-0'>Departments Info</h5>
        <small>Add Departments Info.</small>
      </div>
      <Form onSubmit={e => e.preventDefault()}>
        <Row>
        <Col md='3' className='mb-1'>
            {!gHeadLoading ? ( 
              <>
              <Label className='form-label' for={`country`}>
                Group Head
              </Label>
              <Select
                isClearable={false}
                id={`grouphead`}
                className='react-select'
                classNamePrefix='select'
                options={groupHeadActive}
                defaultValue={groupHeadActive[0]}
                onChange={ ghead => setGHeadID(ghead.value)}
              />
            </>
            ) : (
              <Spinner />
            )
            
            } 
          </Col>
          <Col md='6' className='mb-1'>
            <Label className='form-label' for={`department`}>
              Title
            </Label>
            <Input type='text' id={`department-title`} name='department-title' placeholder='Add Title' onChange={e => setDepTitle(e.target.value)}/>
          </Col>
          <Col md='3' className='mb-1'>
            <Label className='form-label' for={`status`}>
              Status
            </Label>
            <Select
            theme={selectThemeColors}
            isClearable={false}
            id="dep-status"
            className='react-select'
            classNamePrefix='select'
            options={depStatus}
            defaultValue={depStatus[0]}
            onChange={status => setDepStatus(status.value)}
            >  
            </Select>
          </Col>
        </Row>
        <Row>
          <Col md='12' className='mb-1'>
            <Label className='form-label' for={`dep-description`}>
              Description
            </Label>
            <Input
            type='textarea'
            row='3'
            id='dep-description'
            name='dep-description'
            onChange={e => setDepDescription(e.target.value)}
            />
          </Col>
        </Row>
        {stepperStatus ? (
          <div className='d-flex justify-content-between'>
          <Button color='primary' className='btn-prev' onClick={() => stepper.previous()}>
            <ArrowLeft size={14} className='align-middle me-sm-25 me-0'></ArrowLeft>
            <span className='align-middle d-sm-inline-block d-none'>Previous</span>
          </Button>
          <Button color='success' className='btn-next' onClick={saveData}>
            <span className='align-middle d-sm-inline-block d-none'>Save</span>
            <Save size={14} className='align-middle ms-sm-25 ms-0'></Save>
          </Button>
        </div>
        ) : (
            <div className='row float-right'>
              <div className='col-lg-12'>
              <Button color='primary' className='btn-next' onClick={saveData}>
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
DepartmentAdd.defaultProps = {
  stepperStatus: true,
  gHeadLoading: true
}
export default DepartmentAdd