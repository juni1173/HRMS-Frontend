import {Fragment, useState, useEffect} from "react" 
import {Label, Row, Col, Input, Form, Badge, Spinner, Card, CardBody, CardTitle } from "reactstrap" 
import Select from 'react-select'
import apiHelper from "../../../Helpers/ApiHelper"
import { useForm, Controller } from 'react-hook-form'
import Flatpickr from 'react-flatpickr'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import EmployeeHelper from "../../../Helpers/EmployeeHelper"
const OfficeDetail = ({emp_state}) => {
    
      const employee_status = [
        {value: 1, label: 'Active'},
        {value: 2, label: 'Not-Active'}
      ]
      
    const Api = apiHelper()
    const Emp_Helper = EmployeeHelper()
    const [loading, setLoading] = useState(false)
    const [departmentType, setDepartmentType] = useState()
    const [staffClassification, setStaffClassification] = useState('')
    const [position, setPosition] = useState('')
    const [empType, setEmpType] = useState('')
    const [data, setData] = useState([])
    const defaultValues = {
        moduleName : 'officeDetail',
        department : '',
        employee_type : '',
        code : '',
        joining_date : '',
        leaving_date : '',
        starting_salary : 0,
        current_salary : '',
        skype : '',
        title : '',
        staff_classification : '',
        username : '',
        status : employee_status[0],
        hiring_comment : '',
        leaving_reason : ''
    }
    

    const [formData] = useState({
        Staff_Classification:{},
        Department:{},
        Position:{},
        Job_Types:{},
        JD:{}
      })
    const fetchPreData = async () => {
        // setLoading(true)
        await Emp_Helper.fetchFormPreData().then(data => {
          if (data) {
           formData.Staff_Classification = data.Staff_Classification
           formData.Department = data.Department
           formData.Position = data.Position
           formData.emp_types = data.Emp_types
           formData.JD = data.JD
           setDepartmentType(formData.Department)
           setStaffClassification(formData.Staff_Classification)
           setPosition(formData.Position)
           setEmpType(formData.emp_types)
            
          }
          return formData
        })
        // setTimeout(() => {
        //   setLoading(false)
        // }, 1000)
        
    }
    
    useEffect(() => {
         
        fetchPreData()
        
    }, [])


    const {
        control,
        handleSubmit
      } = useForm({
        defaultValues
      })

    const onSubmitHandler = async (data) => {
      setLoading(true)
        if (data.code !== '') {
            const emp_joining_date = Api.formatDate(data.joining_date)
            const emp_leaving_date =  Api.formatDate(data.leaving_date)
            const uuid = emp_state['emp_data'].uuid
            const emp_code = `emp_${data.code}`
            const formData = new FormData()
            formData["organization"] = Api.org.id
            formData["department"] = data.department.value
            formData["employee_type"]  = data.employee_type.value
            formData["position"] = data.position.value
            formData["starting_salary"] = data.starting_salary !== 0 ? data.starting_salary : 0
            formData["code"] = emp_code
            formData["joining_date"] = emp_joining_date
            formData["leaving_date"] = emp_leaving_date
            formData["current_salary"] = data.current_salary
            formData["hiring_comment"] = data.hiring_comment
            formData["skype"] =  data.skype
            formData["staff_classification"] = data.staff_classification.value
            formData["username"] =  data.username
            formData["title"] = data.title
            formData["leaving_reason"] = data.leaving_reason
            formData["status"] =  data.status.value

           await Api.jsonPatch(`/employees/${uuid}/`, formData)
            .then((result) => { 
              if (result) {
                if (result.status === 200) {
                  Api.Toast('success', result.message)
                  setData(result.data.emp_data)
                } else {
                  Api.Toast('error', result.message)
                }
              } else {
                Api.Toast('error', 'Server not responding...')
              }
               
            })
        } else {
          Api.Toast('error', "Fill The * Required Field")
        }
      setTimeout(() => {
        setLoading(false)
      }, 1000)
    }

    return (
       <Fragment>
            {!loading ? (
            Object.values(data).length > 0 ? (
            <>
            <Card>
            <CardTitle>
                        <div className="row bg-blue">
                            <div className="col-lg-4 col-md-4 col-sm-4"></div>
                            <div className='col-lg-4 col-md-4 col-sm-4'>
                                <h4 color='white' className="text-center">Office Detail</h4>
                            </div>
                            <div className="col-lg-4 col-md-4 col-sm-4">
                               
                            </div>
                        </div>
            </CardTitle>
                <CardBody>
                    
                        <div className="row my-1">
                            <div className='col-lg-6 col-md-6 col-sm-6'>
                                <p className='label'>Employment type: &nbsp;  &nbsp;<strong>{data.employee_type_title ? data.employee_type_title : 'N/A'}</strong></p>
                                <p className='label'>Staff Classification: &nbsp;  &nbsp; <strong>{data.staff_classification_title ? data.staff_classification_title : 'N/A'}</strong></p>
                                <p className='label'>Department: &nbsp;  &nbsp; <strong>{data.department_title ? data.department_title : 'N/A'}</strong></p>
                                <p className='label'>Position: &nbsp;  &nbsp; <strong>{data.position_title ? data.position_title : 'N/A'}</strong></p>
                                <p className='label'>Official Email: &nbsp;  &nbsp; <strong>{data.email ? data.email : 'N/A'}</strong></p>
                                <p className='label'>Leaving Reason: &nbsp;  &nbsp; <strong>{data.leaving_reason ? data.leaving_reason : 'N/A'}</strong></p>
                        </div>
                            <div className='col-lg-6 col-md-6 col-sm-6'>
                                <p className='label'>Official Skype: &nbsp;  &nbsp; <strong>{data.skype ? data.skype : 'N/A'}</strong></p>
                                <p className='label'>Joining Date: &nbsp;  &nbsp; <strong>{data.joining_date ? data.joining_date : 'N/A'}</strong></p>
                                <p className='label'>Hiring Comment: &nbsp;  &nbsp; <strong>{data.hiring_comment ? data.hiring_comment : 'N/A'} </strong></p>
                                <p className='label'>Leaving Date: &nbsp;  &nbsp;<strong>{data.leaving_date ? data.leaving_date : 'N/A'}</strong></p>
                                <p className='label'>Starting Salary: &nbsp;  &nbsp; <strong>{data.starting_salary ? data.starting_salary : 'N/A'}</strong></p>
                                <p className='label'>Current Salary: &nbsp;  &nbsp; <strong>{data.current_salary ? data.current_salary : 'N/A'}</strong></p>
                            </div>
                        </div>
                </CardBody>
                </Card>
            </>
            ) : (
              <Form onSubmit={handleSubmit(onSubmitHandler)}>
              <Row>
                  <Col md="4" className="mb-1">
                      <Label className="form-label">
                          Department
                      </Label>
                      <Controller
                        control={control}
                        id="department"
                        name="department"
                        defaultValue={defaultValues[0]}
                        render={({ field }) => (
                            <Select
                              isClearable={false}
                              className='react-select'
                              classNamePrefix='select'
                              options={departmentType}
                              {...field}
                            />
                        )}
                        />
                  </Col>
                  <Col md="4" className="mb-1">
                      <Label className="form-label">
                        Employee Code
                        </Label> <Badge color='light-danger'>*</Badge>
                        <Controller
                            control={control}
                            id="code"
                            name="code"
                            defaultValue={defaultValues.code}
                            render={({ field }) => (
                                <Input
                                type="text"
                                placeholder="Name"
                                {...field}
                                />
                            )}
                        />
                  </Col>
                  <Col md="4" className="mb-1">
                         <Label className="form-label">
                          Starting Salary
                      </Label>
                      <Controller
                        control={control}
                        id="starting_salary"
                        name="starting_salary"
                        defaultValue={defaultValues.starting_salary}
                        render={({ field }) => (
                            <Input
                            type="number"
                            placeholder="Starting Salary"
                            {...field}
                            />
                        )}
                        />
                  </Col>
                  <Col md="4" className="mb-1">
                         <Label className="form-label">
                      Job Title
                      </Label>
                      <Controller
                        control={control}
                        id="job_ttitle"
                        name="title"
                        defaultValue={defaultValues.job_ttitle}
                        render={({ field }) => (
                            <Input
                            type="text"
                            placeholder="job_title"
                            {...field}
                            />
                        )}
                        />
                  </Col>
                  <Col md="4" className="mb-1">
                         <Label className="form-label">
                      Employee Status
                      </Label>
                      <Controller
                        control={control}
                        id="status"
                        name="status"
                        defaultValue={employee_status[0]}
                        render={({ field }) => (
                            <Select
                              isClearable={false}
                              className='react-select'
                              classNamePrefix='select'
                              options={employee_status}
                              {...field}
                            />
                        )}
                        />
                  </Col>
                  <Col md="4" className="mb-1">
                      <Label className="form-label">
                          position
                      </Label>
                      <Controller
                        control={control}
                        id="position"
                        name="position"
                        defaultValue={position[0]}
                        render={({ field }) => (
                            <Select
                              isClearable={false}
                              className='react-select'
                              classNamePrefix='select'
                              options={position}
                              {...field}
                            />
                        )}
                        />
                    </Col>
                    <Col md="4" className="mb-1">
                        <Label className="form-label">
                          Joining Date
                      </Label>
                      <Controller
                        control={control}
                        id="joining_date"
                        name="joining_date"
                        defaultValue={defaultValues.joining_date}
                        render={({ field }) => (
                            <Flatpickr 
                            className='form-control'
                             id='default-picker'
                             options={{
                                altInput: true,
                                altFormat: 'F j, Y',
                                dateFormat: 'Y-m-d'
                              }}
                             {...field}
                              />

                        )}
                        />
                  </Col>
                  <Col md="4" className="mb-1">
                         <Label className="form-label">
                          Current Salary
                      </Label>
                      <Controller
                        control={control}
                        id="current_salary"
                        name="current_salary"
                        defaultValue={defaultValues.current_salary}
                        render={({ field }) => (
                            <Input
                            type="number"
                            placeholder="current Salary"
                            {...field}
                            />
                        )}
                        />
                  </Col>
                  <Col md="4" className="mb-1">
                          <Label className="form-label">
                      Staff Classification
                      </Label>
                      <Controller
                        control={control}
                        id="staff_classification"
                        name="staff_classification"
                        defaultValue={staffClassification[0]}
                        render={({ field }) => (
                            <Select
                              isClearable={false}
                              className='react-select'
                              classNamePrefix='select'
                              options={staffClassification}
                              {...field}
                            />
                        )}
                        />
                  </Col>
                  <Col md="4" className="mb-1">
                         <label htmlFor="company-vision" className="form-label form-label">Hiring Comment</label>
                      <Controller
                        control={control}
                        id="hiring_comment"
                        name="hiring_comment"
                        defaultValue={defaultValues.starting_salary}
                        render={({ field }) => (
                          <textarea row="3" placeholder="hiring comment" 
                         className="form-control"
                          {...field}
                          />
                        )}
                        />
                  </Col>
                  <Col md="4" className="mb-1">
                      <Label className="form-label">
                      Employee Type
                      </Label>
                      <Controller
                        control={control}
                        id="employee_type"
                        name="employee_type"
                        defaultValue={empType[0]}
                        render={({ field }) => (
                            <Select
                              isClearable={false}
                              className='react-select'
                              classNamePrefix='select'
                              options={empType}
                              {...field}
                            />
                        )}
                        />
                    </Col>
                    <Col md="4" className="mb-1">
                         <Label className="form-label">
                          Leaving Date
                      </Label>
                      <Controller
                        control={control}
                        id="leavng_date"
                        name="leaving_date"
                        defaultValue={defaultValues.joining_date}
                        render={({ field }) => (
                            <Flatpickr 
                            className='form-control'
                             id='default-picker'
                             options={{
                             
                                altInput: true,
                                altFormat: 'F j, Y',
                                dateFormat: 'Y-m-d'
                              }}
                             {...field}
                              />

                        )}
                        />
                    </Col>
                    <Col md="4" className="mb-1">
                        <Label className="form-label">
                      Skype ID
                      </Label>
                      <Controller
                        control={control}
                        id="skype"
                        name="skype"
                        defaultValue={defaultValues.skype}
                        render={({ field }) => (
                            <Input
                            type="text"
                            placeholder="Skype Id"
                            {...field}
                            />
                        )}
                        />
                    </Col>
                    <Col md="4" className="mb-1">
                    <Label className="form-label">
                      HRM UserName
                      </Label>
                      <Controller
                        control={control}
                        id="username"
                        name="username"
                        defaultValue={defaultValues.username}
                        render={({ field }) => (
                            <Input
                            type="text"
                            placeholder="username"
                            {...field}
                            />
                        )}
                        /> 
                    </Col>
                    <Col md="4" className="mb-1">
                        <label htmlFor="company-vision" className="form-label form-label">Leaving Reason</label>
                      <Controller
                        control={control}
                        id="leaving_reason"
                        name="leaving_reason"
                        defaultValue={defaultValues.starting_salary}
                        render={({ field }) => (
                          <textarea row="3" placeholder="leaving reasont" 
                         className="form-control"
                          {...field}
                          />
                        )}
                        />
                  </Col>
                 
              </Row>

              <Row>
                  <Col md="8" className="mb-1">

                  </Col>
                  <Col md="4" className="mb-1">
                  <button className="btn-next float-right btn btn-success"><span className="align-middle d-sm-inline-block d-none">Save</span></button>
                  </Col>
              </Row>
                  
              </Form>
            )
            
            ) : (
                <div className="text-center"><Spinner /></div>
            )}
        
          
       </Fragment>
    )
}
export default OfficeDetail