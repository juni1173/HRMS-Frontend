import { Fragment, useEffect, useState } from 'react'
import { Spinner, Label, Badge, Button } from 'reactstrap'
import Select from 'react-select'
// import '@styles/react/libs/flatpickr/flatpickr.scss'
import apiHelper from '../../../Helpers/ApiHelper'
import EmailForm from './EmailForm'

const EmailSetup = ({ uuid, stage_id }) => {
    const Api = apiHelper()
    const [templates] = useState([])
    const [loading, setLoading] = useState(false)
    const [candidateEmail, setCandidateEmail] = useState([])
    const [emailTemplateData, setEmailTemplateData] = useState([])

    const getPreData = async () => {
        setLoading(true)
        await Api.get(`/candidates/pre/data/`).then(result => {
            if (result) {
                if (result.status === 200) {
                    const final = result.data
                    // setPreData(final)
                    const templatesData = final.email_templates
                    templates.splice(0, templates.length)
                    for (let i = 0; i < templatesData.length; i++) {
                        templates.push({value: templatesData[i].id, label: templatesData[i].title})
                    }
                } else {
                    Api.Toast('error', result.message)
                }
            } else {
                Api.Toast('error', 'Server not responding')
            }
        })
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }
    const getEmailData = async (id) => {
        setLoading(true)
        console.warn(candidateEmail)
        await Api.get(`/email/templates/candidate/job/view/${uuid}/${id}/`).then(result => {
            if (result) {
                if (result.status === 200) {
                    const final = result.data
                    console.warn(final)
                    setEmailTemplateData(final)
                } else {
                    Api.Toast('error', result.message)
                }
            } else {
                Api.Toast('error', 'Server not responding')
            }
        })
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }
    const setEmail = async (value) => {
        setLoading(true)
        if (value) {
            const formData = new FormData()
            formData['stage'] = stage_id
            formData['email_template'] = value
            await Api.jsonPost(`/email/templates/candidate/job/${uuid}/`, formData).then(result => {
                if (result) {
                    if (result.status === 200) {
                       const final = result.data
                        setCandidateEmail(final)
                        getEmailData(final.id)
                    } else {
                        Api.Toast('error', result.message)
                    }
                } else {
                    Api.Toast('error', 'Server not responding')
                }
            })
        } else {
            Api.Toast('error', 'Please select email template first!')
        }
       
        setTimeout(() => {
            setLoading(false)
        }, 1000)   
    }
    const onChangeEmailTemplate = (value) => {
        setEmail(value)
    }
    const sendCallBack = () => {
        console.warn('save and sent')
    }
    useEffect(() => {
        getPreData()
    }, [])
  return (
    <Fragment>
        {!loading ? (
            <div className='row'>
                {Object.values(emailTemplateData).length > 0 ? (
                    <>
                    <div className="col-md-6">
                        <Badge color='light-info'>
                            Stage Title 
                        </Badge><br></br>
                        <span className="jd_position" style={{color: "black", fontWeight:"20px", padding:"0.3rem 0.5rem"}}>{emailTemplateData.candidate_email.stage_title && emailTemplateData.candidate_email.stage_title}</span>
                    </div>
                    <div className="col-md-6">
                        <Badge color='light-info'>
                            Email Template Title 
                        </Badge><br></br>
                        <span className="jd_position" style={{color: "black", fontWeight:"20px", padding:"0.3rem 0.5rem"}}>{emailTemplateData.candidate_email.email_template_title && emailTemplateData.candidate_email.email_template_title}</span>
                    </div>
                    <EmailForm EmailData={emailTemplateData} CallBack={sendCallBack}/>
                    {/* <div className="col-md-12"> */}
                        
                        {/* <Badge color='light-primary'>
                            Subject Line
                        </Badge><br></br>
                        <span className="jd_position" style={{color: "black", fontWeight:"20px", padding:"0.3rem 0.5rem"}}>{emailTemplateData.subject_line && emailTemplateData.subject_line}</span> */}
                    {/* </div> */}
                    {/* <div className="col-md-12">
                        <Badge color='light-success'>
                            Body
                        </Badge><br></br>
                        <span className="jd_position" style={{color: "black", fontWeight:"20px", padding:"0.3rem 0.5rem"}}>{emailTemplateData.body && emailTemplateData.body}</span>
                    </div>
                    <div className="col-md-12">
                        <Badge color='light-warning'>
                            Footer
                        </Badge><br></br>
                        <span className="jd_position" style={{color: "black", fontWeight:"20px", padding:"0.3rem 0.5rem"}}>{emailTemplateData.footer && emailTemplateData.footer}</span>
                    </div> */}
                    {/* <div className='col-lg-12'>
                        <Button className='btn btn-success float-right' onClick={SendEmail}>
                            Save & Send 
                        </Button>
                    </div> */}
                    </>
                ) : (
                    
                    <div className='col-lg-6 mb-1'>
                    <Label>
                        Select Email Template<Badge color='light-danger'>*</Badge>
                    </Label>
                    <Select
                        type="text"
                        name="interviewer"
                        options={templates}
                        onChange={ (e) => { onChangeEmailTemplate(e.value) }}
                    />
                </div>
                
                )}
                
            </div>
        ) : (
            <div className="text-center"><Spinner/></div>
        )}    
    </Fragment>
  )
}

export default EmailSetup