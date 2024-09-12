import {Fragment, useState} from "react" 
import {Label, Row, Col, Input, Form, Badge, Card, CardBody, CardHeader, CardFooter, CardTitle } from "reactstrap" 
import Select from 'react-select'
import { useForm, Controller } from 'react-hook-form'
import { XCircle, Check } from "react-feather"
import apiHelper from "../../../Helpers/ApiHelper"
import Flatpickr from 'react-flatpickr'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import InputMask from 'react-input-mask'
 
const PersonalDetail = ({state, CallBack, emp_state}) => {
      const [profileImage, setProfileImage] = useState(null)
     const BloodGrup = [
        {value: "A+", label: "A+"},
        {value: "A-", label: "A-"},
        {value: "B+", label: "B+"},
        {value: "B-", label: "B-"},
        {value: "AB+", label: "AB+"},
        {value: "AB-", label: "AB-"},
        {value: "O+", label: "O+"},
        {value: "O-", label: "O-"}
     ]
     const MeritalStatus = [
        {value: 1, label: "Not Married"},
        {value: 2, label: "Married"}
     ]
     const Gender = [
        {value: 1, label: "Male"},
        {value: 2, label: "Female"}
     ]

     const Api = apiHelper()
     const org_id = Api.org.id

     const defaultValues = {
        organization : org_id,
        first_name: '',
        last_name: '',
        father_name : '',
        profile_image: null,
        email : '',
        dob : '',
        cnic_no : '',
        blood_group : '',
        passport_no : '',
        date_of_expiry : '',
        gender : '',
        marital_status : ''
     }
   
   const {
    control,
    handleSubmit
  } = useForm({
    defaultValues
  })
  const renderUserImg = () => {
      return (
      
        <img
          height='110'
          width='110'
          alt='user-avatar'
          src={profileImage !== null ? URL.createObjectURL(profileImage) : null}
          className='img-fluid rounded mt-3 mb-2'
        />
      )
  }
    const onSubmitHandler = data => {
        const passport_expiry = data.date_of_expiry ? Api.formatDate(data.date_of_expiry) : ''
        const emp_dob =  data.dob ? Api.formatDate(data.dob) : ''
        if (data.cnic_no !== '' && data.first_name !== '' && data.last_name !== '' && data.email !== '') {
            const formData = new FormData()
            formData.append("organization", Api.org.id)
            formData.append("first_name", data.first_name)
            formData.append("last_name", data.last_name)
            if (data.gender !== '') formData.append("gender", data.gender ? data.gender.value : defaultValues.gender.value)
            formData.append("personal_email", data.email)
            formData.append("cnic_no", data.cnic_no)
            if (emp_dob !== '') formData.append("dob", emp_dob)
            if (data.father_name) formData.append("father_name", data.father_name)
            if (data.blood_group !== '') formData.append("blood_group", data.blood_group.value)
            if (data.passport_no) formData.append("passport_no", data.passport_no)
            if (passport_expiry !== '') formData.append("date_of_expiry", passport_expiry)
            if (data.marital_status !== '') formData.append("martial_status", data.martial_status.value)
            if (profileImage) formData.append("profile_image", profileImage ? profileImage : null)
            Api.jsonPost(`/employees/`, formData, false).then(result => {
                if (result.status === 200) {
                    Api.Toast('success', result.message)
                    CallBack(result.data)
                    // stepper.next()
                } else {
                    Api.Toast('error', result.message)
                }
            })  
            
        } else {
            Api.Toast('error', 'All * Fileds are required')
        }
    }

    return (
       <Fragment>
        {!state ? (
              <Form onSubmit={handleSubmit(onSubmitHandler)}>
              <Row>
                  <Col md="4" className="mb-1">
                  <Label className="form-label"  >
                      First Name <Badge color='light-danger'>*</Badge>
                  </Label>
                  <Controller
                  control={control}
                  id="first_name"
                  name="first_name"
                  defaultValue={defaultValues.first_name}
                  render={({ field }) => (
                      <Input
                      type="text"
                      placeholder="First Name"
                      {...field}
                      />
                  )}
                  />
                  </Col>
                  <Col md="4" className="mb-1">
                  <Label className="form-label"  >
                      Last Name <Badge color='light-danger'>*</Badge>
                  </Label>
                  <Controller
                  control={control}
                  id="last_name"
                  name="last_name"
                  defaultValue={defaultValues.last_name}
                  render={({ field }) => (
                      <Input
                      type="text"
                      placeholder="Last Name"
                      {...field}
                      />
                  )}
                  />
                  </Col>
                  
                  <Col md="4" className="mb-1">
                      <Label className="form-label">
                          Profile Pic
                      </Label>
                      {!profileImage ? (
                          <Input
                          type="file"
                          name="profile_image"
                          onChange={ (e) => { setProfileImage(e.target.files[0]) }}
                          placeholder=""
                          />
                      ) : (
                        <>
                          <img
                          src={URL.createObjectURL(profileImage)}
                          alt="Thumb"
                          width="50"
                          />
                          <XCircle color="red" onClick={() => setProfileImage(null)}/>
                        </>  
                      )}
                      
                  </Col>
              </Row>
              <Row className="mt-1">
              <Col md="4" className="mb-1">
                      <Label className="form-label">
                          Father Name
                      </Label>
                      <Controller
                          control={control}
                          id="father_name"
                          name="father_name"
                          defaultValue={defaultValues.father_name}
                          render={({ field }) => (
                              <Input
                              type="text"
                              placeholder="Father Name"
                              {...field}
                              />
                          )}
                          />
                    
                  </Col>
                  <Col md="4" className="mb-1">
                      <Label className="form-label">
                          Personal Email <Badge color='light-danger'>*</Badge>
                      </Label>
                      <Controller
                          control={control}
                          id="email"
                          name="email"
                          defaultValue={defaultValues.email}
                          render={({ field }) => (
                              <Input
                              type="email"
                              placeholder="email"
                              {...field}
                              />
                          )}
                          />
                  </Col>
                  <Col md="4" className="mb-1">
                      <Label className="form-label">
                          DOB
                      </Label>
                      <Controller
                          control={control}
                          id="dob"
                          name="dob"
                          render={({ field }) => (
                              <Flatpickr 
                              className='form-control'
                               id='default-picker'
                               placeholder="Date Of Birth"
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
                  
              </Row>
              <Row> 
                    <Col md="4" className="mb-1">
                      <Label className="form-label">
                      Cnic No <Badge color='light-danger'>*</Badge>
                      </Label>
                      <Controller
                          control={control}
                          id="cnic_no"
                          name="cnic_no"
                          defaultValue={defaultValues.cnic_no}
                          render={({ field }) => (
                            <InputMask className="form-control"
                            mask="99999-9999999-9" 
                            placeholder="cnic no"
                            {...field}
                             
                            />
                             
                          )}
                          />
                  </Col>
                  <Col md="4" className="mb-1">
                      <Label className="form-label">
                      Blood Group
                      </Label>
                      <Controller
                          control={control}
                          id="blood_group"
                          name="blood_group"
                          defaultValue={defaultValues.blood_group}
                          render={({ field }) => (
                              <Select 
                              options={BloodGrup}
                              {...field}
                              />
                          )}
                          />
                  </Col>
                  <Col md="4" className="mb-1">
                      <Label className="form-label">
                      Passport No
                      </Label>
                      <Controller
                          control={control}
                          id="passport_no"
                          name="passport_no"
                          defaultValue={defaultValues.passport_no}
                          render={({ field }) => (
                              <Input
                              type="text"
                              placeholder="passport"
                              {...field}
                              />
                          )}
                          />
                  </Col>
              </Row>
              <Row className="mt-1">
                    <Col md="4" className="mb-1">
                      <Label className="form-label">
                          Passport Expiry Date
                      </Label>
                      <Controller
                          control={control}
                          id="date_of_expiry"
                          name="date_of_expiry"
                          defaultValue={defaultValues.date_of_expiry}
                          render={({ field }) => (
                            <Flatpickr 
                            className='form-control'
                             id='default-picker'
                             placeholder="Passport Expiry Date"
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
                          Gender <Badge color='light-danger'>*</Badge>
                      </Label>
                      <Controller
                          control={control}
                          id="gender"
                          name="gender"
                          render={({ field }) => (
                              <Select
                                isClearable={false}
                                id='gender'
                                name='gender'
                                className='react-select'
                                classNamePrefix='select'
                                options={Gender}
                                {...field}
                              />
                          )}
                          />
                      
                  </Col>
                  <Col md="4" className="mb-1">
                      <Label className="form-label">
                      Marital Status
                      </Label>
                      <Controller
                          control={control}
                          id="martial_status"
                          name="martial_status"
                          render={({ field }) => (
                              <Select
                                isClearable={false}
                                className='react-select'
                                classNamePrefix='select'
                                options={MeritalStatus}
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
        ) : (
            Object.values(emp_state).length > 0 && (
                <>
                {/* <Row>
                    <div className="col-lg-12 col-md-12 col-sm-12 text-center mb-2">
                        <h2>Personal Details</h2>
                    </div>
                    <div className='col-lg-6 col-md-6 col-sm-6'>
                        <p className='label'>Name: &nbsp;  &nbsp;<strong>{emp_state['emp_data'].name ? emp_state['emp_data'].name : "N/A" }</strong></p>
                        <p className='label'>Email: &nbsp;  &nbsp;<strong>{emp_state['emp_data'].personal_email ? emp_state['emp_data'].personal_email : "N/A" }</strong></p>
                        <p className='label'>Blood Group: &nbsp;  &nbsp;<strong>{emp_state['emp_data'].blood_group ? emp_state['emp_data'].blood_group : "N/A" }</strong></p>
                        <p className='label'>Gender: &nbsp;  &nbsp;<strong>{emp_state['emp_data'].gender_type ? emp_state['emp_data'].gender_type : "N/A" }</strong></p>
                        <p className='label'>Marital Status : &nbsp;  &nbsp;<strong>{emp_state['emp_data'].marital_status_type ? emp_state['emp_data'].marital_status_type : "N/A" }</strong></p>
                    </div>
                    <div className='col-lg-6 col-md-6 col-sm-6'>
                        <p className='label'>Father Name: &nbsp;  &nbsp;<strong>{emp_state['emp_data'].father_name ? emp_state['emp_data'].father_name : "N/A" }</strong></p>
                        <p className='label'>Cnic: &nbsp;  &nbsp;<strong>{emp_state['emp_data']['cnic_data'][0] ? emp_state['emp_data']['cnic_data'][0].cnic : "N/A" }</strong></p>
                        <p className='label'>Date Of Birth: &nbsp;  &nbsp;<strong>{emp_state['emp_data'].dob ? emp_state['emp_data'].dob : "N/A" }</strong></p>
                        <p className='label'>Passport No: &nbsp;  &nbsp;<strong>{emp_state['emp_data']['passport_data'][0] ? emp_state['emp_data']['passport_data'][0].passport_no : "N/A" }</strong></p>
                        <p className='label'>Passport Expiry Date: &nbsp;  &nbsp;<strong>{emp_state['emp_data']['passport_data'][0] ? emp_state['emp_data']['passport_data'][0].date_of_expiry : "N/A" }</strong></p>
                    </div>
            </Row> */}
            <Fragment>
            <Card>
              <CardBody>
                <div className='user-avatar-section'>
                  <div className='d-flex align-items-center flex-column'>
                    {renderUserImg()}
                    <div className='d-flex flex-column align-items-center text-center'>
                      <div className='user-info'>
                        <h4>{emp_state['emp_data'].name ? emp_state['emp_data'].name : "N/A" }</h4>
                          <Badge color="secondary" className='text-capitalize'>
                           {emp_state['emp_data'].job_position_title ? emp_state['emp_data'].job_position_title : "N/A" }
                          </Badge>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='d-flex justify-content-around my-2 pt-75'>
                  <div className='d-flex align-items-start me-2'>
                    <Badge color='light-primary' className='rounded p-75'>
                      <Check className='font-medium-2' />
                    </Badge>
                    {/* <div className='ms-75'>
                      <h4 className='mb-0'>1.23k</h4>
                      <small>Tasks Done</small>
                    </div> */}
                  </div>
                  {/* <div className='d-flex align-items-start'>
                    <Badge color='light-primary' className='rounded p-75'>
                      <Briefcase className='font-medium-2' />
                    </Badge>
                    <div className='ms-75'>
                      <h4 className='mb-0'>568</h4>
                      <small>Projects Done</small>
                    </div>
                  </div> */}
                </div>
                <h4 className='fw-bolder border-bottom pb-50 mb-1'>Details</h4>
                <div className='info-container'>
                  {/* {selectedUser !== null ? ( */}
                    <ul className='list-unstyled'>
                      <li className='mb-75'>
                        <span className='fw-bolder me-25'>Name:</span>
                        <span>{emp_state['emp_data'].name ? emp_state['emp_data'].name : "N/A" }</span>
                      </li>
                      <li className='mb-75'>
                        <span className='fw-bolder me-25'>Personal Email:</span>
                        <span>{emp_state['emp_data'].personal_email ? emp_state['emp_data'].personal_email : "N/A" }</span>
                      </li>
                      <li className='mb-75'>
                        <span className='fw-bolder me-25'>Father Name:</span>
                        <Badge className='text-capitalize' color="light-success">
                        {emp_state['emp_data'].father_name ? emp_state['emp_data'].father_name : "N/A" }
                        </Badge>
                      </li>
                      <li className='mb-75'>
                        <span className='fw-bolder me-25'>D-O-B:</span>
                        <span className='text-capitalize'>{emp_state['emp_data'].dob ? emp_state['emp_data'].dob : "N/A" }</span>
                      </li>
                      <li className='mb-75'>
                        <span className='fw-bolder me-25'>CNIC:</span>
                        <span>{emp_state['emp_data'].cnic_no ? emp_state['emp_data'].cnic_no : "N/A" }</span>
                      </li>
                      <li className='mb-75'>
                        <span className='fw-bolder me-25'>Passport NO:</span>
                        <span>{emp_state['emp_data']['passport_data'][0] ? emp_state['emp_data']['passport_data'][0].passport_no : "N/A" }</span>
                      </li>
                      <li className='mb-75'>
                        <span className='fw-bolder me-25'>Passport Expiry Date:</span>
                        <span>{emp_state['emp_data']['passport_data'][0] ? emp_state['emp_data']['passport_data'][0].date_of_expiry : "N/A" }</span>
                      </li>
                      <li className='mb-75'>
                        <span className='fw-bolder me-25'>Blood Group:</span>
                        <span>{emp_state['emp_data'].blood_group ? emp_state['emp_data'].blood_group : "N/A" }</span>
                      </li>
                      <li className='mb-75'>
                        <span className='fw-bolder me-25'>Gender:</span>
                        <span>{emp_state['emp_data'].gender_type ? emp_state['emp_data'].gender_type : "N/A" }</span>
                      </li>
                    </ul>
                  {/* ) : null} */}
                </div>
                {/* <div className='d-flex justify-content-center pt-2'>
                  <Button color='primary' onClick={() => setShow(true)}>
                    Edit
                  </Button>
                  <Button className='ms-1' color='danger' outline onClick={handleSuspendedClick}>
                    Suspended
                  </Button>
                </div> */}
              </CardBody>
            </Card>
          </Fragment>
          </>
            ) 
            
        )}
       </Fragment>
     
    )
}
export default PersonalDetail