import { Fragment, useState } from "react" 
// ** Icons Imports
import { Redirect } from "react-router-dom"
import { ArrowLeft, Save} from "react-feather" 
// ** Reactstrap Imports
import { Label, Row, Col, Input, Form, Button, Spinner } from "reactstrap" 
import Select from 'react-select'
import apiHelper from "../../Helpers/ApiHelper"
const DepartmentAdd = ({ stepper, groupHeadActive, stepperStatus, gHeadLoading, fetchDepartments, fetchDepCallBack }) => {
      const Api = apiHelper()
      const [gHeadID, setGHeadID] = useState('')
      const [dep_title, setDepTitle] = useState('')
      const [dep_description, setDepDescription] = useState('')

    function saveData() {
        if ((gHeadID !== '') && dep_title !== '') {
          const formData = new FormData()
          
          formData['grouphead'] = gHeadID
          formData['title'] = dep_title
          if (dep_description !== '') formData['description'] = dep_description
          
          // ** Api Post Request
      
          Api.jsonPost(`/organization/department/`, formData)
          .then((result) => {
            if (result.status === 200) {
              Api.Toast('success', result.message)
              fetchDepartments()
              if (typeof fetchDepCallBack !== "undefined") { 
                fetchDepCallBack()
              }
              //  window.location.href = "/"
              
            } else {
              Api.Toast('error', result.message)
            }
            
            // stepper.next()
          })
          
        } else {
          Api.Toast('error', 'Please fill all required fields')
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
        <Col md='6' className='mb-1'>
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
          {/* <Col md='3' className='mb-1'>
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
          </Col> */}
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
            <span className='align-middle d-sm-inline-block d-none'>Save & Done</span>
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