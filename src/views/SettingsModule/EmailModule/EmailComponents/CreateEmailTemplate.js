import { Fragment, useState, useEffect } from 'react'
import { Card, CardHeader, CardBody, CardTitle, Col, Button, Row, Label, Badge, Input, Spinner } from 'reactstrap'
import { Plus } from 'react-feather'
import { EditorState, convertToRaw } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import EmailTemplateHelper from '../../../Helpers/EmailTemplateHelper'
import apiHelper from '../../../Helpers/ApiHelper'
import '@styles/react/libs/editor/editor.scss'

const CreateEmailTemplate = ({ CallBack }) => {
  const Helper = EmailTemplateHelper()
  const Api = apiHelper()
  const [loading, setLoading] = useState(false)
  const [body, setBody] = useState(EditorState.createEmpty())
  const [footer, setFooter] = useState(EditorState.createEmpty())
  const [Variables, setVariables] = useState([])
  const [emailDetail, setEmailDetail] = useState({
    title : '',
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
const handleSubmit = async () => {
  const bodyHtml = draftToHtml(convertToRaw(body.getCurrentContent()))
  const footerHtml = draftToHtml(convertToRaw(footer.getCurrentContent()))
  if (emailDetail.title !== '' && emailDetail.title !== ''
  && bodyHtml !== null && footerHtml !== null) {
    const formData = new FormData()
    formData['title'] = emailDetail.title
    formData['subject_line'] = emailDetail.subject
    formData['body'] = bodyHtml
    formData['footer'] = footerHtml
    await Api.jsonPost(`/email/templates/`, formData).then(result => {
      if (result) {
          if (result.status === 200) {
            CallBack()
          } else {
            Api.Toast('error', result.message)
          }
      } else {
        Api.Toast('error', 'Server Not Responding')
      }
    })
  }
}
const getVariables = async () => {
  setLoading(true)
        if (Variables !== null) {
          Variables.splice(0, Variables.length)
        }
        await Helper.fetchEmailVariables().then(data => {
          console.warn(data)
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
useEffect(() => {
  getVariables()
}, [])
  return (
    <Fragment>
      <Row>
        <Col sm={12}>
          <Card>
            <CardHeader>
              <CardTitle tag='h4'>Email Template</CardTitle>
            </CardHeader>
            <CardBody>
               <Row>
                    <Col md="9" className='mb-1'>
                        <Row>
                            <Col md="6" className="mb-1">
                            <Label className="form-label">
                            Title<Badge color='light-danger'>*</Badge>
                            </Label>
                            <Input
                                type="text"
                                name="title"
                                onChange={ (e) => { onChangeEmailHandler('title', 'input', e) }}
                                placeholder="Title"
                                
                                />
                            </Col>
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
                    <Col md="3" className='mb-1'>
                        <Label>
                            Variables
                        </Label>
                        
                          {Variables.length > 0 ? (
                            !loading ? (
                              <ul>
                                {Variables.map((variable, index) => (
                                  <li key={index}>{variable.code}</li>
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
          
          <Button color='primary'  onClick={handleSubmit}>
          <Plus size={14} className='align-middle ms-sm-25 ms-0'></Plus>
            <span className='align-middle d-sm-inline-block d-none'>Email Template</span>            
          </Button>
      </div>
    </Fragment>
  )
}

export default CreateEmailTemplate
