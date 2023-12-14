// ** React Imports
import { Fragment, useState} from "react" 
import { ArrowLeft, ArrowRight, Check, X, XCircle } from "react-feather" 
// ** Reactstrap Imports
import { Label, Row, Col, Input, Form, Button, FormFeedback } from "reactstrap" 
import { useForm, Controller } from 'react-hook-form'
import { toast, Slide } from 'react-toastify'
import Avatar from '@components/avatar'
const OrganizationUpdateBlock = ({detail, stepperStatus}) => {
    const [updatedImage, setUpdatedImage] = useState(null)
    const [updatedCreatedBy, setUpdatedCreatedBy] = useState('')
    const [imgPath, setImgPath] = useState(detail.logo !== null ? process.env.REACT_APP_PUBLIC_URL + detail.logo : null)
    let token = localStorage.getItem('accessToken')
    token = token.replaceAll('"', '')
    token = `Bearer ${token}`
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
              <Avatar size='sm' color='error' icon={<X size={12} />} />
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
          setUpdatedImage(e.target.files[0])
        }
      } 
      const removeUpdatedImage = () => {
        setUpdatedImage() 
      } 
      const removeImage = () => {
        setImgPath() 
      } 
    const updatedValues = {
        updatedName: null,
        updatedTagline: null,
        updatedCity: null,
        updatedAddress: null,
        updatedVision: null,
        updatedMission: null
      }
      const {
        control,
        setError,
        handleSubmit,
        formState: { errors }
      } = useForm({
        updatedValues
      })
    
      const onUpdate = async data => {
        // if (updatedImage) {
        //   // data['company_logo'] = selectedImage
        // } else {
        //   // alert('please select logo to proceed')
        // }
        
        if (data) {
          const formData = new FormData()
          if (updatedImage !== null) {
            setImgPath(process.env.REACT_APP_BACKEND_URL + updatedImage)
          }
         console.warn(updatedCreatedBy)
         if (data.updatedName !== undefined) {
          formData.append('name', data.updatedName)
        }
         if (data.updatedTagline !== undefined) {
          formData.append('tagline', data.updatedTagline)
         }
         if (updatedImage !== null) {
          formData.append('logo', updatedImage)
        } 
        if (data.updatedCity !== undefined && data.updatedAddress !== undefined) {
          const locations = {city_name: data.updatedCity, address: data.updatedAddress}
          formData.append('locations', JSON.stringify(locations))
        }
        if (data.updatedVision !== undefined) {
          formData.append('vision', data.updatedVision)
        }
        if (data.updatedMission !== undefined) {
          formData.append('mission', data.updatedMission)
        }  
        formData.append('user', 1)
         
          fetch(`${process.env.REACT_APP_API_URL}/organizations/${detail.id}/`, {
            method: "PATCH",
            headers: { Authorization: token },
            body: formData
          })
          .then((response) => response.json())
          .then((result) => {
            const data = {status:result.status, result_data:result.data, message: result.message }
            if (data.status === 200) {
              localStorage.removeItem('organization')
              localStorage.setItem('organization', JSON.stringify(data.result_data))
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
            
          })
          .catch((error) => {
            console.error(error)
            toast.error(
              <ToastContent type='error' message={data.message} />,
              { icon: false, transition: Slide, hideProgressBar: true, autoClose: 2000 }
            )
    
            
          }) 
        } else {
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
   
    <>
      <div className="content-header">
          <h5 className="mb-0">Organization Info</h5>
      </div>
      <Form onSubmit={handleSubmit(onUpdate)}>
        <Row>
          <Col md="4" className="mb-1">
            <Label className="form-label" for={`updatedName`}>
              Company Name
            </Label>
            <Controller
              control={control}
              autoFocus
              id="updatedName"
              name="updatedName"
              render={({ field }) => (
                <Input
                  type="text"
                  placeholder="Company Name"
                  defaultValue={detail.name}
                  invalid={errors.updatedName && true}
                  {...field}
                />
              )}
            />
            {errors.updatedName && <FormFeedback>{errors.updatedName.message}</FormFeedback>}
          </Col>
          <Col md="4" className="mb-1">
            <Label className="form-label" for={`updatedTagline`}>
              Company Tagline
            </Label>
            <Controller
              control={control}
              id="updatedTagline"
              name="updatedTagline"
              render={({ field }) => (
                <Input
                  type="text"
                  placeholder="Company Tagline"
                  defaultValue={detail.tagline}
                  invalid={errors.updatedTagline && true}
                  {...field}
                />
              )}
            />
            {errors.updatedTagline && <FormFeedback>{errors.company_tagline.message}</FormFeedback>}
          </Col>
          <Col md="4" className="mb-1">
            {updatedImage ? (
              <div className="float-right">
                <img
                  src={URL.createObjectURL(updatedImage)}
                  alt="Thumb"
                  width="50"
                />
                <button className="btn" onClick={removeUpdatedImage}>
                  <XCircle />
                </button>
              </div>
            ) : (
              <div>
                {imgPath ? (
                 <div className="float-right">
                 <img
                   src={imgPath}
                   alt="Thumb"
                   width="50"
                 />
                 <button className="btn" onClick={removeImage}>
                   <XCircle />
                 </button>
               </div>
                ) : (
                  <>
                    <Label className="form-label">Logo</Label>
                <Input
                      type="file"
                      id="company_logo"
                      name="company_logo"
                      accept="image/*"
                      onChange={imageChange}
                    />
                  </>
                )}
                
              </div>
            )}
          </Col>
        </Row>
        <Row>
        <Col md="6" className="mb-1">
            <Label className="form-label" for={`updatedCity`}>
              City
            </Label>
            <Controller
              control={control}
              id="updatedCity"
              name="updatedCity"
              defaultValue={detail.locations[0] ? detail.locations[0].city_name : ''}
              render={({ field }) => (
                <Input
                  type="text"
                  placeholder="City"
                  invalid={errors.updatedCity && true}
                  {...field}
                />
              )}
            />
            {errors.updatedCity && <FormFeedback>{errors.company_city.message}</FormFeedback>}
          </Col>
          <Col md="6" className="mb-1">
            <Label className="form-label" for={`updatedTagline`}>
              Company Address
            </Label>
            <Controller
              control={control}
              id="updatedAddress"
              name="updatedAddress"
              defaultValue={detail.locations[0] ? detail.locations[0].address : ''}
              render={({ field }) => (
                <Input
                  type="text"
                  placeholder="Address"
                  invalid={errors.updatedAddress && true}
                  {...field}
                />
              )}
            />
            {errors.updatedAddress && <FormFeedback>{errors.address.message}</FormFeedback>}
          </Col>
        </Row>
        <Row>
          <Col md="6" className="mb-1">
            <Label className="form-label" for={`company-vision`}>
              Company Vision
            </Label>
            <Controller
              control={control}
              id="updatedVision"
              name="updatedVision"
              render={({ field }) => (
                <Input
                  type="textarea"
                  row="3"
                  placeholder="Company Vision"
                  defaultValue={detail.vision}
                  invalid={errors.updatedVision && true}
                  {...field}
                />
              )}
            />
            {errors.updatedVision && <FormFeedback>{errors.updatedVision.message}</FormFeedback>}
          </Col>
          <Col md="6" className="mb-1">
            <Label className="form-label" for={`company-mission`}>
              Company Mission
            </Label>
            <Controller
              control={control}
              id="updatedMission"
              name="updatedMission"
              render={({ field }) => (
                <Input
                  type="textarea"
                  row="3"
                  placeholder="Company Mission"
                  defaultValue={detail.mission}
                  invalid={errors.updatedMission && true}
                  {...field}
                />
              )}
            />
            {errors.updatedMission && <FormFeedback>{errors.updatedMission.message}</FormFeedback>}
          </Col>
        </Row>
        <input type='hidden' value='1' id='updatedCreatedBy' name='updatedCreatedBy' onChange={e => setUpdatedCreatedBy(e.target.value)}/> 
        {stepperStatus ? (
        <div className="d-flex justify-content-between">
            <Button color="secondary" className="btn-prev" outline disabled>
              <ArrowLeft
                size={14}
                className="align-middle me-sm-25 me-0"
              ></ArrowLeft>
              <span className="align-middle d-sm-inline-block d-none">
                Previous
              </span>
            </Button>
            <Button color="warning" className="btn-next float-right">
              <span className="align-middle d-sm-inline-block d-none">
                Update
              </span>
            </Button> 
        </div>
         ) : (
            <div className="row text-center">
              <div className="col-lg-12">
              <Button color="warning" className="btn-next float-right">
                <span className="align-middle d-sm-inline-block d-none">
                  Update
                </span>
              </Button>
              </div>
            </div>
         )}
      </Form>
    </> 
    )
} 
export default OrganizationUpdateBlock
