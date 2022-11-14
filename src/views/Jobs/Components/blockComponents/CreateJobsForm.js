import { Fragment, useState, useEffect } from "react" 
// ** Icons Imports
import { Save} from "react-feather" 
// // ** Reactstrap Imports
import { Label, Row, Col, Input, Form, Button, Spinner } from "reactstrap" 
import Select from 'react-select'
import JobHelper from "../../../Helpers/JobHelper"
const JobsAddForm = ({ count }) => {
  const Job_Helper = JobHelper()
  const [formData] = useState({
    Staff_Classification:{},
    Department:{},
    Position:{},
    Job_Types:{},
    JD:{}
  })
  const [loading, setLoading] = useState(true)
  
  const fetchPreData = async () => {
    setLoading(true)
    await Job_Helper.fetchFormPreData().then(data => {
      console.warn(data)
      if (data) {
       formData.Staff_Classification = data.Staff_Classification
       formData.Department = data.Department
       formData.Position = data.Position
       formData.Job_Types = data.Job_Types
       formData.JD = data.JD
      }
      return formData
    })
    setTimeout(() => {
      setLoading(false)
    }, 1000)
    
  }
  useEffect(() => {
    if (count !== 0) {
       fetchPreData()
    } else {
        fetchPreData()
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
            <Col md='4' className='mb-1'>
              <Label className='form-label'>
                Departments
              </Label>
              {!loading ? (
                  <Select
                  theme={formData.Department}
                    isClearable={false}
                    id='dep-type'
                    name='dep-type'
                    className='react-select'
                    classNamePrefix='select'
                    options={formData.Department}
                    defaultValue={formData.Department[0]}
                  //   onChange={type => { setType(type.value) }}
                  />
              ) : ( 
                  <Spinner />
              )}
              
            </Col>
            <Col md='4' className='mb-1'>
              <Label className='form-label'>
                Staff Classifications
              </Label>
              {!loading ? (
                  <Select
                  theme={formData.Staff_Classification}
                    isClearable={false}
                    id='staff-type'
                    name='staff-type'
                    className='react-select'
                    classNamePrefix='select'
                    options={formData.Staff_Classification}
                    defaultValue={formData.Staff_Classification[0]}
                  //   onChange={type => { setType(type.value) }}
                  />
              ) : ( 
                  <Spinner />
              )}
              
            </Col>
            <Col md='4' className='mb-1'>
              <Label className='form-label'>
                Positions
              </Label>
              {formData.Position ? (
                  !loading ? (
                    <Select
                  theme={formData.Position}
                    isClearable={false}
                    id='job-Pos'
                    name='job-Pos'
                    className='react-select'
                    classNamePrefix='select'
                    options={formData.Position}
                    defaultValue={formData.Position[0]}
                  //   onChange={type => { setType(type.value) }}
                  />
                  ) : <Spinner />
                  
                ) : (
                  <p>No Positions Available</p>
                )}
              
            </Col>
            <Col md='4' className='mb-1'>
              <label className='form-label'>
                Job Type
              </label>
              {formData.Job_Types ? (
                  !loading ? (
                    <Select
                  theme={formData.Job_Types}
                    isClearable={false}
                    id='job-Pos'
                    name='job-Pos'
                    className='react-select'
                    classNamePrefix='select'
                    options={formData.Job_Types}
                    defaultValue={formData.Job_Types[0]}
                  //   onChange={type => { setType(type.value) }}
                  />
                  ) : <Spinner />
                  
                ) : (
                  <p>No Positions Available</p>
                )}
            </Col>
            <Col md='4' className='mb-1'>
              <label className='form-label'>
                Job Title
              </label>
                <Input
                  id="job-title"
                  name="job-title"
                  className="job-title"
                  placeholder="Title"
                />
            </Col>
            <Col md='4' className='mb-1'>
            <label className='form-label'>
                Salary Range
              </label>
                <div className="d-flex">
                  <Col md='4' className="mb-1 mr-1">
                      <Input
                        id="salary-range-min"
                        type="number"
                        name="salary-range-min"
                        className="salary-range-min"
                        placeholder="Min Salary Range"
                      />
                  </Col>
                  <Col md='4' className="mb-1">
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
                {formData.JD ? (
                  !loading ? (
                    <Select
                  theme={formData.JD}
                    isClearable={false}
                    id='job-JD'
                    name='job-JD'
                    className='react-select'
                    classNamePrefix='select'
                    options={formData.JD}
                    defaultValue={formData.JD[0]}
                  //   onChange={type => { setType(type.value) }}
                  />
                  ) : <Spinner />
                  
                ) : (
                  <p>No JD Available</p>
                )}
                
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