import { Fragment, useState, useEffect } from 'react'
import { Card, CardHeader, CardBody, CardTitle, Col, Button, Row } from 'reactstrap'
import { ArrowLeft, ArrowRight } from 'react-feather'
import { EditorState, ContentState, convertToRaw, convertFromHTML } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'

import '@styles/react/libs/editor/editor.scss'

const UpdateJobDescription = ({stepper, CallBack, preData }) => {
  
    const [loading, setLoading] = useState(true)
    const [value, setValue] = useState(EditorState.createEmpty())
    const responsibilitySubmit = () => {
      const call = CallBack(draftToHtml(convertToRaw(value.getCurrentContent())), '2')
      console.warn(call)
      stepper.next()
    }
    useEffect(() => {
      setLoading(true)
      setValue(EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(preData.main_responsibilities))))
      setLoading(false)
    }, [])
    return (
      <Fragment>
        <Row>
          <Col sm={12}>
            <Card>
              <CardHeader>
                <CardTitle tag='h4'>Description</CardTitle>
              </CardHeader>
              <CardBody>
                {!loading && (
                  <Editor editorState={value} onEditorStateChange={data => setValue(data)} />
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
        
         
        <div className='d-flex justify-content-between'>
            <Button color='primary' className='btn-prev' onClick={() => stepper.previous()}>
              <ArrowLeft size={14} className='align-middle me-sm-25 me-0'></ArrowLeft>
              <span className='align-middle d-sm-inline-block d-none'>Previous</span>
            </Button>
            <Button color='primary' className='btn-next' onClick={responsibilitySubmit}>
              <span className='align-middle d-sm-inline-block d-none'>Next</span>
              <ArrowRight size={14} className='align-middle ms-sm-25 ms-0'></ArrowRight>
            </Button>
          </div>
     
      </Fragment>
    )
}
export default UpdateJobDescription