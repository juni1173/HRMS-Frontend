import { useState, useEffect } from "react" 
// ** Icons Imports
import { ArrowLeft, ArrowRight} from "react-feather" 
// // ** Reactstrap Imports
import { Label, Row, Col, Input, Form, Button, Spinner, Badge } from "reactstrap" 
import Select from 'react-select'
import { useForm, Controller } from 'react-hook-form'
// import { toast, Slide } from 'react-toastify'
import DepartmentsHelper from "../../../../../Helpers/DepartmentsHelper"
import PositionHelper from "../../../../../Helpers/PositionHelper"
import { Redirect } from "react-router-dom"
import apiHelper from "../../../../../Helpers/ApiHelper"

const Job_Profile = ({ stepper, count, CallBack}) => {
  const Api = apiHelper()
  const Department = DepartmentsHelper()
  const Position = PositionHelper()
  const [depActive] = useState([])
  const [depNotActive] = useState([])
  const [positionActive] = useState([])
  const [positionNotActive] = useState([])
  const [SCActive] = useState([])
  const [SCNotActive] = useState([])
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
      } 
      setLoading(false)
  }
  const fetchPositions = (data) => {
      setLoading(true)
        if (data.position.length > 0) {
          setLoading(true)
          positionActive.splice(0, positionActive.length)
          positionNotActive.splice(0, positionNotActive.length)
          if (Object.values(data.position).length > 0) {
              for (let i = 0; i < data.position.length; i++) {
                  if (data.position[i].is_active) {
                    positionActive.push({value: data.position[i].id, label: data.position[i].title})
                  } else {
                    positionNotActive.push({value: data.position[i].id, label: data.position[i].title})
                  }
                }  
          }
        } 
        setLoading(false)
  }
  const fetchSC = (data) => {
    setLoading(true)
      if (data.SC.length > 0) {
        setLoading(true)
        SCActive.splice(0, SCActive.length)
        SCNotActive.splice(0, SCNotActive.length)
        if (Object.values(data.SC).length > 0) {
            for (let i = 0; i < data.SC.length; i++) {
                if (data.SC[i].is_active) {
                  SCActive.push({value: data.SC[i].id, label: data.SC[i].title})
                } else {
                  SCNotActive.push({value: data.SC[i].id, label: data.SC[i].title})
                }
              }  
        }
      } 
      setLoading(false)
}
  const dep = () => {
      Department.fetchDepartments()
      .then(depData => {
        fetchDepartments(depData)
      })
  }
  const position = () => {
    Position.fetchPositions()
    .then(data => {
      fetchPositions(data)
    })
  }
  const SC = () => {
    Position.fetchStaffClassifications()
    .then(data => {
      fetchSC(data)
    })
  }
  const defaultProfileValues = {
    departmentType: '',
    positionType: '',
    project: '',
    title: '',
    code: 0
  }
  const {
    control,
    handleSubmit,
    formState:{  }
  } = useForm({defaultProfileValues, mode: 'onChange' 
  })
  useEffect(() => {
    setLoading(true)
    if (count !== 0) {
        dep()
        position()
        SC()
    } else {
        dep()
        position()
        SC()
    }
    setLoading(false)
  }, [])
 const onSubmit = data => {
  console.warn(data)
   if (data.department !== undefined && data.position !== undefined && data.title !== '' && data.code !== '') {
    data.department = data.department.value
    data.position = data.position.value
    data.staff_classification = data.staff_classification.value
    CallBack(data, '1')
    stepper.next()
   } else {
      Api.Toast('error', 'Please enter all required fields')
   }
  
  }
  return (
    <div>
      <div className='content-header' >
          <h5 className='mb-2'>Add JD Profile</h5>
          {/* <small>Add Job.</small> */}
        </div>
        <Form onSubmit={handleSubmit(onSubmit)} id="create-job-form">
          <Row>
            <Col md='4' className='mb-1'>
              <Label className='form-label'>
                Departments<Badge color='light-danger'>*</Badge>
              </Label>
              {!loading ? (
                <Controller
                id='react-select'
                control={control}
                name='department'
                // defaultValue={depActive[0]}
                render={({ field }) => (
                  <Select
                  theme={depActive}
                    isClearable={false}
                    id='dep-type'
                    name='dep-type'
                    className='react-select'
                    classNamePrefix='select'
                    options={depActive}
                    // defaultValue={depActive[0]}
                    {...field}
                    
                  //   onChange={type => { setType(type.value) }}
                  />
                )}
              />
                  
              ) : ( 
                  <Spinner />
              )}
              
            </Col>
            <Col md='4' className='mb-1'>
              <Label className='form-label'>
                Staff Classification<Badge color='light-danger'>*</Badge>
              </Label>
              {!loading ? (
                <Controller
                id='react-select'
                control={control}
                name='staff_classification'
                // defaultValue={SCActive[0]}
                render={({ field }) => (
                  <Select
                  theme={SCActive}
                    isClearable={false}
                    id='SC-type'
                    name='SC-type'
                    className='react-select'
                    classNamePrefix='select'
                    options={SCActive}
                    // defaultValue={SCActive[0]}
                    {...field}
                    //   onChange={type => { setType(type.value) }}
                    />
                  )}
                />
              ) : ( 
                  <Spinner />
              )}
              
            </Col>
            <Col md='4' className='mb-1'>
              <Label className='form-label'>
                Positions<Badge color='light-danger'>*</Badge>
              </Label>
              {!loading ? (
                <Controller
                id='react-select'
                control={control}
                name='position'
                // defaultValue={positionActive[0]}
                render={({ field }) => (
                  <Select
                  theme={positionActive}
                    isClearable={false}
                    id='position-type'
                    name='position-type'
                    className='react-select'
                    classNamePrefix='select'
                    options={positionActive}
                    // defaultValue={positionActive[0]}
                    {...field}
                    //   onChange={type => { setType(type.value) }}
                    />
                  )}
                />
              ) : ( 
                  <Spinner />
              )}
              
            </Col>
            <Col md='4' className='mb-1'>
              <label className='form-label'>
                Project
              </label>
              <Controller
                control={control}
                name='project'
                defaultValue=""
                render={({ field }) => (
                <Input
                  id="JD-project"
                  name="JD-project"
                  className="JD-project"
                  placeholder="Project"
                 {...field}
                  //   onChange={type => { setType(type.value) }}
                  />
                )}
              />
            </Col>
            <Col md='4' className='mb-1'>
              <label className='form-label'>
                Title<Badge color='light-danger'>*</Badge>
              </label>
              <Controller
                control={control}
                name='title'
                defaultValue=""
                render={({ field }) => (
                <Input
                  id="JD-title"
                  name="JD-title"
                  className="JD-title"
                  placeholder="Title"
                {...field}
                //   onChange={type => { setType(type.value) }}
                />
              )}
              />
            </Col>
            <Col md='4' className='mb-1'>
              <label className='form-label'>
                Code<Badge color='light-danger'>*</Badge>
              </label>
              <Controller
                control={control}
                name='code'
                defaultValue=""
                render={({ field }) => (
                <Input
                  id="JD-code"
                  name="JD-code"
                  className="JD-code"
                  placeholder="Code"
                  {...field}
                  //   onChange={type => { setType(type.value) }}
                  />
                )}
                />
            </Col>
          
          </Row>
          <div className='d-flex justify-content-between'>
          <Button color='secondary' className='btn-prev' outline disabled>
            <ArrowLeft size={14} className='align-middle me-sm-25 me-0'></ArrowLeft>
            <span className='align-middle d-sm-inline-block d-none'>Previous</span>
          </Button>
          <Button color='primary' className='btn-next'>
            <span className='align-middle d-sm-inline-block d-none'>Next</span>
            <ArrowRight size={14} className='align-middle ms-sm-25 ms-0'></ArrowRight>
          </Button>
        </div>
        </Form>
     
   
    </div>
  )
}

export default Job_Profile
