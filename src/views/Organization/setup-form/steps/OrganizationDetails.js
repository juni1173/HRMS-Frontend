// ** React Imports
import { Fragment, useEffect, useState } from "react" 

// ** Icons Imports
import { ArrowLeft, ArrowRight, Check, Save, X, XCircle } from "react-feather" 

// ** Reactstrap Imports
import { Label, Row, Col, Input, Form, Button, FormFeedback, Spinner } from "reactstrap" 

import { useForm, Controller } from 'react-hook-form'
import { toast, Slide } from 'react-toastify'
import Avatar from '@components/avatar'
import axios from 'axios'
import OrganizationUpdateBlock from "./OrganizationDetailsBlocks/OrganizationUpdateBlock"

const OrganizationDetails = ({ stepper, type, stepperStatus }) => {
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(null)
  // const [createdBy, setCreatedBy] = useState('junaid') 
  const [detail, setDetail] = useState([])
 
  const ToastContent = ({ type, message }) => (
    type === 'success' ? (
    <Fragment>
      <div className='toastify-header'>
        <div className='title-wrapper'>
          <Avatar size='sm' color='success' icon={<Check size={12} />} />
          <h6 className='toast-title fw-bold'>Succesfull</h6>
        </div>
      </div>
      <div className='toastify-body'>
        <span>{message}</span>
      </div>
    </Fragment>) : (
    <Fragment>
      <div className='toastify-header'>
        <div className='title-wrapper'>
          <Avatar size='sm' color='danger' icon={<X size={12} />} />
          <h6 className='toast-title fw-bold'>Error</h6>
        </div>
      </div>
      <div className='toastify-body'>
        <span>{message}</span>
      </div>
    </Fragment>
    )
  )
  const imageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]) 
    }
  } 
  const removeSelectedImage = () => {
    setSelectedImage() 
  } 
  const defaultValues = {
    company_name: '',
    company_tagline: '',
    city: '',
    address: '',
    company_vision: '',
    company_mission: ''
  }
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues
  })
  let token = localStorage.getItem('accessToken')
    token = token.replaceAll('"', '')
    token = `Bearer ${token}`
  // const userData = localStorage.getItem('userData')
  // const user_id = parseInt(userData.userID)
    const fetchData = async () => {
      setLoading(true)
      try {
        const {data: response} = await axios.get('http://127.0.0.1:8000/api/organizations/6/', {
         headers: {
          Accept : 'application/json',
          Authorization : token
         }
        })
        if (response.status === 200) {
          
            setDetail(response.data)
            localStorage.setItem('organization', JSON.stringify(response.data))
        
        } else {
          toast.error(
            <ToastContent type='error' message={response.message} />,
            { icon: false, transition: Slide, hideProgressBar: true, autoClose: 2000 }
          )
          setDetail([])
        }
        // dataLength = Object.keys(data).length
        
      } catch (error) {
        // console.warn(error)
        if (error.response) {
          toast.error(
            <ToastContent type='error' message='No Organization Found! Please enter info...' />,
            { icon: false, transition: Slide, hideProgressBar: true, autoClose: 2000 }
          )
          console.warn(detail.length)
          console.log(error.response.data)
          console.log(error.response.status)
          console.log(error.response.headers)
          setDetail([])
        }
      }
      setTimeout(() => {
        setLoading(false)
      }, 1000)
      
    }
    
  useEffect(() => {
    fetchData()
  }, [])

  const onSubmit = async data => {
    // if (selectedImage) {
    //   data['company_logo'] = selectedImage
    // } else {
      // alert('please select logo to proceed')
    // }
    
    // console.warn(token)
    
    // return false
    
    if (data.company_name.length > 0 && data.company_tagline.length > 0 && data.company_vision.length > 0 && data.company_mission.length > 0 && data.city.length > 0 && data.address.length > 0) {
      
      const formData = new FormData()
      // const logo = selectedImage
      // const logoName = selectedImage.name
      const locations = {city_name: data.city, address: data.address}
      
      // formData.append("user", user_id)
      formData.append("name", data.company_name)
      formData.append('tagline', data.company_tagline)
      formData.append('locations', JSON.stringify(locations))
      formData.append('vision', data.company_vision)
      formData.append('mission', data.company_mission)
      formData.append('logo', selectedImage)
      formData.append('is_active', true)
      
      console.warn(formData)
      fetch('http://127.0.0.1:8000/api/organizations/', {
        method: "POST",
        headers: { Authorization: token },
        body: formData
      })
      .then((response) => response.json())
      .then((result) => {
        const data = {status:result.status, result_data:result.data, message: result.message }
        if (data.status === 200) {
          toast.success(
            <ToastContent type='success' message={data.message} />,
            { icon: false, transition: Slide, hideProgressBar: true, autoClose: 2000 }
          )
        } else {
          toast.error(
            <ToastContent type='error' message={data.message} />,
            { icon: false, transition: Slide, hideProgressBar: true, autoClose: 2000 }
          )
        }
        
        // stepper.next()
      })
      .catch((error) => {
        console.error(error)
        toast.error(
          <ToastContent type='error' message={data.message} />,
          { icon: false, transition: Slide, hideProgressBar: true, autoClose: 2000 }
        )

        
      }) 
    } else {
      console.warn(data)
      stepper.next()
      for (const key in data) {
        if (data[key].length === 0) {
          setError(key, {
            type: 'manual',
            message: `Please enter a valid detail`
          })
        }
      }
    }
  }
 
  return (
    
    Object.keys(detail).length > 0 ? (loading ? <Fragment><div className="text-center align-middle"><Spinner color='primary' /></div></Fragment> : <Fragment><OrganizationUpdateBlock detail={detail} stepperStatus={stepperStatus} /></Fragment>
    ) : (
      <Fragment>
      <div className="content-header">
          <h5 className="mb-0">Organization Details</h5>
          <small className="text-muted">Add Your Organization Details.</small>
      </div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col md="4" className="mb-1">
            <Label className="form-label" for={`company-name-${type}`}>
              Company Name
            </Label>
            <Controller
              control={control}
              id="company_name"
              name="company_name"
              render={({ field }) => (
                <Input
                  type="text"
                  placeholder="Company Name"
                  invalid={errors.company_name && true}
                  {...field}
                />
              )}
            />
            {errors.company_name && <FormFeedback>{errors.company_name.message}</FormFeedback>}
          </Col>
          <Col md="4" className="mb-1">
            <Label className="form-label" for={`company-tagline`}>
              Company Tagline
            </Label>
            <Controller
              control={control}
              id="company_tagline"
              name="company_tagline"
              render={({ field }) => (
                <Input
                  type="text"
                  placeholder="Company Tagline"
                  invalid={errors.company_tagline && true}
                  {...field}
                />
              )}
            />
            {errors.company_tagline && <FormFeedback>{errors.company_tagline.message}</FormFeedback>}
          </Col>
          <Col md="4" className="mb-1">
            {selectedImage ? (
              <div className="float-right">
                <img
                  src={URL.createObjectURL(selectedImage)}
                  alt="Thumb"
                  width="50"
                />
                <button className="btn" onClick={removeSelectedImage}>
                  <XCircle />
                </button>
              </div>
            ) : (
              <div>
                <Label className="form-label">Logo</Label>
                <Input
                      type="file"
                      id="company_logo"
                      name="company_logo"
                      accept="image/*"
                      onChange={imageChange}
                    />
              </div>
            )}
          </Col>
        </Row>
        <Row>
          
          <Col md="6" className="mb-1">
          <Label className="form-label" for={`company-city`}>
              City
            </Label>
            <Controller
              control={control}
              id="city"
              name="city"
              render={({ field }) => (
                <Input
                  type="text"
                  placeholder="City"
                  invalid={errors.city && true}
                  {...field}
                />
              )}
            />
            {errors.city && <FormFeedback>{errors.city.message}</FormFeedback>}
          </Col>
          {/* <Col md="4" className="mt-2">
          </Col> */}
          <Col md="6" className="mb-1">
          <Label className="form-label" for={`company-address`}>
              Address
            </Label>
            <Controller
              control={control}
              id="address"
              name="address"
              render={({ field }) => (
                <Input
                  type="textarea"
                  row="2"
                  placeholder="Company Adress"
                  invalid={errors.address && true}
                  {...field}
                />
              )}
            />
            {errors.address && <FormFeedback>{errors.address.message}</FormFeedback>}
          </Col>
        </Row>
        <Row>
          <Col md="6" className="mb-1">
            <Label className="form-label" for={`company-vision`}>
              Company Vision
            </Label>
            <Controller
              control={control}
              id="company_vision"
              name="company_vision"
              render={({ field }) => (
                <Input
                  type="textarea"
                  row="3"
                  placeholder="Company Vision"
                  invalid={errors.company_vision && true}
                  {...field}
                />
              )}
            />
            {errors.company_vision && <FormFeedback>{errors.company_vision.message}</FormFeedback>}
          </Col>
          <Col md="6" className="mb-1">
            <Label className="form-label" for={`company-mission`}>
              Company Mission
            </Label>
            <Controller
              control={control}
              id="company_mission"
              name="company_mission"
              render={({ field }) => (
                <Input
                  type="textarea"
                  row="3"
                  placeholder="Company Mission"
                  invalid={errors.company_mission && true}
                  {...field}
                />
              )}
            />
            {errors.company_mission && <FormFeedback>{errors.company_mission.message}</FormFeedback>}
          </Col>
        </Row>
        {/* <input type='hidden' value='Junaid' id='created_by' name='created_by' onChange={e => setCreatedBy(e.target.value)}/>  */}
        {stepperStatus ? (
        <div className="d-flex justify-content-between">
             <Button color="secondary" className="`btn-prev d-none`"  outline disabled>
             <ArrowLeft
               size={14}
               className="align-middle me-sm-25 me-0"
             ></ArrowLeft>
             <span className="align-middle d-sm-inline-block">
               previous
             </span>
           </Button>
          <Button color="primary" className="btn-next">
            <span className="align-middle d-sm-inline-block d-none">
              Save
            </span>
            <ArrowRight
              size={14}
              className="align-middle ms-sm-25 ms-0"
            ></ArrowRight>
          </Button>
        </div>
        ) : (
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
        )}
      </Form>
    </Fragment>
    )
  ) 
} 
OrganizationDetails.defaultProps = {
  stepperStatus: true
}
export default OrganizationDetails 
