import { Fragment, useState, useEffect } from 'react'
import { Card, CardBody, Col, Button, Row, Label, Badge, Input, Spinner } from 'reactstrap'
import { Send, XCircle } from 'react-feather'
import { EditorState, ContentState, convertToRaw, convertFromHTML } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import EmailTemplateHelper from '../../../Helpers/EmailTemplateHelper'
import apiHelper from '../../../Helpers/ApiHelper'
import '@styles/react/libs/editor/editor.scss'
const EmailForm = ({EmailData}) => {
  const Helper = EmailTemplateHelper()
  const Api = apiHelper()
  const [loading, setLoading] = useState(false)
  const [body, setBody] = useState(EditorState.createEmpty())
  const [footer, setFooter] = useState(EditorState.createEmpty())
  const [Variables, setVariables] = useState([])
  const [sentEmailMsg, setSentEmailMsg] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [sendLoader, setSendLoader] = useState(false)
  const [emailDetail, setEmailDetail] = useState({
    subject : EmailData.subject_line ? EmailData.subject_line : ''
  })
  const onChangeEmailHandler = (InputName, InputType, e) => {
   
      let InputValue
      if (InputType === 'input') {
      
      InputValue = e.target.value
      } else if (InputType === 'select') {
      
      InputValue = e
      } else if (InputType === 'date') {
          const dateFormat = Api.formatDate(e)
            
          InputValue = dateFormat
      } else if (InputType === 'file') {
          InputValue = e.target.files[0].name
      }
  
      setEmailDetail(prevState => ({
      ...prevState,
      [InputName] : InputValue
      
      
      }))
  }
    const getVariables = async () => {
      setLoading(true)
            if (Variables !== null) {
              Variables.splice(0, Variables.length)
            }
            await Helper.fetchEmailVariables().then(data => {
                if (data) {
                    if (Object.values(data).length > 0) {
                      setVariables(data)
                    } else {
                      setVariables([])
                    }
                } else {
                  setVariables([])
                }
                
            })
            setTimeout(() => {
                setLoading(false)
              }, 1000)
    }
    const attachedFileUpload = (e) => {
      if (e.target.files && e.target.files.length > 0) {
        setSelectedFile(e.target.files[0]) 
      }
    } 
    const removeSelectedFile = () => {
      setSelectedFile() 
    } 
    const handleSubmit = async () => {
        setSendLoader(true)
      const bodyHtml = draftToHtml(convertToRaw(body.getCurrentContent()))
      const footerHtml = draftToHtml(convertToRaw(footer.getCurrentContent()))
    //   bodyHtml.replace(/<[^>]+>/g, '')
      if (emailDetail.subject !== ''
      && bodyHtml !== null && footerHtml !== null) {
        const formData = new FormData()
        formData.append('subject', emailDetail.subject)
        formData.append('body', bodyHtml)
        formData.append('footer', footerHtml)
        formData.append('attachment', selectedFile ? selectedFile : null)
        await Api.jsonPatch(`/email/templates/candidate/job/save/${EmailData.candidate_email.candidate_job_uuid}/${EmailData.candidate_email.id}/`, formData, false).then(result => {
          if (result) {
              if (result.status === 200) {
                 Api.get(`/email/templates/candidate/job/email/send/${EmailData.candidate_email.candidate_job_uuid}/${EmailData.candidate_email.id}/`)
                .then(data => {
                    // CallBack()
                    setSentEmailMsg(data.message)
                    Api.Toast('success', data.message)
                })
              } else {
                Api.Toast('error', result.message)
              }
          } else {
            Api.Toast('error', 'Server Not Responding')
          }
        })
      }
      setSendLoader(false)
    }
    useEffect(() => {
      getVariables()
      if (EmailData.body) setBody(EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(EmailData.body))))
      if (EmailData.footer) setFooter(EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(EmailData.footer))))
    }, [])
  return (
    <Fragment>
       <Row>
        <Col sm={12}>
          <Card>
            {/* <CardHeader>
              <CardTitle tag='h4'>Email Template</CardTitle>
            </CardHeader> */}
            <CardBody>
               <Row>
                    <Col md="9" className='mb-1'>
                        <Row>
                            <Col md="6" className="mb-1">
                                <Label className="form-label">
                                Subject<Badge color='light-danger'>*</Badge>
                                </Label>
                                <Input
                                    type="text"
                                    name="subject"
                                    defaultValue={EmailData.subject_line}
                                    onChange={ (e) => { onChangeEmailHandler('subject', 'input', e) }}
                                    placeholder="Subject"
                                    
                                    />
                            </Col>
                            <Col md="6" className='mb-1'>
                            {selectedFile ? (
                                <div className="float-right">
                                    Attachment File Uploaded
                                    <button className="btn" onClick={removeSelectedFile}>
                                    <XCircle color='red'/>
                                    </button>
                                </div>
                                ) : (
                                <div>
                                    <Label className="form-label">Attachment</Label>
                                    <Input
                                        type="file"
                                        id="attachment"
                                        name="attachment"
                                        accept="*"
                                        onChange={attachedFileUpload}
                                        />
                                </div>
                                )}
                            </Col>
                            <Col md="12" className='mb-1'>
                            <Label className="form-label">
                                Body<Badge color='light-danger'>*</Badge>
                                </Label>
                                <Editor editorState={body} onEditorStateChange={data => setBody(data)} />
                            </Col>
                            <Col md="12" className="mb-1">
                                <Label className="form-label">
                                Footer <Badge color='light-danger'>*</Badge>
                                </Label>
                                <Editor editorState={footer} onEditorStateChange={data => setFooter(data)} />
                            </Col>
                        </Row>
                    </Col>
                    <Col md="3" className='mb-1'>
                        <Label>
                            Variables
                        </Label>
                        
                          {Variables.length > 0 ? (
                            !loading ? (
                              <ul>
                                {Variables.map((variable, index) => (
                                  <button key={index}
                                  className='btn btn-warning mb-1'
                                  onClick={() =>  {
                                    navigator.clipboard.writeText(variable.code)
                                    Api.Toast('success', 'Variable copied to clipboard')
                                  }}
                                >
                                  {variable.code}
                                </button>
                                ))}
                                
                              </ul>
                            ) : (
                              <div className="text-center"><Spinner type='grow' color='lightgreen'/></div>
                            )
                            
                          ) : (
                            <p>No Variables Found</p>
                          )
                        }
                    </Col>
                   
                </Row> 
              
            </CardBody>
          </Card>
        </Col>
      </Row>
      <div className='d-flex justify-content-between float-right'>
          {!sendLoader ? (
            <Button color='primary'  onClick={handleSubmit}>
            <Send size={14} className='align-middle ms-sm-25 ms-0'></Send>
              <span className='align-middle d-sm-inline-block d-none'>Send</span>            
            </Button>
          ) : (
            <Spinner/>
          )}
          
      </div>
      {sentEmailMsg !== '' && (
        <div className='bg-green m-1'>
        <p className='text-white'>{sentEmailMsg}</p>
      </div>
      )}
      
    </Fragment>
  )
}

export default EmailForm