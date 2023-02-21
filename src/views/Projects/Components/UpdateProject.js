import React, { Fragment, useState } from 'react'
import {Input, Button, Label, Row, Col, Badge} from 'reactstrap'
import apiHelper from '../../Helpers/ApiHelper'

const UpdateProject = ({ data, CallBack }) => {
    const Api = apiHelper()
    const [name, setName] = useState(data.name ? data.name : "")
    const [code, setCode] = useState(data.code ? data.code : "")
  
      const handleSubmit = async (event) => {
        event.preventDefault()
        if (name !== '' && code !== '') {
          const formData = new FormData()
          formData['name'] = name
          formData['code'] = code
          await Api.jsonPatch(`/projects/${data.uuid}/`, formData).then(result => {
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
  return (
    <Fragment>
      <h2>Update Project</h2>
      <form onSubmit={handleSubmit}>
        <Row>
          
          <Col md={6} className='mt-1'>
            <Label>Name <Badge color='light-danger'>*</Badge></Label>
            <Input
              type="text"
              id="name"
              defaultValue={data.name ? data.name : ''}
              onChange={(event) => setName(event.target.value)}
            />
          </Col>
          <Col md={6} className='mt-1'>
            <Label>Code <Badge color='light-danger'>*</Badge></Label>
            <Input
              type="text"
              id="code"
              defaultValue={data.code ? data.code : ''}
              onChange={(event) => setCode(event.target.value)}
            />
          </Col>
        </Row>
      <Button className='btn btn-warning mt-1 float-right'>
        Update
      </Button>
    </form>
    </Fragment>
  )
}

export default UpdateProject