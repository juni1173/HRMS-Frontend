import { Fragment, useState, useEffect } from "react" 
// ** Icons Imports
import { Save} from "react-feather" 
// // ** Reactstrap Imports
import { Label, Row, Col, Input, Form, Button, Spinner } from "reactstrap" 
import Select from 'react-select'
import JobHelper from "../../../Helpers/JobHelper"
import apiHelper from "../../../Helpers/ApiHelper"

const UpdateJobList = ({ CallBack, data }) => {
  console.warn(data)
  const Job_Helper = JobHelper()
  const Api = apiHelper()

  const [departmentType, setDepartmentType] = useState(data.department)
  const [staffClassification, setStaffClassification] = useState(data.staff_classification)
  const [position, setPosition] = useState(data.position)
  const [jobType, setJobType] = useState(data.job_type)
  const [jobTitle, setJobTitle] = useState(data.title)
  const [minSalary, setMinSalary] = useState('')
  const [maxSalary, setMaxSalary] = useState('')
  const [jobCode, setJobCode] = useState(data.job_post_code)
  const [individualNo, setIndividualNo] = useState(data.no_of_individuals)
  const [jobDescription, setJobDescription] = useState(data.jd_selection)
  const [job_post_id] = useState(data.job_post_id)

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
    
       fetchPreData()
    
  }, [])

  const onChangeDepartmentHandler = (event) => {
    
      setDepartmentType(event.value)
  }
  const onChangeStaffHandler = (event) => {
       setStaffClassification(event.value)
  }
  const onChangePositionHandler = (event) => {
    setPosition(event.value)
  }
  const onChangeJobTypeHandler = (event) => {
    setJobType(event.value)
  }
  const onChangeTitleHandler = (event) => {
    setJobTitle(event.target.value)
  }
  const onChangeMinSalaryHandler = (event) => {
    setMinSalary(event.target.value)
  }
  const onChangeMaxSalaryHandler = (event) => {
    setMaxSalary(event.target.value)
  }
  const onChangeJobCodeHandler = (event) => {
    setJobCode(event.target.value)
  }
  const onChangeIndividualHandler = (event) => {
    setIndividualNo(event.target.value)
  }
  const onChangeJobDescroptionHandler = (event) => {
    setJobDescription(event.value)
  }
  const onSubmit = async () => {
      
    if (departmentType !== '' && staffClassification !== '' && position !== '' && jobType !== '' && jobTitle !== '' && jobCode !== '' && jobDescription !== '') {
           
            const formInput = new FormData()
            formInput['department'] = departmentType
            formInput['position'] = position
            formInput['title'] = jobTitle
            formInput['staff_classification'] = staffClassification
            // formInput['maximumSalary'] = parseInt(maxSalary)
            formInput['no_of_individuals'] = parseInt(individualNo)
            formInput['job_code'] = parseInt(jobCode)
            formInput['jd_selection'] = jobDescription
            formInput['job_type'] = jobType
            formInput['job_post_id'] = job_post_id
            // formInput['minimumSalary'] = parseInt(minSalary)

            console.warn(`formData ${JSON.stringify(formInput)}`)
            const url = `${process.env.REACT_APP_API_URL}/jobs/${data.job_uuid}/`
          fetch(url, {
            method: "Patch",
            headers:{'Content-Type': 'application/json', Authorization: Api.token},
            body:JSON.stringify(formInput)
            })
          .then((response) => response.json())
          .then((result) => {
              console.log(result)
              if (result.status === 200) {
                  Api.Toast('success', result.message)
                  CallBack()
                  } else {
                      Api.Toast('error', result.message)
                  }
          })
       
    } else {
      console.log(minSalary)
      console.log(maxSalary)
      Api.Toast('error',   "Please fill all required fields with *")
    }
    
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
                Departments<span className="required">*</span>
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
                    defaultValue={formData.Department.find(pre => pre.value === data.department[0]) ? formData.Department.find(pre => pre.value === data.department[0]) : formData.Department[0] }
                    onChange={onChangeDepartmentHandler}
                  />
              ) : ( 
                  <Spinner />
              )}
              
            </Col>
            <Col md='4' className='mb-1'>
              <Label className='form-label'>
                Staff Classifications<span className="required">*</span>
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
                    defaultValue={formData.Staff_Classification.find(pre => pre.value === data.staff_classification[0]) ? formData.Staff_Classification.find(pre => pre.value === data.staff_classification[0]) : formData.Staff_Classification[0]}
                    onChange={onChangeStaffHandler}
                  />
              ) : ( 
                  <Spinner />
              )}
              
            </Col>
            <Col md='4' className='mb-1'>
              <Label className='form-label'>
                Positions<span className="required">*</span>
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
                    defaultValue={formData.Position.find(pre => pre.value === data.position[0]) ? formData.Position.find(pre => pre.value === data.position[0]) : formData.Position[0]}
                    onChange={onChangePositionHandler}
                  />
                  ) : <Spinner />
                  
                ) : (
                  <p>No Positions Available</p>
                )}
              
            </Col>
            <Col md='4' className='mb-1'>
              <label className='form-label'>
                Job Type<span className="required">*</span>
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
                    defaultValue={formData.Job_Types.find(pre => pre.value === data.job_type) ? formData.Job_Types.find(pre => pre.value === data.job_type) : formData.Job_Types[0]}
                    onChange={onChangeJobTypeHandler}
                  />
                  ) : <Spinner />
                  
                ) : (
                  <p>No Positions Available</p>
                )}
            </Col>
            <Col md='4' className='mb-1'>
              <label className='form-label'>
                Job Title<span className="required">*</span>
              </label>
                <Input
                  id="job-title"
                  name="job-title"
                  className="job-title"
                  placeholder="Title"
                  defaultValue={data.title}
                  onChange={onChangeTitleHandler}
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
                        onChange={onChangeMinSalaryHandler}
                      />
                  </Col>
                  <Col md='4' className="mb-1">
                      <Input
                        id="salary-range-max"
                        type="number"
                        name="salary-range-max"
                        className="salary-range-max"
                        placeholder="Max Salary Range"
                        onChange={onChangeMaxSalaryHandler}
                      />
                  </Col>
                </div>
              </Col>
              <Col md='4' className='mb-1'>
                <label className='form-label'>
                  Job Code<span className="required">*</span>
                </label>
                  <Input
                    id="jobCode"
                    type="number"
                    name="jobCode"
                    className="job_code"
                    placeholder="Job Code"
                    defaultValue={data.job_post_code}
                    onChange={onChangeJobCodeHandler}
                  />
              </Col>
              <Col md='4' className='mb-1'>
                <label className='form-label'>
                  No of Individual Required
                </label>
                  <Input
                    id="individual-required"
                    name="individual-required"
                    className="individual-required"
                    placeholder="No of Individual Required"
                    defaultValue={data.no_of_individuals}
                    onChange={onChangeIndividualHandler}
                  />
              </Col>
              <Col md='4' className='mb-1'>
                <label className='form-label'>
                  Job Description<span className="required">*</span>
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
                    defaultValue={formData.JD.find(pre => pre.value === data.jd_selection) ? formData.JD.find(pre => pre.value === data.jd_selection) : formData.JD[0]}
                    onChange={onChangeJobDescroptionHandler}
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

export default UpdateJobList