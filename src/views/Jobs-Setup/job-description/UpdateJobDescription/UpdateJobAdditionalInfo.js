import { useEffect, useState } from 'react'
import { Row, Col, Form, Input, Button, Table, Spinner } from 'reactstrap'
import { ArrowLeft, ArrowRight, XCircle } from 'react-feather'
import Select from 'react-select'
import apiHelper from '../../../Helpers/ApiHelper'

const UpdateJobAdditionalInfo = ({ stepper, preData, CallBack, Dimensions}) => {
    const Api = apiHelper()
    const [loading, setLoading] = useState(true)
    const [dimension, setDimension] = useState(null)
    const [desirable, setDesirable] = useState(null)
    const [essential, setEssential] = useState(null)
    const [Add_info] = useState([])
  const addmoreSubmit = () => {
      setLoading(true)
      const DimensionObject = Dimensions.find(x => x.value === dimension)
      const DimensionLabel = DimensionObject.label
      if (Add_info.find(x => x.jd_dimension === dimension)) {
        Api.Toast('error', 'Dimension Already Exist')
        setTimeout(() => {
          setLoading(false)
        }, 1000)
      } else {
        Add_info.push({jd_dimension: dimension, desirable, essential, DimensionLabel})  
      }
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
    CallBack(data, '4')
  }
  const additionalData = () => {
    setLoading(true)
    Add_info.splice(0, Add_info.length)
    for (let i = 0; i < preData.length; i++) {
      if (preData[i].jd_dimension > 4) {
        Add_info.push({jd_dimension: preData[i].jd_dimension,
          desirable: preData[i].desirable,
        essential: preData[i].essential,
        DimensionLabel: preData[i].jd_dimension_title}) 
      }
    }
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
              <Select
                    isClearable={false}
                    options={Dimensions}
                    className='react-select'
                    classNamePrefix='select'
                    onChange={e => setDimension(e.value)} 
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
                            <td>{item.DimensionLabel}</td>
                            <td>{item.desirable !== null ? item.desirable : ''}</td>
                            <td>{item.essential !== null ? item.essential : ''}</td>
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