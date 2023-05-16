import { Fragment, useState, useEffect } from "react"
import { Row, Col, Form, Input, Button, Modal, ModalHeader, ModalBody, Card, Spinner, Label, CardBody } from 'reactstrap'
import { Save, XCircle, Clock} from "react-feather"
import InputMask from 'react-input-mask'
import validator from "validator"
import {useParams} from "react-router-dom" 
import ApplySuccess from "./ApplySuccess"
import apiHelper from "../../Helpers/ApiHelper"
import pdfImage from "../../../assets/images/icons/pdf-icon.png"
import JDModal from "./JDModal"
 
const applyForm = () => {
    const Api = apiHelper() 

    const [loading, setLoading] = useState(false)
    // const [error, setError] = useState(null)
    const [linkedError, setLinkedError] = useState('')
    const [emailError, setEmailError] = useState('')
    const [cnicError, setCnicError] = useState('')
    const [trackCnicError, setTrackCnicError] = useState('')
    const [nameError, setNameError] = useState('')
    const [phoneError, setPhoneError] = useState('')

    const [name, setName] = useState("")
    const [cnic, setCnic] = useState('')
    const [trackCnic, setTrackCnic] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [linkedin, setLinkedin] = useState('')
    const [time_interval, setInterval] = useState('')
    const [selectedImage, setSelectedImage] = useState(null)
    const [applySuccessData, setApplySuccessData] = useState([])
    const [successMsg, setSuccessMsg] = useState('')
    const [url_params] = useState(useParams())
    const [successModal, setSuccessModal] = useState(false)
    const [jdModal, setJDModal] = useState(true)
    const [jdData, setJDData] = useState([])
    const [timeIntervals, setTimeIntervals] = useState([])
        
    const imageChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
          setSelectedImage(e.target.files[0]) 
        }
        
    } 
    const removeSelectedImage = () => {
    setSelectedImage() 
    }

    const validateEmail = (email) => {
        const emailFormat = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i
        if (!emailFormat.test(email)) {
        setEmailError("Enter the Valid Email")
        return  false
        }
        return true
    }

      const validateResume = (filePath) => {
         
        if (["application/pdf"].includes(filePath.type)) {
            return true
        }
        return false
        
    }  

    const validateUrl = (url) => {
        if (!validator.isURL(url)) {
            setLinkedError("Enter The Valid LinkedIn Url")
            return  false
        }  
        return true
    }

    // const validateLinkedIn = (event) => {
    //       const url = event.target.value
    //       validateUrl(url)
    // }

    const onchangeLinkedIn = (event) => {
        setLinkedin(event.target.value)
        setLinkedError("")
    }

    const onValidateEmail = (event) => {
        validateEmail(event.target.value)
    }
    const onchangeEmail = (event) => {
        setEmail(event.target.value)
        setEmailError("")
    }

    const onChangeCandidateName = (event) => {
        setName(event.target.value)
        setNameError("")

    }

    const checkCnic = (cnic, track = false) => {
    const getCnicNumberCount = cnic.replace(/[^0-9]/g, '')
        if (getCnicNumberCount.length !== 13) {
            if (!track) {
                setCnicError("Your Cnic Length must be 13")
            } else {
                setTrackCnicError("Your Cnic Length must be 13")
            }
            
            return false
        }
        return true
    }

    const onValidateCnic = (event, track) => {
        checkCnic(event.target.value, track)
    }

    const onChangeCnic = (event, track = false) => {
        
        if (!track) {
            setCnic(event.target.value)
            setCnicError("")
        } else {
            setTrackCnic(event.target.value)
            setTrackCnicError("")
        }
        
    }

    const phoneVaidation = (phone) => {
        
       const act_nmbr = phone.replace('_____', " ")
       if (act_nmbr.length !== 13) {
        setPhoneError('Phone no is not valid')
          return false
       } 
        return true
        
    }

    const onChangePhone = (event) => {
        setPhone(event.target.value)
        setPhoneError('')
    }
    
    const onValidatePhone = (event) => {
        phoneVaidation(event.target.value)
    }
    const submit = () => {
        setLoading(true)
        const job_uuid = url_params.uuid
        if (job_uuid !== '' && job_uuid !== null && job_uuid !== undefined && name !== '' && cnic !== '' && email !== '' && phone !== '') {
          
            const isValidCnic = checkCnic(cnic)
            if (!isValidCnic) {
                Api.Toast('error',   "Cnic is not valid")
                return
            }

            const isValidEmail = validateEmail(email)
            if (!isValidEmail) {
                Api.Toast('error',   "Enter the Valid Email")
                 return
            }
            if (linkedin !== '') {
                const isLinkedValid =   validateUrl(linkedin)
                if (!isLinkedValid) {
                    Api.Toast('error',   "Enter The Valid LinkedIn Url")
                    return
                }
            }
            
            const isResumeValid = validateResume(selectedImage)
            if (!isResumeValid) {
                Api.Toast('error',   "Only pdf and word file are allowed")
                return
            }

            const formData = new FormData()
            formData.append("candidate_name", name)
            formData.append("cnic_no", cnic)
            formData.append("email", email)
            formData.append("mobile_no", phone)
            if (linkedin !== '') formData.append("linkedin_profile", linkedin)
            formData.append("resume", selectedImage)
            if (time_interval !== '') formData.append("time_interval", time_interval)
            
                Api.jsonPost(`/candidates/apply/form/${job_uuid}/`, formData, false)
                .then((result) => {
                    if (result.status === 200) {
                        Api.Toast('success', result.message)
                        // setName('')
                        // setCnic('')
                        // setEmail('')
                        // setPhone('')
                        // setLinkedin('')
                        // setSelectedImage('')
                        setSuccessMsg(result.message)
                        const candidate_uuid = result.data.candidate_uuid
                        Api.get(`/assessments/${candidate_uuid}/${job_uuid}/`).then(result => {
                            if (result) {
                                if (result.status === 200) {
                                    setLoading(true)
                                    setApplySuccessData(result.data)
                                    
                                   setTimeout(() => {
                                        setLoading(false)
                                   }, 1000)
                                   setSuccessModal(true)
                                } else {
                                    Api.Toast('error', result.message)
                                }
                            } else {
                                Api.Toast('error', 'Something Went Wrong')
                            }
                        })
                        
                        } else {
                            Api.Toast('error', result.message)
                        }
                })
            
            
        } else {
            Api.Toast('error',   "All Fileds Are Required")
            setNameError("Please Enter Name")
            setCnicError("Your Cnic Length must be 13")
            setLinkedError("Enter The Valid LinkedIn Url")
            setEmailError("Enter the Valid Email")
            setPhoneError("Phone no is not valid")
            // setError("All the fields required")
        }

        setTimeout(() => {
            setLoading(false)
          }, 1000)
    }
    const submitTrack = () => {
        setLoading(true)
        const job_uuid = url_params.uuid
        if (trackCnic !== '') {
            const isValidCnic = checkCnic(trackCnic)
            if (!isValidCnic) {
                Api.Toast('error',   "Cnic is not valid")
                return false
            }
            Api.get(`/assessments/candidate/check/job/post/${trackCnic}/${job_uuid}/`).then(result => {
                if (result) {
                    if (result.status === 200) {
                        setLoading(true)
                        setApplySuccessData(result.data)
                        setSuccessMsg(result.message)
                       setTimeout(() => {
                            setLoading(false)
                       }, 1000)
                       setSuccessModal(true)
                    } else {
                        Api.Toast('error', result.message)
                    }
                } else {
                    Api.Toast('error', 'Something Went Wrong')
                }
            })
            
            } else {
                Api.Toast('error', 'Something Went Wrong')
            } 
            setTimeout(() => {
                setLoading(false)
              }, 1000)  
        }
    const getJD = () => {
        setLoading(true)
        Api.get(`/candidates/apply/job/pre/data/${url_params.uuid}/`).then(result => {
            if (result) {
                if (result.status === 200) {
                    setJDData(result.data.job_description[0])
                    setTimeIntervals(result.data.time_intervals)
                } else {
                    Api.Toast('error', result.message)
                }
            } 
        })
            // Api.get(`/jobs/${url_params.uuid}/jd/`).then(result => {
            //     if (result) {
            //         if (result.status === 200) {
            //             setJDData(result.data[0])
            //         } else {
            //             Api.Toast('error', result.message)
            //         }
            //     } 
            // })
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }
    useEffect(() => {
        getJD()
    }, [])
    return (
        <Fragment>
            <>
            <div className="row apply-head-row">
            <div className="col-lg-12 text-center">
                <h1 className="apply-heading">JOB APPLICATION</h1>
            </div>
            </div>
            <div className="row">
                <div className="col-lg-8 col-md-8 col-sm-12 my-5 apply-form-border">
                <Form onSubmit={e => e.preventDefault()}  id="create-job-form">
                    <Row>
                        <Col md='12' className='mb-1'>
                        <label className='form-label'>
                            Candidate Name
                        </label>
                            <Input
                            id="name"
                            value={name}
                            name="name"
                            className="name"
                            placeholder="name"
                            onChange={onChangeCandidateName}
                            />
                        <p style={{fontSize:'10px', color:'red'}}>{nameError ? nameError : null}</p>    
                        </Col>
                        
                        <Col md='12' className='mb-1'>
                        <label className='form-label'>
                            CNIC No.
                        </label>
                        <InputMask className="form-control"
                        mask="99999-9999999-9"  
                        id="cnic"
                        value={cnic}
                        name="cnic"
                        placeholder="cnic"
                        onBlur={onValidateCnic}
                        onChange={onChangeCnic}
                        
                        />
                            <p style={{fontSize:'10px', color:'red'}}>{cnicError ? cnicError : null}</p> 
                        </Col>

                        <Col md='12' className='mb-1'>
                        <label className='form-label'>
                            Email Address
                        </label>
                            <Input
                            id="email"
                            name="email"
                            value={email}
                            className="email"
                            placeholder="email"
                            onBlur={onValidateEmail}
                            onChange={onchangeEmail}
                            />
                        <p style={{fontSize:'10px', color:'red'}}>{emailError ? emailError : null}</p>  
                        </Col>

                        <Col md='12' className='mb-1'>
                        <label className='form-label'>
                            Phone No.
                        </label>
                            <InputMask
                            mask="+\929999999999"
                        
                            id="phone"
                            name="phone"
                            value={phone}
                            className="phone form-control"
                            placeholder="phone"
                            onBlur={onValidatePhone} 
                            onChange={onChangePhone}
                            />
                            <p style={{fontSize:'10px', color:'red'}}>{phoneError ? phoneError : null}</p>
                        </Col>

                        <Col md='12' className='mb-1'>
                        <label className='form-label'>
                            LinkedIn Profile
                        </label>
                            <Input
                            id="essential"
                            name="essential"
                            value={linkedin}
                            className="essential"
                            placeholder="LinkedIn Url"
                            // onBlur={validateLinkedIn}
                            onChange={onchangeLinkedIn}
                            
                            />
                            <p style={{fontSize:'10px', color:'red'}}>{linkedError ? linkedError : null}</p>  
                        </Col>
                        <Col md='12' className="mb-1">
                        {selectedImage ? (
                        <div>
                            <img
                            src={pdfImage}
                            alt="Thumb"
                            width="100"
                            />
                            <button className="btn" onClick={removeSelectedImage}>
                            <XCircle />
                            </button>
                        </div>
                        ) : (
                        <div>
                            <Label className="form-label">Upload Resume</Label>
                            {!selectedImage ? (
                                <Input
                                type="file"
                                value={selectedImage}
                                id="company_logo"
                                name="company_logo"
                                accept="pdf/image/*"
                            
                                onChange={imageChange}
                                />
                            ) : (
                                <>
                                <img
                                src={`${process.env.REACT_APP_BACKEND_URL}/${empData.profile_image}`}
                                alt="Thumb"
                                width="100"
                                />
                                <XCircle color="red" onClick={() => setSelectedImage(null)}/>
                                </>
                            )}
                           
                        </div>
                        )}
                        </Col>
                        <Col md={12}>
                        {timeIntervals.length > 0 && (
                            <>
                            <Card>
                                <CardBody>
                                <label className='form-label'>
                                    Interview Availability
                                </label>
                            
                                {timeIntervals.map((item) => (
                                    <div className='demo-inline-spacing' key={item.id}>
                                    <div className='form-check'>
                                        <Input type='radio' id={`ex-${item.id}`} value={item.id} name='ex1' onChange={(e) => setInterval(e.target.value)}/>
                                        <Label className='form-check-label' for={`ex-${item.id}`}>
                                        {item.time_interval_title}
                                        </Label>
                                    </div>
                                    </div>
                                ))}   
                              
                                </CardBody>
                            </Card>
                            </>
                        )}
                        </Col>
                    </Row>
                </Form>
                <div className="text-center">
                <Button color='primary' className='btn-next' onClick={submit}>
                    <span className='align-middle d-sm-inline-block'>Submit </span>
                    <Save size={14} className='align-middle ms-sm-25 ms-0'></Save>
                </Button>
                </div>
                </div>
                <div className="col-lg-4 my-5 already-applied-form">
                    <Col md='12' className='mb-1'>
                        <label className='form-label'>
                        If you have already applied for this position track by ID card #:
                        </label>
                        <InputMask className="form-control"
                        mask="99999-9999999-9"  
                        id="cnic"
                        value={trackCnic}
                        name="track_cnic"
                        placeholder="cnic #"
                        onBlur={e => onValidateCnic(e, true)}
                        onChange={e => onChangeCnic(e, true)}
                        />
                            <p style={{fontSize:'10px', color:'red'}}>{trackCnicError ? trackCnicError : null}</p> 
                        </Col>
                        <div className="text-center">
                            {!loading && (
                                <Button color='primary' className='btn-next' onClick={submitTrack}>
                                <span className='align-middle d-sm-inline-block'>Track </span>
                                <Clock size={14} className='align-middle ms-sm-25 ms-0'></Clock>
                            </Button>
                            )}
                            
                        </div>
                </div>
            </div>
            
            </>
            <Modal isOpen={successModal} toggle={() => setSuccessModal(!successModal)} className='modal-lg modal-dialog-centered'>
            <ModalHeader toggle={() => setSuccessModal(!successModal)}>Job Application Status</ModalHeader>
            <ModalBody>
                <ApplySuccess successData={applySuccessData} message={successMsg}/>
            </ModalBody>
            </Modal>

            <Modal isOpen={jdModal} toggle={() => setJDModal(!jdModal)} className='modal-lg modal-dialog-centered'>
            <ModalHeader toggle={() => setJDModal(!jdModal)}>Job Descriptions</ModalHeader>
            <ModalBody>
                {!loading ? (
                    <JDModal data={jdData} />
                ) : (
                    <div className='text-center'><Spinner/></div>
                )}
            </ModalBody>
            </Modal>
        </Fragment>
    )
}
export default applyForm