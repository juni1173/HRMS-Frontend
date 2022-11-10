import { useState, useEffect } from "react" 
import { Label, Row, Col, Input, Form, Button, Spinner, FormFeedback } from "reactstrap" 
import { Save } from "react-feather" 
import Select from 'react-select'
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import classnames from 'classnames'
import CustomHelper from "../../../../Helpers/customHelper"
import apiHelper from "../../../../Helpers/ApiHelper"

const UpdatePosition = ({ CallBack, updateIdData }) => {
    const Helper = CustomHelper()
    const Api = apiHelper() 
    const Status = [
        { value: 0, label: 'Inactive' },
        { value: 1, label: 'Active' }
      ]
    const experience = [
        {value: 1, label: '0-2 years'},
        {value: 2, label: '2-4 years'},
        {value: 3, label: '4-6 years'},
        {value: 4, label: '6-8 years'},
        {value: 5, label: '8-10 years'},
        {value: 6, label: '10+ years'}
    ]
    const Qualification = [
        {value: 1, label: 'Bachelors'},
        {value: 2, label: 'Masters'},
        {value: 3, label: 'MPhil'},
        {value: 4, label: 'Others'}
    ]  
    
    const [depdropdown] = useState([])
    const [staffdropdown] = useState([])
    const [loading, setLoading] = useState(true)
    const [gHead] = useState([])
    const [dep, setDep] = useState('Select')
    // const [staff, setStaff] = useState('Select')
    const [stateData, setStateData] = useState(null)
    const [gheadDefault, stegheadDefault] = useState(null)
    
    const gHeadDropdown = (data) => {
        if (data) {
            gHead.splice(1, gHead.length)
            for (let i = 0; i < data.length; i++) {
                if (data[i].is_active) {
                    gHead.push({value:data[i].id, label: data[i].title })
                }
            }  
            
        }
        
        // console.warn(gHead)
    }
    const depDropdown = (data) => {

        if (data !== null) {
            depdropdown.splice(0, depdropdown.length)
            for (let i = 0; i < data.length; i++) {
                if (data[i].is_active) {
                    depdropdown.push({value:data[i].id, label: data[i].title})
                }
            }
        } else {
            depdropdown.splice(1, depdropdown.length)
            setDep('Select')
        }
    }
    const staffDropdown = (data) => {
        if (data) {
            staffdropdown.splice(1, staffdropdown.length)
            for (let i = 0; i < data.length; i++) {
                if (data[i].is_active) {
                    staffdropdown.push({value:data[i].id, label: data[i].title })
                }
            } 
        }
        
    }
    const getGHead = () => {
        setLoading(true)
        Helper.addPositionGHeadData()
        .then(data => {
            // stegheadDefault(data.grouphead[data.grouphead.map(function(o) { return o.value }).indexOf(updateIdData.grouphead)])
             gHeadDropdown(data)  
        })
        Helper.getstaffByDep()
        .then(data => { 
            staffDropdown(data)
        })
        setLoading(false)
    }
    const gHeadChange = (id) => {
        setLoading(true)
        if (id > 0) {
            Helper.getDepartmentbyGHeadid(id)
            .then(data => {
                depDropdown(data)
            })
        } else {
            depDropdown(null)
        }
        setLoading(false)
    }
    const depChange = (obj) => {
        
        setLoading(true)
        setDep(obj)
        setLoading(false)
    }
    
    const formValues = updateIdData[0]
    // const getPosByID = (id) => {
    //     if (id) {
    //        Api.get(`/organization/${Api.org.id}/position/${updateID}`).then((result) => {
    //             if (result.status === 200) {
    //               setData(result.data)
    //             //   setEditIDState(id)
    //              formValues = {
    //                 ghead: result.data.grouphead,
    //                 department: result.data.department,
    //                 staff_id: result.data.staff_classification,
    //                 position_title: result.data.position_title,
    //                 position_code: result.data.position_code,
    //                 qualification: result.data.qualification,
    //                 experience: result.data.experience,
    //                 min_salary: result.data.min_salary,
    //                 max_salary: result.data.max_salary,
    //                 status: result.data.is_active
            
    //             }
    //              Api.Toast('success', result.message)
    //             } else {
    //              Api.Toast('error', result.message)
    //             }
                
    //           })
    //           .catch((error) => {
    //             console.error(error)
    //             Api.Toast('error', 'Invalid Request')
    //           }) 
    //         } else {
    //             Api.Toast('error', 'Invalid Request')
    //         }
    //   }
    
   
        const FormSchema = yup.object().shape({
          position_title: yup.string().min(3, 'Title must be more than 3 characters').required('Position Title Required'),
          position_code: yup.number().min(3, 'Code must be more than 3 characters').required('Position Code Required'),
          min_salary: yup.number().required('Min Salary Required'),
          max_salary: yup.number().required('Max Salary Required'),
          max_salary: yup.mixed().test('isLarger', 'Max Salary must be larger than Min Salary', (value, testContext) => {
            if (testContext.parent.min_salary > value) return false
            return true
            })

        //   ghead: yup.string().required('Group Head Required').oneOf(Object.values(gHead))
        //   
          
        //   ghead: yup.string().min(3).required()
        })
    
      const {
        control,
        handleSubmit,
        formState:{ errors }
      } = useForm({formValues, mode: 'onChange', resolver: yupResolver(FormSchema) 
      })
     
        const onSubmit = data => {
            const formData = new FormData()
            setStateData(data)
            
            if (data && data.ghead !== undefined && data.department !== undefined && data.staff_id !== undefined && data.qualification !== undefined && data.experience !== undefined && data.status !== undefined) {
                if (data.ghead !== undefined && data.ghead.value !== updateIdData.grouphead) formData['grouphead'] = data.ghead.value
                if (data.department !== undefined && data.department.value !== updateIdData.department) formData['department'] = data.department.value
                if (data.staff_id !== undefined && data.staff_id.value !== updateIdData.staff_classification) formData['staff_classification'] = data.staff_id.value
                if (data.position_title !== undefined && data.position_title !== updateIdData.title)  formData['title'] = data.position_title
                if (data.position_code !== undefined && data.position_code !== updateIdData.code)  formData['code'] =  data.position_code
                if (data.qualification !== undefined && data.qualification.value !== updateIdData.qualification)  formData['qualification'] = data.qualification.value
                if (data.experience !== undefined && data.experience.value !== updateIdData.years_of_experience)  formData['years_of_experience'] = data.experience.value
                if (data.min_salary !== undefined && data.min_salary !== updateIdData.min_salary)  formData['min_salary'] = parseInt(data.min_salary)
                if (data.max_salary !== undefined && data.max_salary !== updateIdData.max_salary)  formData['max_salary'] = parseInt(data.max_salary)
                if (data.status !== undefined)  formData['is_active'] = data.status.value
                console.warn(formData)
                
                // const finalData = JSON.stringify(formData)
                fetch(`${process.env.REACT_APP_API_URL}/organization/${Api.org.id}/positions/${updateIdData.id}/`, {
                method: "PATCH",
                headers: { "Content-Type": "Application/json", Authorization: Api.token },
                body: JSON.stringify(formData) 
                    })
                    .then((response) => response.json())
                .then((result) => {
                    // const data = {status:result.status, result_data:result.data, message: result.message }
                    if (result.status === 200) {
                    Api.Toast('success', result.message)
                    CallBack()
                    } else {
                        Api.Toast('error', 'not working')
                    }
                })
            .catch((error) => {
                Api.Toast('error', error)
            }) 
            
            }
        }
    useEffect(() => {
        // getPosByID(updateID)
        
        getGHead()
        stegheadDefault(gHead[gHead.map(function(o) { return o.value }).indexOf(updateIdData.grouphead)])
        console.warn(gheadDefault)
         setLoading(false)
      }, [])
  return (
    <div>
       <div className='text-center mb-2'>
            <h1 className='mb-1'>Edit Position</h1>
            {/* <p>Updating details will receive a privacy audit.</p> */}
          </div>
          <Form onSubmit={handleSubmit(onSubmit)}  id="create-position-form">
          <Row>
            <Col md='4' className='mb-1'>
              <Label className='form-label'>
                Group Head
              </Label>
              <Controller
                control={control}
                name='ghead'
                // defaultValue={defaultObjVal(gHead)}
                render={({ field }) => (
                    <Select
                    isClearable={false}
                    options={gHead}
                    className={classnames('react-select', { 'is-invalid': stateData !== null && stateData.ghead === undefined })}
                    classNamePrefix='select'
                    defaultValue={gheadDefault}
                    {...field}
                    onChange={e => {
                        field.onChange(e)
                        gHeadChange(e.value)
                    }} 
                    />
                )}
              />
              
            </Col>
            <Col md='4' className='mb-1'>
              <Label className='form-label'>
                Department
              </Label>
              <Controller
                control={control}
                id="department"
                name="department"
                defaultValue={depdropdown[depdropdown.map((o) => o.value).indexOf(updateIdData.department)]}
                render={({ field }) => (
                    !loading ? (
                        <Select
                          isClearable={false}
                          className={classnames('react-select', { 'is-invalid': stateData !== null && stateData.department === undefined })}
                          classNamePrefix='select'
                          options={depdropdown}
                          value={dep}
                          {...field}
                          onChange={obj => { 
                            field.onChange(obj)
                            depChange(obj)
                         }}
                        />
                    ) : ( 
                      <Select
                      isClearable={false}
                      id='staff-type'
                      name='staff-type'
                      className='react-select'
                      classNamePrefix='select'
                    //   onChange={type => { setType(type.value) }}
                    />
                    )
                )}
                />
            </Col>
            <Col md='4' className='mb-1'>
              <Label className='form-label'>
                Staff Classification
              </Label>
              <Controller
                control={control}
                id="staff_id"
                name="staff_id"
                defaultValue={staffdropdown[staffdropdown.map((o) => o.value).indexOf(updateIdData.staff_classification)]}
                render={({ field }) => (
                    !loading ? (
                        <Select
                          isClearable={false}
                          className={classnames('react-select', { 'is-invalid': stateData !== null && stateData.staff_id === undefined })}
                          classNamePrefix='select'
                          options={staffdropdown}
                          {...field}
                          onChange={obj => { 
                            field.onChange(obj)
                            // setStaff(obj)
                         }}
                        />
                        
                    ) : ( 
                        <Spinner />
                    )
                )}
              />
            </Col>
            <Col md='4' className='mb-1'>
              <label className='form-label'>
                Position Title
              </label>
              <Controller
                control={control}
                name="position_title"
                defaultValue={updateIdData.title}
                render={({ field }) => (
                    <Input
                    type="text"
                    placeholder="Position Title"
                    invalid={errors.position_title && true}
                    {...field}
                  />  
                )}
              />
                {errors.position_title && <FormFeedback>{errors.position_title.message}</FormFeedback>}
            </Col>
            <Col md='4' className='mb-1'>
              <label className='form-label'>
                Position Code
              </label>
              <Controller
                control={control}
                id="position_code"
                name="position_code"
                defaultValue={updateIdData.code}
                render={({ field }) => (
                    <Input
                    type="text"
                    className="position-code"
                    placeholder="Position Code"
                    invalid={errors.position_code && true}
                    {...field}
                  />
                )}
              />
               {errors.position_code && <FormFeedback>{errors.position_code.message}</FormFeedback>}
            </Col>
            <Col md='4' className='mb-1'>
              <Label className='form-label'>
                Qualification
              </Label>
              <Controller
                control={control}
                id="qualification"
                name="qualification"
                defaultValue={Qualification[updateIdData.qualification - 1]}
                render={({ field }) => (
                    !loading ? (
                        <Select
                          isClearable={false}
                          className={classnames('react-select', { 'is-invalid': stateData !== null && stateData.qualification === undefined })}
                          classNamePrefix='select'
                          options={Qualification}
                          {...field}
                        //   onChange={type => { setType(type.value) }}
                        />
                    ) : ( 
                        <Spinner />
                    )
                )}
              />
            </Col>
            <Col md='4' className='mb-1'>
              <Label className='form-label'>
                Years of Experience
              </Label>
              <Controller
                control={control}
                id="experience"
                name="experience"
                defaultValue={experience[updateIdData.years_of_experience - 1]}
                render={({ field }) => (
                    !loading ? (
                        <Select
                          isClearable={false}
                          className={classnames('react-select', { 'is-invalid': stateData !== null && stateData.experience === undefined })}
                          classNamePrefix='select'
                          options={experience}
                          {...field}
                        //   onChange={type => { setType(type.value) }}
                        />
                    ) : ( 
                        <Spinner />
                    )
                )}
              />
              
              
            </Col>
            <Col md='4' className='mb-1'>
            <label className='form-label'>
                Salary Range
              </label>
                <div className="d-flex">
                  <Col md='6' className="mb-1 mr-1">
                    <Controller
                        control={control}
                        id="salary_range_min"
                        name="min_salary"
                        defaultValue={updateIdData.min_salary}
                        render={({field}) => (
                            <Input
                                type="number"
                                min={0}
                                className="salary-range-min"
                                placeholder="Min Salary Range"
                                invalid = {errors.min_salary && true}
                                {...field}
                            />
                        )}
                    /> 
                    {errors.min_salary && <FormFeedback>{errors.min_salary.message}</FormFeedback>}
                  </Col>
                  <Col md='6' className="mb-1">
                    <Controller
                        control={control}
                        name="max_salary"
                        defaultValue={updateIdData.max_salary}
                        render={({field}) => (
                            <Input
                                type="number"
                                min={0}
                                className="salary-range-max"
                                placeholder="Max Salary Range"
                                invalid = {errors.max_salary && true}
                                {...field}
                            />
                        )}
                    />
                    {errors.max_salary && <FormFeedback>{errors.max_salary.message}</FormFeedback>}
                  </Col>
                </div>
              </Col>
              <Col md='4' className='mb-1'>
                <Label className='form-label'>
                    Status
                </Label>
                    <Controller
                        control={control}
                        id="status"
                        name="status"
                        defaultValue={Status[updateIdData.is_active ? 1 : 0]}
                        render={({field}) => (
                            <Select
                                isClearable={false}
                                className='react-select'
                                classNamePrefix='select'
                                options={Status}
                                {...field}
                            //   onChange={type => { setType(type.value) }}
                            />
                        )}
                    />
                  
              </Col>
              
              <div className="row text-center">
            <div className="col-lg-12">
            <Button type="submit" color="warning" className="btn-next">
              <span className="align-middle d-sm-inline-block d-none">
                Update
              </span>
              <Save
                size={14}
                className="align-middle ms-sm-25 ms-0"
              ></Save>
            </Button>
            </div>
          </div>
          </Row>
        </Form>
    </div>
  )
}

export default UpdatePosition