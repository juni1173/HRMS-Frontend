import { Fragment, useState, useEffect } from "react" 
import { Label, Row, Col, Input, Form, Button, Spinner, FormFeedback } from "reactstrap" 
import { Save } from "react-feather" 
import Select from 'react-select'
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import classnames from 'classnames'
import CustomHelper from "../../../../Helpers/customHelper"
import apiHelper from "../../../../Helpers/ApiHelper"
const addPosition = ({ CallBack }) => {
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
    const [staff, setStaff] = useState('Select')
    const [stateData, setStateData] = useState(null)
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
                    depdropdown.push({value:data[i].id, label: data[i].title })
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
    const formValues = {
        ghead: gHead[0],
        department: dep[0],
        staff_id: staff[0],
        position_title: '',
        position_code: '',
        qualification: Qualification[0],
        experience: experience[0],
        min_salary: 0,
        max_salary: 0,
        status: Status[0]

    }
    
        const FormSchema = yup.object().shape({
          position_title: yup.string().min(3, 'Title must be more than 3 characters').required('Position Title Required'),
          position_code: yup.number().min(3, 'Code must be more than 3 digits').required('Position Code Required'),
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
                if (data.ghead !== undefined) formData['grouphead'] = data.ghead.value
                if (data.department !== undefined) formData['department'] = data.department.value
                if (data.staff_id !== undefined) formData['staff_classification'] = data.staff_id.value
                if (data.position_title !== undefined)  formData['title'] = data.position_title
                if (data.position_code !== undefined)  formData['code'] =  data.position_code
                if (data.qualification !== undefined)  formData['qualification'] = data.qualification.value
                if (data.experience !== undefined)  formData['years_of_experience'] = data.experience.value
                if (data.min_salary !== undefined)  formData['min_salary'] = parseInt(data.min_salary)
                if (data.max_salary !== undefined)  formData['max_salary'] = parseInt(data.max_salary)
                if (data.status !== undefined)  formData['is_active'] = data.status.value
                
                // const finalData = JSON.stringify(formData)
                const url = `${process.env.REACT_APP_API_URL}/organization/${Api.org.id}/positions/`
                fetch(url, {
                method: "POST",
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
                        Api.Toast('error', 'notworking')
                    }
                })
            .catch((error) => {
                Api.Toast('error', error)
            }) 
            
            }
        }
    useEffect(() => {
        getGHead()
         setLoading(false)
      }, [])
    return (
        <Fragment>
        <div className='content-header' >
          <h5 className='mb-2'>Add Position</h5>
          {/* <small>Add position.</small> */}
        </div>
        <Form onSubmit={handleSubmit(onSubmit)}  id="create-position-form">
          <Row>
            <Col md='4' className='mb-1'>
              <Label className='form-label'>
                Group Head
              </Label>
              <Controller
                id='react-select'
                control={control}
                name='ghead'
                render={({ field }) => (
                    <Select
                    isClearable={false}
                    options={gHead}
                    className={classnames('react-select', { 'is-invalid': stateData !== null && stateData.ghead === undefined })}
                    classNamePrefix='select'
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
                render={({ field }) => (
                    !loading ? (
                        <Select
                          isClearable={false}
                          className={classnames('react-select', { 'is-invalid': stateData !== null && stateData.staff_id === undefined })}
                          classNamePrefix='select'
                          options={staffdropdown}
                          value={staff}
                          {...field}
                          onChange={obj => { 
                            field.onChange(obj)
                            setStaff(obj)
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
                defaultValue=""
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
                defaultValue=""
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
                        defaultValue={0}
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
                        defaultValue={0}
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
                        render={({field}) => (
                            <Select
                                isClearable={false}
                                className='react-select'
                                classNamePrefix='select'
                                options={Status}
                                defaultValue={Status[0]}
                                {...field}
                            //   onChange={type => { setType(type.value) }}
                            />
                        )}
                    />
                  
              </Col>
              
              <div className="row text-center">
            <div className="col-lg-12">
            <Button color="primary" className="btn-next">
              <span className="align-middle d-sm-inline-block d-none">
                Save
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
      </Fragment>
    )
}
export default addPosition