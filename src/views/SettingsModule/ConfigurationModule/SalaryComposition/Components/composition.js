// ** React Imports
import { Fragment, useState, useEffect } from 'react'

// ** Third Party Components
import { Save, Lock, Unlock, Trash2 } from 'react-feather'

// ** Reactstrap Imports
import { Row, Col, Card, CardHeader, CardBody, Form, Label, Input, Button, Spinner, Badge, Table } from 'reactstrap'
import apiHelper from '../../../../Helpers/ApiHelper'

const Composition = () => {
    const Api = apiHelper()
  // ** State
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [attributeDetail, setAttributeDetail] = useState({
        title : '',
        level : ''
    })
    const [percentage, setPercentage] = useState('')

    const onChangeAttributeDetailHandler = (InputName, InputType, e) => {
        
        let InputValue
        if (InputType === 'input') {
        
        InputValue = e.target.value
        } else if (InputType === 'select') {
        
        InputValue = e
        } else if (InputType === 'date') {
            let dateFomat = e.split('/')
            dateFomat = `${dateFomat[2]}-${dateFomat[1]}-${dateFomat[0]}`    
            InputValue = dateFomat
        } else if (InputType === 'file') {
            InputValue = e.target.files[0].name
        }
    
        setAttributeDetail(prevState => ({
        ...prevState,
        [InputName] : InputValue
        
        
        }))
    }
 
  const getData =  async () => {
    setLoading(true)
           await Api.get(`/payroll/pre/data/view/`).then(result => {
            if (result) {
                if (result.status === 200) {
                    setData(result.data)
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

  const CreateBatch = () => {
    setLoading(true)
          Api.jsonPost(`/payroll/batch/`).then(result => {
            if (result) {
                if (result.status === 200) {
                   getData()
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

  const saveAttribute = () => {
        if (attributeDetail.title !== '' && attributeDetail.level !== '') {
            setLoading(true)
            const formData = new FormData()
            formData['title'] = attributeDetail.title
            formData['level'] = attributeDetail.level
            
            Api.jsonPost(`/payroll/attributes/`, formData).then(result => {
                if (result) {
                    if (result.status === 200) {
                    getData()
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
        } else {
            Api.Toast('error', 'Fields are required!')
        }
  }
  const percentageValidation = (compositionData, percentage_value) => {
        if (Object.values(compositionData).length > 0 && percentage_value) {
            const percentage_val = Math.round(percentage_value)
            let sum_composition = 0
            for (let i = 0; i < compositionData.length; i++) {
                sum_composition = sum_composition + Math.round(compositionData[i].attribute_percentage)
            }
            sum_composition = sum_composition + percentage_val
            // console.warn(sum_composition)
            if (sum_composition <= 100) {
                console.warn('true')
                return true
            } else {
                console.warn('false')
                return false
            }
        } else {
            return false
        }
  }
  const checkValidation = (compositionData) => {
    if (Object.values(compositionData).length > 0) {
        let sum_composition = 0
        for (let i = 0; i < compositionData.length; i++) {
            sum_composition = sum_composition + Math.round(compositionData[i].attribute_percentage)
        }
        console.warn(sum_composition)
        if (sum_composition === 100) {
            console.warn('true')
            return true
        } else {
            console.warn('false')
            return false
        }
    } else {
        return false
    }
}
  const saveComposition = attribute_id => {
    if (attribute_id !== '' && percentage !== '') {
    if (Object.values(data.composition).length > 0) {
        if (!percentageValidation(data.composition, percentage)) {
            Api.Toast('error', 'Composition accomulated percentage cannot be exceeded to 100%')
            return false
        }
    }
    setLoading(true)
    const formData = new FormData()
    formData['payroll_attribute'] = attribute_id
    formData['attribute_percentage'] = percentage
    
    Api.jsonPost(`/payroll/batch/compositions/`, formData).then(result => {
        if (result) {
            if (result.status === 200) {
            getData()
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
    } else {
        Api.Toast('error', 'Fields are required!')
    }
  }
  const removePercentage = id => {
    if (id) {
        setLoading(true)
    
        Api.deleteData(`/payroll/batch/compositions/${id}/`, {method: 'Delete'}).then(result => {
            if (result) {
                if (result.status === 200) {
                getData()
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
  }
  const removeAttribute = id => {
    if (id) {
        setLoading(true)
        Api.deleteData(`/payroll/attributes/${id}/`, {method: 'Delete'}).then(result => {
            if (result) {
                if (result.status === 200) {
                getData()
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
  }
  const LockBatch = () => {
    if (checkValidation(data.composition)) {
        setLoading(true)
        
        Api.get(`/payroll/lock/batch/compositions/`).then(result => {
            if (result) {
                if (result.status === 200) {
                getData()
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
    } else {
        Api.Toast('error', 'Composition accomulated percentage must be equals to 100%..')
    }
  }
  useEffect(() => {
    getData()
  }, [setData])
  return (
    <Fragment>
        {!loading ? (
            <>
                {Object.values(data).length > 0 ? (
                    <>
                        {data.batch !== null && (
                            <div className='row'>
                            <div className='col-lg-12'>
                                <Card>
                                    <CardBody>
                                        <div className='row'>
                                            <div className='col-lg-3'>
                                                <p>Batch No. <Badge color='light-success'>{data.batch.batch_no}</Badge></p>
                                            </div>
                                            <div className='col-lg-3'>
                                                <p>Date <Badge color='light-success'>{data.batch.start_date}</Badge></p>
                                            </div>
                                            <div className='col-lg-3'>
                                                <p>Status <Badge color='light-success'>{data.batch.batch_status}</Badge></p>
                                            </div>
                                            <div className='col-lg-3'>
                                            {data.batch.is_lock ? (
                                                <Button className='btn btn-danger' onClick={CreateBatch}>
                                                    <Unlock /> Unlock
                                                </Button>
                                            ) : (
                                                <Button className='btn btn-success' onClick={LockBatch}>
                                                   <Lock /> Lock
                                                </Button>
                                            )}
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            </div>
                            </div>
                        )}
                        <Card>
                            <CardBody>
                            <h5>Attributes</h5>
                                
                            {data.attributes.length > 0 ? (
                                <div className='row'>
                                <div className='col-md-12'>
                                    <Table bordered striped responsive>
                                        <thead className='table-dark text-center'>
                                            <tr>
                                                <th>Title</th>
                                                <th>Level</th>
                                                <th>Delete</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        {data.attributes.map((attribute, key) => (
                                            <tr key={key}>
                                                <td>{attribute.title}</td>
                                                <td>{attribute.level}</td>
                                                {data.composition.find(pre => pre.payroll_attribute === attribute.id) ? (
                                                    <td className='text-center'><Badge color='light-success'>Percentage Added</Badge></td>
                                                ) : (
                                                    
                                                    <td className='text-center'>
                                                        <Button className='btn btn-sm btn-danger' onClick={() => removeAttribute(attribute.id)}>
                                                            <Trash2 />  
                                                        </Button>
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                        </tbody>
                                    </Table>
                                </div>
                                </div>
                               
                            ) : (
                                <>
                                <p>No Attributes Data !</p>
                                <hr></hr>
                                </>
                            )}
                               {!data.batch.is_lock && (
                                <>
                                    <h5 className='pt-2'>Add Attribute</h5>
                                    <Form>
                                        <Row className='justify-content-between align-items-center'>
                                            <Col md={4} className='mb-md-0 mb-1'>
                                            <Label className='form-label'>
                                                Title
                                            </Label>
                                            <Input type='text' placeholder='Title' 
                                            onChange={ (e) => { onChangeAttributeDetailHandler('title', 'input', e) }}/>
                                            </Col>
                                            <Col md={4} className='mb-md-0 mb-1'>
                                            <Label className='form-label'>
                                                Level
                                            </Label>
                                            <Input type='number' placeholder='10' 
                                            onChange={ (e) => { onChangeAttributeDetailHandler('level', 'input', e) }}/>
                                            </Col>
                                            <Col md={2} className='pt-2'>
                                            <Button color='success' className='text-nowrap px-1' onClick={saveAttribute} outline>
                                                <Save size={14} className='me-50' />
                                                <span>Save</span>
                                            </Button>
                                            </Col>
                                        </Row>
                                    </Form>
                                    </>
                               )}
                                
                            </CardBody>
                        </Card>
                        <Card>
                            <CardBody>
                                {data.composition.length > 0 ? (
                                    <>
                                    <h5>Composition</h5>
                                    <div className='row'>
                                        <div className='col-md-12'>
                                            <Table bordered striped responsive>
                                                <thead className='table-dark text-center'>
                                                    <tr>
                                                        <th>Attribute</th>
                                                        <th>Percentage</th>
                                                        {!data.batch.is_lock && (
                                                            <th>Delete</th>
                                                        )}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                {data.composition.map((composition, key) => (
                                                    <tr key={key}>
                                                        <td>{composition.payroll_attribute_title}</td>
                                                        <td>{composition.attribute_percentage}%</td>
                                                        {!data.batch.is_lock && (
                                                            <td className='text-center'><Button className='btn btn-sm btn-danger' onClick={() => removePercentage(composition.id)}>
                                                                <Trash2 />
                                                                </Button></td>
                                                        )}
                                                    </tr>
                                                ))}
                                                </tbody>
                                            </Table>
                                        </div>
                                    </div>
                                    </>
                                ) : (
                                    <h5>No Composition Data!</h5>
                                )}

                                {data.attributes.length > 0 && (
                                    data.attributes.map((attribute, key) => (
                                        data.composition.find(pre => pre.payroll_attribute === attribute.id) ? (
                                            null
                                        ) : (
                                            <Form key={key}>
                                            <Row className='justify-content-between align-items-center'>
                                                <Col md={4} className='mb-md-0 mb-1'>
                                                <Label className='form-label'>
                                                    Attribute
                                                </Label>
                                                <Input type='text' 
                                                defaultValue={attribute.title} disabled/>
                                                </Col>
                                                <Col md={4} className='mb-md-0 mb-1'>
                                                <Label className='form-label'>
                                                    Percentage
                                                </Label>
                                                <Input type='number' placeholder='10' 
                                                onChange={ e => setPercentage(e.target.value)} />
                                                </Col>
                                                <Col md={2} className='pt-2'>
                                                <Button color='success' className='text-nowrap px-1' onClick={() => saveComposition(attribute.id)} outline>
                                                    <Save size={14} className='me-50' />
                                                    <span>Save</span>
                                                </Button>
                                                </Col>
                                            </Row>
                                            </Form>
                                        )
                                        
                                    ))
                                )}
                            </CardBody>
                        </Card>
                    </>
                ) : (
                    <>
                        <Button className='btn btn-success float-right mb-2' onClick={CreateBatch}>
                            Add Salary Composition
                        </Button>
                        <Card>
                            <CardBody>
                                <p>No Composition Found !</p>
                            </CardBody>
                        </Card>
                    </>
                )}
                
            </>
        ) : (
            <div className='text-center'><Spinner type='grow' color='white'/></div>
        )}
    </Fragment>
    
  )
}

export default Composition
