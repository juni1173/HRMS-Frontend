import {Fragment, useState} from "react" 
import {Label, Row, Col, Input, Form, Badge } from "reactstrap" 
import Select from 'react-select'
import { useForm, Controller } from 'react-hook-form'
import apiHelper from "../../../Helpers/ApiHelper"
import Flatpickr from 'react-flatpickr'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import InputMask from 'react-input-mask'
 
const PersonalDetail = ({state, CallBack, emp_state}) => {
      const [profileImage, setProfileImage] = useState(null)
     const BloodGrup = [
        {value: 1, label: "O+"},
        {value: 2, label: "O-"}
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
        name : '',
        father_name : '',
        profile_image: null,
        email : '',
        dob : new Date(),
        cnic_no : '',
        blood_group : BloodGrup[0],
        passport_no : '',
        date_of_expiry : '',
        gender : Gender[0],
        martial_status : MeritalStatus[0]
     }
   
   const {
    control,
    handleSubmit
  } = useForm({
    defaultValues
  })

    const onSubmitHandler = data => {
        const passport_expiry = Api.formatDate(data.date_of_expiry)
        const emp_dob =  Api.formatDate(data.dob)
        if (data.cnic_no !== '' && data.name !== '' && data.email !== '') {
            const formData = new FormData()
            formData.append("organization", Api.org.id)
            formData.append("name", data.name)
            formData.append("gender", data.gender ? data.gender.value : defaultValues.gender.value)
            formData.append("email", data.email)
            formData.append("cnic_no", data.cnic_no)
            formData.append("dob", emp_dob)
            formData.append("father_name", data.father_name)
            formData.append("blood_group", data.blood_group.value)
            formData.append("passport_no", data.passport_no)
            formData.append("date_of_expiry", passport_expiry)
            formData.append("profile_image", profileImage ? profileImage : null)
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
                      Name <Badge color='light-danger'>*</Badge>
                  </Label>
                  <Controller
                  control={control}
                  id="name"
                  name="name"
                  defaultValue={defaultValues.name}
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
                          <img
                          src={URL.createObjectURL(profileImage)}
                          alt="Thumb"
                          width="50"
                          />
                      )}
                      
                  </Col>
              </Row>
              <Row className="mt-1">
                  <Col md="4" className="mb-1">
                      <Label className="form-label">
                          Official Email <Badge color='light-danger'>*</Badge>
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
                      {/* <Input type="text" name="email"
                      onChange={ (e) => { onChangedefaultValuesHandler('email', 'input', e) }}
                          placeholder="email" /> */}
                  </Col>
                  <Col md="4" className="mb-1">
                      <Label className="form-label">
                          DOB
                      </Label>
                      <Controller
                          control={control}
                          id="dob"
                          name="dob"
                          defaultValue={defaultValues.dob}
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
                 
              </Row>
              <Row> 
                  <Col md="4" className="mb-1">
                      <Label className="form-label">
                      Blood Group
                      </Label>
                      <Controller
                          control={control}
                          id="bloof_group"
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
              <Row className="mt-1">
              
                  <Col md="4" className="mb-1">
                      <Label className="form-label">
                          Gender <Badge color='light-danger'>*</Badge>
                      </Label>
                      <Controller
                          control={control}
                          id="gender"
                          name="gender"
                          defaultValue={Gender[0]}
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
                      Martial Status
                      </Label>
                      <Controller
                          control={control}
                          id="merital_status"
                          name="merital_status"
                          defaultValue={MeritalStatus[0]}
                          render={({ field }) => (
                              <Select
                                isClearable={false}
                                id='merital_status'
                                name='merital_status'
                                className='react-select'
                                classNamePrefix='select'
                                options={MeritalStatus}
                                defaultValue={MeritalStatus[0]}
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
                <Row>
                <Col md="4" className="mb-1">
                    <Label className="form-label"  >
                       <strong>Name </strong>   
                    </Label>
                    <p className="form-control">{emp_state['emp_data'].name ? emp_state['emp_data'].name : "N/A" }</p>
                    <Label className="form-label mt-2"  >
                        EMail 
                    </Label>
                    <p className="form-control">{emp_state['emp_data'].email ? emp_state['emp_data'].email : "N/A" }</p>
                    <Label className="form-label mt-2"  >
                        Blood Group   
                    </Label>
                    <p className="form-control">{emp_state['emp_data'].blood_group ? emp_state['emp_data'].blood_group : "N/A" }</p>
                    <Label className="form-label mt-2"  >
                        Gender 
                    </Label>
                    <p className="form-control">{emp_state['emp_data'].gender ? emp_state['emp_data'].name : "N/A" }</p>
                </Col>
                <Col md="4" className="">
                    <Label className="form-label"  >
                        father_name  
                    </Label>
                    <p className="form-control">{emp_state['emp_data'].father_name ? emp_state['emp_data'].father_name : "N/A" }</p>
                    <Label className="form-label mt-2"  >
                        Date Of Birth 
                    </Label>
                    <p className="form-control">{emp_state['emp_data'].dob ? emp_state['emp_data'].dob : "N/A" }</p>
                    <Label className="form-label mt-2"  >
                        Passport No  
                    </Label>
                    <p className="form-control">{emp_state['emp_data']['passport_data'][0] ? emp_state['emp_data']['passport_data'][0].passport_no : "N/A" }</p>
                     
                </Col>
                <Col md="4" className="">
                    <Label className="form-label"  >
                       Cnic  
                    </Label>
                    <p className="form-control">{emp_state['emp_data']['cnic_data'][0] ? emp_state['emp_data']['cnic_data'][0].cnic : "N/A" }</p>
                    <Label className="form-label mt-2"  >
                       Passport Expiry Date  
                    </Label>
                    <p className="form-control">{emp_state['emp_data']['passport_data'][0] ? emp_state['emp_data']['passport_data'][0].date_of_expiry : "N/A" }</p>
                    <Label className="form-label mt-2"  >
                        MeritalStatus  
                    </Label>
                    <p className="form-control">{emp_state['emp_data'].martial_status ? emp_state['emp_data'].martial_status : "N/A" }</p>
                </Col>
            </Row>
            ) 
            
        )}
       
       </Fragment>
    )
}
export default PersonalDetail