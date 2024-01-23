import { useState } from 'react'
import { Row, Col, Form, Input, Button, Table, Spinner } from 'reactstrap'
import { ArrowLeft, ArrowRight, XCircle } from 'react-feather'
import Select from 'react-select'
import apiHelper from '../../../../../Helpers/ApiHelper'
const Job_Specification = ({ stepper, CallBack, Dimensions }) => {
    const Api = apiHelper()
    const [loading, setLoading] = useState(true)
    const [jd_dimension, setDimension] = useState(null)
    const [desirable, setDesirable] = useState(null)
    const [essential, setEssential] = useState(null)
    const [Specifications] = useState([])
  const addmoreSubmit = () => {
      setLoading(true)
        const DimensionObject = Dimensions.find(x => x.value === jd_dimension)
        const DimensionLabel = DimensionObject.label
          if (Specifications.find(x => x.jd_dimension === jd_dimension)) {
            Api.Toast('error', 'Dimension Already Exist')
            setTimeout(() => {
              setLoading(false)
            }, 1000)
          } else {
            Specifications.push({jd_dimension, desirable, essential, DimensionLabel})  
          }
        
        setTimeout(() => {
          setLoading(false)
        }, 1000)
        
      }
  //  const removeAction = value => {
  //     setLoading(true)
  //     Specifications.splice(value)
  //     setTimeout(() => {
  //       setLoading(false)
  //     }, 1000)
  //  }   
  const specSubmit = data => {
     CallBack(data, '3')
    // console.warn(spe)
    stepper.next()
  }
  
  return (
    <div>
       <div className='content-header' >
          <h5 className='mb-2'>Add JD Specifications</h5>
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
                  id="JD-desirable"
                  name="JD-desirable"
                  className="JD-desirable"
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
                  id="JD-essential"
                  name="JD-essential"
                  className="JD-essential"
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
            <div className='col-lg-6'>
              <Button color='warning' className='btn-addmore' onClick={() => addmoreSubmit()}>
                <span>Save & Add More</span>
              </Button>
            </div>
            <div className='col-lg-1'></div>
            <div className='col-lg-5'>
            <Button color='primary' className='btn-next' onClick={() => specSubmit(Specifications)}>
              <span className='align-middle d-sm-inline-block d-none'>Next</span>
              <ArrowRight size={14} className='align-middle ms-sm-25 ms-0'></ArrowRight>
            </Button>
            </div>
          </div>
          
        </div>
        {Object.values(Specifications).length > 0 ? (
          
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
                {/* <th scope="col" className="text-nowrap">
                  Actions
                </th> */}
              </tr>
            </thead>
            
            <tbody className='text-center'>
            {loading && <tr><td colSpan={4}><Spinner /></td></tr>}
             
                {Object.values(Specifications).map((item, key) => (
                   
                      !loading && (
                          <tr key={key}>
                          
                          <td>{item.DimensionLabel}</td>
                          <td>{item.desirable}</td>
                          <td>{item.essential}</td>
                          {/* <td>
                            <div className="d-flex row">
                              <div className="col">
                                <button
                                  className="border-0"
                                  onClick={() => removeAction(key)}
                                >
                                  <XCircle color="red"/>
                                </button>
                              </div>
                            </div>
                          </td> */}
                          </tr>
                          ) 
                    )
                )}
               
            </tbody>
            
          </Table>
            
        ) : null}
    </div>
  )
}

export default Job_Specification
