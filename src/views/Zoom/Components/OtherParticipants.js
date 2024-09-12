import React, { useState } from 'react'
import { Container, Row, Input, Form, Col, Spinner, Label, Button } from 'reactstrap'
import { Delete } from 'react-feather'
const OtherParticipants = ({CallBack, data}) => {
  
    const updateSwitches = () => {
        const updatedSwitchValues = {}
            data.forEach(item => {
                updatedSwitchValues[item.name] = item.is_host === true
            })
            return updatedSwitchValues
            }
  const [viewLoading, setViewLoading] = useState(false)
  const [switchValues, setSwitchValues] = useState(updateSwitches())
  const [formData, setFormData] = useState(data.length > 0 ? data : [{ name: '', email: '', is_host: false }])
        
  
    const handleSwitchChange = (option) => (event) => {
        const { checked } = event.target
        setSwitchValues((prevSwitchValues) => ({
          ...prevSwitchValues,
          [option.name]: checked // Toggle the host value for the corresponding name
        }))
      }
  const getHost = (name) => {
    return Object.keys(switchValues).some(key => {
      return key === name && switchValues[key]
    })
  }
  const handleInputChange = (index, event) => {
    const { name, value } = event.target
    const newData = [...formData]
    newData[index] = {
      ...newData[index],
      [name]: value,
      is_host: false // Set host to false when adding a new entry
    }
    setFormData(newData)
    console.warn(newData)
  }
  const handleAddInput = () => {
    setFormData([...formData, { name: '', email: '', is_host: false }])
    console.warn(formData)
  }
  const handleDeleteInput = (index) => {
    const newData = [...formData]
    newData.splice(index, 1)
    setFormData(newData)
  }
  const validateEmail = (email) => {
    // Regular expression for email validation
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }
  const isFormValid = () => {
    // Check if all name and email fields have values
    return formData.every((data) => data.name && validateEmail(data.email))
  }
  const handleDone = () => {
  
      setViewLoading(true)

    const transformedArr = []

    Object.values(formData).map(item => {
      const obj = {}
      obj.name = item.name
      obj.email = item.email
      if (getHost(item.name)) {
        obj.is_host = true
      } else {
        obj.is_host = false
      }
      transformedArr.push(obj)
    })
    CallBack(transformedArr)
    setTimeout(() => {
        setViewLoading(false)
    }, 500)
    
  }
  return (
    <Row>
       
      <Container>
        <Row>
          <Col md='8' className='border-right'>
          <Form>
          {formData.map((data, index) => (
                <div key={index}>
                <Label className='m-1'>
                    Name:
                    <Input
                    type="text"
                    name="name"
                    value={data.name}
                    onChange={(event) => handleInputChange(index, event)}
                    required
                    />
                </Label>
                <Label className='m-1'>
                    Email:
                    <Input
                    type="email"
                    name="email"
                    value={data.email}
                    onChange={(event) => handleInputChange(index, event)}
                    required
                    />
                </Label>
                <Delete color='red' onClick={() => handleDeleteInput(index)}/>
                </div>
            ))}
            <Button type="button" className='btn btn-warning' style={{marginLeft:'1rem'}} onClick={handleAddInput} disabled={!isFormValid()}>
                Add Another
            </Button>
            </Form>
          </Col>
          <Col md='4'>
            <h4>Assign Hosts</h4>
          {!viewLoading ? (
          formData.length > 0 ? (
            <>
            {formData.map((option) => (
               <div key={option.name}>
                <Row>
                    <Col md='6'><span>{option.name}</span></Col>
                    <Col md='6'>
                        <div className='form-check form-switch'>
                            <Label for='exampleCustomSwitch' className='form-check-label'>
                                Host
                            </Label>
                            <Input type='switch' name='customSwitch'  id={option.name}
                                onChange={handleSwitchChange(option)}
                                checked={switchValues[option.name] || false} />
                        </div>
                        <hr></hr>
                    </Col>
                </Row>
           </div>
            ))}
            <Button className='btn btn-primary float-right' onClick={() => handleDone()}>Done</Button>
            </>
            ) : (
                <p>No Other participants selected</p>
            )) : <div className='text-center'><Spinner/></div>
            }
          </Col>
        </Row>
      
      </Container>
    </Row>
  )
}

export default OtherParticipants