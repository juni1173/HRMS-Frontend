import { Fragment, useState } from 'react'
import { Card, CardTitle, CardHeader, CardBody, Col, Button, Row, Label, Badge, Input, Spinner } from 'reactstrap'
import { Send, XCircle } from 'react-feather'
import { EditorState, convertToRaw } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
// import EmailTemplateHelper from '../../../Helpers/EmailTemplateHelper'
import apiHelper from '../../../../Helpers/ApiHelper'
import '@styles/react/libs/editor/editor.scss'
const index = ({applicant_id}) => {
  const Api = apiHelper()
  const [loading, setLoading] = useState(false)
  const [body, setBody] = useState(EditorState.createEmpty())
  const [footer, setFooter] = useState(EditorState.createEmpty())
  const [sentEmailMsg, setSentEmailMsg] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [emailDetail, setEmailDetail] = useState({
    subject : ''
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

   
    const attachedFileUpload = (e) => {
        if (e.target.files && e.target.files.length > 0) {
          setSelectedFile(e.target.files[0]) 
        }
      } 
      const removeSelectedFile = () => {
        setSelectedFile() 
      } 
    const handleSubmit = async () => {
        setLoading(true)
      const bodyHtml = draftToHtml(convertToRaw(body.getCurrentContent()))
      const footerHtml = draftToHtml(convertToRaw(footer.getCurrentContent()))
    //   bodyHtml.replace(/<[^>]+>/g, '')
      if (emailDetail.subject !== ''
      && (bodyHtml !== null) && footerHtml !== null) {
        const formData = new FormData()
        formData.append('course_applicant', applicant_id)
        formData.append('subject', emailDetail.subject)
        formData.append('body', bodyHtml)
        formData.append('footer', footerHtml)
        if (selectedFile) formData.append('attachment', selectedFile)
        setLoading(false)
        
        await Api.jsonPost(`/course-applicant-emails/`, formData, false).then(result => {
          if (result) {
              if (result.status === 200) {
                    setSentEmailMsg(result.message)
                    Api.Toast('success', result.message)
              } else {
                Api.Toast('error', result.message)
              }
          } else {
            Api.Toast('error', 'Server Not Responding')
          }
        })
      }
     
    }
   
  return (
    <Fragment>
       <Row>
        <Col sm={12}>
          <Card>
            <CardHeader>
              <CardTitle tag='h4'>Email</CardTitle>
            </CardHeader>
            <CardBody>
               <Row>
                    <Col md="12" className='mb-1'>
                        <Row>
                            <Col md="6" className="mb-1">
                                <Label className="form-label">
                                Subject<Badge color='light-danger'>*</Badge>
                                </Label>
                                <Input
                                    type="text"
                                    name="subject"
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
                                Footer<Badge color='light-danger'>*</Badge>
                                </Label>
                                <Editor editorState={footer} onEditorStateChange={data => setFooter(data)} />
                            </Col>
                        </Row>
                    </Col> 
                </Row> 
              
            </CardBody>
          </Card>
        </Col>
      </Row>
      <div className='d-flex justify-content-between float-right'>
          {!loading ? (
            <Button color='primary'  onClick={handleSubmit}>
            <Send size={14} className='align-middle ms-sm-25 ms-0'></Send>
              <span className='align-middle d-sm-inline-block d-none'>Send</span>            
            </Button>
          ) : (
            <div className='text-center'><Spinner/></div>
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

export default index