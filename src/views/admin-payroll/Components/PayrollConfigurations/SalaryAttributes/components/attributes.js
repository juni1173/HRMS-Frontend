// ** React Imports
import { Fragment, useState, useEffect } from 'react'

// ** Third Party Components
import { Save, Lock, Unlock, Trash2, Edit} from 'react-feather'

// ** Reactstrap Imports
import { Row, Col, Card, CardHeader, CardBody, Form, Label, Input, Button, Spinner, Badge, Table } from 'reactstrap'
import apiHelper from '../../../../../Helpers/ApiHelper'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const Attributes = () => {
    const Api = apiHelper()
    const MySwal = withReactContent(Swal)
  // ** State
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [attributeDetail, setAttributeDetail] = useState({
        title : '',
        level : ''
    })
      

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

  useEffect(() => {
    getData()
  }, [setData])
  return (
    <Fragment>
        {!loading ? (
            <>
                {(Object.values(data).length > 0 && data.batch !== null) ? (
                    <>
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
                    </>

                ) : (
                   null
                )}
                
            </>
        ) : (
            <div className='text-center'><Spinner type='grow' color='white'/></div>
        )}
    </Fragment>
    
  )
}

export default Attributes
