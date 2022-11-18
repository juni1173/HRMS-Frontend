import { useEffect, useState } from 'react'
import { Row, Col, Form, Input, Button, Table, Spinner } from 'reactstrap'
import { ArrowLeft, ArrowRight, XCircle } from 'react-feather'
import apiHelper from '../../../Helpers/ApiHelper'

const UpdateJobAdditionalInfo = ({ stepper, preData, CallBack}) => {
    const Api = apiHelper()
    const [loading, setLoading] = useState(true)
    const [dimension, setDimension] = useState(null)
    const [desirable, setDesirable] = useState(null)
    const [essential, setEssential] = useState(null)
    const [Add_info] = useState([])
  const addmoreSubmit = () => {
      setLoading(true)
      if (dimension !== null && desirable !== null && essential !== null) {
        if (Object.values(Add_info).length > 0) {
          for (let i = 0; i < Add_info.length; i++) {
            if (Add_info[i].dimension === dimension) {
              Api.Toast('error', 'Dimension Already Exist')
              setTimeout(() => {
                setLoading(false)
              }, 1000)
              return false
            } else {
              Add_info.push({dimension, desirable, essential})   
            }
          } 
        } else {
          Add_info.push({dimension, desirable, essential})
        }
        
      } else {
        Api.Toast('error', 'Please fill up all the fields required')
      }
      
        console.warn(Add_info)
    
        setTimeout(() => {
          setLoading(false)
        }, 1000)
        
      }
  const removeAction = value => {
    setLoading(true)
    Add_info.splice(value)
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }      
  const onSubmit = data => {
    console.warn(data)
    CallBack(data, '4')
  }
  const additionalData = () => {
    setLoading(true)
    console.warn(preData)
    for (let i = 0; i < preData.length; i++) {
      if (preData[i].jd_dimension > 4) {
        console.warn(preData[i].jd_dimension)
        Add_info.push(preData[i])
      }
    }
    console.warn(Add_info)
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }
  useEffect(() => {
    additionalData()
  }, []) 
  return (
    <div>
      <div className='content-header' >
          <h5 className='mb-2'>Add Additional Info</h5>
          {/* <small>Add Job.</small> */}
        </div>
        <Form onSubmit={e => e.preventDefault()}  id="create-job-form">
          <Row>
           
            <Col md='6' className='mb-1'>
              <label className='form-label'>
                Dimension
              </label>
                <Input
                  id="additional-dimension"
                  name="additional-dimension"
                  className="additional-dimension"
                  placeholder="Dimension"
                  onChange={e => setDimension(e.target.value)}
                />
                <label className='form-label'>
                Desirable
              </label>
                <Input
                  type='textarea'
                  row="5"
                  id="additional-desirable"
                  name="additional-desirable"
                  className="additional-desirable"
                  placeholder="Desirable"
                  onChange={e => setDesirable(e.target.value)}
                />
            </Col>
            
            <Col md='6' className='mb-1'>
              <label className='form-label'>
                Essential
              </label>
                <Input
                  type='textarea'
                  id="additional-essential"
                  name="additional-essential"
                  className="additional-essential"
                  placeholder="Essential"
                  row={10}
                  onChange={e => setEssential(e.target.value)}
                />
            </Col>
          
          </Row>
        </Form>
      <div className='d-flex justify-content-between'>
          <Button color='primary' className='btn-prev' onClick={() => stepper.previous()}>
            <ArrowLeft size={14} className='align-middle me-sm-25 me-0'></ArrowLeft>
            <span className='align-middle d-sm-inline-block d-none'>Previous</span>
          </Button>
          <div className='row'>
            <div className='col-lg-7'>
              <Button color='warning' className='btn-addmore' onClick={() => addmoreSubmit()}>
                <span>Save & Add More</span>
              </Button>
            </div>
            <div className='col-lg-1'></div>
            <div className='col-lg-4'>
            <Button color='success' className='btn-submit' onClick={() => onSubmit(Add_info)}>
                Update
              </Button>
            </div>
          </div>
          
        </div>
        {Object.values(Add_info).length > 0 ? (
          
          <Table bordered striped responsive className='my-1'>
            <thead className='table-dark text-center'>
              <tr>
                <th scope="col" className="text-nowrap">
                  Dimension
                </th>
                <th scope="col" className="text-nowrap">
                  Desirable
                </th>
                <th scope="col" className="text-nowrap">
                  Essential
                </th>
                <th scope="col" className="text-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            
            <tbody className='text-center'>
            {loading && <tr><td colSpan={4}><Spinner /></td></tr>}
                {Object.values(Add_info).map((item, key) => (
                      item.jd_dimension > 4 && ( 
                        !loading && (
                            <tr key={key}>
                            <td>{item.jd_dimension_title}</td>
                            <td>{item.desirable}</td>
                            <td>{item.essential}</td>
                            <td>
                              <div className="d-flex row">
                                <div className="col">
                                  <button
                                    className="border-0"
                                    onClick={() => removeAction(key)}
                                  >
                                    <XCircle color="red" />
                                  </button>
                                </div>
                              </div>
                            </td>
                            </tr>
                            ) 
                      )
                    )
                )}
               
            </tbody>
            
          </Table>
            
        ) : null}
    </div>
  )
}
export default UpdateJobAdditionalInfo