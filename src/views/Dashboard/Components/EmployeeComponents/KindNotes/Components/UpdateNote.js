import React, { Fragment, useState, useEffect } from 'react'
import Select from 'react-select'
import {Input, Button, Label, Row, Col, Badge, Spinner} from 'reactstrap'
import apiHelper from '../../../../../Helpers/ApiHelper'

const UpdateNote = ({ data, CallBack }) => {
    // console.warn(data)
    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const [employeeName, setEmployeeName] = useState(data.receiver ? data.receiver : '')
    const [notes, setNotes] = useState(data.notes ? data.notes : "")
    const [employee_dropdown] = useState([])
    const getEmployeeData = async () => {
        setLoading(true)
          await Api.get(`/kind-notes/pre/data/`).then(result => {
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
        if (employeeName !== '' && notes !== '') {
          const formData = new FormData()
          formData['receiver'] = employeeName
          formData['notes'] = notes
          await Api.jsonPatch(`/kind-notes/${data.id}/`, formData).then(result => {
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
      <h2>Update Kind Note</h2>
      <form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Label>Employee <Badge color='light-danger'>*</Badge>{loading && <Spinner type="grow"/>}</Label>
            {!loading && (
              <Select
                id="employee-name"
                options={employee_dropdown}
                defaultValue={employee_dropdown.find(pre => pre.value === data.receiver) ? employee_dropdown.find(pre => pre.value === data.receiver) : ''}
                onChange={(event) => setEmployeeName(event.value)}
              />
            )}
            
          </Col>
          {/* <Col md={6}>
            <Label>Added by <Badge color='light-danger'>*</Badge>{loading && <Spinner type="grow"/>}</Label>
            {!loading && (
            <Select
              id="added-by"
              options={employee_dropdown}
              defaultValue={employee_dropdown.find(pre => pre.value === data.sender) ? employee_dropdown.find(pre => pre.value === data.sender) : ''}
              onChange={(event) => setAddedBy(event.value)}
            />
            )}
          </Col> */}
          <Col md={12} className='mt-1'>
            <Label>Note <Badge color='light-danger'>*</Badge></Label>
            <Input
              type="textarea"
              id="note"
              defaultValue={data.notes ? data.notes : ''}
              onChange={(event) => setNotes(event.target.value)}
            />
          </Col>
        </Row>
      <Button className='btn btn-warning mt-1'>
        Update
      </Button>
    </form>
    </Fragment>
  )
}

export default UpdateNote