import React, { Fragment, useState, useEffect } from 'react'
import Select from 'react-select'
import {Input, Button, Label, Row, Col, Badge, Spinner} from 'reactstrap'
import apiHelper from '../../Helpers/ApiHelper'

const NotesAdd = ({ CallBack }) => {
  const Api = apiHelper()
  const [loading, setLoading] = useState(false)
  const [employeeName, setEmployeeName] = useState("")
  const [notes, setNotes] = useState("")
  const [addedBy, setAddedBy] = useState("")
  const [employee_dropdown] = useState([])

  const getEmployeeData = async () => {
    setLoading(true)
      await Api.get(`/organization/${Api.org ? Api.org.id : 4}/kind/notes/pre/data/view/`).then(result => {
        if (result) {
          if (result.status === 200) {
              employee_dropdown.splice(0, employee_dropdown.length)
              const employeeData = result.data
              for (let i = 0; i < employeeData.length; i++) {
                employee_dropdown.push({value: employeeData[i].id, label: employeeData[i].name})
              } 
          } else {
              Api.Toast('error', result.message)
          }
        } 
      })  
      setTimeout(() => {
        setLoading(false)
      }, 500)
  }
  const handleSubmit = async (event) => {
    event.preventDefault()
    if (employeeName !== '' && notes !== '' && addedBy !== '') {
      const formData = new FormData()
      formData['reciever'] = employeeName
      formData['sender'] = addedBy
      formData['notes'] = notes
      await Api.jsonPost(`/organization/${Api.org ? Api.org.id : 4}/kind/notes/`, formData).then(result => {
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
    getEmployeeData()
  }, [])
  return (
    <Fragment>
      <h2>Add Kind Note</h2>
      <form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Label>Employee <Badge color='light-danger'>*</Badge>{loading && <Spinner type="grow"/>}</Label>
            {!loading ? (
              <Select
                id="employee-name"
                options={employee_dropdown}
                onChange={(event) => setEmployeeName(event.value)}
              />
            ) : (
              <Select
                id="employee-name"
                isDisabled
              />
            )}
            
          </Col>
          <Col md={6}>
            <Label>Added by <Badge color='light-danger'>*</Badge>{loading && <Spinner type="grow"/>}</Label>
            {!loading ? (
            <Select
              id="added-by"
              options={employee_dropdown}
              onChange={(event) => setAddedBy(event.value)}
            />
            ) : (
              <Select
                id="added-by"
                isDisabled
              />
            )}
          </Col>
          <Col md={12} className='mt-1'>
            <Label>Note <Badge color='light-danger'>*</Badge></Label>
            <Input
              type="textarea"
              id="note"
              onChange={(event) => setNotes(event.target.value)}
            />
          </Col>
        </Row>
      <Button className='btn btn-success mt-1'>
        Save
      </Button>
    </form>
    </Fragment>
  )
}

export default NotesAdd