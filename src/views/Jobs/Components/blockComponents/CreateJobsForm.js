import { Fragment, useState, useEffect } from "react" 
// ** Icons Imports
import { Save} from "react-feather" 
// // ** Reactstrap Imports
import { Label, Row, Col, Input, Form, Button, Spinner } from "reactstrap" 
import Select from 'react-select'
// import { toast, Slide } from 'react-toastify'
import apiHelper from "../../../Helpers/ApiHelper"
import DepartmentsHelper from "../../../Helpers/DepartmentsHelper"
import staffClassificationsHelper from "../../../Helpers/StaffClassificationHelper"
import CustomHelper from "../../../Helpers/customHelper"
import { Redirect } from "react-router-dom"
const JobsAddForm = ({ count }) => {
  const Api = apiHelper()
  const Department = DepartmentsHelper()
  const StaffClassification = staffClassificationsHelper()
  const [depActive] = useState([])
  const [depNotActive] = useState([])
  const [staffActive] = useState([])
  const [staffNotActive] = useState([])
  const [loading, setLoading] = useState(true)
  
  const fetchDepartments = (depData) => {
    setLoading(true)
      if (depData.dep.length > 0) {
        
        depActive.splice(0, depActive.length)
        depNotActive.splice(0, depNotActive.length)
        for (let i = 0; i < depData.dep.length; i++) {
          if (depData.dep[i].is_active) {
              // console.warn(i)
              depActive.push({value: depData.dep[i].id, label: depData.dep[i].title})
          } else {
              // console.warn(i)
              depNotActive.push({value: depData.dep[i].id, label: depData.dep[i].title})
          }
        }  
        setLoading(false)
      }
  }
  const fetchStaffClassifications = (staffData) => {
      setLoading(true)
        if (staffData.staff.length > 0) {
          setLoading(true)
          staffActive.splice(0, staffActive.length)
          staffNotActive.splice(0, staffNotActive.length)
          if (Object.values(staffData.staff).length > 0) {
              for (let i = 0; i < staffData.staff.length; i++) {
                  if (staffData.staff[i].is_active) {
                    staffActive.push({value: staffData.staff[i].id, label: staffData.staff[i].title})
                  } else {
                    staffNotActive.push({value: staffData.staff[i].id, label: staffData.staff[i].title})
                  }
                }  
                setLoading(false)
          }
          
        } else {
          <Redirect to={login} />
        }
  }
  const dep = () => {
      Department.fetchDepartments()
      .then(depData => {
        fetchDepartments(depData)
      })
  }
  const staffClassification = () => {
    StaffClassification.fetchstaffClassifications()
    .then(staffData => {
      fetchStaffClassifications(staffData)
    })
}
  useEffect(() => {
    if (count !== 0) {
        dep()
        staffClassification()
    } else {
        dep()
        staffClassification()
    }
  }, [])
  const onSubmit = async () => {
      // const formData = new FormData()
      alert('submitted')
      // if (title.length > 0) {
      //   formData['title'] =  title
      //   formData['grouphead_type'] = !group_type ? groupType[0].value : group_type
      //   formData['is_status'] =  !group_status ? groupStatus[0].value : group_status
      //   formData['description'] = group_description
      //   formData['organization_id'] = organization.id

      //   // console.warn(formData)
      //   // ** Api Post Request

      //   fetch('http://127.0.0.1:8000/api/grouphead/', {
      //     method: "POST",
      //     headers: { "Content-Type": "Application/json", Authorization: token },
      //     body: JSON.stringify(formData)
      //   })
      //   .then((response) => response.json())
      //   .then((result) => {
      //     // const data = {status:result.status, result_data:result.data, message: result.message }
      //     if (result.status === 201) {
      //       toast.success(
      //         <ToastContent type='success' message={result.message} />,
      //         { icon: false, transition: Slide, hideProgressBar: true, autoClose: 2000 }
      //       )
      //       GroupHeadCallBack()
      //       if (typeof fetchGroupHeads !== "undefined") { 
      //         fetchGroupHeads() 
      //       }
            
      //     } else {
      //       toast.error(
      //         <ToastContent type='error' message={result.message} />,
      //         { icon: false, transition: Slide, hideProgressBar: true, autoClose: 2000 }
      //       )
      //     }
      //   })
      //   .catch((error) => {
          
      //     console.log(error)
      //     toast.error(
      //       <ToastContent type='error' message={error} />,
      //       { icon: false, transition: Slide, hideProgressBar: true, autoClose: 2000 }
      //     )
      //   }) 
        
      // } else {
      //   toast.error(
      //     <ToastContent type='error' message='Title is required' />,
      //     { icon: false, transition: Slide, hideProgressBar: true, autoClose: 2000 }
      //   )
      // }
    }
  return (
      <Fragment>
        <div className='content-header' >
          <h5 className='mb-2'>Add Job</h5>
          {/* <small>Add Job.</small> */}
        </div>
        <Form onSubmit={e => e.preventDefault()}  id="create-job-form">
          <Row>
            <Col md='6' className='mb-1'>
              <Label className='form-label'>
                Departments
              </Label>
              {!loading ? (
                  <Select
                  theme={depActive}
                    isClearable={false}
                    id='dep-type'
                    name='dep-type'
                    className='react-select'
                    classNamePrefix='select'
                    options={depActive}
                    defaultValue={depActive[0]}
                  //   onChange={type => { setType(type.value) }}
                  />
              ) : ( 
                  <Spinner />
              )}
              
            </Col>
            <Col md='6' className='mb-1'>
              <Label className='form-label'>
                Staff Classifications
              </Label>
              {!loading ? (
                  <Select
                  theme={staffActive}
                    isClearable={false}
                    id='staff-type'
                    name='staff-type'
                    className='react-select'
                    classNamePrefix='select'
                    options={staffActive}
                    defaultValue={staffActive[0]}
                  //   onChange={type => { setType(type.value) }}
                  />
              ) : ( 
                  <Spinner />
              )}
              
            </Col>
            <Col md='6' className='mb-1'>
              <label className='form-label'>
                Position Title
              </label>
                <Input
                  id="position-title"
                  name="position-title"
                  className="position-title"
                  placeholder="Position Title"
                />
            </Col>
            <Col md='6' className='mb-1'>
            <label className='form-label'>
                Salary Range
              </label>
                <div className="d-flex">
                  <Col md='3' className="mb-1 mr-1">
                      <Input
                        id="salary-range-min"
                        type="number"
                        name="salary-range-min"
                        className="salary-range-min"
                        placeholder="Min Salary Range"
                      />
                  </Col>
                  <Col md='3' className="mb-1">
                      <Input
                        id="salary-range-max"
                        type="number"
                        name="salary-range-max"
                        className="salary-range-max"
                        placeholder="Max Salary Range"
                      />
                  </Col>
                </div>
              </Col>
              <Col md='6' className='mb-1'>
                <label className='form-label'>
                  No of Individual Required
                </label>
                  <Input
                    id="individual-required"
                    name="individual-required"
                    className="individual-required"
                    placeholder="No of Individual Required"
                  />
              </Col>
              <Col md='6' className='mb-1'>
                <label className='form-label'>
                  Job Description
                </label>
                  <Input
                    id="individujob-descriptional"
                    name="job-description"
                    className="job-description"
                    placeholder="Job Description "
                  />
              </Col>
              
              <div className='row float-right'>
                <div className='col-lg-12 '>
                  <Button color='primary' className='btn-next me-1' onClick={onSubmit}>
                    <span className='align-middle d-sm-inline-block d-none'>Save</span>
                    <Save size={14} className='align-middle ms-sm-25 ms-0'></Save>
                  </Button>
                </div>
              </div>
          </Row>
          
          
        </Form>
      </Fragment>
  )
}
JobsAddForm.defaultProps = {
    count: 1
}

export default JobsAddForm