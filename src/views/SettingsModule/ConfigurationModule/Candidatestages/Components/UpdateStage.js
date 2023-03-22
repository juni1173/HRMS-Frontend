import React, { Fragment, useState, useEffect } from 'react'
import {Input, Button, Label, Row, Col, Badge, Spinner} from 'reactstrap'
import apiHelper from '../../../../Helpers/ApiHelper'
import EmailTemplateHelper from '../../../../Helpers/EmailTemplateHelper'
import Select from 'react-select'
const UpdateStage = ({ data, CallBack }) => {
    const Api = apiHelper()
    const Helper = EmailTemplateHelper()
    const [loading, setLoading] = useState(false)
    const [emailTemplates] = useState([])
    const [title, setTitle] = useState(data.title ? data.title : "")
    const [email_template, setEmailTemplate] = useState(data.email_template ? data.email_template : "")
    const getEmailTemplates = async () => {
        setLoading(true)
        if (emailTemplates.length > 0) {
            emailTemplates.splice(0, emailTemplates.length)
        }
        await Helper.fetchEmailList().then(data => {
            if (data) {
                if (Object.values(data).length > 0) {
                    for (let i = 0; i < Object.values(data).length; i++) {
                        emailTemplates.push({value: data[i].id, label: data[i].title})
                    }
                } else {
                    emailTemplates.splice(0, emailTemplates.length)
                }
            } else {
                emailTemplates.splice(0, emailTemplates.length)
            }
            
        })
        setTimeout(() => {
            setLoading(false)
        }, 500)
    }
      const handleSubmit = async (event) => {
        event.preventDefault()
        if (title !== '') {
          const formData = new FormData()
          formData['title'] = title
          if (data.email_template !== email_template) formData['email_template'] = email_template
          await Api.jsonPatch(`/stages/${data.id}/`, formData).then(result => {
            if (result) {
              if (result.status === 200) {
                Api.Toast('success', result.message)
                CallBack()
              } else {
                Api.Toast('error', result.message)
              }
            } else {
              Api.Toast('error', 'Server not responding!')
            }
          })
        } else {
          Api.Toast('error', 'Please fill all the fields')
        }
      }
      useEffect(() => {
        getEmailTemplates()
      }, [])
  return (
    <Fragment>
      <h2>Update Stage</h2>
      <form onSubmit={handleSubmit}>
        <Row>
          
          <Col md={6} className='mt-1'>
            <Label>Title <Badge color='light-danger'>*</Badge></Label>
            <Input
              type="text"
              id="title"
              defaultValue={data.title ? data.title : ''}
              onChange={(event) => setTitle(event.target.value)}
            />
          </Col>
          <Col md={6} className='mt-1'>
            <Label>Email Template</Label>
            {!loading ? (
                <Select 
                options={emailTemplates}
                defaultValue={emailTemplates.find(pre => pre.value === data.email_template) ? emailTemplates.find(pre => pre.value === data.email_template) : ''}
                onChange={(event) => setEmailTemplate(event.value)}
            />
            ) : (
                <Spinner color='primary' type='grow' />
            )}
          </Col>
        </Row>
      <Button className='btn btn-warning mt-1 float-right'>
        Update
      </Button>
    </form>
    </Fragment>
  )
}

export default UpdateStage