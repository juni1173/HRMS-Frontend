import {Fragment, useState, useEffect} from "react" 
import {Label, Row, Col, Input, Form, Badge } from "reactstrap" 
import Select from 'react-select'
import apiHelper from "../../../Helpers/ApiHelper"
import { useForm, Controller } from 'react-hook-form'
import Flatpickr from 'react-flatpickr'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import EmployeeHelper from "../../../Helpers/EmployeeHelper"
const UpdateOfficeDetail = ({ CallBack, empData}) => {
     console.warn(empData)
      const employee_status = [
        {value: 1, label: 'Active'},
        {value: 2, label: 'Not-Active'}
      ]
      
    const Api = apiHelper()
    const Emp_Helper = EmployeeHelper()
    const [departmentType, setDepartmentType] = useState()
    const [staffClassification, setStaffClassification] = useState('')
    const [position, setPosition] = useState('')
    const [empType, setEmpType] = useState('')

    const defaultValues = {
        moduleName : 'officeDetail',
        department : empData.department_title ? {value: empData.department, label: empData.department_title} : '',
        employee_type : empData.employee_type ? empData.employee_type : '',
        position: empData.position_title ? {value: empData.position, label: empData.position_title} : '',
        code : empData.code ? empData.code : '',
        joining_date : empData.joining_date ? empData.joining_date : '',
        leaving_date : empData.leaving_date ? empData.leaving_date : '',
        starting_salary : empData.starting_salary ? empData.starting_salary : 0,
        current_salary : empData.current_salary ? empData.current_salary : '',
        skype : empData.skype ? empData.skype : '',
        title : empData.title ? empData.title : '',
        staff_classification : empData.staff_classification_title ? {value: empData.staff_classification, label: empData.staff_classification_title} : '',
        username : empData.username ? empData.username : '',
        status : employee_status[0],
        hiring_comment : empData.hiring_comment ? empData.hiring_comment : '',
        leaving_reason : empData.leaving_reason ? empData.leaving_reason : ''
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

    const onSubmitHandler = (data) => {
        if (data.code !== '') {
            const emp_joining_date = Api.formatDate(data.joining_date)
            const emp_leaving_date =  Api.formatDate(data.leaving_date)
            const uuid = empData.uuid
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
           
            Api.jsonPatch(`/employees/${uuid}/`, formData)
            .then((result) => { 
              if (result) {
                if (result.status === 200) {
                  Api.Toast('success', result.message)
                  CallBack()
                } else {
                  Api.Toast('error', result.message)
                }
              } else {
                Api.Toast('error', 'Server not responding...')
              }
            })
        } else {
          Api.Toast('error', "FIll The * Required Field")
        }
      
    }

    return (
       <Fragment>
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
                          defaultValue={defaultValues.department}
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
                          defaultValue={defaultValues.title}
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
                          defaultValue={defaultValues.position}
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
                          defaultValue={defaultValues.staff_classification}
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
                          defaultValue={defaultValues.hiring_comment}
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
                          defaultValue={defaultValues.employee_type}
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
                          defaultValue={defaultValues.leaving_reason}
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
                    <button className="btn-next float-right btn btn-warning"><span className="align-middle d-sm-inline-block d-none">Update</span></button>
                    </Col>
                </Row>
                    
            </Form>
       </Fragment>
    )
}
export default UpdateOfficeDetail