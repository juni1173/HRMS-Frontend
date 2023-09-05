import React, { Fragment, useState, useEffect } from 'react'
import { Row, Col, Input, Button, Spinner, Label, Badge, Card, CardBody } from 'reactstrap'
import { Save, XCircle } from 'react-feather'
import apiHelper from '../Helpers/ApiHelper'
import InputMask from 'react-input-mask'
import pdfImage from "../../assets/images/icons/pdf-icon.png"
import KavSkillsLogo from "../../assets/images/logo/kavskills-logo.png"
import Select from 'react-select'
const KavskillForm = () => {
  const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const [cnic, setCnic] = useState('')
    const [cnicError, setCnicError] = useState('')
    const [email, setEmail] = useState('')
    const [emailError, setEmailError] = useState('')
    const [phone, setPhone] = useState('')
    const [phoneError, setPhoneError] = useState('')
    const [selectedResume, setSelectedResume] = useState(null)
    const [selectedLetter, setSelectedLetter] = useState(null)
    const [preData] = useState([])
    const [preDataRaw, setPreDataRaw] = useState([])
    const [cost, setCost] = useState(null)
    const [financialAid, setFinancialAid] = useState(false)

    const handleFinancialAidChange = (event) => {
        const value = event.target.value 
        setFinancialAid(value)
    }
    
    const [skillData, setSkillData] = useState({
        full_name: '',
        skill_type : '',
        educational_qualifications: '',
        university_name: '',
        major: '',
        objectives: '',
        joining_reason: '',
        financial_aid_reason: ''

   })
    const onChangSkillDetailHandler = (InputName, InputType, e) => {
        
        let InputValue
        if (InputType === 'input') {
        
        InputValue = e.target.value
        } else if (InputType === 'select') {
        
        InputValue = e
        } else if (InputType === 'date') {
            let dateFomat = e.split('/')
                dateFomat = `${dateFomat[2]}-${dateFomat[1]}-${dateFomat[0]}`    
            InputValue = dateFomat
        } else if (InputType === 'file') {
            InputValue = e.target.files[0].name
        }

        setSkillData(prevState => ({
        ...prevState,
        [InputName] : InputValue
        
        }))
        if (InputName === 'skill_type') {
            setCost(preDataRaw.find(pre => pre.id === InputValue) ? preDataRaw.find(pre => pre.id === InputValue).cost : null)
        }
    }
    const validateEmail = (email) => {
        const emailFormat = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i
        if (!emailFormat.test(email)) {
        setEmailError("Enter the Valid Email")
        return  false
        }
        return true
    }
    const onValidateEmail = (event) => {
        validateEmail(event.target.value)
    }
    const onchangeEmail = (event) => {
        setEmail(event.target.value)
        setEmailError("")
    }

    const checkCnic = (cnic) => {
        const getCnicNumberCount = cnic.replace(/[^0-9]/g, '')
            if (getCnicNumberCount.length !== 13) {
                    setCnicError("Your Cnic Length must be 13")
                return false
            }
            return true
        }
    
        const onValidateCnic = (event) => {
            checkCnic(event.target.value)
        }
    
        const onChangeCnic = (event) => {
                setCnic(event.target.value)
                setCnicError("")
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
    const preDataApi = async () => {
        
      const response = await Api.get('/kav_skills/pre/data/')
      if (response.status === 200) {
        setLoading(true)
        const data = response.data
        setPreDataRaw(response.data)
        preData.splice(0, preData.length)
          for (let i = 0; i < data.length; i++) {
            preData.push({value: data[i].id, label: data[i].title})
            
          }
          setTimeout(() => {
            setLoading(false)
        }, 500)
      } else {
          return Api.Toast('error', 'Pre server data not found')
      }
  }
  const validateResume = (filePath) => {
         
        if (["application/pdf"].includes(filePath.type)) {
            return true
        }
        return false
        
    }  
  const ResumeChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
        setSelectedResume(e.target.files[0]) 
        }
        
    } 
    const removeSelectedResume = () => {
        setSelectedResume() 
    }
    const validateLetter = (filePath) => {
         
        if (["application/pdf"].includes(filePath.type)) {
            return true
        }
        return false
        
    }  
  const LetterChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
        setSelectedLetter(e.target.files[0]) 
        }
        
    } 
    const removeSelectedLetter = () => {
        setSelectedLetter() 
    }
  useEffect(() => {
      preDataApi()
      }, [])
      const submit = async () => {
        
        if (skillData.full_name !== '' && skillData.skill_type !== '' && skillData.educational_qualifications !== '' 
        && skillData.joining_reason !== '' && cnic !== '' && email !== '' && phone !== '' && selectedResume
        && skillData.major !== '' && skillData.objectives !== '') {
          
            const isValidCnic = checkCnic(cnic)
            if (!isValidCnic) {
                Api.Toast('error',   "Cnic is not valid")
                return false
            }

            const isValidEmail = validateEmail(email)
            if (!isValidEmail) {
                Api.Toast('error',   "Enter the Valid Email")
                 return false
            }
            
            const isResumeValid = validateResume(selectedResume)
            if (!isResumeValid) {
                Api.Toast('error',   "Only pdf file are allowed for resume!")
                return false
            }
            if (selectedLetter) {
                const isLetterValid = validateLetter(selectedLetter)
                if (!isLetterValid) {
                    Api.Toast('error',   "Only pdf file are allowed for Cover Letter!")
                    return false
                }
            }
            if (financialAid === 'true') {
                if (skillData.financial_aid_reason === '') {
                    Api.Toast('error', 'Financial aid reason is required !')
                    return false
                }
            }
            const formData = new FormData()
            formData.append("full_name", skillData.full_name)
            formData.append("skill_type", skillData.skill_type)
            formData.append("cnic_no", cnic)
            formData.append("email", email)
            formData.append("contact_number", phone)
            formData.append("educational_qualifications", skillData.educational_qualifications)
            formData.append("major", skillData.major)
            formData.append("university_name", skillData.university_name)
            formData.append("joining_reason", skillData.joining_reason)
            formData.append("objectives", skillData.objectives)
            if (skillData.additional_information !== '') formData.append("additional_information", skillData.additional_information)
            formData.append("kav_skills_resume", selectedResume)
            if (selectedLetter) formData.append("cover_letter", selectedLetter)
            formData.append("financial_aid", financialAid)
            if (financialAid === true && skillData.financial_aid_reason) formData.append('financial_aid_reason', skillData.financial_aid_reason)
            await Api.jsonPost(`/kav_skills/`, formData, false)
                .then((result) => {
                    if (result.status === 200) {
                        Api.Toast('success', result.message) 
                        setLoading(true)
                        setFinancialAid(false)
                        setCost(null)
                        setEmail('')
                        setCnic('')
                        setPhone('')
                        setSelectedResume(null)
                        setTimeout(() => {
                            setLoading(false)
                        }, 500)                      
                        } else {
                            Api.Toast('error', result.message)
                        }
                })
            
            
        } else {
            Api.Toast('error',   "Please Fill All Required Fileds!")
        }
    }
  return (
    <Fragment>
            {!loading ? (
                <Row>
                    <Col md="2">
                    </Col>
                    <Col md="8">
                        <Card>
                            <CardBody>
                                <div className='text-center'>
                                <img
                                className='mb-4'
                                src={KavSkillsLogo}
                                alt="Kavskills"
                                width="200"
                                />
                                </div>
                                <Row>
                                    <Col md='4' className='mb-1'>
                                    <label className='form-label'>
                                        Full Name <Badge color='light-danger'>*</Badge>
                                    </label>
                                        <Input
                                        id="full_name"
                                        name="full_name"
                                        placeholder="Full Name"
                                        onChange={ (e) => { onChangSkillDetailHandler('full_name', 'input', e) }}
                                        />
                                    </Col>
                                    <Col md="4" className="mb-1">
                                        <Label className="form-label">
                                        Skill Type <Badge color='light-danger'>*</Badge>
                                        </Label>
                                        <Select
                                            isClearable={false}
                                            className='react-select'
                                            classNamePrefix='select'
                                            name="type"
                                            options={preData}
                                            onChange={ (e) => { onChangSkillDetailHandler('skill_type', 'select', e.value) }}
                                        />
                                    </Col>
                                    <Col md='4' className='mb-1'>
                                    <label className='form-label'>
                                    Email <Badge color='light-danger'>*</Badge>
                                    </label>
                                        <Input
                                        id="email"
                                        name="email"
                                        value={email}
                                        placeholder="Email"
                                        onBlur={onValidateEmail}
                                        onChange={onchangeEmail}
                                        />
                                        <p style={{fontSize:'10px', color:'red'}}>{emailError ? emailError : null}</p>  
                                    </Col>
                                    <Col md='6' className='mb-1'>
                                    <label className='form-label'>
                                            Cost 
                                            </label>
                                        {cost ? (
                                            <Input 
                                            placeholder={cost}
                                            disabled
                                            />
                                        ) : (
                                            <Input 
                                            placeholder='No Cost Available!'
                                            disabled
                                            />
                                        )}
                                    </Col>
                                    <Col md='6' className='mb-1'>
                                    
                                    <div className='demo-inline-spacing'>
                                    <label className='form-label'>
                                    Financial Aid <Badge color='light-danger'>*</Badge>
                                    </label>
                                    <div className='form-check'>
                                    <Input 
                                    type='radio' 
                                    id='radio-primary' 
                                    name='ex1' 
                                    value={true}
                                    onChange={handleFinancialAidChange} />
                                    <Label className='form-check-label' for='ex1-inactive'>
                                        Yes
                                    </Label>
                                    </div>
                                    <div className='form-check'>
                                    <Input 
                                    type='radio' 
                                    name='ex1' 
                                    id='radio-primary' 
                                    value={false}
                                    onChange={handleFinancialAidChange} 
                                    defaultChecked
                                     />
                                    <Label className='form-check-label' for='ex1-active'>
                                        No
                                    </Label>
                                    </div>
                                </div>
                                    </Col>
                                    {financialAid === 'true' && (
                                        <Col md='12' className='mb-1'>
                                            <label className='form-label'>
                                            Kindly tell us why are you applying for financial aid ?<Badge color='light-danger'>*</Badge>
                                        </label>
                                        <Input
                                        type='textarea'
                                        id="financial_aid_reason"
                                        name="financial_aid_reason"
                                        placeholder="Financial Aid Reason"
                                        onChange={ (e) => { onChangSkillDetailHandler('financial_aid_reason', 'input', e) }}
                                        />
                                        </Col>
                                    )}
                                    <Col md='6' className='mb-1'>
                                        <label className='form-label'>
                                            CNIC # <Badge color='light-danger'>*</Badge>
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
                                    <Col md='6' className='mb-1'>
                                    <label className='form-label'>
                                    Contact Number <Badge color='light-danger'>*</Badge>
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
                                        Latest Educational Qualification (Matric/O-level, FSc. (A-level), BSc., MSc., Diploma, etc.) <Badge color='light-danger'>*</Badge>
                                        </label>
                                        <Input
                                        id="educational_qualifications"
                                        name="educational_qualifications"
                                        placeholder="Educational Qualifications"
                                        onChange={ (e) => { onChangSkillDetailHandler('educational_qualifications', 'input', e) }}
                                        />
                                    </Col>
                                    <Col md='12' className='mb-1'>
                                        <label className='form-label'>
                                        University/Institution Name <Badge color='light-danger'>*</Badge>
                                        </label>
                                        <Input
                                        id="university_name"
                                        name="university_name"
                                        placeholder="University Name"
                                        onChange={ (e) => { onChangSkillDetailHandler('university_name', 'input', e) }}
                                        />
                                    </Col>
                                    <Col md='6' className="mb-1">
                                    {selectedResume ? (
                                    <div>
                                        <img
                                        src={pdfImage}
                                        alt="Thumb"
                                        width="100"
                                        />
                                        <button className="btn" onClick={removeSelectedResume}>
                                        <XCircle />
                                        </button>
                                    </div>
                                    ) : (
                                    <div>
                                        <Label className="form-label">Upload your CV/Resume (pdf)</Label>  <Badge color='light-danger'>*</Badge>
                                        {!selectedResume ? (
                                            <Input
                                            type="file"
                                            value={selectedResume}
                                            id="resume"
                                            name="resume"
                                            accept="pdf/image/*"
                                        
                                            onChange={ResumeChange}
                                            />
                                        ) : (
                                            <>
                                            <img
                                                src={pdfImage}
                                                alt="Thumb"
                                                width="100"
                                                />
                                            <XCircle color="red" onClick={() => setSelectedResume(null)}/>
                                            </>
                                        )}
                                        
                                    </div>
                                    )}
                                    </Col>
                                    <Col md='6' className="mb-1">
                                    {selectedLetter ? (
                                    <div>
                                        <img
                                        src={pdfImage}
                                        alt="Thumb"
                                        width="100"
                                        />
                                        <button className="btn" onClick={removeSelectedLetter}>
                                        <XCircle />
                                        </button>
                                    </div>
                                    ) : (
                                    <div>
                                        <Label className="form-label">Upload Cover Letter (Optional)</Label>
                                        {!selectedLetter ? (
                                            <Input
                                            type="file"
                                            value={selectedLetter}
                                            id="Letter"
                                            name="Letter"
                                            accept="pdf/image/*"
                                        
                                            onChange={LetterChange}
                                            />
                                        ) : (
                                            <>
                                            <img
                                                src={pdfImage}
                                                alt="Thumb"
                                                width="100"
                                                />
                                            <XCircle color="red" onClick={() => setSelectedLetter(null)}/>
                                            </>
                                        )}
                                        
                                    </div>
                                    )}
                                    </Col>
                                    <Col md='12' className='mb-1'>
                                        <label className='form-label'>
                                        Major/Field of Study <Badge color='light-danger'>*</Badge>
                                        </label>
                                        <Input
                                        id="major"
                                        name="major"
                                        placeholder="Major"
                                        onChange={ (e) => { onChangSkillDetailHandler('major', 'input', e) }}
                                        />
                                    </Col>
                                    <Col md='12' className='mb-1'>
                                        <label className='form-label'>
                                        Why are you interested in joining KavSkills? (250 words or less) <Badge color='light-danger'>*</Badge>
                                        </label>
                                        <Input
                                        type='textarea'
                                        id="joining_reason"
                                        name="joining_reason"
                                        placeholder="Joining Reason"
                                        onChange={ (e) => { onChangSkillDetailHandler('joining_reason', 'input', e) }}
                                        />
                                    </Col>
                                    <Col md='12' className='mb-1'>
                                        <label className='form-label'>
                                        What do you hope to achieve by attending KavSkills? (250 words or less) <Badge color='light-danger'>*</Badge>
                                        </label>
                                        <Input
                                        id="objectives"
                                        type='textarea'
                                        name="objectives"
                                        placeholder="Objectives"
                                        onChange={ (e) => { onChangSkillDetailHandler('objectives', 'input', e) }}
                                        />
                                    </Col>
                                    <Col md='12' className='mb-1'>
                                        <label className='form-label'>
                                        Is there any other information or skills you'd like us to know about you? 
                                        </label>
                                        <Input
                                        id="additional_information"
                                        type='textarea'
                                        name="additional_information"
                                        placeholder="Additional Information"
                                        onChange={ (e) => { onChangSkillDetailHandler('additional_information', 'input', e) }}
                                        />
                                    </Col>
                                    <Button color='primary' className='btn-next' onClick={submit}>
                                        <span className='align-middle d-sm-inline-block'>Submit </span>
                                        <Save size={14} className='align-middle ms-sm-25 ms-0'></Save>
                                    </Button>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col md="2"></Col>
                    
                </Row>
            ) : (
                <div className='text-center'><Spinner/></div>
            )}
    </Fragment>
  )
}

export default KavskillForm